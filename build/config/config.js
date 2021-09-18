"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    mongo: {
        options: {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            socketTimeoutMS: 30000,
            keepAlive: true,
            // poolSize: 50,
            autoIndex: false,
            retryWrites: false
        },
        url: "mongodb+srv://Ary:endgoal8845@blog0.dnbjn.mongodb.net/blog0"
    },
    server: {
        host: 'localhost',
        port: '1337'
    }
};
exports.default = config;
