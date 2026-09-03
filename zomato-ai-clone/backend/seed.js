import dotenv from "dotenv";import mongoose from "mongoose";import Restaurant from "./models/Restaurant.js";dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
await Restaurant.deleteMany({});
await Restaurant.insertMany([
{name:"Spice Garden",cuisine:["South Indian","Vegetarian"],location:"Chennai",rating:4.4,deliveryTime:"30-40 min",priceForTwo:400,description:"Traditional South Indian favourites.",image:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1000&q=80",menu:[{name:"Masala Dosa",description:"Crispy dosa with potato masala",price:120,category:"Breakfast"},{name:"Idli Sambar",description:"Soft idlis with sambar",price:90,category:"Breakfast"}]},
{name:"Biryani Hub",cuisine:["Biryani","Indian"],location:"Chennai",rating:4.6,deliveryTime:"35-45 min",priceForTwo:600,description:"Aromatic biryani and Indian food.",image:"https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=1000&q=80",menu:[{name:"Chicken Biryani",description:"Dum cooked aromatic rice",price:280,category:"Main"},{name:"Veg Biryani",description:"Spiced vegetable rice",price:220,category:"Main"}]},
{name:"Pizza Street",cuisine:["Pizza","Italian"],location:"Chennai",rating:4.3,deliveryTime:"25-35 min",priceForTwo:700,description:"Fresh pizzas and sides.",image:"https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80",menu:[{name:"Margherita Pizza",description:"Classic cheese pizza",price:299,category:"Pizza"},{name:"Veg Supreme",description:"Loaded vegetable pizza",price:399,category:"Pizza"}]}
]);
console.log("Seed complete");await mongoose.disconnect();
