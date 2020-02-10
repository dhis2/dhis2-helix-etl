const request = require('request');
const SdmxWrapper = require('../helpers/SdmxWrapper');

/**
 * Wrapper around a Helix API endpoint which provides convenience methods for
 * retrieving SDMS data sets.
 */
class HelixConnector {

    constructor(url) {
        this.url = url;
    }

    getData(cb) {
        request(this.url, {json: true}, (err, response, body) => {
            cb(err, new SdmxWrapper(body));
        });
    }
}

module.exports = HelixConnector;