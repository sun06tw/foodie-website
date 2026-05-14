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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* 左側：新增菜單區 (固定寬度) */}
        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded-3xl shadow-lg sticky top-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              ✨ 新增美味菜色
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">品項名稱</label>
                <input
                  type="text"
                  required
                  placeholder="例如：熔岩起司堡"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">價格 (TWD)</label>
                <input
                  type="number"
                  required
                  placeholder="150"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">圖片 URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                />
              </div>
              <button
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-all shadow-md active:scale-95 disabled:bg-gray-400"
              >
                {loading ? '上傳中...' : '確認新增品項'}
              </button>
            </form>
          </div>
        </div>

        {/* 右側：目前菜單管理 (條列式) */}
        <div className="md:w-2/3">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-800">目前菜單管理</h2>
            <span className="text-gray-500 text-sm">共有 {foods.length} 個品項</span>
          </div>
          
          <div className="space-y-4">
            {foods.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
                目前尚無品項，請從左側新增
              </div>
            ) : (
              foods.map((food) => (
                <div key={food.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:shadow-md transition-shadow">
                  <img 
                    src={food.image} 
                    alt={food.name} 
                    className="w-20 h-20 object-cover rounded-xl bg-gray-100"
                  />
                  <div className="ml-6 flex-grow">
                    <h3 className="text-lg font-bold text-gray-800">{food.name}</h3>
                    <p className="text-orange-600 font-semibold">${food.price}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleDelete(food.id)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="刪除品項"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

     


