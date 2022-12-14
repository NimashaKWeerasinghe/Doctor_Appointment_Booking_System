//Imports
const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
var asyncHandler = require("express-async-handler");

//Insert patient into database route
router.post(
    "/addPatient",
    asyncHandler(async (req, res) => {
      // Put some validation related to
      // email validation and strong password rules
  
      // Initialize newUser object with request data
      const newPatient = new Patient({
        pname: req.body.pname,
        pdob: req.body.pdob,
        pnic: req.body.pnic,
        pphone: req.body.pphone,
        pemail: req.body.pemail,
        pcpassword: req.body.pcpassword
      });
  
      var hashedPassword = await newPatient.createHash(req.body.pcpassword);
      newPatient.pcpassword = hashedPassword;
  
      
      newPatient.save((err) => {
        if(err){
            res.json({message: err.message, type:'danger'});
        }else{
            req.session.message = {
                type: "success",
                message: "User added successfully",
            };
            //res.redirect("/"); //redirect add user to home page
        }
          
    });
    })
  );

  router.get("/", (req,res) => {
    res.render('login', {
        title: 'Home Page',
    });
});

//Get all  riute
/**
router.get("/", (req,res) => {
    //res.send("Home Page");
   User.find().exec((err,users) =>{
    if(err){
        res.json({message: err.message});
    }else{
        res.render('index', {
            title: 'Home Page',
            users: users,
        });
    }
   });
});

router.get('/add', (req,res) =>{
    res.render("add_user", { title: "Add User"});
})
**/
module.exports = router;