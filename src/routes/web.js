const express = require('express');
var router = express.Router();
const app = require('../config/setting');

const {toUserLogin,toUserHome} = require('../middleware/user');



router.get('/',require('../controllers/MainController').index);


router.get('/login',toUserHome,(req,res)=>{
    res.render('login');
});

router.get('/register',toUserHome, (req,res)=>{
    res.render('register');
});

router.get('/forgot-password',(req,res)=>{
	res.send('Coming soon');
});

router.post('/login',toUserHome,require('../controllers/UserController').login);
router.post('/register',toUserHome,require('../controllers/UserController').signup);


// master route
router.get('/master/new-exporter',toUserLogin,(req,res)=>{
	res.render('master/new-exporter');
});


router.post('/master/new-exporter',toUserLogin,require('../controllers/MasterController').addExporter);
router.get('/exporter/active/:id/:val',toUserLogin,require('../controllers/MasterController').activeExporter);


router.get('/master/all-exporter',toUserLogin,require('../controllers/MasterController').getExporter);

router.get('/master/new-consignee',toUserLogin,(req,res)=>{
	res.render('master/new-consignee');
});


router.post('/master/new-consignee',toUserLogin,(req,res)=>{
    var data = req.body;
    //var companyName = data.name
    res.json(data);
    //res.render('master/new-exporter');
});

router.get('/master/all-consignee',toUserLogin,(req,res)=>{
    res.render('master/all-consignee');
});

router.get('/master/new-billing-party',toUserLogin,(req,res)=>{
	res.render('master/new-billing-party');
});


router.post('/master/new-billing-party',toUserLogin,(req,res)=>{
    var data = req.body;
    //var companyName = data.name
    res.json(data);
    //res.render('master/new-exporter');
});

router.get('/master/all-billing-party',toUserLogin,(req,res)=>{
	res.render('master/all-billing-party');
});

router.get('/dashboard',toUserLogin,require('../controllers/MainController').dashboard);


router.get('/certificate',toUserLogin,(req,res)=>{
    var data = {};
    data.certificateDate = '20/11/2022';
    data.fumigationOperator = "Suresh Bhatt";
    data.fumigationDuration = '24 HOURS';
    data.fumigationDate="23.3.2020"

    res.render('certificate/index',data);
});



router.get('/users',toUserLogin,require('../controllers/UserController').users);
router.get('/users/active/:id/:val',toUserLogin,require('../controllers/UserController').userActive);

router.get('/logout',require('../controllers/UserController').logout);









module.exports = router;