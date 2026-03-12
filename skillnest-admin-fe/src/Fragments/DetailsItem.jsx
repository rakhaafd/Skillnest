import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Shield, LogOut, ChevronLeft, User, Star,
    Clock, ImageOff, Loader, AlertCircle, Calendar
} from 'lucide-react';
import ReviewItem from './ReviewItem';
import Navbar from '../Layouts/Navbar';

const API = 'http://api.skillnest.site/api';
const token = () => localStorage.getItem('auth_token');

const handleDeleteReview = async (reviewId) => {
    try {
        const r = await fetch(`${API}/admin/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token()}`, Accept: 'application/json' }
        });
        if (!r.ok) throw new Error();
    } catch {
        alert('Gagal menghapus review');
    }
};

const getLevelColor = (level) => ({
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    expert: 'bg-red-100 text-red-800',
}[level?.toLowerCase()] ?? 'bg-gray-100 text-gray-800');

export default function AdminItemDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!token() || user.role !== 'admin') { navigate('/login'); return; }

        fetch(`${API}/items/${id}`, {
            headers: { Authorization: `Bearer ${token()}`, Accept: 'application/json' }
        })
            .then(r => r.json())
            .then(data => {
                if (!data.user) data.user = { name: 'Unknown', created_at: null };
                setItem(data);
            })
            .catch(() => setError('Gagal memuat data item'))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (!item?.id) return;
        fetch(`${API}/items/${item.id}/reviews`)
            .then(r => r.json())
            .then(data => {
                if (data.average_rating) setAverageRating(data.average_rating);
                if (data.total_reviews) setTotalReviews(data.total_reviews);
            })
            .catch(() => { });
    }, [item?.id]);

    const getImageUrl = () => {
        if (!item || imageError) return null;
        if (item.thumbnail_url) return item.thumbnail_url;
        if (item.thumbnail) return item.thumbnail.startsWith('http')
            ? item.thumbnail
            : `http://api.skillnest.site/storage/${item.thumbnail}`;
        return null;
    };

    const formatPrice = (p) => new Intl.NumberFormat('id-ID').format(p || 0);
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

    if (loading) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex justify-center py-24"><Loader size={24} className="animate-spin text-indigo-400" /></div>
        </div>
    );

    if (error || !item) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center gap-2 text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <AlertCircle size={16} /> {error || 'Item tidak ditemukan'}
                </div>
            </div>
        </div>
    );

    const imageUrl = getImageUrl();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">

                {/* Back */}
                <button onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                    <ChevronLeft size={16} /> Kembali
                </button>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                    {/* Thumbnail */}
                    <div className="relative w-full bg-gray-100" style={{ minHeight: 320 }}>
                        {imageUrl ? (
                            <img src={imageUrl} alt={item.name}
                                className="w-full object-contain" style={{ maxHeight: 420 }}
                                onError={() => setImageError(true)} />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <ImageOff size={40} className="mx-auto text-gray-300 mb-2" />
                                    <p className="text-sm text-gray-400">Gambar tidak tersedia</p>
                                </div>
                            </div>
                        )}
                        <span className="absolute top-4 left-4 px-3 py-1 bg-indigo-600 text-white rounded-full text-sm font-medium">
                            {item.category}
                        </span>
                    </div>

                    <div className="p-6 space-y-5">

                        {/* Title & Level */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
                            {item.skill_level && (
                                <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getLevelColor(item.skill_level)}`}>
                                    <Clock size={13} /> {item.skill_level}
                                </span>
                            )}
                        </div>

                        {/* Seller Info */}
                        <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden">
                                    {item.user?.avatar_url
                                        ? <img src={item.user.avatar_url} alt={item.user.name} className="w-full h-full object-cover" />
                                        : <User size={20} className="text-indigo-600" />
                                    }
                                </div>
                                <div>
                                    <button
                                        onClick={() => navigate(`/users/${item.user_id}`)}
                                        className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors text-sm"
                                    >
                                        {item.user?.name || 'Unknown'}
                                    </button>
                                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                        <Calendar size={11} /> Member sejak {formatDate(item.user?.created_at)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star size={18} className="text-yellow-400 fill-current" />
                                <span className="font-semibold text-sm">
                                    {averageRating > 0 ? averageRating : 'Belum ada'}
                                </span>
                                <span className="text-gray-400 text-xs ml-1">({totalReviews} ulasan)</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Harga</p>
                            <p className="text-3xl font-bold text-indigo-600">Rp {formatPrice(item.price)}</p>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="font-semibold text-gray-800 mb-2">Deskripsi</h2>
                            <div className="flex gap-3">
                                <div className="w-1 bg-indigo-400 rounded-full flex-shrink-0" />
                                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">
                                    {item.description || 'Tidak ada deskripsi'}
                                </p>
                            </div>
                        </div>

                        {/* What You Get */}
                        {item.what_you_get && (
                            <div>
                                <h2 className="font-semibold text-gray-800 mb-2">Yang Didapat</h2>
                                <div className="bg-indigo-50 p-4 rounded-lg">
                                    <p className="text-gray-700 font-medium whitespace-pre-line text-sm">{item.what_you_get}</p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
                <ReviewItem
                    itemId={item.id}
                    userId={null}
                    isAuthenticated={false}
                    onReviewSubmitted={() => { }}
                    isAdmin={true}
                    onDeleteReview={handleDeleteReview}
                />
            </div>
        </div>
    );
}