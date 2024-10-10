const jwt = require("jsonwebtoken")
const {z} = require("zod")
const mongoose = require('mongoose')
const Admin = require("../models/Admin/admin");
const Product = require('../models/Admin/Product')
const bcrypt = require("bcrypt")
require("dotenv").config();

const AdminSignUpData = z.object({
    Adminname : z.string().email(),
    password: z.string().min(6,"password must be atleast 6 letter long"),
    firstname: z.string(),
    lastname: z.string(),
    
})

exports.AdminSignup = async(req,res) => {

    try{
        const {Adminname, password, firstname, lastname} = req.body;

        const validatedInputs = AdminSignUpData.safeParse({
            Adminname: Adminname,
            password: password,
            firstname: firstname,
            lastname: lastname
        })
        if(!validatedInputs.success){
            return res.status(404).json({message: "inncorrect inputs"})
        }
        if(await Admin.findOne({Adminname: Adminname})){
            return res.status(411).json({message: "Emal already taken"})
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const admin = await Admin.create({
            Adminname: Adminname,
            firstname: firstname,
            lastname: lastname,
            password: hashedPassword
        })

        const adminId = admin._id;

        res.status(200).json({message: "Admin created successfully"});

    } catch(error){
        console.error(error)
        res.status(411).json({
            success: false,
            message: error.message
        })
    } 
}

const AdminSigninData = z.object({
    Adminname: z.string().email(),
    password: z.string(),
})

exports.AdminSignin = async(req,res) => {
    try{
        const {Adminname, password} = req.body;

        const validatedInputs = AdminSigninData.safeParse({
            Adminname, password
        })
        if(!validatedInputs.success){
            return res.status(411).json({message: "Incorrect inputs"})
        }

        const admin = await Admin.findOne({Adminname:Adminname})

        if(!admin){
            return res.status(411).json({message: 'admin not registered'})
        }
        const token = await jwt.sign({adminId: admin._id},process.env.JWT_SECRET);

        res.status(200).json({token: token})
    } catch (error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


const addProductData = z.object({
    name: z.string().min(1),
    description: z.string(),
    price: z.number().positive(),
    stock: z.number().int().positive()
})
exports.addProduct = async (req, res) => {
    try {
        // Destructure required fields from req.body
        const { name, description, price, stock } = req.body;

        // Validate and parse inputs using Zod
        const validatedInputs = addProductData.safeParse({
            name,
            description,
            price: parseFloat(price),    // Convert to number
            stock: parseInt(stock, 10)   // Convert to integer
        });

        if (!validatedInputs.success) {
            // Return detailed validation errors
            return res.status(400).json({ 
                message: "Error while adding information", 
                errors: validatedInputs.error.errors 
            });
        }

        // Handle the uploaded image
        let imageUrl = null;
        if (req.file) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        // Create the product in the database
        const product = await Product.create({
            name: validatedInputs.data.name,
            description: validatedInputs.data.description,
            price: validatedInputs.data.price, 
            stock: validatedInputs.data.stock,
            imageUrl
        });

        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        console.error('AddProduct Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const updateProductData = z.object({
    name: z.string().min(1),
    description: z.string(),
    price: z.number().positive(),
    stock: z.number().int().positive(),
})
exports.updateProduct = async(req,res) => {
    try{
        const {productId} = req.params;
        const updates = req.body;

        const validatedInputs = updateProductData.safeParse(req.body);

        if(!validatedInputs.success){
            return res.status(411).json({message: "Error while updating information"})
        }

        if(req.file){
            updates.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }
        const product = await Product.findByIdAndUpdate(productId,updates,{new:true});
        if(!product){
            return res.status(404).json({message:'Product not found'});
        }
        res.status(200).json({message: 'Product updated successfully', product})
    } catch(error){
        res.status(500).json({message: 'Server error '})
    }
};

const updatePasswordSchema = z.object({
    oldPassword: z.string().min(6,'Old password must be at least 6 characters'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters')
})

exports.updatePassword = async (req, res) => {
    try {
        const validatedInputs = updatePasswordSchema.safeParse(req.body);

        if (!validatedInputs.success) {
            return res.status(411).json({ message: "Error while updating information", errors: validatedInputs.error.errors });
        }

        const { oldPassword, newPassword } = validatedInputs.data;

        const admin = await Admin.findById(req.adminId);

        if (!admin) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid old password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;

        await admin.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || 'createdAt';
        const order = req.query.order === 'desc' ? -1 : 1;
        const search = req.query.search || '';

        const skip = (page - 1) * limit;
        const sortOrder = { [sortBy]: order };

        // Build search query if search parameter is provided
        const query = search
            ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                ],
            }
            : {};

        const products = await Product.find(query)
            .sort(sortOrder)
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            data: products,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('GetProducts Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: 'Invalid Product ID' });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error('GetProductById Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};