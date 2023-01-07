const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const timeslotSchema = new mongoose.Schema({
    demail: {
        type: String,
        required: true,
    },
    ddate: {
        type: String,
        required: true,
    },
    dtime: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("TimeSlot", timeslotSchema);