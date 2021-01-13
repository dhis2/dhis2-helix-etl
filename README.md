# DHIS 2 Helix DXP Data Pipeline

## Requirements

The data pipeline is written in Node.js and requires a Node.js runtime.

## Configuration

First set up `config.json` with the required information, then run the script with Node:

    node index.js

This script will load data from Helix, transform it based on the profile mapping and push data to the DHIS2 instance defined in the configuration.

The `config.json` configuration file is in JSON format and looks like this:

```json
{
  "dhis2": {
    "url": "http://localhost/dhis",
    "username": "admin",
    "password": "district"
  },
  "profiles": [
    {
      "name": "DHIS2 Sample data",
      "url": "https://unicef.sdmxcloud.org/ws/public/sdmxapi/rest/data/UNICEF_TEST",
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

The `dhis2` section contains information about the instance where data should be pushed. This includes the URL, username and password required to connect.

The `profiles` section represents each set of data to import into DHIS 2. Each profile refers to a helix endpoint and a `transformation` for the data.

The `transformation` consists of the key (`dataElementId`, `period`, `organisationUnit`) which relates directly to entities in DHIS 2, and a value. The value will be executed as javascript with variables based on the Helix payload. This means in our current example, we pick the certain properties that represents the diffent references to the entities in DHIS 2. We expect `dataElementId`, `organisationUnit` and `categoryOptionCombo` all refer to valid codes in DHIS 2. This is a property that can be configured for each entity in DHIS 2.

Each data dimension refer to each of the three values which are required (observed value, lower bound and upper bound) which are disaggregated into different category option combos. This means that each row of data from Helix will result in three DHIS 2 datavalues.

Additionally, the period must be in the correct format. If we are working solely with years, four digits is sufficient.
