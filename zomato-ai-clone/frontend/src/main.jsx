import React,{useState,useEffect,createContext,useContext} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter,Routes,Route,Link,useParams,useNavigate} from "react-router-dom";
import axios from "axios";
import "./styles.css";
const api=axios.create({baseURL:"http://localhost:5000/api"});
const AppContext=createContext();
const useApp=()=>useContext(AppContext);

function Provider({children}){const [cart,setCart]=useState(JSON.parse(localStorage.getItem("cart")||"[]"));const [user,setUser]=useState(JSON.parse(localStorage.getItem("user")||"null"));
useEffect(()=>localStorage.setItem("cart",JSON.stringify(cart)),[cart]);useEffect(()=>localStorage.setItem("user",JSON.stringify(user)),[user]);
const add=i=>setCart(c=>{const x=c.find(a=>a._id===i._id);return x?c.map(a=>a._id===i._id?{...a,quantity:a.quantity+1}:a):[...c,{...i,quantity:1}]});
return <AppContext.Provider value={{cart,setCart,user,setUser,add}}>{children}</AppContext.Provider>}

function Header(){const {cart,user,setUser}=useApp();return <header><Link className="logo" to="/">zomatoAI</Link><nav><Link to="/">Home</Link><Link to="/ai">AI Assistant</Link><Link to="/cart">Cart ({cart.length})</Link>{user?<button onClick={()=>{localStorage.removeItem("token");setUser(null)}}>Logout</button>:<Link to="/login">Login</Link>}</nav></header>}

function Home(){const [items,setItems]=useState([]),[search,setSearch]=useState(""),[cuisine,setCuisine]=useState("");
useEffect(()=>{api.get("/restaurants",{params:{search,cuisine}}).then(r=>setItems(r.data)).catch(()=>{})},[search,cuisine]);
return <main><section className="hero"><h1>Discover the best food</h1><p>Search restaurants, explore menus and order smarter with AI.</p><input placeholder="Search restaurants..." value={search} onChange={e=>setSearch(e.target.value)}/><select value={cuisine} onChange={e=>setCuisine(e.target.value)}><option value="">All cuisines</option><option>South Indian</option><option>Biryani</option><option>Pizza</option></select></section><div className="grid">{items.map(r=><Link className="card" to={"/restaurant/"+r._id} key={r._id}><img src={r.image||"https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=700&q=80"}/><h3>{r.name}</h3><p>{r.cuisine?.join(", ")}</p><b>⭐ {r.rating?.toFixed(1)||"New"}</b><p>{r.deliveryTime} • ₹{r.priceForTwo} for two</p></Link>)}</div></main>}

function Restaurant(){const {id}=useParams();const [r,setR]=useState(null);const {add}=useApp();useEffect(()=>api.get("/restaurants/"+id).then(x=>setR(x.data)),[id]);if(!r)return <main>Loading...</main>;return <main><img className="banner" src={r.image}/><h1>{r.name}</h1><p>{r.description}</p><p>{r.cuisine?.join(", ")} • ⭐ {r.rating}</p><h2>Menu</h2>{r.menu?.map(m=><div className="menu" key={m._id}><div><h3>{m.name}</h3><p>{m.description}</p><b>₹{m.price}</b></div><button onClick={()=>add({...m,restaurant:r._id})}>Add</button></div>)}<h2>Reviews</h2>{r.reviews?.map(x=><div className="review" key={x._id}><b>{x.name}</b> ⭐{x.rating}<p>{x.comment}</p></div>)}</main>}

function Cart(){const {cart,setCart,user}=useApp();const nav=useNavigate();const total=cart.reduce((s,x)=>s+x.price*x.quantity,0);const change=(id,d)=>setCart(c=>c.map(x=>x._id===id?{...x,quantity:x.quantity+d}:x).filter(x=>x.quantity>0));
const checkout=async()=>{if(!user)return nav("/login");try{await api.post("/orders",{items:cart.map(x=>({restaurant:x.restaurant,name:x.name,price:x.price,quantity:x.quantity})),total,address:"Demo delivery address"},{headers:{Authorization:"Bearer "+localStorage.getItem("token")}});setCart([]);alert("Order placed successfully!") }catch(e){alert(e.response?.data?.message||"Order failed")}};
return <main><h1>Your Cart</h1>{cart.map(x=><div className="menu" key={x._id}><div><h3>{x.name}</h3><b>₹{x.price}</b></div><div><button onClick={()=>change(x._id,-1)}>-</button> {x.quantity} <button onClick={()=>change(x._id,1)}>+</button></div></div>)}<h2>Total: ₹{total}</h2><button onClick={checkout}>Place Order</button></main>}

function Login(){const [name,setName]=useState(""),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[register,setRegister]=useState(false);const {setUser}=useApp();const nav=useNavigate();
const submit=async e=>{e.preventDefault();try{const r=await api.post("/auth/"+(register?"register":"login"),register?{name,email,password}:{email,password});localStorage.setItem("token",r.data.token);setUser(r.data.user);nav("/")}catch(e){alert(e.response?.data?.message||"Try again")}};
return <main className="auth"><h1>{register?"Create account":"Welcome back"}</h1><form onSubmit={submit}>{register&&<input placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/>}<input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/><button>{register?"Register":"Login"}</button></form><button className="linkbtn" onClick={()=>setRegister(!register)}>{register?"Already have an account? Login":"New user? Register"}</button></main>}

function AI(){const [prompt,setPrompt]=useState(""),[data,setData]=useState(null),[loading,setLoading]=useState(false);
const ask=async()=>{setLoading(true);try{setData((await api.post("/ai/recommend",{prompt})).data)}finally{setLoading(false)}};
return <main><div className="ai"><h1>🤖 AI Food Assistant</h1><p>Try: “I want spicy biryani under 300” or “Suggest vegetarian food”.</p><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Tell me what you feel like eating..."/><button onClick={ask}>Ask AI</button>{loading&&<p>Thinking...</p>}{data&&<><h3>{data.answer}</h3>{data.restaurants.map(r=><Link className="card" key={r._id} to={"/restaurant/"+r._id}><h3>{r.name}</h3><p>{r.cuisine?.join(", ")}</p><b>⭐ {r.rating}</b></Link>)}</>}</div></main>}

function App(){return <Provider><BrowserRouter><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/restaurant/:id" element={<Restaurant/>}/><Route path="/cart" element={<Cart/>}/><Route path="/login" element={<Login/>}/><Route path="/ai" element={<AI/>}/></Routes></BrowserRouter></Provider>}
createRoot(document.getElementById("root")).render(<App/>);
