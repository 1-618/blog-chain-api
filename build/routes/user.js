"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var user_1 = __importDefault(require("../controllers/user"));
var extractFirebaseInfo_1 = __importDefault(require("../middleware/extractFirebaseInfo"));
var router = express_1.default.Router();
router.get('/validate', extractFirebaseInfo_1.default, user_1.default.validate);
router.get('/:userID', user_1.default.read);
router.post('/create', user_1.default.create);
router.post('/login', user_1.default.login);
router.get('/', user_1.default.readAll);
module.exports = router;
