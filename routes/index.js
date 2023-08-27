var express = require('express');
var router = express.Router();
const indexController= require("../controllers/index")


/* GET users listing. */

router.get('/', indexController.index.get);



module.exports = router;
