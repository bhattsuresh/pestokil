const express = require('express');
var router = express.Router();
const app = require('../config/setting');

const {toUserLogin,toUserHome} = require('../middleware/user');



router.get('/',require('../controllers/MainController').index);

router.get('/cart',require('../controllers/MainController').cart);
router.get('/checkout',toUserLogin,require('../controllers/MainController').checkout);
router.get('/contact',require('../controllers/MainController').contact);
router.get('/about',require('../controllers/MainController').about);
//router.get('/service',require('../controllers/MainController').service);
router.get('/product',require('../controllers/MainController').product);



router.get('/account',toUserHome,require('../controllers/MainController').account);

router.post('/login',toUserHome,require('../controllers/UserController').login);
router.post('/signup',toUserHome,require('../controllers/UserController').signup);

router.post('/forgot',toUserHome,require('../controllers/UserController').forgotPassword);

router.post('/reset',toUserHome,require('../controllers/UserController').resetPassword);

router.get('/dashboard',toUserLogin,require('../controllers/MainController').dashboard);

router.get('/order/track-order/:id',toUserLogin,require('../controllers/MainController').trackOrder);

router.get('/order/download-order/:id',toUserLogin,require('../controllers/OrderController').downloadOrder);

router.post('/place-order',toUserLogin,require('../controllers/OrderController').placeOrder);
router.get('/payment',toUserLogin,require('../controllers/OrderController').payment);
router.post('/response',toUserLogin,require('../controllers/OrderController').responseOrder);


router.get('/process',toUserLogin,require('../controllers/OrderController').process);
router.get('/success',toUserLogin,require('../controllers/OrderController').success);
router.get('/failed',toUserLogin,require('../controllers/OrderController').failed);

router.post('/update-order',toUserLogin,require('../controllers/OrderController').updateOrder);

router.post('/upload-payment',toUserLogin,require('../controllers/OrderController').uploadPayment);

router.get('/order-complaints',toUserLogin,require('../controllers/OrderController').orderComplaints);

router.get('/order/invoices',toUserLogin,require('../controllers/UserController').orderInvoices);

router.get('/order/invoice/:id',toUserLogin,require('../controllers/UserController').orderInvoice);

router.get('/order/shipping-detail/:id',toUserLogin,require('../controllers/UserController').orderShipping);

router.get('/account/ledger',toUserLogin,require('../controllers/UserController').accountLedger);


router.get('/logout', require('../controllers/UserController').logout);


router.get('/privacy-policy', require('../controllers/MainController').privacyPolicy);
router.get('/terms-conditions', require('../controllers/MainController').termsConditions);
router.get('/shipping', require('../controllers/MainController').shippingPolicy);
router.get('/returns-refunds', require('../controllers/MainController').returnExchange);


router.get('/payment-shipping', require('../controllers/MainController').paymentShipping);









module.exports = router;