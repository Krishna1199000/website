const express = require("express")

const bodyParser = require('body-parser');
const app = express();
const cors = require("cors")
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes")

app.use(
    cors({
        origin: "",
        credentials : true,
    })
)

app.use(bodyParser.json());
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