/* eslint-disable no-underscore-dangle */
const handler = {};
const data = require('../../lib/data');
const { hash, parseJson } = require('../../helpers/utilities');

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, { message: 'Method Not Allowed' });
    }
};

handler._users = {};
handler._users.get = (requestProperties, callback) => {
    const mobile =
        typeof requestProperties.queryStringObject.mobile === 'string' &&
        requestProperties.queryStringObject.mobile.trim().length === 11
            ? requestProperties.queryStringObject.mobile
            : null;
    if (mobile) {
        data.read('users', mobile, (err, userData) => {
            const user = { ...parseJson(userData) };
            delete user.password;

            if (!err) {
                callback(200, user);
            } else {
                callback(500, {
                    error: 'User not found',
                });
            }
        });
    } else {
        callback(404, {
            error: 'User not found',
        });
    }
};

handler._users.post = (requestProperties, callback) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : null;
    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : null;
    const mobile =
        typeof requestProperties.body.mobile === 'string' &&
        requestProperties.body.mobile.trim().length === 11
            ? requestProperties.body.mobile
            : null;
    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : null;
    const tosAggrement =
        typeof requestProperties.body.tosAggrement === 'boolean' &&
        requestProperties.body.tosAggrement > 0
            ? requestProperties.body.tosAggrement
            : null;
    if (firstName && lastName && mobile && password && tosAggrement) {
        data.read('users', mobile, (err1) => {
            if (err1) {
                const userObject = {
                    firstName,
                    lastName,
                    mobile,
                    password: hash(password),
                    tosAggrement,
                };
                data.create('users', mobile, userObject, (err2) => {
                    if (!err2) {
                        callback(200, { message: 'User created successfully' });
                    } else {
                        callback(500, { message: 'Could not create user' });
                    }
                });
            } else {
                callback(500, {
                    message: 'There was a problem with the server.',
                });
            }
        });
    } else {
        callback(400);
    }
};
handler._users.put = (requestProperties, callback) => {
    const mobile =
        typeof requestProperties.body.mobile === 'string' &&
        requestProperties.body.mobile.trim().length === 11
            ? requestProperties.body.mobile
            : null;

    if (mobile) {
        data.read('users', mobile, (err, userData) => {
            const user = { ...parseJson(userData) };
            if (!err) {
                const firstName =
                    typeof requestProperties.body.firstName === 'string' &&
                    requestProperties.body.firstName.trim().length > 0
                        ? requestProperties.body.firstName
                        : null;
                const lastName =
                    typeof requestProperties.body.lastName === 'string' &&
                    requestProperties.body.lastName.trim().length > 0
                        ? requestProperties.body.lastName
                        : null;
                const password =
                    typeof requestProperties.body.password === 'string' &&
                    requestProperties.body.password.trim().length > 0
                        ? requestProperties.body.password
                        : null;
                if (firstName || lastName || password) {
                    if (firstName) {
                        user.firstName = firstName;
                    }
                    if (lastName) {
                        user.lastName = lastName;
                    }
                    if (password) {
                        user.password = password;
                    }
                    data.update('users', mobile, user, (err1) => {
                        if (!err1) {
                            callback(200, { message: `User Updated successfully` });
                        } else {
                            callback(500, { message: `User not found` });
                        }
                    });
                }
            } else {
                callback(404, { message: `User not found` });
            }
        });
    } else {
        callback(400, { message: `Invalid request by user` });
    }
};
handler._users.delete = (requestProperties, callback) => {
    const mobile =
        typeof requestProperties.queryStringObject.mobile === 'string' &&
        requestProperties.queryStringObject.mobile.trim().length === 11
            ? requestProperties.queryStringObject.mobile
            : null;
    if (mobile) {
        data.read('users', mobile, (err) => {
            if (!err) {
                data.delete('users', mobile, (err1) => {
                    if (!err1) {
                        callback(200, { message: `User deleted successfully` });
                    } else {
                        callback(500, { message: `User not found` });
                    }
                });
            } else {
                callback(404, { message: `User not found` });
            }
        });
    } else {
        callback(200, { message: `Invalid request` });
    }
};

module.exports = handler;
