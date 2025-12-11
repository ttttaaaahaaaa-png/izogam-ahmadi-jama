import React, { useState, useEffect } from "react";

// Product list with images const products = [ { id: 1, name: "ایزوگام درجه 1", price: 500000, img: "izogam-1.jpg" }, { id: 2, name: "ایزوگام ساده", price: 350000, img: "izogam-2.jpg" }, { id: 3, name: "ایزوگام طرح‌دار", price: 600000, img: "izogam-3.jpg" }, { id: 4, name: "ایزوگام صادراتی", price: 750000, img: "izogam-4.jpg" }, ];

export default function App() { const [cart, setCart] = useState([]); const [page, setPage] = useState("home"); const [users, setUsers] = useState([]); const [currentUser, setCurrentUser] = useState(null); const [registerData, setRegisterData] = useState({ username: "", password: "" }); const [loginData, setLoginData] = useState({ username: "", password: "" });

// Load users and logged user from localStorage useEffect(() => { const savedUsers = JSON.parse(localStorage.getItem("users")) || []; const savedUser = JSON.parse(localStorage.getItem("currentUser")) || null;

setUsers(savedUsers);
setCurrentUser(savedUser);

}, []);

// Add to cart const addToCart = (p) => { if (!cart.find((c) => c.id === p.id)) { setCart([...cart, p]); } };

// Remove from cart const removeFromCart = (id) => { setCart(cart.filter((c) => c.id !== id)); };

// Register const handleRegister = () => { const { username, password } = registerData; if (!username || !password) return;

const exists = users.find((u) => u.username === username);
if (exists) {
  alert("این نام کاربری قبلاً وجود دارد");
  return;
}

const newUser = { username, password };
const updated = [...users, newUser];
setUsers(updated);

localStorage.setItem("users", JSON.stringify(updated));

alert("ثبت‌نام انجام شد!");
setRegisterData({ username: "", password: "" });

};

// Login const handleLogin = () => { const { username, password } = loginData; const user = users.find((u) => u.username === username && u.password === password);

if (user) {
  setCurrentUser(user);
  localStorage.setItem("currentUser", JSON.stringify(user));
  alert("ورود موفقیت‌آمیز بود");
  setPage("home");
} else {
  alert("اطلاعات صحیح نیست");
}

};

// Logout const logout = () => { setCurrentUser(null); localStorage.removeItem("currentUser"); };

return ( <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white p-6"> <header className="flex justify-between items-center mb-6"> <h1 className="text-3xl font-bold">ایزوگام احمدی جاما</h1> <nav className="space-x-4 text-lg"> <button onClick={() => setPage("home")} className="hover:text-blue-400">خانه</button> <button onClick={() => setPage("cart")} className="hover:text-blue-400">سبد خرید ({cart.length})</button> {!currentUser && ( <button onClick={() => setPage("login")} className="hover:text-blue-400">ورود</button> )} {!currentUser && ( <button onClick={() => setPage("register")} className="hover:text-blue-400">ثبت‌نام</button> )} {currentUser && ( <button onClick={logout} className="hover:text-red-400">خروج</button> )} </nav> </header>

{/* Home */}
  {page === "home" && (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((p) => (
        <div key={p.id} className="p-4 bg-white/10 rounded-xl shadow-xl backdrop-blur-md">
          <img src={`products/${p.img}`} alt={p.name} className="rounded-xl mb-3" />
          <h2 className="text-xl font-semibold mb-2">{p.name}</h2>
          <p className="mb-4">قیمت: {p.price.toLocaleString()} تومان</p>
          <button
            onClick={() => addToCart(p)}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500"
          >
            افزودن به سبد
          </button>
        </div>
      ))}
    </div>
  )}

  {/* Cart */}
  {page === "cart" && (
    <div>
      <h2 className="text-2xl font-bold mb-4">سبد خرید</h2>
      {cart.length === 0 && <p>سبد خرید خالی است.</p>}
      {cart.map((c) => (
        <div key={c.id} className="flex justify-between bg-white/10 p-4 rounded-xl mb-2">
          <span>{c.name}</span>
          <button
            onClick={() => removeFromCart(c.id)}
            className="text-red-400 hover:text-red-300"
          >
            حذف
          </button>
        </div>
      ))}
    </div>
  )}

  {/* Register */}
  {page === "register" && (
    <div className="max-w-sm mx-auto bg-white/10 p-6 rounded-xl backdrop-blur-md">
      <h2 className="text-2xl font-bold mb-4">ثبت‌نام</h2>

      <input
        className="w-full p-2 mb-3 rounded text-black"
        placeholder="نام کاربری"
        value={registerData.username}
        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
      />

      <input
        type="password"
        className="w-full p-2 mb-3 rounded text-black"
        placeholder="رمز عبور"
        value={registerData.password}
        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
      />

      <button
        className="bg-green-600 w-full p-2 rounded hover:bg-green-500"
        onClick={handleRegister}
      >ثبت‌نام</button>
    </div>
  )}

  {/* Login */}
  {page === "login" && (
    <div className="max-w-sm mx-auto bg-white/10 p-6 rounded-xl backdrop-blur-md">
      <h2 className="text-2xl font-bold mb-4">ورود</h2>

      <input
        className="w-full p-2 mb-3 rounded text-black"
        placeholder="نام کاربری"
        value={loginData.username}
        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
      />

      <input
        type="password"
        className="w-full p-2 mb-3 rounded text-black"
        placeholder="رمز عبور"
        value={loginData.password}
        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
      />

      <button
        className="bg-blue-600 w-full p-2 rounded hover:bg-blue-500"
        onClick={handleLogin}
      >ورود</button>
    </div>
  )}
</div>

); }
