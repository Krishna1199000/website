const jwt = require("jsonwebtoken")
const {z} = require("zod")
const Admin = require("../models/admin");
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