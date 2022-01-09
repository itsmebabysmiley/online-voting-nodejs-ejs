const express = require('express'),
      request = require('request'),
      router = express(),
      bcrypt = require('bcrypt')

const passport = require('passport');

const dbConnection = require("../config/dbConnect");
const {checkAuthenticated, checkNotAuthenticated, checkAuthenticatedForVotePage} = require("../middleware/index.js");

router.get('/', (req,res) => {
    res.render("index");
});

router.get('/login',checkNotAuthenticated, (req,res) => {
    res.render("login");
});

router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect("/");
})
router.get('/register',checkNotAuthenticated, (req,res) => {
    res.render("register", {errorCode : 0});
});

router.get('/vote-page',checkAuthenticated, (req, res)=>{
    res.render('vote-page.ejs',);
})
router.get('/vote-results',checkAuthenticatedForVotePage, (req, res) => {
    res.render("vote-result.ejs");
});

router.get('/it-failed', (req, res)=>{
  res.send('try again');
})
router.post('/login',checkCaptcha,checkNotAuthenticated, passport.authenticate('local',
                                            { failureRedirect: '/login', 
                                              successRedirect: '/vote-page',
                                              failureFlash: true }));

router.post('/register',checkNotAuthenticated, async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = {
    'fname' : req.body.fname,
    'lname' : req.body.lname,
    'email' : req.body.email,
    'password' : hashedPassword,
    'tel' : req.body.tel,
    'DOB' : req.body.DOB
  }
  let connection = await dbConnection();
  connection.query("insert into election_db.users set ?", user, (err, result)=>{
    if(err){
      if(err.errno == 1062){
        return res.render("register.ejs", {error: true, errorCode: 1, msg: "This email is already used. Please use another email"});
      }
      return res.render("register.ejs", {error: true, errorCode: 4, msg: "Someting went wrong. Please try again"});
    }
    else{
      return res.json({"responseCode" : 1,"responseDesc" : "Insert successfully"});
    }
  });
})


function checkCaptcha(req,res, next) {
  // g-recaptcha-response is the key that browser will generate upon form submit.
  // if its blank or null means user has not selected the captcha, so return the error.
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
  }
  // Put your secret key here.
  var secretKey = process.env.RECAPTHA_SECRETKEY;
  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  // Hitting GET request to the URL, Google will respond with success or error scenario.
  request(verificationUrl, (error, response, body) => {
    body = JSON.parse(body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
    }
    return next();
  });
};

module.exports = router;