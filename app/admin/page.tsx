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
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">後台管理 - 新增餐點</h1>
      <input placeholder="餐點名稱" value={name} onChange={e => setName(e.target.value)} className="border p-2 block mb-2"/>
      <input placeholder="價格" value={price} onChange={e => setPrice(e.target.value)} className="border p-2 block mb-2"/>
      <input placeholder="圖片網址" value={image} onChange={e => setImage(e.target.value)} className="border p-2 block mb-2"/>
      <button onClick={handleAddFood} className="bg-blue-500 text-white p-2 rounded">送出</button>
    </div>
  );
}