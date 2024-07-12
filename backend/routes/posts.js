const express=require('express');
const router=express.Router();
const User=require('../models/User')
const Post=require('../models/Post')
const bcrypt=require('bcrypt')
//GET POST by ID
router.get('/:id',async(req,res)=>{
    
    try{
        const post=await Post.findById(req.params.id).lean()
        res.status(200).json(post)
    }catch(err)
    {
        res.status(500).json({message:'No post found'})
    }

})
//GET POST
router.get('/',async(req,res)=>{
    const username=req.query.user;
    const catName=req.query.cat;
    try{
        let posts;
        if(username)
        {
            posts=await Post.find({username})
        }else if(catName)
        {
            posts=await Post.find({categories:{
                $in:[catName]
            }})
        }else{
            posts=await Post.find()
        }
        res.status(200).json(posts)
    }catch(err)
    {
        res.status(500).json({message:'No post found'})
    }
})
//CREATING POST
router.post("/",async(req,res)=>{
    const newPost=new Post(req.body)
    try{
        const savePost=await newPost.save();
        res.status(200).json({message:savePost})
    }catch(err)
    {
        res.status(500).json({message:'post was not uploaded'})
    }
})
//UPDATE MY POST
router.patch('/:id',async(req,res)=>{
    const {username,title,desc}=req.body;
    const {id}=req.params;
    if(!id || !username || !title || !desc )
    {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const post=await Post.findById(id).exec();
    if(!post)
    {
        return res.status(400).json({message:'Post not found'})
    }
    post.username=username
    post.title=title
    post.desc=desc
    const updatePost=await post.save()
    res.json({message:'post has been updated'})
})
//DELETE MY POST
router.delete('/:id',async(req,res)=>{
    const {id}=req.params;
    if(!id)
    {
        return res.status(400).json({message:'Note ID required'})
    }
    const post = await Post.findById(id).exec()

    if (!post) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const result = await post.deleteOne()

    const reply = `Post '${result.title}' with ID ${result._id} deleted`

    res.json(reply)

})
/* router.delete('/:id', async (req, res) => {
    const { id } = req.params; // Use req.params instead of req.body
  
    if (!id) {
      return res.status(400).json({ message: 'Note ID required' });
    }
  
    try {
      const post = await Post.findByIdAndDelete(id).exec();
  
      if (!post) {
        return res.status(400).json({ message: 'Note not found' });
      }
  
      const reply = `Post '${post.title}' with ID ${post._id} deleted`;
      res.json(reply);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }); */
module.exports=router;