const db = require('../models');

class OrderController{

	placeOrder(req,res){

	  var orderData = req.body.order;
	  req.session.paymentMethod = orderData.paymentMethod;
	  orderData.userId = req.session.user.id;
	  orderData.date = app.date;
	  orderData.time= app.time;
	  orderData.orderStatus = 'Ordered';
	  orderData.paymentStatus = 'Pending';
	  orderData.isTrash=0;
	  orderData.isActive=1;
	  orderData.pendingQty = 0;
	  orderData.orderAddress = JSON.stringify(req.body.address);

	  var items = req.session.cart;

		db.order.create(orderData)
		   .then((result)=>{

		if(orderData.paymentMethod == 'Razorpay'){	
		try{

            const Razorpay = require('razorpay');
            var instance = new Razorpay({
                key_id: app.razorpay_key,
                key_secret: app.razorpay_secret
              });

			var amt = parseFloat(orderData.total);
			amt = amt.toFixed(3);
			amt = parseFloat(amt)*100
			amt = parseInt(amt);
			var payload = {
				amount:amt, 
				currency:'INR', 
				receipt:result.id,
				payment_capture:0,
				notes:"NA"}
		  
			instance.orders.create(payload,async function(err,order){
				if(err)
					res.json({err,msg:'razorpay error',order,payload})



					req.session.user.orderId = result.id;
					req.session.user.orderAmount = result.total;
					req.session.user.razorpayOrderId = order.id;
					var {gstNumber,panNumber} = req.body.user;

					db.order.update({razorpayOrderId:order.id},{where:{id:result.id}}).then(r=>{
						console.log('success');
					}).catch(err=>{console.log('error log 3'); });
					db.user.update({address:orderData.orderAddress,gstNumber,panNumber},{where:{id:orderData.userId}}).then(r=>{
						req.session.user.address = req.body.address;
					}).catch(e=>{});	
				  for (const [key, value] of Object.entries(items)) {
						   items[key].orderId = result.id;
						   items[key].pendingQty = items[key].qty;
	 
						   if(items.length-1 == key){
							   db.orderitem.bulkCreate(items).then(r=>{
								   res.json({err:0,r,order});
							   }).catch(err=>{
								 res.json({err:1,msg:'items err',order})
								  });
								break;
						   }
					 }
				
			});

		}catch(err){
			console.log('error log 1',err);
		}

	}else{

		   	req.session.user.orderId = result.id;
		   	req.session.user.orderAmount = result.total;
		   	
		   	var {gstNumber,panNumber} = req.body.user;
		   	db.user.update({address:orderData.orderAddress,gstNumber,panNumber},{where:{id:orderData.userId}}).then(r=>{
		   		req.session.user.address = req.body.address;
		   	}).catch(e=>{});	
			 for (const [key, value] of Object.entries(items)) {
  					items[key].orderId = result.id;
  					items[key].pendingQty = items[key].qty;

  					if(items.length-1 == key){
  						db.orderitem.bulkCreate(items).then(r=>{
						  	res.json({err:0,r,order:null});
						  }).catch(err=>{
							res.json({err:1,msg:'items err',order:null})
					   	  });
					   	break;
  					}
				}

		   }

		})
		.catch(err=>{
		res.json({err:1,msg:'order err'})
		});
	}

	
	payment(req,res){
		res.render('payment');
	}


	responseOrder(req,res){
       
            var data = req.body;

            if(!data.razorpay_payment_id || !data.razorpay_order_id )
            	return res.redirect('failed');


            	data.currency = 'INR';


            
             	const Razorpay = require('razorpay');
                db.order.findOne({where:{razorpayOrderId:data.razorpay_order_id}}).then(resultOrder=>{

                    if(!resultOrder)
                        return res.json({ code:404, msg: "order not found",result:null });


                        var instance = new Razorpay({
                          key_id: app.razorpay_key,
                          key_secret: app.razorpay_secret
                        });
                      try{
                        data.amount = parseFloat(resultOrder.total);
						data.amount = data.amount*100;
						data.amount = parseInt(data.amount);

                        instance.payments.capture(data.razorpay_payment_id, data.amount, data.currency,result=>{
                          console.log(result);
                          db.order.update({paymentStatus:'Paid'},{where:{razorpayOrderId:data.razorpay_order_id}}).then(resultUpdate=>{
                             return res.redirect('success');
                          }).catch(err=>{
                            return res.json({ code:500, msg: "error log 1 ",result:null });
                          });
                          
                        })
                      }catch(err){
                          return res.json({ code:500, msg: "error log 2",result:err });
                      }

                }).catch(err=>{
                    return res.json({ code:500, msg: "error log 1",result:null });
                });
		            
		            
		      

        
    }
	

	process(req,res){
		if(req.session.paymentMethod == 'BankTransfer')
			res.render('process');
		else
			res.redirect('/success');
	}

	success(req,res){
	
		res.render('success');
	}


	failed(req,res){
		res.render('failed');
	}

	updateOrder(req,res){
		var orderId = req.session.user.orderId;
		var {purchaseOrder} = req.body;
		if(orderId){
			db.order.update({purchaseOrder},{where:{id:orderId}}).then(r=>{
				var result = {err:0,msg:"Great! Purchase order has been saved successful.",purchaseOrder};
				res.render('success',{result});
			}).catch(e=>{
				var result = {err:1,msg:"Sorry! Purchase order has not neen saved successful.",purchaseOrder};
				res.render('success',{result});
			});
		}
	}


	orderComplaints(req,res){
		let userId = req.session.user.id;
		db.ordercomplaint.findAll({where:{userId}}).then(complaints=>{

			res.render('user/order-complaint',{complaints});
		}).catch(e=>{
			res.render('user/order-complaint');
		});
	}

	uploadPayment(req,res){
		req.session.info = {};
		if (!req.files || Object.keys(req.files).length === 0) {
			req.session.info = {err:1,message:'Select image first'};
			return res.redirect('process');
		  }

		  let paymentProof = req.files.paymentProof;
		  	
		  if(245760 < paymentProof.size){
		  		req.session.info = {err:1,message:'image size less than '+(245760/2024).toFixed(0)+'Mb'};
				return res.redirect('process');
		  }	

		  if(paymentProof.mimetype != 'image/jpeg' || paymentProof.size < 1000){
		  	req.session.info = {err:1,message:'Please enter valid image'};
			return res.redirect('process');
		}
		
		  let file_name = req.session.user.firstname+'-'+req.session.user.orderId+'.jpg';
		  let dir = './client/public/uploads/payment/'+file_name;
		  paymentProof.mv(dir, function(err) {
		    if (err){
		    	req.session.info = {err:1,message:'File path Can not found!'};
		      return res.redirect('process');
		    }
		    db.order.update({paymentProof:file_name},{where:{id:req.session.user.orderId}}).then(
		    	r=>{
		    		res.redirect('success');
		    	}).catch(e=>{
		    	req.session.info = {err:1,message:'Error on save image'};
		      return res.redirect('process');
		    })
		    
		  });
	}


	downloadOrder(req,res){
			var {id} = req.params;

			var options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "45mm",
            contents: '<div style="text-align: center;"><h3>Performa Invoice</h3></div>'
        },
        "footer": {
            "height": "28mm",
            "contents": {
            first: 'Cosmos',
            2: 'Second page', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            last: 'Last Page'
        }
    	}
    };




			
			db.order.findOne({where:{id}}).then(order=>{
				order.orderAddress = JSON.parse(order.orderAddress);
				var pdf = require("pdf-creator-node");
				
				var data = [order.id,order.total,order.orderStatus,order.date,order.time,order.paymentMethod,order.paymentStatus];
				var csv = "";
				csv += "<h4><center>Cosmos International <br>";
				csv += "G 54 Sector 63 Noida Uttar Pradesh <br>";
				csv += "201307 </center> <br><br></h4>";
				csv += '<table style="width:100%">';
				csv += '<tr>\
				<th>ORDER_ID </th> <th>ORDER_TOTAL </th><th>ORDER_STATUS </th><th> ORDER_DATE </th><th> ORDER_TIME </th><th> PAYMENT_METHOD </th><th> PAYMENT_STATUS </th>\
				</tr>';

				csv += '<tr>';
				for(var x in data)
				 	csv +=  '<th>'+data[x]+' </th>';

				csv += '</tr>';

				csv +="\n \n Item Name, QTY, Pending QTY, GST, Price, Total \n";
				db.orderitem.findAll({where:{orderId:id}}).then(items=>{
					
					for (const [key, item] of Object.entries(items)){

						var subtotal = item.price*item.qty;
						var totalTax = (subtotal*item.tax)/100;
						var total = subtotal+totalTax;
						var itemName = item.name;

						csv += itemName.replace(/,/g, '')+', '+item.qty+', '+item.pendingQty+', '+item.tax+'%, '+item.price+', '+total+'\n';
					
				}
					
					var filename = "order-"+id+".pdf";
					 var doc = {
					    html: csv,
					    data: {
					        //users: users
					    },
					    path: "./client/downloads/"+filename
					};

					pdf.create(doc, options)
					    .then(pdfRes => {
							res.render('user/download',{url:filename});
					    })
					    .catch(err => {
					    	
					        res.redirect('/dashboard');
					    });
					
				});
				
				
			}).catch(e=>res.json(e));
			  
	}


 
}
module.exports = new OrderController;