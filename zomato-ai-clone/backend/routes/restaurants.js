import express from "express"; import Restaurant from "../models/Restaurant.js"; import {protect,adminOnly} from "../middleware/auth.js";
const router=express.Router();
router.get("/",async(req,res)=>{const {search,cuisine,minRating}=req.query;let q={};if(search)q.name={$regex:search,$options:"i"};if(cuisine)q.cuisine={$in:[new RegExp(cuisine,"i")]};if(minRating)q.rating={$gte:Number(minRating)};res.json(await Restaurant.find(q).sort({rating:-1}))});
router.get("/:id",async(req,res)=>{const r=await Restaurant.findById(req.params.id);r?res.json(r):res.status(404).json({message:"Not found"})});
router.post("/",protect,adminOnly,async(req,res)=>res.status(201).json(await Restaurant.create(req.body)));
router.put("/:id",protect,adminOnly,async(req,res)=>res.json(await Restaurant.findByIdAndUpdate(req.params.id,req.body,{new:true})));
router.delete("/:id",protect,adminOnly,async(req,res)=>{await Restaurant.findByIdAndDelete(req.params.id);res.json({message:"Deleted"})});
router.post("/:id/reviews",protect,async(req,res)=>{const r=await Restaurant.findById(req.params.id);r.reviews.push({user:req.user.id,...req.body});r.rating=r.reviews.reduce((a,x)=>a+x.rating,0)/r.reviews.length;await r.save();res.json(r)});
export default router;
