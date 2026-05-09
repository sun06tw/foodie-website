"use client"; // 
import toast, { Toaster } from 'react-hot-toast';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react'; // 
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export default function FoodOrderingWebsite() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  useEffect(() => {
    async function getFoods() {
      const { data, error } = await supabase
        .from('foods') // 這裡要跟你剛才在 Supabase 建立的資料表名稱一樣
        .select('*');
      
      if (error) {
        console.error('抓取失敗:', error);
      } else {
        setMenuItems(data || []);
      }
    }
    getFoods();
  }, []);
  /*const menuItems = [
    {
      id: 1,
      name: "起司牛肉漢堡",
      price: 180,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "經典牛肉漢堡",
      price: 210,
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "炸雞塊套餐",
      price: 240,
      image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "日式拉麵",
      price: 220,
      image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 5,
      name: "鮭魚壽司捲",
      price: 260,
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 6,
      name: "瑪格麗特披薩",
      price: 320,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 7,
      name: "肉醬義大利麵",
      price: 280,
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 8,
      name: "凱薩沙拉",
      price: 150,
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 9,
      name: "炸薯條",
      price: 90,
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 10,
      name: "炸雞",
      price: 260,
      image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 11,
      name: "牛排套餐",
      price: 450,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 12,
      name: "香煎雞胸餐",
      price: 230,
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 13,
      name: "石鍋拌飯",
      price: 250,
      image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 14,
      name: "珍珠奶茶",
      price: 75,
      image: "https://images.unsplash.com/photo-1558857563-b371033873b8?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 15,
      name: "藍莓鬆餅",
      price: 160,
      image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 16,
      name: "巧克力蛋糕",
      price: 140,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 17,
      name: "巧克力冰淇淋",
      price: 120,
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 18,
      name: "蝦仁炒飯",
      price: 200,
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 19,
      name: "火腿三明治",
      price: 130,
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 20,
      name: "水果優格碗",
      price: 170,
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1200&auto=format&fit=crop",
    },
  ];*/
 const addToCart = (item: any) => {
    setCart((prevCart: any[]) => {
      const existing = prevCart.find((i) => i.id === item.id);
      if (existing) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} 已加入購物車！`, {
    position: "top-center",
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  });
};
const handleCheckout = () => {
  if (cart.length === 0) {
    toast.error("您的購物車是空的，快去點餐吧！");
    return;
  }
  
  toast.success("訂單已完成！感謝您的訂購 🍛", {
    duration: 5000,
    position: "top-center",
  });

  setCart([]); // 清空購物車
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <header className="bg-black text-white py-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Foodie 點餐網站</h1>
            <p className="text-gray-300 mt-1">快速點餐・線上美食平台</p>
          </div>

          <button 
            onClick={() => document.getElementById('cart-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-black px-5 py-2 rounded-xl font-semibold hover:scale-105 transition"
          >
            查看購物車
          </button>
        </div>
      </header>

      <section className="relative h-[350px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop"
          className="w-full h-full object-cover"
          alt="banner"
        />

        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center px-4">
          <h2 className="text-5xl font-bold mb-4">今天想吃什麼？</h2>
          <p className="text-lg max-w-2xl">
            超過 20 種人氣餐點，從主食、甜點到飲料一次滿足。
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold">熱門餐點</h3>

          <input
            type="text"
            placeholder="搜尋餐點..."
            className="px-4 py-2 rounded-xl border w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 hover:-translate-y-1"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-56 object-cover"
              />

              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xl font-bold">{item.name}</h4>
                  <span className="text-lg font-semibold text-green-600">
                    NT$ {item.price}
                  </span>
                </div>

                <p className="text-gray-500 text-sm mb-5">
                  新鮮現做，人氣推薦美食。
                </p>

                <button 
                  onClick={() => addToCart(item)}
                  className="w-full bg-black text-white py-3 rounded-2xl font-semibold hover:bg-gray-800 transition"
                >
                  加入購物車
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
          {/* 購物車顯示區域 */}
<div id="cart-section" className="max-w-7xl mx-auto px-4 py-10 bg-white mt-10 rounded-3xl shadow-xl">
  <h2 className="text-3xl font-bold mb-6">🛒 您的購物車</h2>
  {cart.length === 0 ? (
    <p className="text-gray-500">購物車空空如也...</p>
  ) : (
    <div className="space-y-4">
      {cart.map((item: any) => (
        <div key={item.id} className="flex justify-between items-center border-b pb-4">
          <div>
            <p className="font-bold text-lg">{item.name}</p>
            <p className="text-green-600">NT$ {item.price}</p>
          </div>
          <div className="flex items-center gap-4">
            {/* 修改數量 */}
            <button onClick={() => {
              if (item.quantity > 1) {
                setCart(cart.map(i => i.id === item.id ? {...i, quantity: i.quantity - 1} : i))
              } else {
                setCart(cart.filter(i => i.id !== item.id))
              }
            }} className="p-2 bg-gray-100 rounded-lg">-</button>
            
            <span className="font-bold">{item.quantity}</span>
            
            <button onClick={() => setCart(cart.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i))}
              className="p-2 bg-gray-100 rounded-lg">+</button>

            {/* 刪除商品 */}
            <button onClick={() => setCart(cart.filter(i => i.id !== item.id))}
              className="text-red-500 font-medium">刪除</button>
          </div>
        </div>
      ))}
      {/* 總金額計算 */}
      <div className="text-2xl font-bold text-right mt-6">
        總計：NT$ {cart.reduce((total: number, item: any) => total + (item.price * item.quantity), 0)}
      </div>
      <button disabled={isPending}
      onClick={handleCheckout}
      className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition duration-300 transform hover:scale-[1.02] active:scale-95"
      >
      {isPending ? "處理中..." : "確認完成訂單"}
      </button>
    </div>
  )}
</div>
      <footer className="bg-black text-white py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <h5 className="text-2xl font-bold mb-3">Foodie</h5>
            <p className="text-gray-400 leading-relaxed">
              專業線上點餐平台，讓每一次點餐都快速又方便。
            </p>
          </div>

          <div>
            <h5 className="text-xl font-semibold mb-3">營業資訊</h5>
            <ul className="space-y-2 text-gray-400">
              <li>週一～週日</li>
              <li>11:00 AM - 10:00 PM</li>
              <li>提供外送與自取服務</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xl font-semibold mb-3">聯絡我們</h5>
            <ul className="space-y-2 text-gray-400">
              <li>電話：02-1234-5678</li>
              <li>Email：foodie@example.com</li>
              <li>地址：新北市板橋區美食路 100 號</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
