const express = require('express');
const router = express.Router();
const {Usersignup,Usersignin,updatePassword,addMoney,
    purchaseProduct,
    searchProducts,
    getUserPurchases,
    getBalance,cancelOrder,
    addProductToBucket,buyProducts,fetchBucketItems,
    getAllProducts} = require("../controller/UserController")
const {UserAuth} = require("../middleware/usermiddleware");

router.post("/UserSignup",Usersignup);
router.post("/UserSignin",Usersignin);
router.put("/updateCredentials",UserAuth,updatePassword);
router.post("/add-money",UserAuth,addMoney)
router.post("/purchase",UserAuth,purchaseProduct)
router.get("/purchases",UserAuth,getUserPurchases)
router.get("/products",getAllProducts)
router.post("/search", UserAuth,searchProducts); 
router.get("/balance",UserAuth,getBalance)
router.post("/cancel-order",UserAuth,cancelOrder)
router.post("/add-to-bucket",UserAuth, addProductToBucket)
router.get("/bucket",UserAuth,fetchBucketItems)
router.post("/buy", UserAuth, buyProducts);
module.exports = router;