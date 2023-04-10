const db = require('../models');

class MasterController{

	addExporter(req,res){
		   let data = req.body;

			db.exporter.create(data)
			   .then((result)=>{
				   //req.session.info = {err:0,msg:'Signup successful. Please wait your id active soon.'};
				   
				   res.redirect('/master/all-exporter');
			   })
			   .catch(err=>{
			   
			   return	res.json(err)
				//req.session.info = {err:1,msg:'This Email or Mobile already registered'}
				res.redirect('/master/new-exporter');
			   });
	}

    

    getExporter(req, res) {

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


	
 
}
module.exports = new MasterController;