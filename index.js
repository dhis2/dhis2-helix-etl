const HelixConnector = require('./connector/Helix');
const DHIS2Connector = require('./connector/Dhis2');
const mapper = require('./mapper/Transform');
const config = require('./config.json');

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

        helixConnector.getData((err, data) => {

            if (err) {
                console.err("Unable to fetch data from ", profile.url, "(", profile.name, ")");
                process.exit(1);
            }

            let dataSet = data.getDataSet();

            console.log("Found " + Object.keys(dataSet).length + " records");

            for (let key in dataSet) {

                let res = {};
                let dimensions = key.split(":");

                for (let i = 0; i < dimensions.length; i++) {
                    let dimension = data.getDimension(i, dimensions[i]);
                    res[dimension.id] = dimension.value;
                }

                for (let i = 0; i < dataSet[key].length - 1; i++) {
                    let row = dataSet[key];
                    let attribute = data.getAttribute(i, row[i]);

                    res[attribute.id] = attribute.value;
                }

                profile.transformation.forEach((transformation) => {
                    dataValues = dataValues.concat(mapper.transformToDataValue(res, transformation));
                });
            }
            console.log("Mapped", Object.keys(dataSet).length, "records into", dataValues.length, "data values");

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