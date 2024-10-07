const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    Adminname: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    }
})

module.exports = mongoose.model("Admin",adminSchema);