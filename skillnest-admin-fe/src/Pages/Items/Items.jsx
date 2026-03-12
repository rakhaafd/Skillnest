import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, ChevronRight,
  Loader, Search, Trash2, AlertCircle,
  Star, ImageOff
} from 'lucide-react';
import Alert from '../../Components/Alert';
import Navbar from '../../Layouts/Navbar';

const API   = 'http://api.skillnest.site/api';
const token = () => localStorage.getItem('auth_token');

const getLevelColor = (level) => ({
  beginner:     'bg-green-100  text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  expert:       'bg-red-100    text-red-700',
}[level?.toLowerCase()] ?? 'bg-gray-100 text-gray-600');

const formatPrice = (p) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(p || 0);

export default function AdminItems() {
  const navigate = useNavigate();
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [error,   setError]   = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token() || user.role !== 'admin') { navigate('/login'); return; }

    fetch(`${API}/admin/items`, {
      headers: { Authorization: `Bearer ${token()}`, Accept: 'application/json' },
    })
      .then(r => r.json())
      .then(res => setItems(Array.isArray(res.data) ? res.data : res))
      .catch(() => setError('Gagal memuat data items'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    const result = await Alert.confirm({
      title: 'Hapus Item?',
      text: `Item "${name}" akan dihapus permanen.`,
      confirmText: 'Hapus',
      confirmColor: '#dc2626',
    });

    console.log('result:', result);
console.log('isConfirmed:', result?.isConfirmed);
    if (!result.isConfirmed) return;

    try {
      const r = await fetch(`${API}/admin/items/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}`, Accept: 'application/json' },
      });
      if (!r.ok) throw new Error();
      setItems(prev => prev.filter(i => i.id !== id));
    } catch {
      Alert.show({ title: 'Gagal', text: 'Gagal menghapus item.', icon: 'error' });
    }
  };

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())     ||
    item.category.toLowerCase().includes(search.toLowerCase()) ||
    item.user?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Package size={20} className="text-indigo-600" /> Manajemen Item
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">{items.length} item terdaftar</p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama / kategori / seller..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 w-64"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader size={24} className="animate-spin text-indigo-400" />
          </div>

        ) : error ? (
          <div className="flex items-center gap-2 text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle size={16} /> {error}
          </div>

        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-12 text-center">
            <Package size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Tidak ada item ditemukan</p>
          </div>

        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${
                  i !== filtered.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-200">
                  {item.thumbnail_url
                    ? <img src={item.thumbnail_url} alt={item.name} className="w-full h-full object-cover" />
                    : <ImageOff size={18} className="text-gray-300" />
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                    {item.skill_level && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getLevelColor(item.skill_level)}`}>
                        {item.skill_level}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-gray-400">{item.category}</p>
                    <span className="text-gray-300">·</span>
                    <p className="text-xs text-gray-400">by {item.user?.name ?? '-'}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-6 text-center mr-2">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{formatPrice(item.price)}</p>
                    <p className="text-xs text-gray-400">Harga</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{item.orders_count ?? '-'}</p>
                    <p className="text-xs text-gray-400">Terjual</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-current" />
                      <p className="text-sm font-bold text-gray-800">
                        {item.average_rating ? Number(item.average_rating).toFixed(1) : '-'}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">({item.total_reviews ?? 0} ulasan)</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/items/${item.id}`)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Lihat detail"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}