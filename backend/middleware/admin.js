function admin(req, res, next) {
    //403 Forbidden
    if(!req.user.isAdmin) return res.status(403).send('Access Denied.');
    next(); 
}//admin 

module.exports = admin;