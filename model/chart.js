const mongoose = require("mongoose"); 

const chart = new mongoose.Schema({
    title: {
        type: String, 
        required: true, 
        unique: true,
    }, 

    budget: {
        type: Number, 
        required: true,
    }, 

    color: {
        type: String, 
        required: true, 
        trim: true, 
        uppercase: true, 
        minlength: 6, 
        match: /^#[A-Fa-f0-9]*$/,
    }, 

}, { collection: "charts"}); 

module.exports = mongoose.model("charts", chart); 