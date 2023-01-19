const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
//const Product = require('../models/doctor');

//const express = require('express');
//const app = express();
//const sv = app.use("", require('./routes/allRoutes'));



const chaiHttp = require('chai-http');
const server = require('../main');
//const { deleteOne } = require('../models/patient');

chai.use(chaiHttp);





describe('/First Test Collection', () => {

    it('should test login route....', (done) => {
        // actual test content
        
        chai.request(server)
        .get('/')
        .end((err, res) => {
            done();
        })
    })
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
            expect(response.statusCode).to.equal(200);
            expect('Location', '/patientHome');
            done();
        })
    })

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
            expect(response.statusCode).to.equal(500);   
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
            expect(response.statusCode).to.equal(500);
            
        })
    })

   /** 
    it('should test two values....', function(){
        // actual test content
        let expectedVal = 10;
        let actualVal = 10;

        expect(actualVal).to.be.equal(expectedVal);
    })
    **/

})