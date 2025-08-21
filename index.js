const express=require("express")
const mongoose = require("mongoose");
const cors = require("cors");
const Connection = require("./config/db");
const userRouter = require("./routes/authRoutes");
const customerRouter = require("./routes/customers");
const leadsRouter = require("./routes/leadsRoutes");
const proposalRouter = require("./routes/proposalRouter");
require("dotenv").config();

const app = express();
app.use(express.json())


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || [
        'http://localhost:5173',
        'https://crm-frontend-nine-lilac.vercel.app'
    ].includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(userRouter)
app.use(customerRouter)
app.use(leadsRouter)
app.use(proposalRouter)

app.get("/",async(req,res)=>{
    res.send({message:"Welcome to DFT CRM Backend" });
})

app.listen(process.env.port,async()=>{
    try {
        await Connection;
        console.log("Connected to MongoDB");
        console.log(`Server is running on port ${process.env.port}`);  
    } catch (error){    
        console.error("Error connecting to MongoDB:", error);
    }
})
