import express from "express"; import bcrypt from "bcryptjs"; import jwt from "jsonwebtoken"; import User from "../models/User.js";
const router=express.Router();
const token=u=>jwt.sign({id:u._id,role:u.role},process.env.JWT_SECRET,{expiresIn:"7d"});
router.post("/register",async(req,res)=>{try{const {name,email,password}=req.body;if(await User.findOne({email}))return res.status(400).json({message:"Email already exists"});const u=await User.create({name,email,password:await bcrypt.hash(password,10)});res.status(201).json({token:token(u),user:{id:u._id,name:u.name,email:u.email,role:u.role}})}catch(e){res.status(500).json({message:e.message})}});
router.post("/login",async(req,res)=>{try{const u=await User.findOne({email:req.body.email});if(!u||!(await bcrypt.compare(req.body.password,u.password)))return res.status(401).json({message:"Invalid email or password"});res.json({token:token(u),user:{id:u._id,name:u.name,email:u.email,role:u.role}})}catch(e){res.status(500).json({message:e.message})}});
router.get("/me",async(req,res)=>{res.json({message:"Use protect middleware here for expanded profile"})});
export default router;
