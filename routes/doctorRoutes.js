//Imports
const express = require('express');
const doctor_routes = express();
const Doctor = require('../models/doctor');
//const Doctor = require('../models/doctor');
var asyncHandler = require("express-async-handler");

const passport = require('passport');
const flash = require("express-flash")

const config = require("../config/config");
const session = require("express-session");
doctor_routes.use(session({secret:config.sessionSecret}));


const bodyParser = require("body-parser");
doctor_routes.unsubscribe(bodyParser.json());
doctor_routes.use(bodyParser.urlencoded({extended:true}));

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
//patient_routes.set('view engine','ejs');
//patient_routes.set('views','./views/patientHome');

//const patientController = require("../controllers/patientController");



//Insert patient into database route
doctor_routes.post(
    "/addDoctor",
    asyncHandler(async (req, res) => {
      // Put some validation related to
      // email validation and strong password rules
  
      // Initialize newUser object with request data
      const newDoctor = new Doctor({
        dname: req.body.dname,
        demail: req.body.demail,
        dphone: req.body.dphone,
        special: req.body.special,
        experience: req.body.experience,
        dpassword: req.body.dpassword
      });
  
      var hashedPassword = await newDoctor.createHash(req.body.dpassword);
      newDoctor.dpassword = hashedPassword;
  
      
      newDoctor.save((err) => {
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
  
  doctor_routes.get("/", (req,res) => {
    res.render('login', {
        title: 'Home Page',
    });
});

doctor_routes.post(
  "/loginDoctor",
  asyncHandler(async (req, res) => {
    // Find user with requested email
    let doctor = await Doctor.findOne({ email: req.body.dlemail });

    if (doctor === null) {
      return res.status(400).json({
        message: "User not found.",
      });
    } else {
      if (await doctor.validatePassword(req.body.dlpassword)) {
        console.log('User Successfully Logged In')
        //return res.status(200).json({
          //message: "User Successfully Logged In",
        //});
        res.redirect("/patientHome")
      } else {
        console.log('Incorrect Password')
        return res.status(400).json({
         
          message: "Incorrect Password",
        });
      }
    }
  })
);



module.exports = doctor_routes;