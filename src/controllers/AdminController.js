const db = require("../models");
class AdminController {

    constructor(){
       
         if(config.dashboard == undefined){
            config.dashboard = {};
            const { Op } = require("sequelize");


            db.user.count().then(users=>{config.dashboard.users = users;}).catch(e=>{console.log(e)});  
            db.order.count().then(all=>{config.dashboard.all = all;}).catch(e=>{console.log(e)});  
            db.order.count({where:{orderStatus: {
            [Op.ne]: 'Shipped'}}}).then(current=>{config.dashboard.current = current;}).catch(e=>{console.log(e)});  
             
            db.order.count({where:{orderStatus:'Shipped'}}).then(shipped=>{config.dashboard.shipped = shipped;}).catch(e=>{console.log(e)}); 
        }
       
    }


  register(req, res) {
    let data = req.body.signup;
    let app_key = req.body.app_key;

    if (config.key == app_key) {
      db.admin.create(data)
        .then((result) => {
          req.session.info = {
            err: 0,
            msg: "Signup successful. Please wait your id active soon.",
          };
          require("../lib/email")
            .to(data.email)
            .sub("Register Successful.")
            .render("c-signup", { firstname: data.firstname })
            .send((e, r) => {
              console.log(e, r);
            });
          res.redirect("/admin");
        })
        .catch((err) => {
          req.session.info = { err: 1, msg: "This Email or Mobile already registered" };
          res.redirect("/admin");
        });
    } else {
      req.session.info = { err: 1, msg: "Not Found App key" };
      res.redirect("/admin");
    }
  }

  signin(req, res) {
    var email = req.body.signin.email,
      password = req.body.signin.password;

    db.admin.findOne({ where: { email: email }})
      .then(function (user) {
        if (!user) {
          req.session.info = { err: 1, msg: "User Not found!" };
          res.redirect("/admin");
        } else {
          let bcrypt = require("bcryptjs");
          bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
              if (user.active) {
				  user.rights = JSON.parse(user.rights);
                req.session.admin = { data: user, isLogged: true };
                req.session.info = null;
                res.redirect("/admin/dashboard");
              } else {
                req.session.info = { err: 1, msg: "Account not active yet." };
                res.redirect("/admin");
              }
            } else {
              req.session.info = { err: 1, msg: "Password Incorrect" };
              res.redirect("/admin");
            }
          });
        }
      })
      .catch((e) => {
        req.session.info = { err: 1, msg: "Sorry Login error" };
        res.redirect("/admin");
      });
  }


  signout(req,res,next){
    if (req.session.admin) {
          
          req.session.destroy(function(err) {
              if(err) {
                  return next(err);
              } else {
              res.clearCookie('cosmossid');
                  req.session = null;
                  console.log("logout successful");
                  return res.redirect('/admin');
              }
          });
          
        } else {
            return res.redirect('/admin');
        }
  }


  dashboard(req,res){
   
    var whereOrder = {order: [['updatedAt', 'DESC']],limit:5};
    var whereComplaint = {where:{active: 1},order: [['createdAt', 'DESC']],limit:5};

    db.order.findAll(whereOrder).then(orders=>{
          db.ordercomplaint.findAll(whereComplaint).then(complaints=>{
          res.render('admin/index',{complaints,orders});
        }).catch(e=>{
          res.render('admin/index',{orders});
        });
    }).catch(e=>{
      res.render('admin/index');
    });  
  }


  customers(req, res) {
    const { Op } = require("sequelize");
    var year = req.params.year;
    if (!year) year = app.year;
    /*var whr = {
      where: {
        date: {
          [Op.like]: year + "%",
        },
      },
    };*/

    db.user.findAll({order: [['updatedAt', 'DESC']]})
      .then((users) => {
        res.render("admin/users/customer-list", { users, year });
      })
      .catch((err) => console.log(err));
  }

  customer(req, res) {
    var id = req.params.id;
    

    db.user.findOne({ where: { id } })
      .then((usr) => {
        if(!usr){
          res.render("admin/users/customer-detail");
        }
        let user = usr.dataValues;
      // user.address = JSON.parse(user.address);
          db.usercategory.findAll({
                where:{userId:user.id},
                include: [
                    {model:db.category,attributes:['name']}
                    ],attributes: ['categoryId']}).then(r=>{
                user.category = r;
                
                res.render("admin/users/customer-detail", { user });
              }).catch(e=>{
                 
                res.render("admin/users/customer-detail", { user });
              })
          
      
      })
      .catch((err) => console.log(err));
  }

  customerActivate(req, res) {
    let id = req.params.id;
    let active = parseInt(req.params.flag);
    active = active ? 0 : 1;

    db.user.update({ active }, { where: { id } }).then((r) => {
      res.redirect("/admin/customers");
    });
  }

  admins(req, res) {
    const { Op } = require("sequelize");
    var year = req.params.year;
    if (!year) year = app.year;
    /*var whr = {
      where: {
        date: {
          [Op.like]: year + "%",
        },
      },
    }*/
    db.admin.findAll()
      .then((users) => {
        res.render("admin/users/admin-list", { users, year });
      })
      .catch((err) => console.log(err));
  }

  admin(req, res) {
    var id = req.params.id;

    db.admin.findOne({ where: { id },attributes: ['id', 'firstname','lastname','email','password','phone','role','rights'] })
      .then((user) => {
		  user.rights  = JSON.parse(user.rights);
		  user.password  = '';
		  db.rights.findAll().then(r=>{
			  res.render("admin/users/admin-detail", { user,rights:r });
		  }).catch(e=>{});
        
      })
      .catch((err) => console.log(err));
  }

  adminActivate(req, res) {
    let id = req.params.id;
    let active = parseInt(req.params.flag);
    active = active ? 0 : 1;

    db.admin.update({ active }, { where: { id } }).then((r) => {
      res.redirect("/admin/admins");
    });
  }

  // category method

  catalogCategoryList(req, res) {
    db.category.findAll().then((result) => {
      res.render("admin/catalog/category", { data: result });
    });
  }

  catalogCategoryAdd(req, res) {
    let data = req.body;
    db.category.create(data).then((result) => {
      res.redirect("/admin/catalog/category");
    });
  }

  // product method

  catalogProductList(req, res) {
    db.product.findAll().then((result) => {
      res.render("admin/catalog/product", { data: result });
    });
  }

  catalogProductAdd(req, res) {
	 
    if (req.method == "POST") {
      let data = req.body.product;
      db.product.create(data).then((result) => {
		res.redirect("/admin/catalog/product");
      });
    } else {
				
		db.category.findAll().then(cat=>{
			app.category=cat
			res.render("admin/catalog/product-add");
		});	

		
		
    }
  }

  addNewAdmin(req,res){
     db.rights.findAll().then(r=>{
        res.render("admin/users/admin-add", { rights:r });
      }).catch(e=>{});
  }

  saveNewAdmin(req,res){
    var data = req.body;
    data.rights = JSON.stringify(data.rights);
    db.admin.create(data).then(r=>{
       res.redirect('/admin/admins');
    }).catch(e=>{
       var err = e.errors;
        res.render('admin/users/admin-add',{err});
    });
   
   
  }
  
  updateAdmin(req,res){
    var data = req.body;
	var id = data.id;
	delete data.id;
	 const bcrypt = require("bcryptjs");
    const salt = bcrypt.genSaltSync();
    data.password = bcrypt.hashSync(data.password, salt);
    data.rights = JSON.stringify(data.rights);
    db.admin.update(data,{where:{id}}).then(r=>{
       res.redirect('/admin/admins');
    }).catch(e=>{
       var err = e.errors;
        res.render('admin/users/admin-detail/'+id,{err});
    });
   
   
  }

  catalogProductEdit(req, res) {

    let id = req.params.id;
    
    db.product.findOne({ where: { id: id } })
      .then((product) => res.render("admin/catalog/product-edit", { product }))
      .catch((err) => res.end(err));
  }



    updateProductImage(req,res){
     var id = req.body.id; 
    req.session.info = {};
    if (!req.files || Object.keys(req.files).length === 0) {
      req.session.info = {err:1,message:'Select image first'};
     return res.redirect('/admin/catalog/product-edit/'+id);
      }

      let image = req.files.image;
        

      if(image.mimetype != 'image/jpeg' || image.size < 1000){
        req.session.info = {err:1,message:'Please enter valid image'};
      return res.redirect('/admin/catalog/product-edit/'+id);
    }
    
      let file_name = id+'.jpg';
      let dir = './client/public/uploads/products/'+file_name;
      image.mv(dir, function(err) {
        if (err){
          req.session.info = {err:1,message:'File path Can not found!'};
          return res.redirect('/admin/catalog/product-edit/'+id);
        }
        db.product.update({image:file_name},{where:{id}}).then(
          r=>{
            return res.redirect('/admin/catalog/product-edit/'+id);
          }).catch(e=>{
          req.session.info = {err:1,message:'Error on save image'};

          return res.redirect('/admin/catalog/product-edit/'+id);
        })
        
      });
  }





  

  orders(req, res){
    const { Op } = require("sequelize");
    var from_date = req.query.from_date;
    var to_date = req.query.to_date;
    if(!from_date || !to_date){
       from_date = app.year+'-'+app.month+'-01';
       to_date = app.year+'-'+app.month+'-'+app.day;
    }

    var status = req.query.status == undefined ? 'All' :  req.query.status;

    if(status && status != 'All'){
      if(status == 'Accepted')
        var where = {where:{  date: {[Op.between]: [from_date, to_date] },[Op.or]: [{orderStatus: 'Accepted'}],[Op.or]: [{orderStatus: 'Partially Shipped'}]},order: [['updatedAt', 'DESC']]};
      else
        var where = {where:{  date: {[Op.between]: [from_date, to_date] },[Op.or]: [{orderStatus: status}]},order: [['updatedAt', 'DESC']]};
    }else
      var where = {where:{  date: {[Op.between]: [from_date, to_date] }},order: [['updatedAt', 'DESC']]};

    db.order.findAll(where).then(result=>{
         res.render('admin/order/list',{orders:result,from_date,to_date,status});
      }).catch(e=>{

        res.render('admin/order/list',{orders:[]});
      })
  }



  order(req, res){
    var id = req.params.id;
    if(id){
    db.order.findOne({where:{id}}).then(result=>{
        result.orderAddress = JSON.parse( result.orderAddress);
        db.orderitem.findAll({where:{orderId:id}}).then(items=>{
          result.items = items;
          res.render('admin/order/detail',{order:result});
        });
         
      }).catch(e=>{
        res.render('admin/order/detail',{order:[]});
      })
    }else{
      res.redirect('/admin/orders');
    }
  }

  orderComplaint(req, res){
    var id = req.params.id;
    if(id){
    db.ordercomplaint.findOne({where:{id}}).then(result=>{
   
          res.render('admin/order/complaint-detail',{complaint:result});
         
      }).catch(e=>{
        res.render('admin/order/complaint-detail',{complaint:[]});
      })
    }else{
      res.redirect('/admin/complaints');
    }
  } 


  orderShipping(req, res){
    const { Op } = require("sequelize");
    var where = {where:{[Op.or]: [{ orderStatus:'Accepted' }, { orderStatus: 'Partially Shipped' }]}};
    db.order.findAll(where).then(result=>{
   
          res.render('admin/order/shipping',{orders:result});
         
      }).catch(e=>{
        res.render('admin/order/shipping');
      })
    
  }


  orderShippingList(req, res){
     const { Op } = require("sequelize");
    
    if(req.query.year == undefined)
      var year = app.year+'-'+app.month;
    else
      var year = req.query.year;

    db.shipping.findAll({where:{  date: {[Op.like]: year+'%', }},order: [['updatedAt', 'DESC']]}).then(result=>{
   
          res.render('admin/order/shipping-list',{shipping:result,year});
         
      }).catch(e=>{
        res.render('admin/order/shipping-list',{year});
      })
    
  }

  shippingDetail(req, res){
    var id = req.params.id;
    
    db.shipping.findOne({where:{id},include: [{model:db.user},{model:db.order}]}).then(result=>{
      //result.user.address = JSON.parse( result.user.address);
      
          db.shippingitem.findAll({where:{shippingId:id},include: [{model:db.product}]}).then(items=>{
           
              res.render('admin/order/shipping-detail',{shipping:result,shippingItems:items});
         
          }).catch(e=>{
            res.render('admin/order/shipping-detail');
          })
        
      }).catch(e=>{
        res.render('admin/order/shipping-detail');
      })
    
  }

  shippingUpdate(req, res){
    var id = req.params.id;
    
    db.shipping.findOne({where:{id},include: [{model:db.user},{model:db.order}]}).then(result=>{

      if(result.sendToUser){
         res.redirect('/admin/order-shipping-list');
      }
    
          db.shippingitem.findAll({where:{shippingId:id},include: [{model:db.product}]}).then(items=>{
           
              res.render('admin/order/shipping-update',{shipping:result,shippingItems:items});
         
          }).catch(e=>{
            res.render('admin/order/shipping-update');
          })
        
      }).catch(e=>{
        res.render('admin/order/shipping-update');
      })
    
  }

  doShippingUpdate(req, res){
    var id = req.body.id;
    var where = {where:{id},include: [{model:db.user},{model:db.order}]};
    var data = req.body.shipping;
    db.shipping.update(data,where).then(result=>{
          res.json({err:0,id});
      }).catch(e=>{
          res.json({err:1});
      })
    
  }


  sendToUser(req, res){
    var id = req.params.id;
    var where = {where:{id}};
    var data = {sendToUser:1};
    db.shipping.update(data,where).then(result=>{
          res.redirect('/admin/order-shipping-list');
      }).catch(e=>{
          res.redirect('/admin/order-shipping-list');
        
      })
    
  }

  invoice(req, res){
    var id = req.params.id;
    
    db.shipping.findOne({where:{id},include: [{model:db.user},{model:db.order}]}).then(result=>{
    result.user.address = JSON.parse( result.user.address);
      
          db.shippingitem.findAll({where:{shippingId:id},include: [{model:db.product}]}).then(items=>{
           
              res.render('admin/order/invoice',{shipping:result,shippingItems:items});
         
          }).catch(e=>{
            res.render('admin/order/invoice');
          })
        
      }).catch(e=>{
        
        res.render('admin/order/invoice');
      })
  }


  complaints(req,res){
     const { Op } = require("sequelize");
    var {startDate,endDate} = req.query;

    if(!startDate || !endDate){
       startDate = app.year+'-'+app.month+'-01';
       endDate = app.year+'-'+app.month+'-'+app.day;
    }
    var eDate = new Date(endDate);
    eDate.setDate(eDate.getDate()+1);
    var where = {where:{  createdAt: {[Op.between]: [startDate, eDate] } },
         include: [{model:db.user}],order: [['updatedAt', 'DESC']]}; 

      db.ordercomplaint.findAll(where).then(complaints=>{

        res.render('admin/order/complaints',{complaints,startDate,endDate});
        }).catch(e=>{
          res.render('admin/order/complaints',{startDate,endDate});
      });
  }


  complaintResponse(req,res){
      let {response,id,closeDate} = req.body;
      if(!closeDate)
          closeDate = '';

      db.ordercomplaint.update({closeDate,response,status:'Replied'},{where:{id}}).then(res=>{
          req.session.info = 'Success';
           return res.redirect('/admin/order/order-complaint/'+id)
      }).catch(e=>{

        return res.redirect('/admin/order/order-complaint/'+id)

    });
  }


  termAndCondition(req,res){
    db.static.findOne({where:{type:'termAndCondition'}}).then(term=>{

      res.render('admin/static/term-and-condition',{term});
    })
    
  }

  termAndConditionSave(req,res){
   let term = req.body.term;
      db.static.update({value:term},{where:{type:'termAndCondition'}}).then(term=>{

    res.json({'err':0});
    })
    
  }


  orderDelete(req, res) {
    var id = req.params.id;
    db.order.destroy({ where: { id: id } })
      .then((result) =>{
        
          db.orderitem.destroy({ where: { orderId: id } }).then().catch();
          return res.redirect('/admin/orders');
      })
      .catch((err) => res.json({err:1}));
  }


 

}
module.exports = new AdminController();
