var express = require('express');
var router = express.Router();
const userController= require("../controllers/users");
const {validateFormRegister} = require('../middlewares/validarFormRegister');
const {isCookie} = require('../middlewares/isCookies')



router.get('/register',userController.register.get);
router.post('/register',validateFormRegister, userController.register.post);

router.post('/login',isCookie,userController.login.post);
router.get('/login',userController.login.get);




module.exports = router;
