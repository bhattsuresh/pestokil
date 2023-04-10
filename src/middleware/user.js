var toUserLogin = (req, res, next) => {
   
 const {user} = req.session;

    if(req.session.history == undefined)
     	req.session.history  = [req.url];
     else
     	req.session.history.push(req.url);

     if(req.session.history.length >2)
     	req.session.history.shift();

     !user?res.redirect('/'):next();
   

 };

 var toUserHome = (req, res, next) => {
    const {user} = req.session;
    
    user?res.redirect('/dashboard'):next();
 };


 module.exports = {toUserLogin,toUserHome};