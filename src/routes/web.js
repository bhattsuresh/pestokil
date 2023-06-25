const express = require('express');
var router = express.Router();
const app = require('../config/setting');

const MasterController = require('../controllers/MasterController');

const {toUserLogin,toUserHome} = require('../middleware/user');



// router.get('/',require('../controllers/MainController').index);

router.get('/',toUserHome,(req,res)=>{
    res.redirect('login');
});

router.get('/login',toUserHome,(req,res)=>{
    res.render('login');
});

router.get('/register',toUserHome, (req,res)=>{
    res.render('register');
});

router.get('/forgot-password',(req,res)=>{
	res.send('Coming soon');
});

router.get('/mbr-new',toUserLogin, (req,res)=>{
    res.render('certificate/mbr-new');
});

router.get('/mbr', (req,res)=>{
    res.render('certificate/mbr');
});

router.get('/tst', (req,res)=>{
    res.render('certificate/tst');
});

router.post('/login',toUserHome,require('../controllers/UserController').login);
router.post('/register',toUserHome,require('../controllers/UserController').signup);


// master route
router.get('/master/new-exporter',toUserLogin,MasterController.newExporter);
router.post('/master/new-exporter',toUserLogin,MasterController.addExporter);
router.get('/master/all-exporter',toUserLogin,MasterController.getExporter);
router.get('/master/exporter/active/:id/:val',toUserLogin,MasterController.activeExporter);


router.get('/master/new-consignee',toUserLogin,MasterController.newConsignee);
router.post('/master/new-consignee',toUserLogin,MasterController.addConsignee);
router.get('/master/all-consignee',toUserLogin,MasterController.getConsignee);
router.get('/master/consignee/active/:id/:val',toUserLogin,MasterController.activeConsignee);


router.get('/master/new-billing-party',toUserLogin,MasterController.newBillingParty);
router.post('/master/new-billing-party',toUserLogin,MasterController.addBillingParty);
router.get('/master/all-billing-party',toUserLogin,MasterController.getBillingParty);
router.get('/master/billing-party/active/:id/:val',toUserLogin,MasterController.activeBillingParty);





router.get('/dashboard',toUserLogin,require('../controllers/MainController').dashboard);


router.get('/mbr-certificate',toUserLogin,(req,res)=>{
    var data = {};
    data.certificateDate = '20/11/2022';
    data.fumigationOperator = "Suresh Bhatt";
    data.fumigationDuration = '24 HOURS';
    data.fumigationDate="23.3.2020"

    res.render('certificate/index',data);
});



router.get('/certificate/alp',toUserLogin,(req,res)=>{
    res.render('certificate/alp');
});



router.get('/certificate/aus',toUserLogin,(req,res)=>{
    res.render('certificate/aus');
});

router.get('/certificate/mbr/download',(req,res)=>{
    var html_to_pdf = require('html-pdf-node');

let options = { format: 'A4' };
// Example of options with args //
// let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };

//let file = { content: "<h1>Welcome to html-pdf-node</h1>" };
// or //
let file = { url: "http://localhost:5000/mbr" };
html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
  console.log("PDF Buffer:-", pdfBuffer);
  res.contentType("application/pdf");
  //res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
  res.send(pdfBuffer);
});
});


router.get('/branches',toUserLogin,require('../controllers/BranchController').branches);
router.get('/branch',toUserLogin,require('../controllers/BranchController').branch);
router.get('/branch/:id',toUserLogin,require('../controllers/BranchController').branchEdit);
router.post('/branch',toUserLogin,require('../controllers/BranchController').branchAdd);
router.get('/branch/active/:id/:val',toUserLogin,require('../controllers/BranchController').branchActive);


router.get('/users',toUserLogin,require('../controllers/UserController').users);
router.get('/user',toUserLogin,require('../controllers/UserController').user);
router.post('/user',toUserLogin,require('../controllers/UserController').userAdd);
router.get('/user/:id',toUserLogin,require('../controllers/UserController').userEdit);
router.get('/users/active/:id/:val',toUserLogin,require('../controllers/UserController').userActive);

router.get('/certificate-no',require('../controllers/CertificateController').generateCertificate);
router.get('/logout',require('../controllers/UserController').logout);









module.exports = router;