// Define Patient Schema 

//Imports
const mongoose = require('mongoose');
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