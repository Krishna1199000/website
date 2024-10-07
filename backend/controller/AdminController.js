const jwt = require("jsonwebtoken")
const {z} = require("zod")
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
        if(!validatedInputs){
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
        if(!validatedInputs){
            return res.status(411).json({message: "Incorrect inputs"})
        }

        const admin = await Admin.findOne({Adminname:Adminname})

        if(!admin){
            return res.status(411).json({message: 'admin not registered'})
        }
        const token = await jwt.sign({admin_Id: admin._id},process.env.JWT_SECRET);

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
exports.addProduct = async (req,res) => {
    try{
        const validatedInputs = addProductData.safeParse(req.body);

        if(!validatedInputs.success){
            return res.status(411).json({message: "Error while adding information"});
        }

        const product = await Product.create({name,description,price,stock});

        res.status(201).json({message: 'Product added successfully', product});
    } catch(error){
        res.status(500).json({message: 'Server error'});
    }
}
const updateProductData = z.object({
    name: z.string().min(1),
    description: z.string(),
    price: z.number().positive(),
    stock: z.number().int().positive(),
})
exports.updateProduct = async(req,res) => {
    try{
        const validatedInputs = updateProductData.safeParse(req.body);

        if(validatedInputs){
            return res.status(411).json({message: "Error while updating information"})
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

exports.updatePassword = async (req,res ) => {
    try{
        const validatedInputs = updatePasswordSchema.safeParse(req.body)

        if(!validatedInputs){
            return res.status(411).json({message: "Error while updating information"})
        }

        const admin = await Admin.findById(req.Admin.id);
        if(!admin) {
            return res.status(404).json({message: "User not found"});
        }

        const isMatch = await bcrypt.compare(oldPassword,admin.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid old password'});
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);
        admin.password = hashedPassword;

        await admin.save();

        res.status(200).json({message: 'Password updated successfully'});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
}