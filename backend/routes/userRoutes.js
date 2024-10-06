const express = require('express');
const router = express.Router();
const {Usersignup,Usersignin} = require("../controller/UserController")


router.post("/UserSignup",Usersignup);
router.post("/UserSignin",Usersignin);

module.exports = router;