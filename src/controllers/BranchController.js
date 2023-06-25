const db = require('../models');

class BranchController{

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

	async branchEdit(req,res){
		let id = req.params.id;
		var where = {where:{id:id}};
		var user = await db.user.findOne(where);
		
		 let branches = await db.branch.findAll();
  		res.render("user/new-user",{branches,user})

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
module.exports = new BranchController;