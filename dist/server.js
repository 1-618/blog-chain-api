"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Import the dependencies need in this module
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var logging_1 = __importDefault(require("./config/logging"));
var config_1 = __importDefault(require("./config/config"));
var mongoose_1 = __importDefault(require("mongoose"));
var firebase_admin_1 = __importDefault(require("firebase-admin"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
//Give access to private application information
dotenv_1.default.config();
//Import the routes that will be used to direct the flow of requests in the application
var user_1 = __importDefault(require("./routes/user"));
var blog_1 = __importDefault(require("./routes/blog"));
//Initialize express application by running the express function
var app = (0, express_1.default)();
//Logging Middleware
app.use((0, morgan_1.default)('tiny'));
//Parse the body
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
//Connect to Firebase Admin
var serviceAccountKey = require('./serviceAccountKey.json');
//Initialize firebase
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccountKey)
});
//Connect to Mongo database
mongoose_1.default
    .connect("mongodb+srv://" + process.env.USER_NAME + ":" + process.env.PASSWORD + "@blog0.dnbjn.mongodb.net/blog0", config_1.default.mongo.options)
    .then(function (result) {
    logging_1.default.info('Mongo connected!');
})
    .catch(function (error) {
    logging_1.default.error(error);
});
//Detailed Logging
app.use(function (req, res, next) {
    logging_1.default.info("METHOD: [" + req.method + "] - URL: [" + req.url + "] - IP: [" + req.socket.remoteAddress + "]");
    res.on('finish', function () {
        logging_1.default.info("METHOD: [" + req.method + "] - URL: [" + req.url + "] - STATUS: [" + res.statusCode + "] - IP: [" + req.socket.remoteAddress + "]");
    });
    next();
});
//Our Routes
app.use('/users', user_1.default);
app.use('/blogs', blog_1.default);
// Error Handling middleware to catch stray requests
app.use(function (req, res, next) {
    var error = new Error('Not found');
    res.status(404).json({
        message: error.message
    });
});
//Listen for http requests on specified port
app.listen(config_1.default.server.port, function () { return console.log("Server is running on port" + config_1.default.server.port); });
