"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var blog_1 = __importDefault(require("../controllers/blog"));
var router = express_1.default.Router();
router.get('/', blog_1.default.readAll);
router.get('/read/:blogID', blog_1.default.read);
router.post('/create', blog_1.default.create);
router.post('/query', blog_1.default.query);
router.patch('/update/:blogID', blog_1.default.update);
router.delete('/:blogID', blog_1.default.deleteBlog);
module.exports = router;
