const express = require('express');
var router = express.Router();
const fs = require('fs');

const {toAdminLogin,toAdminHome} = require('../middleware/admin');


router.get('/',toAdminHome,(req,res)=>{
    res.render('admin/login')
});

 

router.post('/signin',require('../controllers/AdminController').signin);
router.post('/register',require('../controllers/AdminController').register);

router.get('/signout',require('../controllers/AdminController').signout);

router.get('/dashboard',toAdminLogin,require('../controllers/AdminController').dashboard);



router.get('/customers',toAdminLogin,require('../controllers/AdminController').customers);
router.get('/customer/:id',toAdminLogin,require('../controllers/AdminController').customer);
router.get('/customer/:id/:flag',toAdminLogin,require('../controllers/AdminController').customerActivate);

router.get('/admins',toAdminLogin,require('../controllers/AdminController').admins);
router.get('/add-new',toAdminLogin,require('../controllers/AdminController').addNewAdmin);
router.post('/add-new',toAdminLogin,require('../controllers/AdminController').saveNewAdmin);
router.post('/update-admin',toAdminLogin,require('../controllers/AdminController').updateAdmin);
router.get('/admin/:id',toAdminLogin,require('../controllers/AdminController').admin);
router.get('/admin/:id/:flag',toAdminLogin,require('../controllers/AdminController').adminActivate);


router.get('/catalog/category',toAdminLogin,require('../controllers/AdminController').catalogCategoryList);
router.post('/catalog/category',toAdminLogin,require('../controllers/AdminController').catalogCategoryAdd);

router.get('/catalog/product',toAdminLogin,require('../controllers/AdminController').catalogProductList);
router.get('/catalog/product-add',toAdminLogin,require('../controllers/AdminController').catalogProductAdd);
router.post('/catalog/product-add',toAdminLogin,require('../controllers/AdminController').catalogProductAdd);

router.get('/catalog/product-edit/:id',toAdminLogin,require('../controllers/AdminController').catalogProductEdit);
router.post('/catalog/update-product-image',toAdminLogin,require('../controllers/AdminController').updateProductImage);




router.get('/orders',toAdminLogin,require('../controllers/AdminController').orders);


router.get('/order/:id',toAdminLogin,require('../controllers/AdminController').order);

router.get('/order/delete/:id',toAdminLogin,require('../controllers/AdminController').orderDelete);

router.get('/order/order-complaint/:id',toAdminLogin,require('../controllers/AdminController').orderComplaint);


router.get('/order-shipping',toAdminLogin,require('../controllers/AdminController').orderShipping);

router.get('/order-shipping-list',toAdminLogin,require('../controllers/AdminController').orderShippingList);

router.get('/invoice/:id',toAdminLogin,require('../controllers/AdminController').invoice);

router.get('/shipping-detail/:id',toAdminLogin,require('../controllers/AdminController').shippingDetail);

router.get('/shipping-update/:id',toAdminLogin,require('../controllers/AdminController').shippingUpdate);

router.post('/shipping-update',toAdminLogin,require('../controllers/AdminController').doShippingUpdate);

router.get('/shipping-sendto-user/:id',toAdminLogin,require('../controllers/AdminController').sendToUser);



router.get('/complaints',toAdminLogin,require('../controllers/AdminController').complaints);
router.post('/complaint-response',toAdminLogin,require('../controllers/AdminController').complaintResponse);






router.get('/report/pending/orders',toAdminLogin,require('../controllers/ReportController').pendingOrders);


router.post('/report/pending/orders',require("../controllers/ReportController").getPendingOrders);




router.get('/term-and-condition',require("../controllers/AdminController").termAndCondition);
router.post('/term-and-condition',require("../controllers/AdminController").termAndConditionSave);



router.get('/order-report',require("../controllers/ReportController").orders);
router.get('/order-pending-report',require("../controllers/ReportController").orderPendingReport);

router.get('/account-ledger',require("../controllers/ReportController").accountLedger);
router.get('/sales',require("../controllers/ReportController").sales);


/*
const admin = './client/views/admin/all/';

fs.readdirSync(admin).forEach(file => {
  
  router.get('/all/'+file,(req,res)=>{
        res.render('admin/all/'+file)
    });
});*/

module.exports = router;