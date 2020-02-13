const HelixConnector = require('./connector/Helix');
const DHIS2Connector = require('./connector/Dhis2');
const mapper = require('./mapper/Transform');
const config = require('./config.json');
const fs = require('fs');

/**
 * Main service for the Helix DHIS 2 data pipeline.
 */
(function () {

    console.log("Configuration:");
    console.log("Found " + config.profiles.length + " profile entries");

    config.profiles.forEach((profile) => {
        console.log("\t- " + profile.name);
    });

    // For each data entry, fetch, transform and push the datasets
    config.profiles.forEach((profile) => {
        let helixConnector = new HelixConnector(profile.url);
        let dhiS2Connector = new DHIS2Connector(config.dhis2.url, config.dhis2.username, config.dhis2.password);
        let dataValues = [];

        console.log("Processing profile: " + profile.name);

        helixConnector.getData((err, data) => {

            if (err) {
                console.err("Unable to fetch data from ", profile.url, "(", profile.name, ")");
                process.exit(1);
            }

            let dataSet = data.getDataSet();

            console.log("Found " + Object.keys(dataSet).length + " records");

            /*
            * Key refers to the SDMX observation key. This key contains multiple indexes split by ":".
            * The index position refers to the structure dimensions, and the index values refer to the
            * position of the value within dimension.
            */
            for (let key in dataSet) {

                let observation = {};
                let dimensions = key.split(":");

                for (let i = 0; i < dimensions.length; i++) {
                    let dimension = data.getDimension(i, dimensions[i]);
                    observation[dimension.id] = dimension.value;
                }

                for (let i = 0; i < dataSet[key].length - 1; i++) {
                    let row = dataSet[key];
                    let valIndex = row[i];

                    if (valIndex == null) {
                        continue;
                    }

                    let attribute = data.getAttribute(i, valIndex);
                    
                    observation[attribute.id] = attribute.value;
                }

                profile.transformation.forEach((transformation) => {
                    dataValues = dataValues.concat(mapper.transformToDataValue(observation, transformation));
                });
            }
            console.log("Mapped", Object.keys(dataSet).length, "records into", dataValues.length, "data values");

            if (profile.writeToFile) {
                fs.writeFile("dhis2-data-values.json", JSON.stringify(dataValues, null, 2), function() {
                    console.log("Wrote file 'dhis2-data-values.json'");
                });
            }

            dhiS2Connector.postDataValues({dataValues: dataValues}, function (err, res) {
                if (err) {
                    throw err;
                }

                if (res.body.conflicts) {
                    console.log("Error: Unable to import data into DHIS2. Please review conflicts and try again:");
                    res.body.conflicts.forEach((conflict) => {
                        console.log("\t-", conflict.value, "(", conflict.object, ")");
                    });
                    process.exit(1);
                }

                console.log("Import result:", res.body.importCount);
            });
        });
    });
})();