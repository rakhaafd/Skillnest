import React from 'react';
import { Star } from 'lucide-react';

export default function TopItemRow({ item, rank }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <span className="text-xs font-bold text-gray-300 w-4">#{rank}</span>
      <img
        src={item.thumbnail_url}
        alt={item.name}
        className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-100"
        onError={e => { e.target.style.display = 'none'; }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
        <p className="text-xs text-gray-400">{item.category}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-indigo-600">
          Rp {Number(item.price).toLocaleString('id-ID')}
        </p>
        <p className="text-xs text-gray-400 flex items-center justify-end gap-1">
          <Star size={10} className="text-yellow-400 fill-current" />
          {item.average_rating} · {item.orders_count} order
        </p>
      </div>
    </div>
  );
}