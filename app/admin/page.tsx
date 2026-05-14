// app/admin/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import toast, { Toaster } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export default function AdminPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [foods, setFoods] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // 新增：用來控制按鈕的載入狀態
  const [formData, setFormData] = useState({ name: '', price: '', image: '', category: '漢堡' });
  const [loading, setLoading] = useState(false);

  const fetchFoods = async () => {
    const { data, error } = await supabase
      .from('foods') // 確保這是你 Supabase 裡的資料表名稱
      .select('*')
      .order('created_at', { ascending: false }); // 讓最新的排在上面

    if (!error && data) {
      setFoods(data);
    }
  };
  useEffect(() => {
    fetchFoods();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('foods').insert([formData]);
    if (!error) {
      alert('新增成功！');
      setFormData({ name: '', price: '', image: '', category: '漢堡' });
      fetchFoods();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

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
      fetchFoods();
      // 清空輸入框
      setName('');
      setPrice('');
      setImage('');
    } else {
      toast.error("新增失敗，請檢查網路或資料庫設定");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
  if (confirm('確定要下架這道餐點嗎？')) {
    const { error } = await supabase
      .from('foods')
      .delete()
      .eq('id', id);

    if (error) {
      alert('刪除失敗');
    } else {
      // 成功後，重新抓取資料讓列表即時更新
      fetchFoods(); 
    }
  }
};

  return (
  <div className="min-h-screen bg-gray-50 p-4 md:p-8">
    {/* 提示元件 */}
    <Toaster position="top-center" reverseOrder={false} />

    {/* 頂部導覽 */}
    <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
      <a href="/" className="text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-2 text-sm font-medium">
        ← 返回點餐首頁
      </a>
      <h1 className="text-2xl font-bold text-gray-800">餐廳後台管理系統</h1>
    </div>

    {/* 主內容區：左右分欄 */}
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-start">
      
      {/* 左側：新增菜單區 (固定在左側) [cite: 2] */}
      <div className="w-full md:w-[400px] sticky top-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-xl font-bold text-white tracking-wider">新增餐點</h1>
            <p className="text-blue-100 text-sm mt-1">填寫資訊並上傳至資料庫</p>
          </div>

          <div className="p-8 space-y-6">
            {/* 餐點名稱 [cite: 3] */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">餐點名稱</label>
              <input
                type="text"
                placeholder="例如：熔岩起司牛肉堡"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            {/* 價格 [cite: 5] */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">價格 (NT$)</label>
              <input
                type="number"
                placeholder="例如：180"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            {/* 圖片網址 [cite: 6] */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">圖片網址 (URL)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            {/* 圖片預覽 [cite: 8] */}
            {image && (
              <div className="mt-3 h-32 w-full rounded-xl overflow-hidden border border-gray-100 bg-gray-100">
                <img 
                  src={image} 
                  alt="預覽" 
                  className="w-full h-full object-cover" 
                  onError={(e) => e.currentTarget.style.display = 'none'} 
                />
              </div>
            )}

            {/* 送出按鈕 [cite: 10] */}
            <button
              onClick={handleAddFood}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl font-bold text-white text-lg tracking-wide transition-all shadow-md ${
                isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? '正在上傳...' : '確認新增餐點'}
            </button>
          </div>
        </div>
      </div>

      {/* 右側：目前菜單管理 (條列式展示) [cite: 13] */}
      <div className="flex-1 w-full">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">目前菜單管理 ({foods.length})</h2>
            <button onClick={fetchFoods} className="text-blue-600 text-sm hover:underline">重新整理列表</button>
          </div>
          
          <div className="space-y-3">
            {foods.length === 0 ? (
              <div className="text-center py-10 text-gray-400 italic">目前資料庫尚無餐點...</div>
            ) : (
              foods.map((food) => (
                <div key={food.id} className="group p-4 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 flex items-center justify-between transition-all">
                  <div className="flex items-center gap-5">
                    {/* 餐點小圖 [cite: 14] */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-50">
                      <img src={food.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{food.name}</h3>
                      <p className="text-blue-600 font-semibold mt-0.5">NT$ {food.price}</p>
                    </div>
                  </div>
                  
                  {/* 管理操作 [cite: 15] */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDelete(food.id)}
                      className="px-4 py-2 text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center gap-1"
                    >
                      <span>刪除</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  </div>
);
}