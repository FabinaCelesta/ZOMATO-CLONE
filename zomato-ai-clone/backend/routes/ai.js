import express from "express"; import Restaurant from "../models/Restaurant.js";
const router=express.Router();
router.post("/recommend",async(req,res)=>{
 const text=(req.body.prompt||"").toLowerCase(); let q={};
 if(text.includes("veg")) q.cuisine={$in:[/vegetarian/i,/south indian/i]};
 if(text.includes("biryani")) q.cuisine={$in:[/biryani/i]};
 if(text.includes("pizza")) q.cuisine={$in:[/pizza/i]};
 const restaurants=await Restaurant.find(q).sort({rating:-1}).limit(5);
 const budget=(text.match(/(?:under|below|₹|rs\.?)\s*(\d+)/)||[])[1];
 res.json({answer:budget?`Here are popular choices matching your request around your ₹${budget} budget.`:"Here are my food recommendations based on your request.",restaurants});
});
export default router;
