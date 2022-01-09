const express = require('express'),
      bodyParser = require('body-parser'),
      request = require('request'),
      router = express(),
      bcrypt = require('bcrypt'),
      ejs = require('ejs')

const dbConnection = require("../controller/dbConnect");

router.get('/', (req,res) => {
    res.render("index");
});

// router.get('/recap',function(req,res) {
//     res.render("recaptha");
// });

router.get('/login', (req,res) => {
    res.render("login");
});

router.get('/register', (req,res) => {
    res.render("register", {errorCode : 0});
});

router.get('/vote-results', (req, res) => {
    res.render("vote-result");
});

router.post('/login', (req,res) => {
    res.json({"responseCode" : 0,"responseDesc" : "Success"});
});

router.post('/register', async (req, res) => {
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
  const query = connection.query("insert into election_db.users set ?", user, (err, result)=>{
    if(err){
      console.log(err)
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


router.post('/submit', (req,res) => {
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
  request(verificationUrl, (error,response,body) => {
    body = JSON.parse(body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
    }
    res.json({"responseCode" : 0,"responseDesc" : "Success"});
  });
});

module.exports = router;