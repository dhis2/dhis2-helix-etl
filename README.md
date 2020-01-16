# How to use

Set up configuration.json with required information, then run the script using "node index.js".

This script will load all the data from helix, one endpoint at the time (If more than one "profile" is defined),
transform it based on the profile's mapping, and push to the DHIS2 instance defined in the configuration.

The configuration:

```js
{
"dhis2": {
"url": "http://localhost:8080",
"username": "admin",
"password": "district"
},
"profiles": [
{
"name": "DHIS2 Sample data",
"url": "https://unicef.sdmxcloud.org/ws/public/sdmxapi/rest/data/UNICEF_TEST,DHIS_SAMPLE_DATASET,1.0/all?format=sdmx-json&includeHistory=true&includeMetadata=true&dimensionAtObservation=AllDimensions&includeAllAnnotations=true",
"transformation": [
{
"dataElementId": "UNICEF_INDICATOR",
"period": "TIME_PERIOD",
"organisationUnit": "COUNTRY",
"dataDimensions": [
{
"categoryOptionCombo": "OBS_VALUE",
"value": "VALUE"
},
{
"categoryOptionCombo": "LOWER_BOUND",
"value": "LOWER_BOUND"
},
{
"categoryOptionCombo": "UPPER_BOUND",
"value": "UPPER_BOUND"
}
]
}
]
}
]
}
```

"dhis2" contains information about the instance where data should be pushed. This includes the url, username and password required to connect.

"profiles" represents each set of data to import into dhis2. Each profile refers to a helix endpoint and a "transformation" for the data.

The "transformation" consists of the key (dataElementId, period, organisationUnit) which relates directly to entities in DHIS2, and a value.
The value will be executed as javascript with variables based on the helix payload. This means in our current example, we pick the
certain properties that represents the diffent references to the entities in DHIS2. We expect dataElementId, organisationUnit and categoryOptionCombo all
refer to valid codes in DHIS2. This is a property that can be configured for each entity in DHIS2.

Each dataDimension refers to each of the 3 values we require (Observed value, lower bound and upper bound) these are disaggregated into different category option combos.
In reality, this means (in this case) that each row of data from helix will result in 3 DHIS2 datavalues.

Additionally, the period must be at the correct format (If we are working solely with years, four digits is sufficient).
