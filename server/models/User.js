const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname:{
        type: String,
        required: true,
        trim: true
    },

    lname:{
        type: String,
        required: true,
        trim: true
    },

    mobile:{
        type: String,
        required: true,
        trim: true
    },

    role:{
        type: String,
        enum:["admin", "employee"],
        default: "employee"
    },

    email:{
        type: String,
        required: true,
        trim: true
    },

    password:{
        type: String,
        required: true,
        trim: true
    },

    picture: {
        type: String,
        trim: true
    }
},{timestamps: true})

module.exports = mongoose.model("User", userSchema);