const jwt = require("jsonwebtoken");
const {z} = require("zod");
const User = require("../models/User/user");
const bcrypt = require("bcrypt");
const Product = require("../models/Admin/Product");
const Transaction = require("../models/Transaction")
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

const addMoneySchema = z.object ({
    amount: z.number().positive('Amount must be a positive number')
})

exports.addMoney = async (req,res) => {
    try{
    const {amount} = req.body;

    const validatedInputs = addMoneySchema.safeParse({amount});

    if(!validatedInputs.success) {
        return res.status(411).json({message: "Error while logging in"})
    }  

    const user = await User.findById(req.userId);
    user.balance += amount;
    await user.save();


    const transaction = new Transaction({
        user: user._id,
        type: 'credit',
        amount,
        description: 'Added money to account',
    });

    await transaction.save();
    res.json({balance:user.balance,transaction});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
}
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

exports.searchProducts = async (req,res) => {
    
    try{
        const {query} = req.body;

        const validatedInputs = SearchProductSchema.safeParse({query});
        if(!validatedInputs.success){
            return res.status(411).json({message: "Error while logging in"})
        }

        const regex = newRegExp(query,'i');
        const products = await Product.find({
            $or:[
                {name: regex},
                {category: regex},
                {description: regex},
            ],
        });
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};


exports.getUserPurchases = async(req,res) => {
    try{
        const user = await User.findById(req.user.id).populate('purchases');
        res.json(user.purchases);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}