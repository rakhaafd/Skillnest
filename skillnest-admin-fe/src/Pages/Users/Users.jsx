import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, LogOut, Users, ChevronRight,
  Loader, Search, Trash2, AlertCircle
} from 'lucide-react';
import Alert from '../../Components/Alert';
import Navbar from '../../Layouts/Navbar';

const API = 'http://api.skillnest.site/api';
const token = () => localStorage.getItem('auth_token');

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token() || user.role !== 'admin') { navigate('/login'); return; }

    fetch(`${API}/admin/users`, {
      headers: { Authorization: `Bearer ${token()}`, Accept: 'application/json' }
    })
      .then(r => r.json())
      .then(res => setUsers(Array.isArray(res.data) ? res.data : res))
      .catch(() => setError('Gagal memuat data users'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    const result = await Alert.confirm({
      title: 'Hapus User?',
      text: `User "${name}" akan dihapus permanen.`,
      confirmText: 'Hapus',
      confirmColor: '#dc2626',
    });
    if (!result.isConfirmed) return;

    try {
      const r = await fetch(`${API}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}`, Accept: 'application/json' }
      });
      if (!r.ok) throw new Error();
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch {
      Alert.show({ title: 'Gagal', text: 'Gagal menghapus user.', icon: 'error' });
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users size={20} className="text-indigo-600" /> Manajemen User
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">{users.length} user terdaftar</p>
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama / email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 w-56"
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
            <Users size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Tidak ada user ditemukan</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {filtered.map((u, i) => (
              <div key={u.id}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${i !== filtered.length - 1 ? 'border-b border-gray-100' : ''}`}>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {u.avatar_url
                    ? <img src={u.avatar_url} alt={u.name} className="w-full h-full object-cover" />
                    : <span className="text-sm font-bold text-indigo-600">{u.name?.charAt(0).toUpperCase()}</span>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                    {u.role === 'admin' && (
                      <span className="text-xs bg-indigo-100 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">Admin</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{u.email}</p>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-6 text-center mr-2">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{u.market_items_count ?? u.items_count ?? '-'}</p>
                    <p className="text-xs text-gray-400">Karya</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {new Date(u.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-gray-400">Bergabung</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/users/${u.id}`)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Lihat detail"
                  >
                    <ChevronRight size={16} />
                  </button>
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => handleDelete(u.id, u.name)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus user"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}