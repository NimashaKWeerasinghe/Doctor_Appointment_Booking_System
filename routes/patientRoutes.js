//Imports
const express = require('express');
const patient_routes = express();
const Patient = require('../models/patient');
//const Doctor = require('../models/doctor');
var asyncHandler = require("express-async-handler");

const passport = require('passport');
const flash = require("express-flash")

const config = require("../config/config");
const session = require("express-session");
patient_routes.use(session({secret:config.sessionSecret}));


const bodyParser = require("body-parser");
patient_routes.unsubscribe(bodyParser.json());
patient_routes.use(bodyParser.urlencoded({extended:true}));

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
//patient_routes.set('view engine','ejs');
//patient_routes.set('views','./views/patientHome');

//const patientController = require("../controllers/patientController");



//Insert patient into database route
patient_routes.post(
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
  
  patient_routes.get("/", (req,res) => {
    res.render('login', {
        title: 'Home Page',
    });
});

patient_routes.post(
  "/loginPatient",
  asyncHandler(async (req, res) => {
    // Find user with requested email
    let patient = await Patient.findOne({ email: req.body.email });

    if (patient === null) {
      return res.status(400).json({
        message: "User not found.",
      });
    } else {
      if (await patient.validatePassword(req.body.password)) {
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



module.exports = patient_routes;