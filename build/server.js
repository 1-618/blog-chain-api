"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var logging_1 = __importDefault(require("./config/logging"));
var config_1 = __importDefault(require("./config/config"));
var mongoose_1 = __importDefault(require("mongoose"));
var firebase_admin_1 = __importDefault(require("firebase-admin"));
var user_1 = __importDefault(require("./routes/user"));
var router = (0, express_1.default)();
/**Server Handling */
var httpServer = http_1.default.createServer(router);
/**Connect to Firebase Admin */
var serviceAccountKey = require('./config/serviceAccountKey.json');
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccountKey)
});
/**Logging Middleware using Morgan */
router.use((0, morgan_1.default)('tiny'));
/**Connect to Mongo */
mongoose_1.default
    .connect(config_1.default.mongo.url, config_1.default.mongo.options)
    .then(function () {
    logging_1.default.info('Mongo connected!');
})
    .catch(function (error) {
    logging_1.default.error(error);
});
/** Log the request */
/**router.use((req, res, next) => {
    logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});*/
/**Parse the body */
router.use(express_1.default.urlencoded({ extended: true }));
router.use(express_1.default.json());
/**API Access Policies */
router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
/**Routes */
router.use('/users', user_1.default);
/**Error Handling */
router.use(function (req, res, next) {
    var error = new Error('Not found');
    res.status(404).json({
        message: error.message
    });
});
/** Listen */
httpServer.listen(config_1.default.server.port, function () { return console.log("Server is running " + config_1.default.server.host + ":" + config_1.default.server.port); });
