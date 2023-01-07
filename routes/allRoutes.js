//Imports
const express = require('express');
const routes = express();


const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const TimeSlot = require('../models/timeSlot');
const Appointment = require('../models/appointment');

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
const jwt = require('jsonwebtoken');
const appointment = require('../models/appointment');



//Insert patient into database 
routes.post(
    "/addPatient",
    asyncHandler(async (req, res) => {
  
      // Initialize newPatient object with request data
      const newPatient = new Patient({
        pname: req.body.pname,
        pdob: req.body.pdob,
        pnic: req.body.pnic,
        pgender: req.body.pgender,
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
        }
          
    });
    })
  );
  
  //Insert doctor into database 
  routes.post(
    "/addDoctor",
    asyncHandler(async (req, res) => {
      
      // Initialize newDoctorobject with request data
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
        }
          
    });
    })
  );

// Display login.ejs
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
  console.log(emails)
 
  Patient.findOne({pemail: emails}).exec((err,dis) =>{
    
        global.x = dis;
   });

  
  Doctor.find().exec((err,doctors) =>{
    global.d = doctors
    if(err){
        res.json({message: err.message});
    }else{
        res.render('patientHome', {
            title: x,
            doctors: d,
            success:'',
           
            
        });
    }
   });
  });


// Add appointment into database
 routes.post(
    "/addAppointment",
    asyncHandler(async (req, res) => {

      
      
      const newAppointment = new appointment({
        aname: req.body.aname,
        aphone: req.body.aphone,
        aemail: req.body.aemail,
        agender: req.body.agender, 
        aage: req.body.aage,  
        adocname: req.body.adocname,
        adescription: req.body.adescription,
        adate: req.body.adate, 
        atime: '10 :00'    
      });
  
      global.doctorname = req.body.adocname;
      global.doctordate =  req.body.adate;

      newAppointment.save((err) => {
        if(err){
            res.json({message: err.message, type:'danger'});
        }else{

          Doctor.findOne({dname: doctorname}).exec((err,doctoremail) =>{
    
            global.docemail = doctoremail.demail;
            console.log(docemail);
            TimeSlot.find({$and: [{ddate:doctordate},{demail:docemail}]}).exec((err,timeslots) =>{

       
              res.render('patientHome', { title: x,doctors: d,success: timeslots,});
              global.timeslotsarray = timeslots;
              console.log(timeslots)
         });
            
       });
       
       

          
           // req.session.message = {
               // type: "success",
               // message: "Appoitment added successfully",
          //  };
  }
          
    });
    
    })
  );


 
 
//Display patient profile page 
routes.get("/patientProfile", (req,res) => {

  Patient.findOne({pemail: emails}).exec((err,pationtsDetails) =>{
    if(err){
        res.json({message: err.message});
    }else{
      console.log(pationtsDetails);
        res.render('patientProfile', {
            
            pationtsDetails: pationtsDetails,
        });
    }
   });
});

 //Login Doctor
routes.post(
  "/loginDoctor",
  asyncHandler(async (req, res) => {

    global.docemail = req.body.dlemail ;
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
        res.redirect("/doctorHome")
      } else {
        console.log('Incorrect Password')
        return res.status(400).json({
         
          message: "Incorrect Password",
        });
      }
    }
  })
);

routes.post(
  "/timeslots",
  asyncHandler(async (req, res) => {
    // Put some validation related to
    // email validation and strong password rules

    // Initialize newUser object with request data
    const newTimeSlot = new TimeSlot({
      demail: docemail,
      ddate: req.body.ddate,
      dtime: req.body.dtime,
      
    });

   
    
    newTimeSlot.save((err) => {
      if(err){
          res.json({message: err.message, type:'danger'});
      }else{
          req.session.message = {
              type: "success",
              message: "Time Slot added successfully",
          };
          //res.redirect("/"); //redirect add user to home page
      }
        
  });
  })
);

 //Display doctorHome.ejs
 routes.get("/doctorHome", (req,res) => {
  
   Doctor.findOne({demail: docemail}).exec((err,docDetails) =>{
     
         x = docDetails;
       
         
     
    });
 
   Doctor.find().exec((err,doctors) =>{
     if(err){
         res.json({message: err.message});
     }else{
         res.render('DoctorHome', {
             docDetalisArray: x,
             doctors: doctors,
         });
     }
    });
   });

   
//Display patient profile page 
routes.get("/doctorProfile", (req,res) => {
  //console.log(emails)
    Doctor.findOne({demail: docemail}).exec((err,doctorsDetails) =>{
      if(err){
          res.json({message: err.message});
      }else{
       // console.log(doctorsDetails);
          res.render('doctorProfile', {
              
            doctorsDetails: doctorsDetails,
          });
      }
     });
  });
 
 



routes.get('/logout', function(req, res, next) {
  // remove the req.user property and clear the login session
 // req.logout();

  // destroy session data
 // req.session = null;

  // redirect to homepage
  res.redirect('/');
});



module.exports = routes;