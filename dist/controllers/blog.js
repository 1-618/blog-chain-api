"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logging_1 = __importDefault(require("../config/logging"));
var blog_1 = __importDefault(require("../models/blog"));
var mongoose_1 = __importDefault(require("mongoose"));
var create = function (req, res, next) {
    logging_1.default.info('Attempting to create blog ...');
    var _a = req.body, author = _a.author, title = _a.title, content = _a.content, headline = _a.headline, picture = _a.picture;
    var blog = new blog_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        author: author,
        title: title,
        content: content,
        headline: headline,
        picture: picture
    });
    return blog
        .save()
        .then(function (newBlog) {
        logging_1.default.info("New blog created");
        return res.status(201).json({ blog: newBlog });
    })
        .catch(function (error) {
        logging_1.default.error(error.message);
        return res.status(500).json({
            message: error.message
        });
    });
};
var read = function (req, res, next) {
    var _id = req.params.blogID;
    logging_1.default.info("Incoming read for blog with id " + _id);
    blog_1.default.findById(_id)
        .populate('author')
        .exec()
        .then(function (blog) {
        if (blog) {
            return res.status(200).json({ blog: blog });
        }
        else {
            return res.status(404).json({
                error: 'Blog not found.'
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
    logging_1.default.info('Returning all blogs ');
    blog_1.default.find()
        .populate('author')
        .exec()
        .then(function (blogs) {
        return res.status(200).json({
            count: blogs.length,
            blogs: blogs
        });
    })
        .catch(function (error) {
        logging_1.default.error(error.message);
        return res.status(500).json({
            message: error.message
        });
    });
};
var query = function (req, res, next) {
    logging_1.default.info('Query route called');
    blog_1.default.find(req.body)
        .populate('author')
        .exec()
        .then(function (blogs) {
        return res.status(200).json({
            count: blogs.length,
            blogs: blogs
        });
    })
        .catch(function (error) {
        logging_1.default.error(error.message);
        return res.status(500).json({
            message: error.message
        });
    });
};
var update = function (req, res, next) {
    logging_1.default.info('Update route called');
    var _id = req.params.blogID;
    blog_1.default.findById(_id)
        .exec()
        .then(function (blog) {
        if (blog) {
            blog.set(req.body);
            blog.save()
                .then(function (savedBlog) {
                logging_1.default.info("Blog with id " + _id + " updated");
                return res.status(201).json({
                    blog: savedBlog
                });
            })
                .catch(function (error) {
                logging_1.default.error(error.message);
                return res.status(500).json({
                    message: error.message
                });
            });
        }
        else {
            return res.status(401).json({
                message: 'NOT FOUND'
            });
        }
    })
        .catch(function (error) {
        logging_1.default.error(error.message);
        return res.status(500).json({
            message: error.message
        });
    });
};
var deleteBlog = function (req, res, next) {
    logging_1.default.warn('Delete route called');
    var _id = req.params.blogID;
    blog_1.default.findByIdAndDelete(_id)
        .exec()
        .then(function () {
        return res.status(201).json({
            message: 'Blog deleted'
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
    create: create,
    read: read,
    readAll: readAll,
    query: query,
    update: update,
    deleteBlog: deleteBlog
};
