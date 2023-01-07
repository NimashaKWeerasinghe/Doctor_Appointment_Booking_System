const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const appointmentSchema = new mongoose.Schema({
    aname: {
        type: String,
        required: true,
    },
    aphone: {
        type: String,
        required: true,
    },
    aemail: {
        type: String,
        required: true,
    },
    agender: {
        type: String,
        required: true,
    },
    aage: {
        type: String,
        required: true,
    },
    adocname: {
        type: String,
        required: true,
    },
    adescription: {
        type: String,
        required: true,
    },
    adate: {
        type: String,
        required: true,
    },
    atime: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("Appointment", appointmentSchema);