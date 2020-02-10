const request = require('request');

/**
 * Wrapper around a DHIS 2 API endpoint which provides convenience methods for 
 * saving data values.
 */
class DHIS2Connector {

    constructor(url, username, password) {
        this.url = url;
        this.username = username;
        this.password = password;
    }

    postDataValues(payload, cb) {
        return request({
            url: this.url + "/api/dataValueSets",
            qs: {
                dataElementIdScheme: "CODE",
                orgUnitIdScheme: "CODE",
                categoryOptionComboIdScheme: "CODE"
            },
            method: "POST",
            json: true,
            body: payload,
            auth: {user: this.username, pass: this.password}
        }, cb);
    }
}

module.exports = DHIS2Connector;