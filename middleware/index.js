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

module.exports = middlewareObj;