const express = require("express")
const router = express.Router();
const {AdminSignup,AdminSignin,addProduct,updateProduct,updatePassword,getProducts,getProductById} = require("../controller/AdminController")
const {AdminAuth} = require("../middleware/adminMiddleware")
const upload = require("../middleware/upload")


router.post("/AdminSignup",AdminSignup);
router.post("/AdminSignin",AdminSignin);

router.post('/products',AdminAuth,upload.single('image'),addProduct)
router.put('/products/:productId',AdminAuth,upload.single('image'),updateProduct)
router.put('/updateCredentials',AdminAuth,updatePassword)
router.get('/products',AdminAuth,getProducts)
router.get('/products/:productId',AdminAuth,getProductById)
module.exports = router;