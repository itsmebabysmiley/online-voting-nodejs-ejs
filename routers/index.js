const express = require('express'),
      request = require('request'),
      router = express(),
      bcrypt = require('bcrypt'),
      jwt = require('jsonwebtoken');


const passport = require('passport');
const nodemailer = require("nodemailer");

const dbConnection = require("../config/dbConnect");
const transporter  = require("../config/nodemailer-config");
const {checkAuthenticated, checkNotAuthenticated, checkAuthenticatedForVotePage, checkAuthenticatedForActivateAccount} = require("../middleware/index.js");

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
    res.render("register", {errorCode : 0, user: {}});
});

router.get('/vote-page',checkAuthenticated, (req, res)=>{
    res.render('vote-page.ejs',);
})

router.get('/vote-results',checkAuthenticatedForVotePage, (req, res) => {
    res.render("vote-result.ejs");
});

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
  connection.query("insert into election_db.users set ?", user, async (err, result)=>{
    if(err){
      if(err.errno == 1062){
        return res.render("register.ejs", {errorCode: 1, msg: "This email is already used. Please use another email", user});
      }
      return res.render("register.ejs", {errorCode: 4, msg: "Someting went wrong. Please try again"});
    }
    else{
        let info;
        var token = jwt.sign({ email: req.body.email, password: req.body.password }, process.env.JWT_SECRET, { expiresIn: '10h' });
        try {
          info = await transporter.sendMail({
            from: '"Voteme" <noreply@voteme.com>', // sender address
            to: req.body.email, // list of receivers
            subject: "Please confrim the email", // Subject line
            text: `Please confrim this email to vote Payut.`, // plain text body
            html: `<h2>Please click on given link to activate your account</h2><p>Dear ${req.body.fname} ${req.body.lname}, </p> Please click on given link to activate your account <a href="http://127.0.0.1:3000/autertication/activate/${token}">confirm</a> in 1 hour before your computer brow up.` // html body
          });
        }catch(error){
          throw error;
        }

      return res.redirect('/login');
    }
  });
})

//check valid link for new user to activate the account.
router.get('/autertication/activate/:token', checkAuthenticatedForActivateAccount, passport.authenticate('local',
                                                                                            { failureRedirect: '/Not-found', 
                                                                                            successRedirect: '/',
                                                                                            failureFlash: true }));

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