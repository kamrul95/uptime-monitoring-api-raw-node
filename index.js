// dependencies
const http = require('http');
const handleReqRes = require('./helpers/handleReqRes');

const environment = require('./environments');

const data = require('./lib/data');

const app = {};

data.create('test', 'users', { name: 'John', email: 'jhon@example.com' }, (result) => {
    console.log(result);
});

// data.read('test', 'users', (err, result) => {
//     console.log(result);
// });

// update user
// data.update('test', 'users', { name: 'Musa', email: 'musa1@example.com' }, (result) => {
//     console.log(result);
// });

// file delete
data.delete('test', 'users', (result) => {
    console.log(result);
});

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`Listening on ${environment.port}`);
    });
};

app.handleReqRes = handleReqRes;

app.handleReqRes = app.createServer();
