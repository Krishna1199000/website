const express = require('express');
const router = express.Router();
const {Usersignup, Usersignin, updatePassword, addMoney, purchaseProduct, searchProducts, getUserPurchases, getBalance, cancelOrder,getAllProducts, addToBucket, removeFromBucket, viewBucket,purchaseBucketItems} = require("../controller/UserController");
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
router.post("/bucket/add", UserAuth, addToBucket);
router.post("/bucket/remove", UserAuth, removeFromBucket);
router.get("/bucket", UserAuth, viewBucket);
router.post("/bucket/purchase", UserAuth, purchaseBucketItems);
module.exports = router;