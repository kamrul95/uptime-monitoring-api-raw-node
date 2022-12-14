const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');

const { parseJson } = require('./utilities');

const { notFoundHandler } = require('../handlers/routeHandler/notFoundHandler');

const app = {};

app.handlerReqRes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPathName = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headerObject = req.headers;
    const requestProperties = {
        parsedUrl,
        path,
        trimmedPathName,
        method,
        queryStringObject,
        headerObject,
    };

    let realData = '';

    const choosenHandler = routes[trimmedPathName] ? routes[trimmedPathName] : notFoundHandler;

    const decoder = new StringDecoder('utf-8');
    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        decoder.end();
        requestProperties.body = parseJson(realData);
        choosenHandler(requestProperties, (statusCode, payload) => {
            const code = typeof statusCode === 'number' ? statusCode : 500;
            const payloadMsg = typeof payload === 'object' ? payload : {};
            const payloadString = JSON.stringify(payloadMsg);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(code);
            // res.write(realData);
            res.end(payloadString);
        });
    });
};

module.exports = app.handlerReqRes;
