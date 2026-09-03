import mongoose from "mongoose";
const menuSchema=new mongoose.Schema({name:String,description:String,price:Number,category:String,image:String});
const reviewSchema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},name:String,rating:{type:Number,min:1,max:5},comment:String},{timestamps:true});
const restaurantSchema=new mongoose.Schema({
 name:{type:String,required:true}, image:String, cuisine:[String], location:String,
 description:String, deliveryTime:String, priceForTwo:Number,
 rating:{type:Number,default:0}, menu:[menuSchema], reviews:[reviewSchema]
},{timestamps:true});
export default mongoose.model("Restaurant",restaurantSchema);
