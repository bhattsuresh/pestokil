const db = require('../models');

class BranchController{

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

	branches(req, res) {

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
      	 
         res.render("branch/branches", {users});
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

  branch(req,res){
  	res.render('branch/new-branch')
  }
	  
 
}
module.exports = new BranchController;