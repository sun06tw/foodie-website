// app/admin/page.tsx
"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import toast, { Toaster } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export default function AdminPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // 新增：用來控制按鈕的載入狀態

  const handleAddFood = async () => {
    // 檢查欄位是否都有填寫
    if (!name || !price || !image) {
      toast.error("請填寫所有欄位！");
      return;
    }

    setIsSubmitting(true); // 開始載入

    const { error } = await supabase
      .from('foods')
      .insert([{ name, price: parseInt(price), image }]);

    setIsSubmitting(false); // 結束載入

    if (!error) {
      toast.success("餐點新增成功！🎉");
      // 清空輸入框
      setName('');
      setPrice('');
      setImage('');
    } else {
      toast.error("新增失敗，請檢查網路或資料庫設定");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      {/* 這是負責顯示精美提示視窗的元件 */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* 回首頁的連結 */}
      <div className="w-full max-w-md mb-6">
        <a href="/" className="text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-2 text-sm font-medium">
          ← 返回點餐首頁
        </a>
      </div>

      {/* 主卡片區塊 */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* 卡片標題區 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white tracking-wider">後台管理</h1>
          <p className="text-blue-100 text-sm mt-1">新增美味餐點至資料庫</p>
        </div>

        {/* 填寫表單區 */}
        <div className="p-8 space-y-6">
          
          {/* 餐點名稱 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">餐點名稱</label>
            <input 
              type="text"
              placeholder="例如：熔岩起司牛肉堡" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
            />
          </div>

          {/* 價格 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">價格 (NT$)</label>
            <input 
              type="number"
              placeholder="例如：180" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
            />
          </div>

          {/* 圖片網址 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">圖片網址 (URL)</label>
            <input 
              type="url"
              placeholder="https://images.unsplash.com/..." 
              value={image} 
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white text-sm"
            />
            {/* 圖片預覽小功能 */}
            {image && (
              <div className="mt-3 h-32 w-full rounded-xl overflow-hidden border border-gray-100 bg-gray-100">
                <img src={image} alt="預覽" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
            )}
          </div>

          {/* 送出按鈕 */}
          <button 
            onClick={handleAddFood}
            disabled={isSubmitting} // 載入中時禁用按鈕
            className={`w-full py-4 rounded-xl font-bold text-white text-lg tracking-wide transition-all shadow-md
              ${isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'
              }
            `}
          >
            {isSubmitting ? '正在上傳至資料庫...' : '確認新增餐點'}
          </button>

        </div>
      </div>
    </div>
  );
}