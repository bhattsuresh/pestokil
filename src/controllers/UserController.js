const db = require('../models');

class UserController{

	signup(req,res){
		   let data = req.body;

			db.user.create(data)
			   .then((result)=>{
				   //req.session.info = {err:0,msg:'Signup successful. Please wait your id active soon.'};
				   
					/*require('../lib/email')
					.to(data.email)
					.sub('Register Successful.')
					.render('c-signup',{firstname:data.firstname})
					.send((e,r)=>{console.log(e,r)});*/
			   	req.session.user = result;
				   res.redirect('/users');
			   })
			   .catch(err=>{
			   
			   return	res.json(err)
				//req.session.info = {err:1,msg:'This Email or Mobile already registered'}
				res.redirect('/');
			   });
	}

	 users(req, res) {
    const { Op } = require("sequelize");
   /* var year = req.params.year;
    if (!year) year = app.year;
    /*var whr = {
      where: {
        date: {
          [Op.like]: year + "%",
        },
      },
    };*/

    db.user.findAll({order: [['createdAt', 'DESC']]})
      .then((users) => {
         res.render("users", {users});
      })
      .catch((err) => console.log(err));
  }


  userActive(req,res){
  	var {id,val} = req.params

  	var update = {active:val};
   	var where = {where:{id:id}};
	  	db.user.update(update,where).then(r=>{
	  		 res.redirect('/users');
	  		//res.json({err:0,msg:"User has been updated successfully",r});
	  	}).catch(e=>{
	  		res.json({err:1,msg:"Sorry! someting went wrong!",data,e});
	  	})


  }


	login(req,res){
		req.session.info = {};
		var email = req.body.signin.email,
            password = req.body.signin.password;
			
		db.user.findOne({ where: { email:email } }).then(function (user) {
            if(!user){
				res.json({err:1,msg:"User Not found!"});
			}
			else{
				
				
				let bcrypt = require('bcryptjs');  
					bcrypt.compare(password, user.password, (err,result)=>{
					if(result){
						

						if(user.active){
							req.session.user = user.dataValues;
							req.session.user.address = JSON.parse(req.session.user.address);
							req.session.user.isLogged=true;
							req.session.info = {err:0,msg:"Login Success"};
							let url = req.session.history == undefined ? '/':req.session.history.pop();
							db.usercategory.findAll({
								where:{userId:user.id},
								include: [
						        {model:db.category,attributes:['name']}
						        ]}).then(r=>{

								req.session.user.category = r;
								res.json({err:0,msg:"Login successful! Please wait...",url});
							}).catch(e=>{
								res.json({err:1,msg:"Account not active yet...",url});
							})
						    							
							
							
						}else{
							res.json({err:1,msg:"Account not active yet."});
						}
					}else{
						res.json({err:1,msg:"Password Incorrect"});
					}
					});
					
				
			}	
			
		}).catch(e=>{
			res.json({err:1,msg:"Sorry Login error"});
		})
		
	}

	orderInvoices(req,res){
		 var userId = req.session.user.id;

		    db.shipping.findAll({where:{userId,sendToUser:1},order: [['updatedAt', 'DESC']]}).then(result=>{
		   
		          res.render('user/invoices',{shipping:result});
		         
		      }).catch(e=>{
		        res.render('user/invoices');
		      })
	}



	orderInvoice(req, res){ 
    var id = req.params.id;
    var userId = req.session.user.id;
 
	   		db.shipping.findOne({where:{id,userId,sendToUser:1},include: [{model:db.user},{model:db.order}]}).then(result=>{
	      	result.user.address = JSON.parse( result.user.address);

	      	
	      
	          db.shippingitem.findAll({where:{shippingId:id},include: [{model:db.product}]}).then(items=>{
	            
	              res.render('user/invoice',{shipping:result,shippingItems:items});
	         
	          }).catch(e=>{
	            res.render('user/invoice');
	          })
	        
	      }).catch(e=>{
	        
	        res.render('user/invoice');
	      })
   
 
  }


orderShipping(req, res){
       var id = req.params.id;
    var userId = req.session.user.id;
 /*
	   		db.shipping.findOne({where:{id,userId},include: [{model:db.user},{model:db.order}]}).then(result=>{
	      	//result.user.address = JSON.parse( result.user.address);
	      	
	      
	          db.shippingitem.findAll({where:{shippingId:id},include: [{model:db.product}]}).then(items=>{
	            
	              res.render('user/invoice',{shipping:result,shippingItems:items});
	         
	          }).catch(e=>{
	            res.render('user/invoice');
	          })
	        
	      }).catch(e=>{
	        
	        res.render('user/invoice');
	      })
   
 		*/

 		db.shipping.findOne({where:{id},include: [{model:db.user},{model:db.order}]}).then(result=>{
    result.user.address = JSON.parse( result.user.address);
      
          db.shippingitem.findAll({where:{shippingId:id},include: [{model:db.product}]}).then(items=>{
           
              res.render('user/invoice',{shipping:result,shippingItems:items});
         
          }).catch(e=>{
            res.render('user/invoice');
          })
        
      }).catch(e=>{
        
        res.render('user/invoice');
      })
  }

  forgotPassword(req,res){
  	var {email} = req.body;
  	var forgotCode = app.uniqueId;

  	db.user.findOne({where:{email}}).then(usr=>{
  		if(usr){

  			require('../lib/email')
			.to(email)
			.sub('Forget Password request')
			.render('c-forgot',{forgotCode,firstname:usr.firstname})
			.send((e,r)=>{
				console.log(e,r)
			});

  			res.json({code:200,err:0,user:usr,forgotCode,msg:"Success, Please check your email."});

  		}
  		else{
  			res.json({code:404,err:1,msg:"Sorry, user not found with this email."});
  		}
  	}).catch(e=>{
  		res.json({code:404,err:1,msg:"Sorry, this action cannot be performed."});
  	})

  

  }


  resetPassword(req,res){
  	var data = req.body;
  	const bcrypt = require("bcryptjs");
    const salt = bcrypt.genSaltSync();
  
    let password = data.password = bcrypt.hashSync(data.password, salt);
   	var update = {password};
   	var where = {where:{email:data.email}};
	  	db.user.update(update,where).then(r=>{
	  		res.json({err:0,msg:"Password has been updated successfully",r});
	  	}).catch(e=>{
	  		res.json({err:1,msg:"Sorry! someting went wrong!",data,e});
	  	})


  
  	}
	
   
	   list(req,res){
		const { Op } = require("sequelize");
		var year = req.params.year;
		if(!year)
		   year = config.year;
		   
		   db.user.findAll({where:{  date: {
			[Op.like]: year+'%',  
		  }}})
		   .then(customers=>{
			   res.render("customer/list",{customers,year})
		   })
		   .catch(err => console.log(err));
	   }
   
	   edit(req,res){
		   let id = req.params.id;
		   db.user.findOne(
			   { where: { id:id} }
			 )
			   .then(customer =>
				 res.render('customer/edit',{customer})
			   )
			   .catch(err =>
				 res.end(err)
			   );
	   }

	   update(req,res){
		let data = req.body;
		let {id,name,address,phone} = data;
		db.user.update(
			{ name,address,phone},
			{ where: { id: id } }
		  )
			.then(result =>
			  res.send('Customer has been updated successfully.')
			)
			.catch(err =>
			  res.end(err)
			);
		}


   
	   delete(req,res){
		   let data = req.body;
		
		   let {id,name} = data;
		   db.user.destroy(
			   { where: { id: id } }
			 )
			   .then(result =>
				 res.send(' <br><b>'+ name+'</b> has been deleted successfully.')
			   )
			   .catch(err =>
				 res.end(err)
			   );
	   }



	logout(req, res,next) {
	    if (req.session.user) {
	        
	        req.session.destroy(function(err) {
	            if(err) {
	                return next(err);
	            } else {
	        		res.clearCookie('cosmossid');
	                req.session = null;
	                console.log("logout successful");
	                return res.redirect('/account');
	            }
	        });
	        
		    } else {
		        return res.redirect('/account');
		    }
	}

	accountLedger(req,res){
		var {id} = req.session.user;
		db.order.findAll({where:{userId:id},include: [{model:db.shipping}],order: [['updatedAt', 'DESC']]}).then(orders=>{

			return res.render('user/account-ledger',{shipping:orders}); 
		}).catch(e=>{
			return res.render('user/account-ledger'); 
		});
		
	}
	  
 
}
module.exports = new UserController;