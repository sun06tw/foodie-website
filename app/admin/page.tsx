// app/admin/page.tsx
"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');

  const handleAddFood = async () => {
    const { error } = await supabase
      .from('foods')
      .insert([{ name, price: parseInt(price), image }]);
    
    if (!error) {
      alert("餐點新增成功！");
      setName(''); setPrice(''); setImage('');
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
  <input 
    className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
    placeholder="餐點名稱" 
    value={name} 
    onChange={(e) => setName(e.target.value)} 
  />
  <input 
    className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
    type="number"
    placeholder="價格" 
    value={price} 
    onChange={(e) => setPrice(e.target.value)} 
  />
  <input 
    className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
    placeholder="圖片網址" 
    value={image} 
    onChange={(e) => setImage(e.target.value)} 
  />
  <button 
    className="bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all"
    onClick={handleAddFood}
  >
    新增餐點
  </button>
</div>
  );
}