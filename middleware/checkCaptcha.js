const request = require('request');

module.exports =  (req,res, next) => {
    // g-recaptcha-response is the key that browser will generate upon form submit.
    // if its blank or null means user has not selected the captcha, so return the error.
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
      return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
    }
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

//credit: https://codeforgeek.com/google-recaptcha-node-js-tutorial/
