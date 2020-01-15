const request = require('request');
const SdmxWrapper = require('../helpers/SdmxWrapper');

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