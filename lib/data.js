const fs = require('fs');
const path = require('path');

const lib = {};

lib.basedir = path.join(`${__dirname}/../.data/`);
lib.create = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const dataString = JSON.stringify(data);
            fs.writeFile(fileDescriptor, dataString, (err1) => {
                if (!err1) {
                    fs.close(fileDescriptor, (err2) => {
                        if (!err2) {
                            callback('File written successfully');
                        } else {
                            callback('Could not close file');
                        }
                    });
                } else {
                    callback('Could not write file');
                }
            });
        } else {
            callback('File may already exist');
        }
    });
};

lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        if (!err) {
            callback(err, data);
        } else {
            callback('Could not read');
        }
    });
};

lib.update = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            fs.ftruncate(fileDescriptor, (err1) => {
                if (!err1) {
                    fs.writeFile(fileDescriptor, JSON.stringify(data), (err2) => {
                        if (!err2) {
                            callback('file updated successfully');
                        } else {
                            callback('unable to write');
                        }
                    });
                } else {
                    callback('Unable to truncate');
                }
            });
        } else {
            callback('Unable to open');
        }
    });
};

lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback('File deleted successfully');
        } else {
            callback('Error deleting file');
        }
    });
};

module.exports = lib;
