const vm = require('vm');

/**
 * Accepts an environment, consisting of variables representing data, and the mapping configuration
 * and maps the correct data to the correct properties based on the configuration.
 * 
 * @param env variables representing data from Helix
 * @param mapping configuration
 * @returns DataValues
 */
function transformToDataValue(env, mapping) {
    let dataValues = [];

    mapping.dataDimensions.forEach(function (dimension) {
        let dataValue =
            {
                "dataElement": transform(env, mapping.dataElementId),
                "orgUnit": transform(env, mapping.organisationUnit),
                "period": transform(env, mapping.period),
                "categoryOptionCombo": dimension.categoryOptionCombo,
                "value": transform(env, dimension.value)
            };

        dataValues.push(dataValue);
    });

    return dataValues;
}

/**
 * Transforms an object into a string, based on the given expression.
 * 
 * @param env an object containing the variables used in expressions.
 * @param expression executable javascript
 * @returns A String
 */
function transform(env, expression) {
    let script = new vm.Script(expression);

    try {
        return script.runInNewContext(env);
    } catch (e) {
        console.log(env, expression);
        throw new Error("Unable to parse expression: " + e.message);
    }
}

module.exports = {
    transformToDataValue: transformToDataValue
};