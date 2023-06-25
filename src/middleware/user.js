var toUserLogin = (req, res, next) => {

   const { user } = req.session;
   /*req.session.flush = req.session.info;
   if(req.session.flush)
        req.session.info = null;*/


   if (req.session.history == undefined)
      req.session.history = [req.url];
   else
      req.session.history.push(req.url);

   if (req.session.history.length > 2)
      req.session.history.shift();


   if (user) {
      return next();
   }

   let token = null;
   if (req.headers.authorization)
      token = req.headers.authorization.split(" ")[1];

   if (!token)
      return res.status(401).send({ success: false, message: "Unauthorized Access!" });


   const jwt = require('jsonwebtoken');
   try {
      const decodedToken = jwt.verify(
         token,
         process.env.APP_KEY
      );
      if (decodedToken) {
         req.decodedToken=decodedToken
         return next();
      }
   } catch (e) {
      return res.status(401).send({ success: false, message: "Invalid Token", data: e });
   }



   res.send(decodedToken);
   // !user?res.redirect('/'):next();


};

var toUserHome = (req, res, next) => {
   const { user } = req.session;
   next();
   //user?res.redirect('/dashboard'):next();
};


module.exports = { toUserLogin, toUserHome };