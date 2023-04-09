const db = require('../models');
class MainController{
    
    constructor(){
  
           /* db.category.findAll({attributes: ['id','name']}).then(result=>{
                   
            }).catch(e=>{console.log(e)}); */ 
        
       
    }

    index(req,res){
      //console.log('sb-app-config',req.app.config);
      res.render('index',{data:{name:"SB",age:56}})
     }

    about(req,res){
      res.render('about')
    }

    contact(req,res){
      res.render('contact')
    }
    service(req,res){
      res.render('service')
    }
    product(req,res){
     
     var categoryIds = [1];
      var categoryId = 1;
      if(req.session.user){
        if(req.session.user.category !== undefined){
         
        
    
         if(req.query.category != undefined){
              
      
              for(var key in req.session.user.category){
            var catObj = req.session.user.category[key];
            if(catObj.categoryId == req.query.category){
              categoryIds = [];
               categoryId = req.query.category;
              categoryIds.push(req.query.category);
              break;
            }
          }
        }
      }

      }
     

            db.product.findAll(
              {where:{categoryId:categoryIds},
              include: [
              {model:db.category,attributes:['name']}
              ]}).then(products=>{
               
              res.render('product',{products,categoryId}) 
            }).catch(e=>res.json(e));  

    }



    cart(req,res){
      
      res.render('cart')
    }
    checkout(req,res){
     //res.json({r: JSON.parse(req.session.user.address)});
      res.render('checkout')
    }

    account(req,res){
		  db.static.findOne({where:{type:'termAndCondition'}}).then(r=>{
        req.session.termAndCondition = r;
        res.render('account');  
      }).catch(e=>{});
			  
		  
    }

    dashboard(req,res){

    
      db.order.findAll({where:{userId:req.session.user.id},order: [['updatedAt', 'DESC']]}).then(result=>{
        
         res.render('user/index',{orders:result});
      }).catch(e=>{
        res.render('user/index');
      })
      
    } 

    trackOrder(req,res){
      var id = req.params.id;
      db.order.findOne({where:{id}}).then(result=>{
         result.orderAddress = JSON.parse(result.orderAddress);
         db.orderitem.findAll({where:{orderId:result.id}}).then(resultItems=>{
          result.items = resultItems;
          res.render('user/track-order',{order:result});
        });
      }).catch(e=>{
        res.render('user/track-order');
      })
      
    }

    chart(req,res){
          /*var Bill = require("../models/Bill");
          const { Op } = require("sequelize");
          let filter = req.params.filter;
		      if(!filter)
              filter =  config.year+'-'+config.month;

          Bill.findAll({where:{  bill_date: {
            [Op.like]: filter+'%',  
          }}})
            .then((bills) => {
              res.render('home',{bills,filter});
            })*/

    }


    privacyPolicy(req,res){
      res.render('privacy-policy');
    }

    termsConditions(req,res){
      res.render('terms-conditions');
    }
  shippingPolicy(req,res){
      res.render('shipping-policy');
    }


    returnExchange(req,res){
      res.render('return-exchange');
    }

 paymentShipping(req,res){
      res.render('payment-shipping');
    }

  }


  module.exports = new MainController;