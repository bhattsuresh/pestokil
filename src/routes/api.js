const express = require('express');
const app = require('../config/setting');
var router = express.Router();

router.get('/',(req,res)=>{
    res.json({"res":"Hello"})
});

router.get('/customer-get',require("../controllers/ApiController").getCustomer);

router.post('/add-to-cart',require("../controllers/ApiController").addToCart);

router.post('/process-cart',require("../controllers/ApiController").processCart);

router.post('/order-update-status',require("../controllers/ApiController").orderStatusUpdate);


router.post('/send-order-complaint',require("../controllers/ApiController").sendOrderComplaint);


router.post('/check-email',require("../controllers/ApiController").checkEmail);

router.post('/check-phone',require("../controllers/ApiController").checkPhone);

router.post('/get-order-items',require("../controllers/ApiController").getOrderOtems);

router.post('/create-shipping-items',require("../controllers/ApiController").createShippingItems);

router.post('/add-user-category',require("../controllers/ApiController").addUserCategory);

router.post('/del-user-category',require("../controllers/ApiController").delUserCategory);



router.post('/update-category',require("../controllers/ApiController").updateCategory);


router.post('/update-product',require("../controllers/ApiController").updateProduct);


router.post('/set-tsc',require("../controllers/ApiController").setTsc);
router.post('/set-credit',require("../controllers/ApiController").setCredit);




router.get('/reset-info-session',(req,res)=>{
    app.info = null;
    res.json({err:0});
})

module.exports = router;
