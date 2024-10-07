const jwt = require("jsonwebtoken");
const {z} = require("zod");
const User = require("../models/User/user");
const bcrypt = require("bcrypt");
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
