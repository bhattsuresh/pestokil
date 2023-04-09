const db = require('../models');
const { success } = require('./OrderController');

class ApiController{

	getCustomer(req,res){
		   const db = require('../models');
		   db.user.findAll()
		   .then(customers=>{
			   res.json({err:0,customers});
		   })
		   .catch(err => res.json(err));
	   }

   addToCart(req,res){
   		const id = req.body.id;
   		const qty = req.body.qty;
		const db = require('../models');
		   db.product.findOne({where:{id},include: [
        {model:db.category,attributes:['name']}
        ],attributes:['id','image','name','model','sku','price','hsnSac','tax','sortDesc']})
		   .then(product=>{
			   res.json({err:0,data:{
			   	productId:product.id,
          		image:product.image == null ? 'default.jpg' : product.image,
			   	name:product.name,
			   	model:product.model,
			   	sku:product.sku,
			   	qty:qty,
			   	price:product.price,
          		hsnSac:product.hsnSac,
          		tax:product.tax,
			   	sortDesc:product.sortDesc,
			   	category:product.category.name
			   }});
		   })
		   .catch(err => res.json(err));
	   }
   
	 processCart(req,res){
	 	let cart = req.body.cart ? req.body.cart : 0;

      /*for (key in cart){
        let tex = cart[key].tax;
        let tax_amt = ((cart[key].price * cart[key].qty) *tax) / 100;
        cart[key].price += tax_amt;
      }*/
	 		req.session.cart = cart;

	 	if(cart)
	 		res.json({err:0,data:cart});
	 	else
	 		res.json({err:1});
	 }

	orderStatusUpdate(req,res){
	const db = require('../models');
    var data = req.body;
    var status = data.status == undefined ? '' : data.status;
    var note = data.statusNote == undefined ? '' : data.statusNote;
    var id = data.orderId == undefined ? '' : data.orderId;
    var routeNumber = data.routeNumber == undefined ? '' : data.routeNumber;
    if(status == 'Accepted')
      var orderUpdate = {orderStatus:status,paymentStatus:'Approved',statusNote:note,pendingQty:1,routeNumber,acceptedDate:app.date};
    else
      var orderUpdate = {orderStatus:status,statusNote:note,routeNumber,pendingQty:0};

    db.order.findOne({where:{id:data.orderId}}).then(
      record=>{
        if(record.orderStatus != status){
          record.update(orderUpdate,{where:{id}}).then(
            r=>{
              db.orderstatus.create({orderId:id,status,note,date:app.date}).then(r=>{
                res.json({'err':0,data:'Order moved to '+status});
              });
            });
        }else{
          res.json({'err':1,data:'Status already updated'});
        }
      });
  }


  sendOrderComplaint(req,res){
  	const db = require('../models');
  	var complaint = req.body;
  		complaint.userId = req.session.user.id;
  		complaint.date= app.date;
  		  var date = new Date();
		  var components = [
		    complaint.orderId,
		    date.getFullYear(),
		    date.getMonth(),
		    date.getDate(),
		    date.getHours(),
		    date.getMinutes(),
		    date.getSeconds(),
		    date.getMilliseconds()
		];

		complaint.ticket = components.join("");

		db.ordercomplaint.create(complaint).then(r=>{
			res.json({err:0,ticket:r.ticket});
		}).catch(e=>{
			res.json({err:1});
		});
		
  }

  checkEmail(req, res){
  	const db = require('../models');
  	var {email} = req.body;
  	db.user.count({where:{email}}).then(r=>{
  		if(r)
  			res.status(200).json({err:1})
  		else
  			res.status(200).json({err:0})
  	}).catch(e=>{res.json(e)})
  }

  checkPhone(req, res){
  	const db = require('../models');
  	var {phone} = req.body;
  	db.user.count({where:{phone}}).then(r=>{
  		if(r)
  			res.status(200).json({err:1})
  		else
  			res.status(200).json({err:0})
  	}).catch(e=>{res.json(e)})
  }

  getOrderOtems(req, res){
  	const db = require('../models');
    const { Op } = require("sequelize");
  	var {orderId} = req.body;
  	db.order.findOne({where:{id:orderId}}).then(order=>{
        		db.orderitem.findAll({where:{orderId,pendingQty:{[Op.not]:0}}}).then(r=>{
  					res.status(200).json({err:0,data:r,order})	
  				}).catch(e=>{res.status(200).json({err:1}); })
        })
  
  }



  createShippingItems(req,res){
    var shipping = req.body.shipping;
    var shipItems = req.body.ship;
    var orderStatus = req.body.orderStatus;
    shipping.status = "Dispatched";
    shipping.active = 1;
    shipping.date = app.date;

    const db = require('../models');
    if(shipItems == undefined)
      return res.json({err:1,msg:'No items found in this shipping.'});

    db.shipping.create(shipping).then(ship=>{
      var itemIns = [];
      var amount = 0;
      for (const [key, value] of Object.entries(shipItems.orderItemId)) {
       if(parseFloat(shipItems.qty[key])>0){
          var itemUpdate = {pendingQty:shipItems.itemQty[key]-shipItems.qty[key]};
          db.orderitem.update(itemUpdate,{where:{id:shipItems.orderItemId[key]}}).then(re=>{}).catch(e=>{console.log(e)});
          itemIns.push({
          shippingId:ship.id,
          orderItemId:value,
          productId:shipItems.productId[key],
          category:shipItems.itemCategory[key],
          name:shipItems.itemName[key],
          sortDesc:shipItems.itemSortDesc[key],
          qty:shipItems.qty[key],
          hsnSac:shipItems.hsnSac[key],
          tax:shipItems.tax[key],
          rate:shipItems.rate[key],
          status:'Send',
          active:1,

        });
          var subTotal = shipItems.qty[key]*shipItems.rate[key];
          var subTaxTotal = (subTotal*shipItems.tax[key])/100;
          amount += subTaxTotal+subTotal;
      }
       
       if(shipItems.orderItemId.length-1 == key){
              if(itemIns.length){
                db.shippingitem.bulkCreate(itemIns).then(r=>{
                  var orderUp = orderStatus == 'Shipped' ? {orderStatus,pendingQty:0} : {orderStatus,pendingQty:1};

                  db.order.update(orderUp, {where:{id:shipping.orderId}}).then(st=>{}).catch(e=>{})
                  db.shipping.update({amount}, {where:{id:ship.id}}).then(st=>{}).catch(e=>{})
                   res.json({err:0,msg:'Item added to shipping.',id:ship.id});
                }).catch(err=>{
                res.json({err:1,msg:'items err'})
                  });
              }
              break;
            }
      }
     
    }).catch(e=>res.json({err:1,msg:'Sorry some issue with this shipping.'}));
  }


  addUserCategory(req,res){
    var {categoryId,userId} = req.body;
    const db = require('../models');
    db.usercategory.count({where:{categoryId,userId}}).then(r=>{
      if(r){
        res.json({err:1,msg:"This company already exsit."});
      }else{
        db.usercategory.create({categoryId,userId,active:1,status:'assigned'})
        res.json({err:0,msg:"This company has been assigned to user successfully."});
      }
    })
  }


  delUserCategory(req,res){
    var {categoryId,userId} = req.body;
    const db = require('../models');
    db.usercategory.count({where:{categoryId,userId}}).then(r=>{
     
        db.usercategory.destroy({where:{categoryId,userId}})
        res.json({err:0,msg:"This company has been removed from user successfully."});
    })
  }

  updateCategory(req,res){

    var id = req.body.id;
    var name = req.body.name;
    var date = app.date;
    const db = require('../models');
    db.category.update({name,date},{where:{id}}).then(r=>{
        res.json({err:0,msg:"This company has been updated successfully."});
    }).catch(e=>res.json({err:1}))
  }

  updateProduct(req, res) {
    let id = req.body.id;
    let product = req.body.product;
    
    const db = require('../models');
    db.product.update(product,{ where: { id: id } })
      .then((product) => res.json({err:0}))
      .catch((err) => res.json({err:1}));
  }

  setTsc(req,res){
    var tsc = req.body.tsc;
    var userId = req.body.userId;
    db.user.update({tsc},{where:{id:userId}}).then(success=>{
      res.json({err:0});
    }).catch(err=> res.json({err:1}));
  }


  setCredit(req,res){
    var credit = req.body.credit;
    var userId = req.body.userId;
    db.user.update({credit},{where:{id:userId}}).then(success=>{
      res.json({err:0});
    }).catch(err=> res.json({err:1}));
  }
 
 
}
module.exports = new ApiController;