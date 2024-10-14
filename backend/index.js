const express = require("express")

const bodyParser = require('body-parser');
const app = express();
const cors = require("cors")
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes")
const path = require('path')


const corsOptions = {
    origin: 'https://website-frontend-9gcc.onrender.com', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    
    credentials: true, 
};

app.use(cors(corsOptions));


app.use(bodyParser.json());

require("dotenv").config();

const dbConnect = require("./config/db")
dbConnect();

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin",adminRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the API!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`Server is listening on port ${PORT}`);
});