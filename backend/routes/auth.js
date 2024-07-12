const express=require('express');
const router=express.Router();
const User=require('../models/User')
const bcrypt=require('bcrypt');
//REGISTER
router.post("/register",async(req,res)=>{
    try{
        console.log(req.body)
        const hashedpwd=await bcrypt.hash(req.body.password,10)
       const newUser=new User(
        {
            username:req.body.username,
            email:req.body.email,
            password:hashedpwd,
        }
       )
       const user=await newUser.save();
       res.status(200).json({user})
        
    }catch(err)
    {
        res.status(500).json(err);
    }
})
//LOGIN
router.post("/login", async (req, res) => {
    console.log("Request body:", req.body);
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            console.log("User not found");
            return res.status(400).json("Wrong credentials!");
        }
        console.log("User found:", user);

        const validate = await bcrypt.compare(req.body.password, user.password);
        console.log("Password validation result:", validate);

        if (validate) {
            console.log("Password validation failed");
            return res.status(400).json("Wrong credentials!");
        }

        const { password, ...other } = user._doc;
        console.log("User data to return:", other);

        return res.status(200).json(other);
    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json(err);
    }
});

module.exports = router;