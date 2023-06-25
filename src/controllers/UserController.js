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
				   res.redirect('/login');
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
      	 
         res.render("user/users", {users});
      })
      .catch((err) => console.log(err));
  }

  async user(req,res){
    let branches = await db.branch.findAll();
  	res.render("user/new-user",{branches})
  }


	async userAdd(req,res){
	   let data = req.body;

	   if(data.id == ""){
	   		 data.active = 1;
	   		 delete data.id;
			db.user.create(data)
		   .then((result)=>{
			   req.session.info = {err:0,msg:'User created successful.'}; 
		   	   res.redirect('/users');
		   })
		   .catch(err=>{
		   		return res.json(err)
		   });

	   }else{
		var where = {where:{id:data.id}};

		var user = await db.user.findOne(where);

		   user.name = data.name;
		   user.email = data.email;
		   user.username = data.username;
		   user.branchCode = data.branchCode;
		   if(data.checkPass){
		   	user.password = data.password
		   }

		   await user.save();	

		   req.session.info = {err:0,msg:'User updated successful.'}; 
		   	   res.redirect('/users');
		}


       
	}

	async userEdit(req,res){
		let id = req.params.id;
		var where = {where:{id:id}};
		var user = await db.user.findOne(where);
		
		 let branches = await db.branch.findAll();
  		res.render("user/new-user",{branches,user})

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
		var username = req.body.username,
            password = req.body.password;
    
		const jwt = require('jsonwebtoken');
			
		db.user.findOne({ where: { username:username } }).then(function (user) {
            if(!user){
				//req.session.info = {err:1,msg:"User Not found!"};
				res.status(200).send({
					success:false,
					message:"User Not found!",
					data:null
				});
			}
			else{
				
				
				let bcrypt = require('bcryptjs');  
					bcrypt.compare(password, user.password, (err,result)=>{
					if(result){
						

						if(user.active){
							//req.session.user = user.dataValues;
							//req.session.user.address = JSON.parse(req.session.user.address);
							//req.session.user.isLogged=true;
							//req.session.info = {err:0,msg:"Login Success"};
							//let url = req.session.history == undefined ? '/':req.session.history.pop();
							const token = jwt.sign(
								{
									user:user.dataValues
								},
								process.env.APP_KEY,
								{ expiresIn: 60*60 } //one hour
								
								// { expiresIn: "24h" }
								// { expiresIn: 60*60*24 }
							  );

							res.status(200).send({success:true,
								message:"Login Success",
							data:user.dataValues,
							token:token,
							type:"Baerer"
						})
							
							
						}else{
							req.session.info = {err:1,msg:"Account not active yet."};
							res.status(200).send({
								success:false,
								message:"Account not active yet.",
								data:null
							});
						}
					}else{
						req.session.info = {err:1,msg:"Password Incorrect"};
						res.status(200).send({
							success:false,
							message:"Password Incorrect.",
							data:null
						});
					}
					});
					
				
			}	
			
		}).catch(e=>{
			
			req.session.info = {err:1,msg:"Sorry Login error"};
			res.status(200).send({
				success:false,
				message:"Sorry Login error",
				data:e
			});
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
	        		res.clearCookie(process.env.SESS_NAME);
	                req.session = null;
	                console.log("logout successful");
	                return res.redirect('/login');
	            }
	        });
	        
		    } else {
		        return res.redirect('/login');
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