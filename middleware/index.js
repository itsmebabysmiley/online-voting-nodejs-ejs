const jwt = require('jsonwebtoken');
const updateEmail = require('../models/update-emailVerification');
var middlewareObj = {};

middlewareObj.checkAuthenticated = function(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }else{
        //TODO: add redirect route
        return res.redirect('login');
    }
}

middlewareObj.checkNotAuthenticated = function(req, res, next){
    if (!req.isAuthenticated()) {
        //TODO: add redirect route
        return next();
    }else{
        return res.redirect('vote-results');
    }
}

middlewareObj.checkAuthenticatedForVotePage = function(req, res, next){
    if (!req.isAuthenticated()) {
        return next();
    }else{
        //TODO: add redirect route
        return res.redirect("vote-page");
    }
}

middlewareObj.checkAuthenticatedForActivateAccount = (req, res, next) =>{
    var  token = req.params.token;
    if(token){
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded)=>{
        if(err){
            return res.status(400).json({"responseCode" : 1,"responseDesc" : "Failed captcha activate your account! Maybe link is out of date or you're an idoit."})
        }else{
            const {email, password} = decoded;
            // TODO: fix the emailverified to be real value.
            var status = await updateEmail(email);
            var emailVerified = 'false'
            if(status === 1){
                emailVerified = 'true';
            }else{
                emailVerified = 'false';
            }
            req.body = {email: email, password: password, emailVerified: emailVerified};
            if(req.user){
                req.user[0].emailVerified = emailVerified;
            }
            return next();
        }
      });
    }
}

module.exports = middlewareObj;