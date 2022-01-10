const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const bcrypt = require('bcrypt')

const dbConnection = require("../config/dbConnect");

const customFields = {
  usernameField: 'email',
  passwordField: 'password'
};

const verifyCallback = async (username, password, done) => {
  console.log("username, password");
  console.log(username);
  console.log(password);
  let connection = await dbConnection();
  connection.query("SELECT email,password FROM election_db.users WHERE email = ?", username, async (err, result)=> {
    if(err){
      done(err);
    }else{
      // console.log(result);
      if(result.length == 0){
        return done(null, false, { message: 'Invalid username or password' });
      }else{
        const match = await bcrypt.compare(password, result[0].password);
        if(match){
          return done(null, result);
        }else{
          return done(null, false, { message: 'Invalid username or password' });
        }
      }
    }
  });

};

const strategy  = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});