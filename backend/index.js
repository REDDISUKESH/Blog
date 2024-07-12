const express=require('express');
const path=require('path')
const app=express();
const cors = require('cors');
const mongoose=require('mongoose');
const connectDB=require('./config/dbConn');
const multer=require('multer')
require('dotenv').config();
app.use(express.json())
const PORT=process.env.PORT || 3500;
connectDB();
app.use(cors());
app.use("/auth",require('./routes/auth'));
app.use('/users',require('./routes/users'))
app.use('/posts',require('./routes/posts'))
app.use('/categories',require('./routes/categories'))
app.use("/images",express.static(path.join(__dirname,"/images")))
const stroage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images");
    },
    filename:(req,file,cb)=>{
        cb(null,req.body.name);
    }
})
const upload=multer({storage:stroage});
app.post('/upload',upload.single("file"),(req,res)=>{
    res.status(200).json({message:'file has been uploaded'})
})
mongoose.connection.once('open',()=>{
    console.log('connected to mongodb')
    app.listen(PORT,()=>console.log(`server running on port ${PORT}`));
})
