const db = require('../models');

class CertificateController{

	generateCertificate(req,res){
		let branchCode = req.session.user.branchCode;
       db.branch.findOne({where: {code:branchCode}})
       .then(result=>{
       	var {certificate} = result;
       	let cert = req.app.config.generateCertificate(certificate);
       	res.render('certificate/mbr-create',{certificate:cert});
       }).catch(err=>{
		   		return res.json(err)
		   });

	}

	branchAdd(req,res){
	   let data = req.body;
        data.active = 1;
		db.branch.create(data)
		   .then((result)=>{
			   req.session.info = {err:0,msg:'Branch created successful.'}; 
		   	   res.redirect('/branches');
		   })
		   .catch(err=>{
		   		return res.json(err)
		   });
	}

	branches(req, res) {

    db.branch.findAll({order: [['createdAt', 'DESC']]})
      .then((users) => {
      	 
         res.render("branch/branches", {users});
      })
      .catch((err) => console.log(err));
  }


  branchActive(req,res){
  	var {id,val} = req.params

  	var update = {active:val};
   	var where = {where:{id:id}};
	  	db.branch.update(update,where).then(r=>{
	  		req.session.info = {err:0,msg:"User has been updated successfully"};
	  	
	  		res.redirect('/branches');
	  		}).catch(e=>{
	  		res.json({err:1,msg:"Sorry! someting went wrong!",data,e});
	  	})


  }

  branch(req,res){
  	res.render('branch/new-branch')
  }
	  
 
}
module.exports = new CertificateController;