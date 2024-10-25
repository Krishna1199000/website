const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const {z} = require("zod");
const User = require("../models/User/user");
const bcrypt = require("bcrypt");
const Product = require("../models/Admin/Product");
const Transaction = require("../models/Transaction")
const Bucket = require('../models/User/Bucket');

require("dotenv").config();

const UsersignupData = z.object({
    username: z.string().email(),
    password: z.string().min(6, "password must be at least 6 characters long"),
    firstname: z.string(),
    lastname: z.string(),
});

exports.Usersignup = async (req,res) => {
    try{
        const {username, password, firstname,lastname} = req.body;

        const validatedInputs = UsersignupData.safeParse({
            username,
            password,
            firstname,
            lastname,
        });

        if(!validatedInputs.success){
            return res.status(411).json({message: "Incorrect inputs"})

        }
        if(await User.findOne({username: username})){
            return res.status(411).json({message: "Email already taken"});

        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            username: username,
            firstname: firstname,
            lastname: lastname,
            password: hashedPassword,
        });

        const userId = user._id;
        res.status(200).json({message: "User created successfully"});
    } catch(error){
        console.error(error)
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


const UserSigninData = z.object({
    username: z.string().email(),
    password: z.string(),
});

exports.Usersignin = async (req,res) => {
    try{

        const {username,password} = req.body;

        const validatedInputs = UserSigninData.safeParse({username,password});

        if(!validatedInputs.success){
            return res.status(411).json({message: "Error while logging in"})
        }

        const user = await User.findOne({username: username})
        if(!user) {
            return res.status(404).json({message: "User not registered"});
        }

        const token = await jwt.sign({userId: user._id}, process.env.JWT_SECRET);

        res.status(200).json({token: token})
    } catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
const updatePasswordSchema = z.object({
    oldPassword: z.string().min(6,'Old password must be at least 6 characters'),
    newPassword: z.string().min(6,'New password must be at least 6 characters')
})

exports.updatePassword = async (req,res) => {
    try{
        const {oldPassword,newPassword} = req.body
        const validatedInputs = updatePasswordSchema.safeParse({oldPassword,newPassword})
        if(!validatedInputs.success) {
            return res.status(411).json({message: "Error while updating information", errors: validatedInputs.error.errors});
        }

        const user = await User.findById(req.userId);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const isMatch = await bcrypt.compare(oldPassword,user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid old password'});
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);
        user.password = hashedPassword;

        await user.save();

        res.status(200).json({message: 'Password updated successfully'})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
}



const addMoneySchema = z.object({
    amount: z.number().positive('Amount must be a positive number')
});

exports.addMoney = async (req, res) => {
    try {
        console.log('Add Money Request Body:', req.body);
        console.log('User ID:', req.userId);

        const { amount } = req.body;

        const validatedInputs = addMoneySchema.safeParse({ amount });

        if (!validatedInputs.success) {
            console.log('Validation errors:', validatedInputs.error.errors);
            return res.status(400).json({ message: validatedInputs.error.errors[0].message });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.balance += amount;
        await user.save();

        const transaction = new Transaction({
            user: user._id,
            type: 'credit',
            amount,
            description: 'Added money to account',
        });

        console.log("Transaction to be saved:", transaction);
        await transaction.save();

        res.json({ balance: user.balance, transaction });
    } catch (error) {
        console.error("Server error:", error.message);
        res.status(500).send('Server error');
    }
};


const purchaseSchema = z.object({
    productId: z.string().length(24, "Invalid product ID length"),
})
exports.purchaseProduct = async (req, res) => {
    try {
        const { productId } = req.body;

        const validatedInputs = purchaseSchema.safeParse({ productId });

        if (!validatedInputs.success) {
            return res.status(400).json({ message: "Error while purchasing product", errors: validatedInputs.error.errors });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
         }

        if (user.balance < product.price) {
            return res.status(400).json({ msg: 'Insufficient balance' });
        }

        if (product.stock < 1) {
            return res.status(400).json({ msg: 'Product out of stock' });
        }

        user.balance -= product.price;
        user.purchases.push(product._id);
        await user.save();

        product.stock -= 1;
        await product.save();

        const transaction = await Transaction.create({
            user: user._id,
            type: 'debit',
            amount: product.price,
            description: `Purchased ${product.name}`,
            product: product._id,
        });

        res.status(200).json({ balance: user.balance, transaction, product });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};
exports.getAllProducts = async (req,res) => {
    try{
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

const SearchProductSchema = z.object({
    query: z.string().min(1,"Search query cannot be empty"),
})


exports.searchProducts = async (req, res) => {
    try {
        const { query } = req.body; 
        

        const validatedInputs = SearchProductSchema.safeParse({ query });
        if (!validatedInputs.success) {
            const errorMsg = validatedInputs.error.errors.map(err => err.message).join(', ');
            return res.status(400).json({ message: errorMsg }); 
        }

        const regex = new RegExp(query, 'i'); 
        const products = await Product.find({
            $or: [
                { name: regex },
                { category: regex },
                { description: regex },
            ],
        });
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};


exports.getUserPurchases = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('purchases');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (!user.purchases || user.purchases.length === 0) {
            return res.status(200).json({ msg: 'No purchases found', purchases: [] });
        }
        res.json(user.purchases);
    } catch (error) {
        console.error('Error fetching purchases:', error.message);
        res.status(500).send('Server error');
    }
};


exports.getBalance = async (req,res) => {
    try{
        const user = await User.findById(req.userId).select('balance');
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.json({balance: user.balance});
    } catch(error){
        console.error(error);
        res.status(500).json({message: "Server errror"})
    }
};
exports.cancelOrder = async (req, res) => {
    try {
        const { transactionId } = req.body;


        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }


        if (transaction.isReversed) {
            return res.status(400).json({ message: 'This order has already been cancelled' });
        }


        const user = await User.findById(transaction.user);
        const product = await Product.findById(transaction.product);

        if (!user || !product) {
            return res.status(404).json({ message: 'User or product not found' });
        }

    
        user.balance += transaction.amount;
        await user.save();

    
        product.stock += 1;
        await product.save();

        transaction.isReversed = true;
        await transaction.save();

        res.status(200).json({
            message: 'Order cancelled and refund processed successfully',
            userBalance: user.balance,
            productStock: product.stock,
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Server error while cancelling order' });
    }
};

const addToBucketSchema = z.object({
    productId: z.string().length(24, "Invalid product ID length"),
});

exports.addToBucket = async (req, res) => {
    try {
        const { productId } = req.body;
        const validatedInputs = addToBucketSchema.safeParse({ productId });

        if (!validatedInputs.success) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

    
        user.bucket.push(product._id);
        await user.save();

        res.status(200).json({ message: "Product added to bucket", bucket: user.bucket });
    } catch (error) {
        console.error("Error adding to bucket:", error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.viewBucket = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('bucket');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ bucket: user.bucket });
    } catch (error) {
        console.error("Error fetching bucket:", error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.buyAllProducts = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('bucket');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let totalAmount = 0;
        const purchasedProducts = [];

      
        for (const product of user.bucket) {
            if (product.stock < 1) {
                return res.status(400).json({ message: `Product ${product.name} is out of stock` });
            }
            totalAmount += product.price;
            purchasedProducts.push(product);
        }

        if (user.balance < totalAmount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        
        user.balance -= totalAmount;
        for (const product of purchasedProducts) {
            product.stock -= 1;
            await product.save();
        }

        user.purchases.push(...purchasedProducts.map(p => p._id));
        user.bucket = []; 
        await user.save();

       
        const transaction = await Transaction.create({
            user: user._id,
            type: 'debit',
            amount: totalAmount,
            description: 'Purchased multiple products',
            product: null,  
        });

        res.status(200).json({
            message: "Purchase successful",
            balance: user.balance,
            transaction,
            purchasedProducts
        });
    } catch (error) {
        console.error("Error purchasing products:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getUserReceipt = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('purchases.product');

        const receipt = {
            purchases: user.purchases.map(item => ({
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
            })),
            total: user.purchases.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
        };

        res.status(200).json(receipt);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get receipt', error: error.message });
    }
};
exports.modifyBucket = async (req, res) => {
    const { productId, action } = req.body;
    const userId = req.userId;

    try {
        const bucket = await Bucket.findOne({ user: userId });

        if (!bucket) {
            return res.status(404).json({ message: "Bucket not found" });
        }

        const productIndex = bucket.products.findIndex(p => p.productId == productId);

        if (action === 'add') {
            if (productIndex > -1) {
                bucket.products[productIndex].quantity += 1;
            } else {
                bucket.products.push({ productId, quantity: 1 });
            }
        } else if (action === 'remove') {
            if (productIndex > -1 && bucket.products[productIndex].quantity > 1) {
                bucket.products[productIndex].quantity -= 1;
            } else {
                bucket.products = bucket.products.filter(p => p.productId != productId);
            }
        } else {
            return res.status(400).json({ message: "Invalid action" });
        }

        await bucket.save();
        res.status(200).json({ message: "Bucket updated", bucket });
    } catch (error) {
        console.error("Error modifying bucket:", error); // Log the error for debugging
        res.status(500).json({ message: "Error modifying bucket" });
    }
};