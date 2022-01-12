const express = require('express'),

      router = express(),
      bcrypt = require('bcrypt'),
      jwt = require('jsonwebtoken'),
      passport = require('passport');

const dbConnection = require("../config/dbConnect");
const transporter  = require("../config/nodemailer-config");
const {checkAuthenticated, checkNotAuthenticated,                                                              checkAuthenticatedForVotePage, checkAuthenticatedForActivateAccount} = require("../middleware/index.js");
const checkCaptcha = require("../middleware/checkCaptcha");

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
        // Generate token for verify an email.
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

router.post('/voteme', checkAuthenticated, (req, res)=>{
  //TODO : user has already voted that can't vote anymore. If user just voted, return the new vote count.

  console.log(req.body);
  res.status(200).json({data: 'ok'});
});





module.exports = router;