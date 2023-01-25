//Imports
const express = require('express');
const routes = express();

const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const TimeSlot = require('../models/timeSlot');
const Appointment = require('../models/appointment');
const FeedBack = require('../models/feedback');

var asyncHandler = require("express-async-handler");

const flash = require("express-flash")


const bodyParser = require("body-parser");
routes.unsubscribe(bodyParser.json());
routes.use(bodyParser.urlencoded({ extended: true }));

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const appointment = require('../models/appointment');

const WebSocket = require('ws');

//Insert patient into database 
routes.post("/addPatient", asyncHandler(async (req, res) => {

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
    if (err) {
      res.json({ message: err.message, type: 'danger' });
    }
  });
})
);

//Insert doctor into database 
routes.post("/addDoctor", asyncHandler(async (req, res) => {

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
    if (err) {
      res.json({ message: err.message, type: 'danger' });
    } else {

      //res.redirect(req.get('referer'));
      //res.redirect(req.get('referer'));
      //return res.status(400).json({
      //});
    
    }
  });
})
);

// Display login.ejs
routes.get("/", (req, res) => {
  res.render('login', {
    title: 'Home Page',
  });
});



// Login Patient
routes.post("/loginPatient", asyncHandler(async (req, res) => {

  global.emails = req.body.email;

  global.patient = await Patient.findOne({ email: emails });

  if (patient === null) {
    return res.status(400).json({
      message: "User not found.",
    });
  } else {
    if (await patient.validatePassword(req.body.password)) {
      console.log('User Successfully Logged In')
      res.redirect("/patientHome")
    } else {
      return res.status(400).json({
        message: "Incorrect Password",
      });
    }
  }
})
);

//Display patientHome.ejs
routes.get("/patientHome", (req, res) => {

  Patient.findOne({ pemail: emails }).exec((err, dis) => {
    global.x = dis;

    Doctor.find().exec((err, doctors) => {
      global.d = doctors
      if (err) {
        res.json({ message: err.message });
      } else {
        res.render('patientHome', {
          title: x,
          doctors: d,
          success: '',

        });
      }
    });
  });


});


// Add appointment into database
routes.post("/addAppointment", asyncHandler(async (req, res) => {

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
  global.doctordate = req.body.adate;
  global.userEmail = req.body.aemail;

  newAppointment.save((err) => {
    if (err) {
      res.json({ message: err.message, type: 'danger' });
    } else {
      Doctor.findOne({ dname: doctorname }).exec((err, doctoremail) => {

        global.docemail = doctoremail.demail;
        
        TimeSlot.find({ $and: [{ ddate: doctordate }, { demail: docemail }] }).exec((err, timeslots) => {

          res.render('patientHome', {
            title: x,
            doctors: d,
            success: timeslots,
          });

          global.timeslotsarray = timeslots;
          
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

// Update time of appointment 

routes.post("/updateAppointmentTime", asyncHandler(async (req, res) => {

  userTime = req.body.userTime
  

  var newvalues = { $set: { atime: userTime } };

  Appointment.updateOne({ $and: [{ adocname: doctorname }, { adate: doctordate }, { aemail: userEmail }] }, newvalues).exec((err, dis) => {
    
  });

  TimeSlot.deleteOne({ $and: [{ dtime: userTime }, { ddate: doctordate }, { demail: docemail }] }, newvalues).exec((err, dis) => {

    // res.redirect(req.get('referer'));
    
  });
})
);




//Display patient profile page 
routes.get("/patientProfile", (req, res) => {

  Patient.findOne({ pemail: emails }).exec((err, pationtsDetails) => {

    Appointment.find({ aemail: emails }).exec((err, pastappointments) => {

      res.render('patientProfile', {

        pationtsDetails: pationtsDetails,
        pastappointments: pastappointments
      });
    });
  });
});

//Display patient profile page 
routes.get("/patientProfileForDoctor", (req, res) => {

  Patient.findOne({ pemail: emails }).exec((err, pationtsDetails) => {

    Appointment.find({ aemail: emails }).exec((err, pastappointments) => {

      res.render('patientProfile', {

        pationtsDetails: pationtsDetails,
        pastappointments: pastappointments
      });
    });
  });
});

//Login Doctor
routes.post("/loginDoctor", asyncHandler(async (req, res) => {

  global.docemail = req.body.dlemail;

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

// Add TimeSlots into Database
routes.post("/timeslots", asyncHandler(async (req, res) => {

  const newTimeSlot = new TimeSlot({
    demail: docemail,
    ddate: req.body.ddate,
    dtime: req.body.dtime
  });

  newTimeSlot.save((err) => {
    if (err) {
      res.json({ message: err.message, type: 'danger' });
    } else {

      //res.redirect(req.get('referer'));
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
routes.get("/doctorHome", (req, res) => {

  Doctor.findOne({ demail: docemail }).exec((err, docDetails) => {
    x = docDetails;
    //doctorName = docDetails.dname;
    // console.log(doctorName)
    Appointment.find({ adocname: docDetails.dname }).exec((err, appDetails) => {
      global.appArray = appDetails;

      Doctor.find().exec((err, doctors) => {
        if (err) {
          res.json({ message: err.message });
        } else {
          res.render('DoctorHome', {
            docDetalisArray: x,
            doctors: doctors,
            appArray: appArray,
          });
        }
      });
    });
  });
});


//Display doctor profile page 
routes.get("/doctorProfile", (req, res) => {
  //console.log(emails)
  Doctor.findOne({ demail: docemail }).exec((err, doctorsDetails) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      // console.log(doctorsDetails);
      res.render('doctorProfile', {
        doctorsDetails: doctorsDetails,
      });
    }
  });
});

// Admin Login 
routes.post("/loginAdmin", asyncHandler(async (req, res) => {

  global.adminemail = req.body.adminemail;
  global.adminpw = req.body.adminpw;


  if (adminemail === null) {
    return res.status(400).json({
      message: "User not found.",
    });
  } else {
    if (adminemail == 'mydoctor@gmail.com' && adminpw == 'admin123') {
      console.log('User Successfully Logged In')
      //return res.status(200).json({
      //message: "User Successfully Logged In",
      //});
      res.redirect("/adminHome")
    } else {
      console.log('Incorrect Password')
      return res.status(400).json({

        message: "Incorrect Password",
      });
    }
  }
})
);

// Display adminHome.ejs
routes.get("/adminHome", (req, res) => {

  Appointment.find().exec((err, appForAdmin) => {

    Patient.find().exec((err, patientForAdmin) => {

      Doctor.find().exec((err, doctorForAdmin) => {

        FeedBack.find().exec((err, fbForAdmin) => {

          Appointment.find({ _id: { $exists: true } }).count((err, appcount) => {

            Doctor.find({ _id: { $exists: true } }).count((err, doccount) => {

              Patient.find({ _id: { $exists: true } }).count((err, patcount) => {



                res.render('adminHome', {
                  appForAdmin: appForAdmin,
                  patientForAdmin: patientForAdmin,
                  doctorForAdmin: doctorForAdmin,
                  fbForAdmin: fbForAdmin,
                  appcount: appcount,
                  doccount: doccount,
                  patcount: patcount,
                  outputs: ""

                });
              });
            });
          });
        });
      });
    });
  });
});

//view profiles of patients - doctor
routes.get('/profilePatient/:id', (req, res) => {
  let id = req.params.id;


  Patient.findOne({ pemail: id }).exec((err, pationtsDetails) => {
    console.log(pationtsDetails)


    Appointment.find({ aemail: id }).exec((err, pastappointments) => {

      res.render('patientProfileForDoctor', {

        pationtsDetails: pationtsDetails,
        pastappointments: pastappointments
      });
    })
  })
})

//Edit Patient Route
routes.get('/editPatient/:id', (req, res) => {
  let id = req.params.id;

  Patient.findById(id, (err, patient) => {
    res.render("editPatient", {
      patientForAdmin: patient
    })
  })
})

//Edit Doctor Route
routes.get('/editDoctor/:id', (req, res) => {
  let id = req.params.id;

  Doctor.findById(id, (err, doctor) => {
    res.render("editDoctor", {
      DoctorForAdmin: doctor
    })
  })
})

//Edit Doctor Route
routes.get('/editAppointment/:id', (req, res) => {
  let id = req.params.id;

  Appointment.findById(id, (err, appointmentarray) => {
    res.render("editAppointment", {
      appForAdmin: appointmentarray
    })
  })
})

//Update Patient Route
routes.post('/updatePatient/:id', (req, res) => {
  let id = req.params.id;

  Patient.findByIdAndUpdate(id, {

    pname: req.body.pnameAdmin,
    pdob: req.body.pdobAdmin,
    pnic: req.body.pnicAdmin,
    pphone: req.body.pphoneAdmin,
    pgender: req.body.pgenderAdmin,
    pemail: req.body.pemailAdmin,

  }, (err, result) => {
    if (err) {
      res.json({ message: err.message, type: 'danger' });
      console.log('Error')
    } else {
      console.log('updated')
    };
    // res.redirect('/adminHome');
  })

});

//Update Doctor Route
routes.post('/updateDoctor/:id', (req, res) => {
  let id = req.params.id;

  Doctor.findByIdAndUpdate(id, {

    dname: req.body.dnameAdmin,
    demail: req.body.demailAdmin,
    dphone: req.body.dphoneAdmin,
    special: req.body.specialAdmin,
    experience: req.body.experienceAdmin,


  }, (err, result) => {
    if (err) {
      res.json({ message: err.message, type: 'danger' });
      console.log('Error')
    } else {
      console.log('updated')
    };
    // res.redirect('/adminHome');
  })

});

//Update Appointment Route
routes.post('/updateAppointment/:id', (req, res) => {
  let id = req.params.id;

  Appointment.findByIdAndUpdate(id, {

    aname: req.body.anameAdmin,
    aphone: req.body.aphoneAdmin,
    aemail: req.body.aemailAdmin,
    agender: req.body.agenderAdmin,
    aage: req.body.aageAdmin,
    adocname: req.body.adocnameAdmin,
    adescription: req.body.adescriptionAdmin,
    adate: req.body.adateAdmin,
    atime: req.body.atimeAdmin,


  }, (err, result) => {
    if (err) {
      res.json({ message: err.message, type: 'danger' });
      console.log('Error')
    } else {
      console.log('updated')
    };
    //res.redirect('/adminHome');
  })

});

// Delele Patient
routes.get('/deletePatient/:id', (req, res) => {
  let id = req.params.id;

  Patient.findByIdAndRemove(id, (err, result) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      // console.log(doctorsDetails);

      //res.send("Hii")
      //res.redirect(req.get('referer'));



    }

  })
})


// Delele Doctor
routes.get('/deleteDoctor/:id', (req, res) => {
  let id = req.params.id;

  Doctor.findByIdAndRemove(id, (err, result) => {

    if (err) {
      res.json({ message: err.message });
    } else {
      
      // res.redirect(req.get('referer'));

    }

  })
})

// Delele appointmrnt
routes.get('/deleteAppointment/:id', (req, res) => {
  let id = req.params.id;

  Appointment.findByIdAndRemove(id, (err, result) => {

    if (err) {
      res.json({ message: err.message });
    } else {
    
      //res.redirect(req.get('referer'));

    }

  })
})

//Feedback Messages
routes.post(
  "/addFeedback",
  asyncHandler(async (req, res) => {
    
    const newFeedback = new FeedBack({
      name: req.body.fname,
      feedback: req.body.feedback

    });
    newFeedback.save((err) => {
      if (err) {
        res.json({ message: err.message, type: 'danger' });
    
      }

    });
  })
);



routes.get('/logout', function (req, res, next) {
  
  res.redirect('/');
});



module.exports = routes;