var toAdminLogin = (req, res, next) => {
    const {admin} = req.session;
    !admin?res.redirect('/admin'):next();
 };

 var toAdminHome = (req, res, next) => {
    const {admin} = req.session;
    admin?res.redirect('/admin/dashboard'):next();
 };


 module.exports = {toAdminLogin,toAdminHome};