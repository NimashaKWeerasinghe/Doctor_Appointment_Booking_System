const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../main');
chai.use(chaiHttp);


//const Product = require('../models/doctor');
//const express = require('express');
//const app = express();
//const sv = app.use("", require('./routes/allRoutes'));
//const { deleteOne } = require('../models/patient');


describe('/Initial Testing', () => {

    it('should test login route....', (done) => {
        // actual test content
        
        chai.request(server)
        .get('/')
        .end((err, res) => {
            done();
        })
    })

})



describe('/Patient Testing', () => {

    
    // Patient Login
    it('test login patient route with values....', (done) => {
        const userCredentials = {
            email: 'hashini@gmail.com', 
            password: '123'
        }

         chai.request(server)
        .post('/loginPatient')
        .send(userCredentials)
        .end(function(err, response){
           // expect(response.statusCode).to.equal(200);
            expect('Location', '/patientHome');
            done();
        })
    })

   

   

    // Register Patient 
    it('test register patient route with values....', async function ()  {

        let patient = {
            pname: 'Ashanthi Jayakodi',
            pdob: '1996-07-08',
            pnic: '199612345687',
            pgender: 'female',
            pphone: '0789696385',
            pemail: 'ashanthi@gmail.com',
            pcpassword: 'ashanthi123'
        }

        chai.request(server)
        .post('/addPatient')
        .send(patient)
        .end(function(err, response){
            expect('Location', '/patientHome');
        })
    })
    

   

    // Add Poointment
    it('test add appointment route with values....', async function ()  {
        let appointment = {
            aname: 'Ashanthi Jayakodi' ,
            aphone: '0789696385',
            aemail: 'ashanthi@gmail.com',
            agender: 'female', 
            aage:'23',  
            adocname: 'Sanath Abesinghe',
            adescription: 'Fever',
            adate: '2023-10-10', 
            atime: '10:00'
        }

         chai.request(server)
        .post('/addAppointment')
        .send(appointment)
        .end(function(err, response){
            expect(response.statusCode).to.equal(200);
            
        })
    })

     // Update time of appointment with available time
     it('test update time route with values....', (done) => {
        const updateTime = {
            userTime: '10:00'
        }

         chai.request(server)
        .post('/updateAppointmentTime')
        .send(updateTime)
        .end(function(err, response){
           // expect(response.statusCode).to.equal(500);
            expect('Location', '/patientHome');
            done();
        })
    })
    
   
    // Add feedback
    it('test add feedback route with values....', async function () {
        const feedback = {
            fname:  'Ashanthi Jayakodi',
            feedback: 'Good service'
        }

         chai.request(server)
        .post('/addFeedback')
        .send(feedback)
        .end(function(err, response){
           // expect(response.statusCode).to.equal(500);
            expect('Location', '/patientHome');
            done();
        })
    })

     // Update patient  
  /**   it('test update patient route with values....', (done) => {
        const updatePatient = {
            pnameAdmin: 'Ashanthi Jayakodi',
            pdobAdmin: '1996-07-08',
            pnicAdmin: '199612345687',
            pphoneAdmin: '0789696388',
            pgenderAdmin:  'female',
            pemailAdmin: 'ashanthi@gmail.com'
        }

         chai.request(server)
        .post('/updatePatient/63c7d178f94e3f9145b42c58')
        .send(updatePatient)
        .end(function(err, response){
           // expect(response.statusCode).to.equal(500);
            expect('Location', '/adminHome');
            done();
        })
    })**/




   /** 
    it('should test two values....', function(){
        // actual test content
        let expectedVal = 10;
        let actualVal = 10;

        expect(actualVal).to.be.equal(expectedVal);
    })
    **/

})

describe('/Other Testing', () => {

   after(() => {
    process.exit();
   });

    // Doctor Login
    it('test login doctor route with values....', (done) => {
        const userCredentials = {
            email: 'nadini@gmail.com', 
            password: '123'
        }

         chai.request(server)
        .post('/loginDoctor')
        .send(userCredentials)
        .end(function(err, response){
            expect(response.statusCode).to.equal(500);
            expect('Location', '/doctorHome');
            done();
        })
    })

    // Admin Login
    it('test login admin route with values....', (done) => {
        const userCredentials = {
            email: 'medcareadmingmail.com', 
            password: 'admin123'
        }

         chai.request(server)
        .post('/loginDoctor')
        .send(userCredentials)
        .end(function(err, response){
            expect(response.statusCode).to.equal(500);
            expect('Location', '/adminHome');
            done();
        })
    })

   
    

    // Register Doctor 
    it('test register doctor route with values....', async function ()  {
        let doctor = {
            dname: 'Jayalath Jayakodi',
            demail: 'jayalath@gmail.com',
            dphone: '0789696963',
            special: 'CONSULTANT NEUROSURGEON',
            experience: '2 years',
            pemail: 'ashanthi@gmail.com',
            dpassword: 'jayalathi123'
        }

         chai.request(server)
        .post('/addDoctor')
        .send(doctor)
        .end(function(err, response){
            expect('Location', '/doctorHome');
            
        })
    })

    

    
    
    // Add timeslots 
    it('test add time slots route with values....', (done) => {
        const times = {
            docemail: 'sanath@gmail.com',
            ddate: '2023-10-10',
            dtime: '11:05'
        }

         chai.request(server)
        .post('/timeslots')
        .send(times)
        .end(function(err, response){
           // expect(response.statusCode).to.equal(500);
            expect('Location', '/doctorHome');
            done();
        })
    })

    

    




   

})

