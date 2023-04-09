const db = require("../models");
class ReportController {
	pendingOrders(req,res){
		res.render('admin/reports/pending-orders');
	}



	  getPendingOrders(req,res){
	    var {startDate,endDate} = req.body;
	    
	    const {Op} = require('sequelize');
	    var where = {where:{
	      createdAt: {
	        [Op.between]:[startDate, endDate]
		    },[Op.and]: [{ pendingQty: 1 },{pendingQty:{[Op.not]:0}}]

		    },include: [{model:db.orderitem}],
		    order: [['createdAt', 'DESC']]
		};

	    db.order.findAll(where).then(orders=>{
			res.json({err:0,orders});
	    }).catch(e=>{
	       res.json({err:1});
	    })
	   
	  }



	orders(req, res){
	    const { Op } = require("sequelize");
	    var from_date = req.query.from_date;
	    var to_date = req.query.to_date;
	    if(!from_date || !to_date){
	       from_date = app.year+'-'+app.month+'-01';
	       to_date = app.year+'-'+app.month+'-'+app.day;
	    }

	 
	    var where = {where:{  date: {[Op.between]: [from_date, to_date] }},include: [{model:db.user},{model:db.orderitem}],order: [['updatedAt', 'DESC']]};

	    db.order.findAll(where).then(result=>{

	         res.render('admin/reports/order-report',{orders:result,from_date,to_date});
	      }).catch(e=>{

	        res.render('admin/reports/order-report',{orders:[]});
	      })
  }

	orderPendingReport(req, res){
	    const { Op } = require("sequelize");
	    var from_date = req.query.from_date;
	    var to_date = req.query.to_date;
	    if(!from_date || !to_date){
	       from_date = app.year+'-'+app.month+'-01';
	       to_date = app.year+'-'+app.month+'-'+app.day;
	    }

	 
	    var where = {where:{  date: {[Op.between]: [from_date, to_date] },[Op.or]: [{orderStatus: 'Accepted'},{orderStatus: 'Partially Shipped'}]},include: [{model:db.user},{model:db.orderitem}],order: [['updatedAt', 'DESC']]};

	    db.order.findAll(where).then(result=>{

	         res.render('admin/reports/pending-order-report',{orders:result,from_date,to_date});
	      }).catch(e=>{

	        res.render('admin/reports/pending-order-report',{orders:[]});
	      })
  }


	accountLedger(req,res){
	    const { Op } = require("sequelize");
	    var from_date = req.query.from_date;
	    var to_date = req.query.to_date;
	    if(!from_date || !to_date){
	       from_date = app.year+'-'+app.month+'-01';
	       to_date = app.year+'-'+app.month+'-'+app.day;
	    }
	    var where = {where:{  date: {[Op.between]: [from_date, to_date] } }, include: [{model:db.shipping}],order: [['updatedAt', 'DESC']]}; 
	    db.order.findAll(where).then(orders=>{

	      return res.render('admin/reports/account-ledger',{shipping:orders,from_date,to_date}); 
	    }).catch(e=>{
	      return res.render('admin/reports/account-ledger',{from_date,to_date}); 
	    });
	  }

	  sales(req,res){
		const { Op } = require("sequelize");
	    var {startDate,endDate} = req.query;

	    if(!startDate || !endDate){
	       startDate = app.year+'-'+app.month+'-01';
	       endDate = app.year+'-'+app.month+'-'+app.day;
	    }
	    var eDate = new Date(endDate);
	    eDate.setDate(eDate.getDate()+1);
	    var where = {where:{  createdAt: {[Op.between]: [startDate, eDate] }},
	         include: [{model:db.user},{model:db.shippingitem},
				{model:db.order}],order: [['updatedAt', 'DESC']]}; 
				
	      db.shipping.findAll(where).then(orders=>{
	      	
	        res.render('admin/reports/sales',{orders,startDate,endDate});


	        }).catch(e=>{
	        	res.json(e)
	          res.render('admin/reports/sales',{startDate,endDate});
	      });
	  }

}

module.exports = new ReportController();