"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logging_1 = __importDefault(require("../config/logging"));
var firebase_admin_1 = __importDefault(require("firebase-admin"));
var extractFirebaseInfo = function (req, res, next) {
    var _a;
    logging_1.default.info('Validating firebase token');
    var token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (token) {
        firebase_admin_1.default
            .auth()
            .verifyIdToken(token)
            .then(function (result) {
            if (result) {
                res.locals.firebase = result;
                res.locals.fire_token = token;
                next();
            }
            else {
                logging_1.default.warn('Token invalid, Unauthorized');
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            }
        })
            .catch(function (error) {
            logging_1.default.error(error);
            return res.status(401).json({
                error: error,
                message: 'Unauthorized'
            });
        });
    }
    else {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};
exports.default = extractFirebaseInfo;
