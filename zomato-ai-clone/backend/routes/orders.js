import express from "express"; import Order from "../models/Order.js"; import {protect,adminOnly} from "../middleware/auth.js";
const router=express.Router();
router.post("/",protect,async(req,res)=>res.status(201).json(await Order.create({...req.body,user:req.user.id})));
router.get("/my",protect,async(req,res)=>res.json(await Order.find({user:req.user.id}).sort({createdAt:-1})));
router.get("/",protect,adminOnly,async(req,res)=>res.json(await Order.find().populate("user","name email").sort({createdAt:-1})));
router.patch("/:id/status",protect,adminOnly,async(req,res)=>res.json(await Order.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true})));
export default router;
