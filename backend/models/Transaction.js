const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['credit','debit'],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0.01,
        },
        description: {
            type: String,
            required: true,
        },
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Product',
        },
        isReversed: {
            type: Boolean,
            default: false,
        }
    },
);

module.exports = mongoose.model("Transaction", transactionSchema);