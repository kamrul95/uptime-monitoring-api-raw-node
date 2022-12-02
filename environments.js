const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: '1qas2wsd',
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: '2wsd3edf',
};

const currentEnv = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

const environmentToExport =
    typeof environments[currentEnv] === 'object' ? environments[currentEnv] : environments.staging;

module.exports = environmentToExport;
