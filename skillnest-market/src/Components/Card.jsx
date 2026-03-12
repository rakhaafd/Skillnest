import React, { useState } from 'react';
import { Star, ImageOff, Pencil, Trash2, ShoppingBag } from 'lucide-react';
import Alert from './Alert';

export default function Card({
  data,
  showDetailButton = true,
  onDetailClick,
  onDeleted,
}) {
  const [imageError, setImageError] = useState(false);
  const [deleting, setDeleting]     = useState(false);
  const [hovered, setHovered]       = useState(false);

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();

  const itemOwnerId   = data?.user_id ?? data?.user?.id;
  const isOwner       = currentUser && String(currentUser.id) === String(itemOwnerId);
  const averageRating = data?.average_rating ?? data?.reviews_avg_rating ?? null;
  const totalReviews  = data?.total_reviews  ?? data?.reviews_count ?? 0;

  const handleDetailClick = (e) => { e.stopPropagation(); if (onDetailClick) onDetailClick(data); };
  const handleEditClick   = (e) => { e.stopPropagation(); window.location.href = `/edit-item/${data.id}`; };

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    const result = await Alert.confirm({
      title: 'Hapus item ini?',
      text: 'Tindakan ini tidak dapat dibatalkan.',
      confirmText: 'Ya, Hapus',
    });
    if (!result.isConfirmed) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem('auth_token');
      const res   = await fetch(`http://api.skillnest.site/api/items/${data.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error();
      Alert.show({ title: 'Terhapus!', text: 'Item berhasil dihapus.', icon: 'success', timer: 1500 });
      if (onDeleted) onDeleted(data.id);
    } catch {
      Alert.show({ title: 'Gagal!', text: 'Gagal menghapus item.', icon: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const imageUrl = data?.thumbnail_url
    || (data?.thumbnail ? `http://api.skillnest.site/storage/${data.thumbnail}` : null);

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Harga tidak tersedia';
    return `Rp ${Number(price).toLocaleString('id-ID')}`;
  };

  const levelColors = {
    beginner:     { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-400' },
    intermediate: { bg: 'bg-amber-50',   text: 'text-amber-600',   dot: 'bg-amber-400'   },
    advanced:     { bg: 'bg-rose-50',    text: 'text-rose-600',    dot: 'bg-rose-400'    },
  };
  const levelKey   = data.skill_level?.toLowerCase();
  const levelStyle = levelColors[levelKey] ?? { bg: 'bg-gray-50', text: 'text-gray-500', dot: 'bg-gray-400' };

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/60 hover:-translate-y-0.5 flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Thumbnail ── */}
      <div className="relative w-full h-44 bg-gray-50 overflow-hidden flex-shrink-0">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={data.name || data.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
            <div className="text-center">
              <ImageOff size={28} className="mx-auto text-gray-300 mb-1" />
              <p className="text-xs text-gray-400">Tidak ada gambar</p>
            </div>
          </div>
        )}

        {/* dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Skill Level badge */}
        {data.skill_level && (
          <span className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${levelStyle.bg} ${levelStyle.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${levelStyle.dot}`} />
            {data.skill_level}
          </span>
        )}

        {/* Owner actions */}
        {isOwner && (
          <div className="absolute top-3 left-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleEditClick}
              className="p-1.5 bg-white/95 hover:bg-indigo-50 text-indigo-600 rounded-lg shadow-sm transition-colors"
              title="Edit"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={deleting}
              className="p-1.5 bg-white/95 hover:bg-red-50 text-red-500 rounded-lg shadow-sm transition-colors disabled:opacity-50"
              title="Hapus"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Title + seller */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1.5">
            {data.name || data.title}
          </h3>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {data.user?.avatar_url
                ? <img src={data.user.avatar_url} alt="" className="w-full h-full object-cover" />
                : <span className="text-indigo-600 font-bold text-[10px]">{data.user?.name?.charAt(0).toUpperCase() ?? '?'}</span>
              }
            </div>
            <span className="text-xs text-gray-400 truncate">{data.user?.name || 'Unknown'}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Rating + Price */}
        <div className="flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1">
            {averageRating ? (
              <>
                <Star size={13} className="text-yellow-400 fill-current" />
                <span className="text-xs font-semibold text-gray-700">{Number(averageRating).toFixed(1)}</span>
                <span className="text-xs text-gray-400">({totalReviews})</span>
              </>
            ) : (
              <>
                <Star size={13} className="text-gray-200 fill-current" />
                <span className="text-xs text-gray-400">Belum ada</span>
              </>
            )}
          </div>

          {/* Price */}
          <span className="text-sm font-bold text-indigo-600">
            {formatPrice(data.price)}
          </span>
        </div>

        {/* CTA */}
        {showDetailButton && (
          <button
            onClick={handleDetailClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl transition-colors duration-200"
          >
            <ShoppingBag size={13} />
            Lihat Detail
          </button>
        )}
      </div>
    </div>
  );
}