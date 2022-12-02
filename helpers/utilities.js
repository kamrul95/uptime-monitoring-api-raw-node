const utilities = {};

const crypto = require('crypto');
const environments = require('../environments');

utilities.parseJson = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch (e) {
        output = {};
    }
    return output;
};

utilities.hash = (str) => {
    if (typeof str === 'string') {
        const hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
        return hash;
    }

    return false;
};

module.exports = utilities;
