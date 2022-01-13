const express = require('express'),
      router = express(),
      bcrypt = require('bcrypt'),
      jwt = require('jsonwebtoken'),
      passport = require('passport');

const dbConnection = require("../config/dbConnect");
const transporter  = require("../config/nodemailer-config");
const {checkAuthenticated, checkNotAuthenticated,                                                              checkAuthenticatedForVotePage, checkAuthenticatedForActivateAccount} = require("../middleware/index.js");
const checkCaptcha = require("../middleware/checkCaptcha");
const getVoteStatus = require("../models/get-voteStatus");


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

router.get('/vote-info', async (req, res)=>{
  let connection = await dbConnection();
  let sql = `select vote.ID, vote.Number_vote, candidates.fullname from vote
              inner join candidates on vote.ID = candidates.cID;`
  connection.query(sql, async (err, result)=>{
    if(err) return res.json({error: true, data: err});
    return res.json( {error: false, data: result} );
  });
})

router.post('/voteme', checkAuthenticated, async (req, res)=>{
  //TODO: user has already voted that can't vote anymore. If user just voted, return the new vote count.
  if(req.user[0].email !== req.body.email || req.user[0].emailVerified === 'false'){
    return res.status(401).json({error: true, "responseCode" : 4,"responseDesc" : "Failed to authericated user"});
  }
  var voteStatus = await getVoteStatus(req.body.email);
  if(voteStatus[0].voted === 'true'){
    return res.status(200).json({error: true,"responseCode" : 3,"responseDesc" : "User already voted."});
  }else{
    //update vote status and increase voted number.
    let connection = await dbConnection();
    connection.query("UPDATE users SET voted = ? WHERE email = ?", ['true',req.body.email], (err,result)=>{
      if(err) throw err;
      
      return connection.query("UPDATE vote SET Number_vote = Number_vote +1 where ID = ?", req.body.candidateID, (err, response) =>{
        if(err) throw err;
        return res.status(200).json({error: false,"responseCode" : 1,"responseDesc" : "Successfully vote!"});
      })
    });
  }
});





module.exports = router;