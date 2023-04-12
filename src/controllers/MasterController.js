const db = require('../models');

class MasterController{

	// exporter methods
	newExporter(req,res){
		res.render('master/new-exporter');
	}

	addExporter(req,res){
	   let data = req.body;
	   	data.active = 1;
		db.exporter.create(data)
		   .then((result)=>{
		   	   req.session.info = {err:0,msg:'Exporter added successfully.'}

			   res.redirect('/master/all-exporter');
		   })
		   .catch(err=>{
			req.session.info = {err:0,msg:'Sorry! someting went wrong!'}
			res.redirect('/master/new-exporter');
		});
	}

    

   	getExporter(req, res) {

    	const { Op } = require("sequelize");

	    db.exporter.findAll({order: [['createdAt', 'DESC']]})
	      .then((data) => {
	      	 
	         res.render("master/all-exporter", {data});
	      })
	      .catch((err) => console.log(err));
  	}


	activeExporter(req,res){
		var {id,val} = req.params

		var update = {active:val};
		var where = {where:{id:id}};
	  	db.exporter.update(update,where).then(r=>{
	  		req.session.info = {err:0,msg:"Exporter has been updated successfully"}
	  		res.redirect('/master/all-exporter');
	  	}).catch(e=>{
	  		req.session.info = {err:1,msg:"Sorry! someting went wrong!"}
	  		res.redirect('/master/all-exporter');
	  	})

	}

	// consignee methods

	newConsignee(req,res){
		res.render('master/new-consignee');
	}

	addConsignee(req,res){
	   let data = req.body;
	   	data.active = 1;
		db.consignee.create(data)
		   .then((result)=>{
		   	   req.session.info = {err:0,msg:'Consignee added successfully.'}
			   res.redirect('/master/all-consignee');
		   })
		   .catch(err=>{
		 
			req.session.info = {err:1,msg:'Sorry! someting went wrong!'}
			res.redirect('/master/new-consignee');
		});
	}

    

   	getConsignee(req, res) {

    	const { Op } = require("sequelize");

	    db.consignee.findAll({order: [['createdAt', 'DESC']]})
	      .then((data) => {
	      	 
	         res.render("master/all-consignee", {data});
	      })
	      .catch((err) => console.log(err));
  	}


	activeConsignee(req,res){
		var {id,val} = req.params

		var update = {active:val};
		var where = {where:{id:id}};
	  	db.consignee.update(update,where).then(r=>{
	  		req.session.info = {err:0,msg:"Consignee has been updated successfully"}
	  		res.redirect('/master/all-consignee');
	  	}).catch(e=>{
	  		req.session.info = {err:1,msg:"Sorry! someting went wrong!"}
	  		res.redirect('/master/all-consignee');
	  	})

	}

	// billing party methods

	newBillingParty(req,res){
		res.render('master/new-billing-party');
	}

	addBillingParty(req,res){
	   let data = req.body;
	   	data.active = 1;
		db.billing.create(data)
		   .then((result)=>{
		   	   req.session.info = {err:0,msg:'Billing Party added successfully.'}
			   res.redirect('/master/all-billing-party');
		   })
		   .catch(err=>{
		 
			req.session.info = {err:1,msg:'Sorry! someting went wrong!'}
			res.redirect('/master/new-billing-party');
		});
	}

    

   	getBillingParty(req, res) {

    	const { Op } = require("sequelize");

	    db.billing.findAll({order: [['createdAt', 'DESC']]})
	      .then((data) => {
	      	 
	         res.render("master/all-billing-party", {data});
	      })
	      .catch((err) => console.log(err));
  	}


	activeBillingParty(req,res){
		var {id,val} = req.params

		var update = {active:val};
		var where = {where:{id:id}};
	  	db.billing.update(update,where).then(r=>{
	  		req.session.info = {err:0,msg:"Billing Party has been updated successfully"}
	  		res.redirect('/master/all-billing-party');
	  	}).catch(e=>{
	  		req.session.info = {err:1,msg:"Sorry! someting went wrong!"}
	  		res.redirect('/master/all-billing-party');
	  	})

	}
	
 
}
module.exports = new MasterController;