const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const app = express();
app.use(express.json);
app.use(express.urlencoded());
app.use(cors());


//connection to database
mongoose.connect('mongodb://localhost:27017/youtube',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//user Schema
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},

})

const User =  mongoose.model("user", userSchema);

//Routes

app.post('/login', (req, res) => {
    const {email, password} = req.body;
    User.findOne({email: email}, (err, user) => {
        if(user) {
            if(password === user.password) {
                res.send({message: "Login Successful", user});
            } else {
                res.send({message: "Password does not match"});
            }
        } else {
            res.send({message: "User not registered"});
        }
    })
})
app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    User.findOne({email: email}, (err, user) => {
        if(user) {
            res.send({message: "User already registered"})
        } else {
            const user = new User({
                name,
                email,
                password
            })
            user.save(err => {
                if(err) {
                    res.send(err);
                } else {
                    res.send({message: "Successfully Registered"});
                }
            })
        }
    })
    
})

app.listen(3002, () => {
    console.log("Listening to port 3002")
})