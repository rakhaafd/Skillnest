import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Shield, LogOut, ChevronLeft, Mail, Star,
    Package, ShoppingBag, Loader, AlertCircle, Calendar, Pencil
} from 'lucide-react';
import Navbar from '../../Layouts/Navbar';

const API = 'http://api.skillnest.site/api';
const token = () => localStorage.getItem('auth_token');

const statusColor = (status) => ({
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
}[status] ?? 'bg-gray-100 text-gray-600');

const statusLabel = (s) => ({
    pending: 'Menunggu', paid: 'Dibayar', completed: 'Selesai', cancelled: 'Dibatalkan'
}[s] ?? s);

export default function AdminUserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!token() || user.role !== 'admin') { navigate('/login'); return; }

        // Fetch user detail
        fetch(`${API}/users/${id}`, {
            headers: { Authorization: `Bearer ${token()}`, Accept: 'application/json' }
        })
            .then(r => r.json())
            .then(res => setData(res.data ?? res))
            .catch(() => setError('Gagal memuat data user'))
            .finally(() => setLoading(false));

        // Fetch orders dan filter by user id
        fetch(`${API}/admin/orders`, {
            headers: { Authorization: `Bearer ${token()}`, Accept: 'application/json' }
        })
            .then(r => r.json())
            .then(res => {
                const all = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
                setOrders(all.filter(o => String(o.buyer_id) === String(id)));
            })
            .catch(() => setOrders([]));
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex justify-center py-24">
                <Loader size={24} className="animate-spin text-indigo-400" />
            </div>
        </div>
    );

    if (error || !data) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center gap-2 text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <AlertCircle size={16} /> {error || 'User tidak ditemukan'}
                </div>
            </div>
        </div>
    );

    const user = data.user ?? data;
    const items = data.market_items ?? data.items ?? [];
    const memberSince = user.created_at
        ? new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : '-';

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">

                {/* Back */}
                <button onClick={() => navigate('/users')}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                    <ChevronLeft size={16} /> Kembali ke daftar user
                </button>

                {/* Profile Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                            {user.avatar_url
                                ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                                : <span className="text-2xl font-bold text-indigo-600">{user.name?.charAt(0).toUpperCase()}</span>
                            }
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-white">{user.name}</h1>
                                {user.role === 'admin' && (
                                    <span className="text-xs bg-white/20 text-white font-semibold px-2 py-0.5 rounded-full">Admin</span>
                                )}
                            </div>
                            <p className="text-white/80 flex items-center gap-1.5 mt-1 text-sm">
                                <Mail size={14} /> {user.email}
                            </p>
                            <p className="text-white/60 flex items-center gap-1.5 mt-1 text-xs">
                                <Calendar size={12} /> Bergabung {memberSince}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 mt-5 pt-5 border-t border-white/20">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">{items.length}</p>
                            <p className="text-xs text-white/70">Total Karya</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">{orders.length}</p>
                            <p className="text-xs text-white/70">Pesanan</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">
                                {orders.filter(o => o.status === 'completed').length}
                            </p>
                            <p className="text-xs text-white/70">Selesai</p>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                        <Package size={16} className="text-indigo-600" />
                        <h2 className="font-semibold text-gray-900 text-sm">Karya yang Dijual</h2>
                        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{items.length} item</span>
                    </div>

                    {items.length === 0 ? (
                        <div className="py-10 text-center">
                            <Package size={28} className="mx-auto text-gray-300 mb-2" />
                            <p className="text-sm text-gray-400">Belum ada karya</p>
                        </div>
                    ) : (
                        items.map((item, i) => (
                            <div key={item.id}
                                className={`hover:bg-gray-100 flex items-center gap-4 px-5 py-4 ${i !== items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                <img
                                    src={item.thumbnail_url || `${API.replace('/api', '')}/storage/${item.thumbnail}`}
                                    alt={item.name}
                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-gray-100 cursor-pointer"
                                    onClick={() => navigate(`/items/${item.id}`)}
                                    onError={e => { e.target.style.display = 'none'; }}
                                />
                                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/items/${item.id}`)}>
                                    <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{item.category} · {item.skill_level}</p>
                                </div>
                                <div className="text-right flex-shrink-0 mr-2" onClick={() => navigate(`/items/${item.id}`)}>
                                    <p className="text-sm font-bold text-indigo-600 cursor-pointer">
                                        Rp {Number(item.price).toLocaleString('id-ID')}
                                    </p>
                                    {item.average_rating != null && (
                                        <p className="text-xs text-gray-400 flex items-center justify-end gap-1 mt-0.5">
                                            <Star size={10} className="text-yellow-400 fill-current" />
                                            {item.average_rating} · {item.total_reviews} ulasan
                                        </p>
                                    )}
                                </div>
                                {/* Tombol Edit */}
                                <button
                                    onClick={() => navigate(`/edit-item/${item.id}`)}
                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex-shrink-0"
                                    title="Edit item"
                                >
                                    <Pencil size={15} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Pesanan */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                        <ShoppingBag size={16} className="text-indigo-600" />
                        <h2 className="font-semibold text-gray-900 text-sm">Pesanan</h2>
                        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{orders.length} pesanan</span>
                    </div>

                    {orders.length === 0 ? (
                        <div className="py-10 text-center">
                            <ShoppingBag size={28} className="mx-auto text-gray-300 mb-2" />
                            <p className="text-sm text-gray-400">Belum ada pesanan</p>
                        </div>
                    ) : (
                        orders.map((order, i) => (
                            <div key={order.id}
                                className={`hover:bg-gray-100 flex items-start gap-4 px-5 py-4 ${i !== orders.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                {order.item?.thumbnail_url && (
                                    <img src={order.item.thumbnail_url} alt={order.item?.name}
                                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                                        onError={e => { e.target.style.display = 'none'; }} />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm truncate">
                                                {order.item?.name ?? `Order #${order.id}`}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {order.item?.user?.name && `oleh ${order.item.user.name}`}
                                            </p>
                                        </div>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor(order.status)}`}>
                                            {statusLabel(order.status)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-indigo-600 font-bold text-sm">
                                            Rp {Number(order.price).toLocaleString('id-ID')}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {order.created_at && new Date(order.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}