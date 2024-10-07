const express = require("express")
const router = express.Router();
const {AdminSignup,AdminSignin,addProduct,updatePassword} = require("../controller/AdminController")
const AdminAuth = require("../middleware/adminMiddleware")


router.post("/AdminSignup",AdminSignup);
router.post("/AdminSignin",AdminSignin);
router.post('/products',AdminAuth,addProduct)
router.put('/products/:productId',AdminAuth,updateProduct)
router.put('/updateCredentials',AdminAuth,updatePassword)
module.exports = router;