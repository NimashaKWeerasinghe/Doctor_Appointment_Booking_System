// Define Patient Schema 

//Imports
const mongoose = require('mongoose');
const patientSchema = new mongoose.Schema({
    pname: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    pemail: {
        type: String,
        required: true,
    },
    pphone: {
        type: String,
        required: true,
    },
    ppassword: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model("Patient", patientSchema);