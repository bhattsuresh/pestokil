const express = require('express');
var router = express.Router();
const app = require('../config/setting');

const {toUserLogin,toUserHome} = require('../middleware/user');



router.get('/',require('../controllers/MainController').index);


router.get('/login',(req,res)=>{
    res.render('login');
});

router.get('/register',(req,res)=>{
    res.render('register');
});


router.get('/certificate',(req,res)=>{
    var data = {};
    data.date = new Date();
    data.fumigationOperator = "Suresh Bhatt";
    data.fumigationDuration = '24 HOURS';
    data.fumigationDate="23.3.2020"

    res.render('certificate/index',data);
});



router.get('/users',require('../controllers/UserController').users);
router.get('/users/active/:id/:val',require('../controllers/UserController').userActive);


router.post('/login',toUserHome,require('../controllers/UserController').login);
router.post('/register',require('../controllers/UserController').signup);









module.exports = router;