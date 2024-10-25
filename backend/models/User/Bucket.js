const mongoose = require('mongoose');

const BucketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ]
});

const Bucket = mongoose.model('Bucket', BucketSchema);
module.exports = Bucket;
