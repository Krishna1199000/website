const jwt = require("jsonwebtoken")
require("dotenv").config();

exports.AdminAuth = async(req,res,next) => {
    try{
        const token = req.header("Authorization").replace("Bearer ","");

    if(!token){
        res.status(403).json({message: "token not found"})
    }

    const payload = await jwt.verify(token,process.env.JWT_SECRET);

    req.adminId = payload.adminId;
    next();
    } catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
    
    
}