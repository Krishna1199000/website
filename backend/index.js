const express = require("express")

const bodyParser = require('body-parser');
const app = express();
const cors = require("cors")
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes")
const path = require('path')


const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    
    credentials: true, // If you need to send cookies or other credentials
};

app.use(cors(corsOptions));


app.use(bodyParser.json());
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
require("dotenv").config();

const dbConnect = require("./config/db")
dbConnect();

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin",adminRoutes);

app.get("/",(req,res)=>{
    console.error(err.stack);
    res.status(500).json({message: "Something went wrong",error: err.message})
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`Server is listening on port ${PORT}`);
});