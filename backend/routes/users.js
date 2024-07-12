const express=require('express');
const router=express.Router();
const User=require('../models/User')
const Post=require('../models/Post')
const bcrypt=require('bcrypt')
//UPDATE
/* router.patch("/:id",async(req,res)=>{
     if(req.body.userId>=req.params.id){
        if(req.body.password)
        {
            const hashedpwd=await bcrypt.hash(req.body.password,10)
            req.body.password=hashedpwd;
        }
        try{
            const updateUser=await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },{new:true})
            res.status(200).json(updateUser)
        }catch(err)
        {
            res.status(500).json(err);
        }
    }else{
        res.status(401).json({message:'You can update only your account'})
    }
}) */
    router.patch("/:id", async (req, res) => {
      try {
        if (req.body.userId === req.params.id) {
          if (req.body.password) {
            const hashedPwd = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPwd;
          }
    
          const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
          );
    
          res.status(200).json(updateUser);
        } else {
          res.status(401).json({ message: 'You can update only your account' });
        }
      } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
      }
    });
router.get("/:id",async (req,res)=>{
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
} catch (err) {
    res.status(401).json(err);
}
})
router.delete("/",async(req,res)=>{
    const {id}=req.body;
        if(!id)
        {
            return res.status(400).json({message:'User ID Required'})
        }
        const user =await User.findById(id).exec()
        if(!user)
        {
            return res.status(400).json({message:'user Not found'})
        }
        const posts=await User.findOne({user:id}).lean().exec();
        if(posts)
        {
            await Post.deleteMany({username:user.username})
        }
        const result=await user.deleteOne();
        const reply=`Username ${result.username} with ID ${result._id} deleted`
        res.json(reply);
})
//GET USER
router.get("/",async(req,res)=>{
    const user=await User.find().select("-password").lean();
    if(!user?.length)
    {
        return res.status(400).json({message:'No users Found'})
    }
    res.json(user)
})

module.exports=router;