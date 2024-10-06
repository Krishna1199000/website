const express = require("express")
const {AdminSignup,AdminSignin} = require("../controller/AdminController")
const router = express.Router();

router.post("/AdminSignup",AdminSignup);
router.post("/AdminSignin",AdminSignin);

module.exports = router;