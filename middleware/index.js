const jwt = require('jsonwebtoken');
const updateEmail = require('../models/update-emailVerification');
var middlewareObj = {};

middlewareObj.checkAuthenticated = function(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }else{
        return res.redirect('login');
    }
}

middlewareObj.checkNotAuthenticated = function(req, res, next){
    if (!req.isAuthenticated()) {
        return next();
    }else{
        return res.redirect('vote');
    }
}

middlewareObj.checkAuthenticatedForActivateAccount = (req, res, next) =>{
    var  token = req.params.token;
    if(token){
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded)=>{
        if(err){
            return res.status(401).json({"responseCode" : 1,"responseDesc" : "Failed to activate your account! Maybe link is out of date or you're an idoit."})
        }else{
            const {email, password} = decoded;
            // TODO: fix the emailverified to be real value.
            var status = await updateEmail(email);
            var emailVerified = status === 1 ? 'true': 'false';
            req.whoami = {email: email, password: password, emailVerified: emailVerified};
            return next();
        }
      });
    }
    return res.status(401).json({"responseCode" : 1,"responseDesc" : "Failed to activate your account! Maybe link is out of date or you're an idoit."})
}

module.exports = middlewareObj;