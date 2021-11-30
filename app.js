//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const bcrypt = require("bcrypt");
//const md5 = require("md5");
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});

//mongoose schema class
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

// user Model
const User = new mongoose.model("User", userSchema)

app.get("/", function(req, res){
    res.render("home");
})

app.get("/login", function(req, res){
    res.render("login");
})

app.get("/register", function(req, res){
    res.render("register");
})

// implemented hash
app.post("/register", function(req, res){
    //md5(req.body.password)

    bcrypt.hash(myPlaintextPassword,saltRounds,function(err,hash){
        const newUser = new User({
            email: req.body.username,
            password: hash
        })

        newUser.save(function(err){
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        })
    })
})

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, function(err, foundUser){
        if (err){
            console.log(err);
        } else {
            if(foundUser){
                    bcrypt.compare(password, foundUser.password).then(function(result) {
                        res.render("secrets");
                    });
                  }
                }
              });
            });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
