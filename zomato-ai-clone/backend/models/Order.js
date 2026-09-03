import mongoose from "mongoose";
const orderSchema=new mongoose.Schema({
 user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
 items:[{restaurant:{type:mongoose.Schema.Types.ObjectId,ref:"Restaurant"},name:String,price:Number,quantity:Number}],
 total:Number,status:{type:String,default:"Placed",enum:["Placed","Preparing","Out for delivery","Delivered","Cancelled"]},
 address:String
},{timestamps:true});
export default mongoose.model("Order",orderSchema);
