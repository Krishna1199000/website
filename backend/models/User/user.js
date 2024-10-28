const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
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
    },
    balance : {
        type: Number,
        default: 0,
    },
    purchases: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
})

module.exports = mongoose.model("User",userSchema);