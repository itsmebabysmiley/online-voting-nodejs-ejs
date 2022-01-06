require('dotenv').config();
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

//require routes
var indexRoutes = require("./routers/index");

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "\\views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use("/",indexRoutes);

const dbConnection = require("./controller/dbConnect");

async function testconnectDB() {
    let connection = await dbConnection();
}
testconnectDB();

// This will handle 404 requests.
// app.use("*",function(req,res) {
//   res.status(404).send("404");
// })

// lifting the app on port 3000.
app.listen(3000, function () {
    console.log("Server starting at http://localhost:3000")
});