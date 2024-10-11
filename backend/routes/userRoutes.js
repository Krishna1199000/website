const express = require('express');
const router = express.Router();
const {Usersignup,Usersignin,updatePassword,addMoney,
    purchaseProduct,
    getAllProducts,
    searchProducts,
    getUserPurchases,} = require("../controller/UserController")
const {UserAuth} = require("../middleware/usermiddleware")

router.post("/UserSignup",Usersignup);
router.post("/UserSignin",Usersignin);
router.put("/updateCredentials",UserAuth,updatePassword);
router.post("/add-money",UserAuth,addMoney)
router.post("/purchase",UserAuth,purchaseProduct)
router.get("/products",getAllProducts)
router.get("/purchases",UserAuth,getUserPurchases);
module.exports = router;