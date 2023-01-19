const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    feedback: {
        type: String,
        required: true,
    }
}
);

module.exports = mongoose.model("FeedBack", feedbackSchema);