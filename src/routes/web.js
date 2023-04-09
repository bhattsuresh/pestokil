const express = require('express');
var router = express.Router();
const app = require('../config/setting');

const {toUserLogin,toUserHome} = require('../middleware/user');



router.get('/',require('../controllers/MainController').index);


router.get('/login',(req,res)=>{
    res.render('login');
});
router.post('/login',toUserHome,require('../controllers/UserController').login);
router.post('/signup',toUserHome,require('../controllers/UserController').signup);









module.exports = router;