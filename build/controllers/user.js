"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logging_1 = __importDefault(require("../config/logging"));
var user_1 = __importDefault(require("../models/user"));
var mongoose_1 = __importDefault(require("mongoose"));
var validate = function (req, res, next) {
    logging_1.default.info('Token validated, ensuring user.');
    var firebase = res.locals.firebase;
    return user_1.default.findOne({ uid: firebase.uid })
        .then(function (user) {
        if (user) {
            return res.status(200).json({ user: user });
        }
        else {
            return res.status(401).json({
                message: 'Token(s) invalid, user not found'
            });
        }
    })
        .catch(function (error) {
        return res.status(500).json({
            message: error.message,
            error: error
        });
    });
};
var create = function (req, res, next) {
    logging_1.default.info('Attempting to register user ...');
    var _a = req.body, uid = _a.uid, name = _a.name;
    var fire_token = res.locals.fire_token;
    var user = new user_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        uid: uid,
        name: name
    });
    return user
        .save()
        .then(function (newUser) {
        logging_1.default.info("New user " + uid + " created");
        return res.status(200).json({ user: newUser, fire_token: fire_token });
    })
        .catch(function (error) {
        logging_1.default.error(error.message);
        return res.status(500).json({
            message: error.message
        });
    });
};
var login = function (req, res, next) {
    logging_1.default.info('Verifying user');
    var uid = req.body.uid;
    var fire_token = res.locals.fire_token;
    return user_1.default.findOne({ uid: uid })
        .then(function (user) {
        if (user) {
            logging_1.default.info("User " + uid + " found, attempting to sign token and return user ...");
            return res.status(200).json({ user: user, fire_token: fire_token });
        }
        else {
            logging_1.default.warn("User " + uid + " not in the DB, attempting to register ...");
            return create(req, res, next);
        }
    })
        .catch(function (error) {
        logging_1.default.error(error.message);
        return res.status(500).json({
            message: error.message
        });
    });
};
var read = function (req, res, next) {
    var _id = req.params.userID;
    logging_1.default.info("Incoming read for user with id " + _id);
    user_1.default.findById(_id)
        .exec()
        .then(function (user) {
        if (user) {
            return res.status(200).json({
                user: user
            });
        }
        else {
            return res.status(404).json({
                error: 'User not found.'
            });
        }
    })
        .catch(function (error) {
        logging_1.default.error(error.message);
        return res.status(500).json({
            error: error.message
        });
    });
};
var readAll = function (req, res, next) {
    logging_1.default.info('Readall route called');
    user_1.default.find()
        .exec()
        .then(function (users) {
        return res.status(200).json({
            count: users.length,
            users: users
        });
    })
        .catch(function (error) {
        logging_1.default.error(error.message);
        return res.status(500).json({
            message: error.message
        });
    });
};
exports.default = {
    validate: validate,
    create: create,
    login: login,
    read: read,
    readAll: readAll
};
