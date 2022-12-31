//Imports
const express = require('express');
const routes = express();


const Patient = require('../models/patient');
const Doctor = require('../models/doctor');

var asyncHandler = require("express-async-handler");

const passport = require('passport');
const flash = require("express-flash")

const config = require("../config/config");
const session = require("express-session");
routes.use(session({secret:config.sessionSecret}));


const bodyParser = require("body-parser");
routes.unsubscribe(bodyParser.json());
routes.use(bodyParser.urlencoded({extended:true}));



const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')


//Insert patient into database 
routes.post(
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
  
  //Insert patient into database 
  routes.post(
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

  routes.get("/", (req,res) => {
    res.render('login', {
        title: 'Home Page',
    });
});



// Login Patient
routes.post(
  "/loginPatient",
  asyncHandler(async (req, res) => {
    global.emails = req.body.email ;
    // Find user with requested email
    global.patient = await Patient.findOne({ email: emails});

    if (patient === null) {
      return res.status(400).json({
        message: "User not found.",
      });
    } else {
      if (await patient.validatePassword(req.body.password)) {
        console.log('User Successfully Logged In')
       
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
 

 //Display patientHome.ejs
routes.get("/patientHome", (req,res) => {
 // test = emails;
 // let pati = Patient.findOne({ 'pemail': req.body.email});
 
  Patient.findOne({pemail: emails},{pname:true}).exec((err,dis) =>{
    
        x = dis;
       // y=x.pname;
       // console.log(y);
        
    
   });

  Doctor.find().exec((err,doctors) =>{
    if(err){
        res.json({message: err.message});
    }else{
        res.render('patientHome', {
            title: x,
            doctors: doctors,
        });
    }
   });
  });


 //Login Doctor
routes.post(
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


module.exports = routes;