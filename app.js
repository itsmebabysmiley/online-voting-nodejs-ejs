require('dotenv').config();
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    cookieParser = require('cookie-parser');

var passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
//require routes
var indexRoutes = require("./routers/index");

const getEmailStatus = require("./models/get-emailStatus");
const getVoteStatus = require("./models/get-voteStatus");

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "\\views");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(flash());
app.use(cookieParser());

// session set up
const sessionStore = require("./models/session.js");
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    }
}));
//passport authenication
require("./config/passport-config.js");
app.use(passport.initialize())
app.use(passport.session())
app.use(async (req, res, next) => {
    var user = {email: null, emailStatus: null, vote: null}
    res.locals.currentUser = null;
    res.locals.emailVerified = null;
    // console.log("default:\n");
    // console.log(req.user);
    if(req.user){ //user exist.
        //req.user are different when user request to register or login. Register is {} but Login is [{}]
        //register
        if(!Array.isArray(req.user)){
            user.email = req.user.email;
        }
        //login
        else{
            user.email = req.user[0].email;
        }

        user.email = req.user[0].email;
        res.locals.currentUser = user.email;    
        var emailStatus = await getEmailStatus(user.email);
        var voteStatus = await getVoteStatus(user.email);
        if(emailStatus.length == 1){
            res.locals.emailVerified = emailStatus[0].emailVerified; 
            req.user[0].emailVerified = emailStatus[0].emailVerified;
            user.emailVerified = emailStatus[0].emailVerified;
            user.voted = voteStatus[0].voted;
        }
        res.cookie("userData", user,);
    }
    // console.log(req.session);
    // console.log(req.user);
    next();
});

// This will handle all the routes.
app.use("/",indexRoutes);

// This will handle 404 requests.
app.use("*",function(req,res) {
  res.status(404).send("404");
})

// lifting the app on port 3000.
app.listen(3000, () => {
    console.log("Server starting at http://localhost:3000")
});