// Define Patient Schema 

//Imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const patientSchema = new mongoose.Schema({
    pname: {
        type: String,
        required: true,
    },
    pdob: {
        type: String,
        required: true,
    },
    pnic: {
        type: String,
        required: true,
    },
    pphone: {
        type: String,
        required: true,
    },
    pgender: {
        type: String,
        required: true,
    },
    pemail: {
        type: String,
        required: true,
    },
    pcpassword: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

// Method to generate a hash from plain text
patientSchema.methods.createHash = async function (plainTextPassword) {
     
  const saltRounds = 10; 

  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(plainTextPassword, salt);
 
};

// Validating the candidate password with stored hash and hash function
patientSchema.methods.validatePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.pcpassword);
  };

module.exports = mongoose.model("Patient", patientSchema);
