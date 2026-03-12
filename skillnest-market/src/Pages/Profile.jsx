import React, { useState, useEffect } from 'react';
import {
    User, Mail, Edit3, Check, X, Package,
    Star, ShoppingBag, ChevronRight, Eye, EyeOff,
    AlertCircle, CheckCircle, Loader, Grid, List
} from 'lucide-react';
import Navbar from '../Layouts/Navbar';
import Footer from '../Layouts/Footer';
import Button from '../Components/Button';
import Card from '../Components/Card';

const API = 'http://api.skillnest.site/api';

const token = () => localStorage.getItem('auth_token');
const storedUser = () => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
};

function Toast({ type, message, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);

    const colors = type === 'success'
        ? 'bg-green-50 border-green-400 text-green-800'
        : 'bg-red-50 border-red-400 text-red-800';
    const Icon = type === 'success' ? CheckCircle : AlertCircle;

    return (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-md text-sm font-medium ${colors}`}>
            <Icon size={16} />
            {message}
            <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X size={14} /></button>
        </div>
    );
}

function EditableField({ label, value, onSave, placeholder }) {
    const [editing, setEditing] = useState(false);
    const [val, setVal] = useState(value);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!val.trim()) return;
        setLoading(true);
        const ok = await onSave(val);
        setLoading(false);
        if (ok) setEditing(false);
    };

    const handleCancel = () => { setVal(value); setEditing(false); };

    return (
        <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">{label}</label>
            {editing ? (
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={val}
                        onChange={e => setVal(e.target.value)}
                        placeholder={placeholder}
                        onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
                        className="flex-1 px-3 py-2 rounded-lg border-2 border-indigo-400 text-gray-900 text-sm focus:outline-none"
                        autoFocus
                    />
                    <button onClick={handleSave} disabled={loading}
                        className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center disabled:opacity-50">
                        {loading ? <Loader size={13} className="animate-spin" /> : <Check size={14} />}
                    </button>
                    <button onClick={handleCancel}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center">
                        <X size={14} />
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
                    <span className="text-sm text-gray-800">{value || <span className="text-gray-400 italic">Belum diisi</span>}</span>
                    <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-indigo-600 ml-2">
                        <Edit3 size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}

function PasswordForm({ onSave }) {
    const [editing, setEditing] = useState(false);
    const [current, setCurrent] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        const ok = await onSave({ current, newPass, confirmPass });
        setLoading(false);
        if (ok) {
            setEditing(false);
            setCurrent(''); setNewPass(''); setConfirmPass('');
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setCurrent(''); setNewPass(''); setConfirmPass('');
    };

    return (
        <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">Password</label>
            {editing ? (
                <div className="space-y-2">
                    <div className="relative">
                        <input type={showCurrent ? 'text' : 'password'} value={current} onChange={e => setCurrent(e.target.value)}
                            placeholder="Password saat ini..." className="w-full px-3 py-2 rounded-lg border-2 border-indigo-400 text-sm focus:outline-none pr-9" />
                        <button type="button" onClick={() => setShowCurrent(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>
                    <div className="relative">
                        <input type={showNew ? 'text' : 'password'} value={newPass} onChange={e => setNewPass(e.target.value)}
                            placeholder="Password baru..." className="w-full px-3 py-2 rounded-lg border-2 border-indigo-400 text-sm focus:outline-none pr-9" />
                        <button type="button" onClick={() => setShowNew(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>
                    <div className="relative">
                        <input type={showConfirm ? 'text' : 'password'} value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                            placeholder="Konfirmasi password baru..." className="w-full px-3 py-2 rounded-lg border-2 border-indigo-400 text-sm focus:outline-none pr-9" />
                        <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                        <button onClick={handleCancel} className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm flex items-center gap-1">
                            <X size={13} /> Batal
                        </button>
                        <button onClick={handleSave} disabled={loading || !current || !newPass || !confirmPass}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm flex items-center gap-1 disabled:opacity-50">
                            {loading ? <Loader size={13} className="animate-spin" /> : <Check size={13} />}
                            Simpan
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
                    <span className="text-sm text-gray-800">••••••••</span>
                    <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-indigo-600 ml-2">
                        <Edit3 size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}

export default function Profile() {
    const [user, setUser] = useState(storedUser());
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loadingItems, setLoadingItems] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [toast, setToast] = useState(null);
    const [tab, setTab] = useState('karya');
    const [viewMode, setViewMode] = useState('grid');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const isAuthenticated = !!token();
    const showToast = (type, message) => setToast({ type, message });

    useEffect(() => {
        if (!isAuthenticated) window.location.href = '/login';
    }, [isAuthenticated]);

    useEffect(() => {
        if (!user?.id) return;
        setLoadingItems(true);
        fetch(`${API}/users/${user.id}`, { headers: { Authorization: `Bearer ${token()}` } })
            .then(r => r.json())
            .then(data => { if (data.items) setItems(data.items); else fetchUserItems(); })
            .catch(() => fetchUserItems())
            .finally(() => setLoadingItems(false));
    }, [user?.id]);

    const fetchUserItems = async () => {
        try {
            const r = await fetch(`${API}/items`, { headers: { Authorization: `Bearer ${token()}` } });
            const data = await r.json();
            const mine = (Array.isArray(data) ? data : data.data ?? [])
                .filter(item => String(item.user_id) === String(user?.id));
            setItems(mine);
        } catch { setItems([]); }
        setLoadingItems(false);
    };

    useEffect(() => {
        if (!isAuthenticated) return;
        setLoadingOrders(true);
        fetch(`${API}/orders/my`, { headers: { Authorization: `Bearer ${token()}` } })
            .then(r => r.json())
            .then(data => setOrders(Array.isArray(data) ? data : data.data ?? []))
            .catch(() => setOrders([]))
            .finally(() => setLoadingOrders(false));
    }, [isAuthenticated]);

    const completedOrders = orders.filter(o => o.status === 'completed').length;

    const handleUpdateName = async (name) => {
        try {
            const r = await fetch(`${API}/profile/new-name`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
                body: JSON.stringify({ name }),
            });
            const data = await r.json();
            if (!r.ok) throw new Error(data.message || 'Gagal memperbarui nama');
            const updated = { ...user, name };
            setUser(updated);
            localStorage.setItem('user', JSON.stringify(updated));
            showToast('success', 'Nama berhasil diperbarui!');
            return true;
        } catch (err) { showToast('error', err.message); return false; }
    };

    const handleUpdatePassword = async ({ current, newPass, confirmPass }) => {
        if (newPass.length < 6) { showToast('error', 'Password minimal 6 karakter'); return false; }
        if (newPass !== confirmPass) { showToast('error', 'Konfirmasi password tidak cocok'); return false; }
        try {
            const r = await fetch(`${API}/profile/new-password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', Authorization: `Bearer ${token()}` },
                body: JSON.stringify({ current, new: newPass, new_confirmation: confirmPass }),
            });
            const data = await r.json();
            if (!r.ok) throw new Error(data.message || 'Gagal memperbarui password');
            showToast('success', 'Password berhasil diperbarui!');
            return true;
        } catch (err) { showToast('error', err.message); return false; }
    };

    const handleItemDeleted = (id) => setItems(prev => prev.filter(i => i.id !== id));

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            setUploadingAvatar(true);
            const r = await fetch(`${API}/profile/avatar`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token()}` },
                body: formData,
            });
            const data = await r.json();
            if (!r.ok) throw new Error(data.message || 'Gagal upload avatar');
            const updated = { ...user, avatar_url: data.data.avatar_url };
            setUser(updated);
            localStorage.setItem('user', JSON.stringify(updated));
            showToast('success', 'Foto profil berhasil diperbarui!');
        } catch (err) {
            showToast('error', err.message);
        } finally {
            setUploadingAvatar(false);
        }
    };

    const statusColor = (status) => ({
        pending: 'bg-yellow-100 text-yellow-700',
        paid: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    }[status] ?? 'bg-gray-100 text-gray-600');

    const statusLabel = (s) => ({
        pending: 'Menunggu', paid: 'Dibayar', completed: 'Selesai', cancelled: 'Dibatalkan'
    }[s] ?? s);

    const memberSince = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
        : null;

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar isLoggedIn={isAuthenticated} user={user} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-5">
                        <div className="relative w-16 h-16 flex-shrink-0">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-100 overflow-hidden flex items-center justify-center">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl font-bold text-indigo-600">
                                        {user.name?.charAt(0).toUpperCase() ?? '?'}
                                    </span>
                                )}
                            </div>
                            <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-white hover:bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center cursor-pointer shadow">
                                {uploadingAvatar
                                    ? <Loader size={11} className="animate-spin text-indigo-600" />
                                    : <Edit3 size={11} className="text-indigo-600" />
                                }
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                    disabled={uploadingAvatar}
                                />
                            </label>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">{user.name}</h1>
                            <p className="text-xl font-semibold text-white flex items-center gap-1.5 mt-0.5">
                                <Mail size={18} /> {user.email}
                            </p>
                            {memberSince && <p className="text-md text-white mt-2">Member sejak {memberSince}</p>}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 mt-6 pt-6 border-t border-gray-200">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">{items.length}</p>
                            <p className="text-md text-white">Total Karya</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">{orders.length}</p>
                            <p className="text-md text-white">Pesanan</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">{completedOrders}</p>
                            <p className="text-md text-white">Selesai</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

                {/* Pengaturan Profil */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                        <User size={16} className="text-indigo-600" />
                        <h2 className="font-semibold text-gray-900 text-sm">Pengaturan Profil</h2>
                    </div>
                    <div className="p-5 grid sm:grid-cols-2 gap-4">
                        <EditableField
                            label="Nama Lengkap"
                            value={user.name}
                            onSave={handleUpdateName}
                            placeholder="Masukkan nama baru..."
                        />
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">Email</label>
                            <div className="flex items-center px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
                                <Mail size={13} className="text-gray-400 mr-2" />
                                <span className="text-sm text-gray-500">{user.email}</span>
                                <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Tetap</span>
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <PasswordForm onSave={handleUpdatePassword} />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
                            {[
                                { key: 'karya', label: 'Karya Saya', icon: Package },
                                { key: 'pesanan', label: 'Pesanan Saya', icon: ShoppingBag },
                            ].map(({ key, label, icon: Icon }) => (
                                <button key={key} onClick={() => setTab(key)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === key ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-700'
                                        }`}>
                                    <Icon size={14} />{label}
                                </button>
                            ))}
                        </div>

                        {tab === 'karya' && (
                            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                                <button onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400'}`}>
                                    <Grid size={14} />
                                </button>
                                <button onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400'}`}>
                                    <List size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Karya Tab */}
                    {tab === 'karya' && (
                        <div>
                            {loadingItems ? (
                                <div className="flex justify-center py-12">
                                    <Loader size={24} className="animate-spin text-indigo-400" />
                                </div>
                            ) : items.length === 0 ? (
                                <div className="bg-white rounded-xl border border-gray-200 py-12 text-center">
                                    <Package size={32} className="mx-auto text-gray-300 mb-3" />
                                    <p className="font-semibold text-gray-700 mb-1">Belum ada karya</p>
                                    <p className="text-sm text-gray-400 mb-4">Mulai jual karya pertamamu sekarang!</p>
                                    <Button text="Tambah Karya" variant="solid" onClick={() => window.location.href = '/add-item'} />
                                </div>
                            ) : (
                                <>
                                    <div className={viewMode === 'grid'
                                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                                        : 'flex flex-col gap-3'}>
                                        {items.map(item => (
                                            viewMode === 'grid' ? (
                                                <Card key={item.id} data={item}
                                                    onDetailClick={() => window.location.href = `/details/${item.id}`}
                                                    onDeleted={handleItemDeleted} />
                                            ) : (
                                                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                                                    <img
                                                        src={item.thumbnail_url || `http://api.skillnest.site/storage/${item.thumbnail}`}
                                                        alt={item.name}
                                                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                                                        onError={e => { e.target.style.display = 'none'; }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-indigo-600 font-semibold text-sm">
                                                                Rp {Number(item.price).toLocaleString('id-ID')}
                                                            </span>
                                                            {item.average_rating && (
                                                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                                                    <Star size={11} className="text-yellow-400 fill-current" />
                                                                    {item.average_rating}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button onClick={() => window.location.href = `/details/${item.id}`}
                                                        className="text-gray-400 hover:text-indigo-600">
                                                        <ChevronRight size={16} />
                                                    </button>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                    <div className="mt-6 text-center">
                                        <Button text="+ Tambah Karya Baru" variant="outline" onClick={() => window.location.href = '/add-item'} />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Pesanan Tab */}
                    {tab === 'pesanan' && (
                        <div>
                            {loadingOrders ? (
                                <div className="flex justify-center py-12">
                                    <Loader size={24} className="animate-spin text-indigo-400" />
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="bg-white rounded-xl border border-gray-200 py-12 text-center">
                                    <ShoppingBag size={32} className="mx-auto text-gray-300 mb-3" />
                                    <p className="font-semibold text-gray-700 mb-1">Belum ada pesanan</p>
                                    <p className="text-sm text-gray-400 mb-4">Temukan karya menarik di marketplace!</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {orders.map(order => (
                                        <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-4">
                                            <div className="flex items-start gap-4">
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
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}