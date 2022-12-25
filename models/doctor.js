// Define Patient Schema 

//Imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require("bcrypt");

const doctorSchema = new mongoose.Schema({
    dname: {
        type: String,
        required: true,
    },
    demail: {
        type: String,
        required: true,
    },
    dphone: {
        type: String,
        required: true,
    },
    special: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true
    },
    dpassword: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});


// Method to generate a hash from plain text
doctorSchema.methods.createHash = async function (plainTextPassword) {
     
    const saltRounds = 10; // Hashing user's salt and password with 10 iterations
  
    // First method to generate a salt and then create hash
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plainTextPassword, salt);
   // Second mehtod - Or we can create salt and hash in a single method also
    // return await bcrypt.hash(plainTextPassword, saltRounds);
  };
  
  // Validating the candidate password with stored hash and hash function
  doctorSchema.methods.validatePassword = async function (candidatePassword) {
      return await bcrypt.compare(candidatePassword, this.dpassword);
    };

module.exports = mongoose.model("Doctor", doctorSchema);