import React, { useState, useEffect, useRef } from 'react';
import {
  Users, Package, ShoppingBag, TrendingUp,
  Loader, Star, Award, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import StatCard from '../Components/StatCard';
import TopItemRow from '../Components/TopItemRow';
import Navbar from '../Layouts/Navbar';

const API   = 'http://api.skillnest.site/api';
const token = () => localStorage.getItem('auth_token');

/* ── chart colour palette ── */
const COLORS = {
  indigo: '#6366f1', blue: '#3b82f6', emerald: '#10b981',
  amber: '#f59e0b', rose: '#f43f5e', violet: '#8b5cf6', cyan: '#06b6d4',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  /* canvas refs */
  const donutRef   = useRef(null);
  const barRef     = useRef(null);
  const radarRef   = useRef(null);
  const lineRef    = useRef(null);

  /* chart instances */
  const charts = useRef({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token() || user.role !== 'admin') { navigate('/login'); return; }

    fetch(`${API}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token()}`, Accept: 'application/json' },
    })
      .then(r => r.json())
      .then(res => setData(res.data))
      .catch(() => setError('Gagal memuat data dashboard'))
      .finally(() => setLoading(false));
  }, []);

  /* destroy helper */
  const destroy = (key) => { charts.current[key]?.destroy(); };

  /* ── 1. Donut – order status ── */
  useEffect(() => {
    if (!data || !donutRef.current) return;
    destroy('donut');
    const { pending, paid, completed, cancelled } = data.order_summary;
    charts.current.donut = new Chart(donutRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'Dibayar', 'Selesai', 'Dibatalkan'],
        datasets: [{
          data: [pending, paid, completed, cancelled],
          backgroundColor: [COLORS.amber, COLORS.blue, COLORS.emerald, COLORS.rose],
          borderWidth: 0,
          hoverOffset: 8,
        }],
      },
      options: {
        cutout: '70%',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 14, font: { size: 11 }, usePointStyle: true } },
        },
      },
    });
    return () => destroy('donut');
  }, [data]);

  /* ── 2. Horizontal Bar – top items by orders ── */
  useEffect(() => {
    if (!data?.top_items?.length || !barRef.current) return;
    destroy('bar');
    const labels = data.top_items.map(i => i.name.length > 18 ? i.name.slice(0, 18) + '…' : i.name);
    const values = data.top_items.map(i => i.orders_count ?? 0);
    charts.current.bar = new Chart(barRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Pesanan',
          data: values,
          backgroundColor: labels.map((_, idx) => [
            COLORS.indigo, COLORS.blue, COLORS.cyan, COLORS.violet, COLORS.emerald,
          ][idx % 5] + 'cc'),
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } } },
          y: { grid: { display: false }, ticks: { font: { size: 11 } } },
        },
      },
    });
    return () => destroy('bar');
  }, [data]);

  /* ── 3. Radar – top items multi-metric ── */
  useEffect(() => {
    if (!data?.top_items?.length || !radarRef.current) return;
    destroy('radar');
    const top5  = data.top_items.slice(0, 5);
    const labels = top5.map(i => i.name.length > 12 ? i.name.slice(0, 12) + '…' : i.name);

    const normalize = (arr) => {
      const mx = Math.max(...arr, 1);
      return arr.map(v => Math.round((v / mx) * 100));
    };

    charts.current.radar = new Chart(radarRef.current, {
      type: 'radar',
      data: {
        labels,
        datasets: [
          {
            label: 'Pesanan',
            data: normalize(top5.map(i => i.orders_count ?? 0)),
            borderColor: COLORS.indigo,
            backgroundColor: COLORS.indigo + '22',
            pointBackgroundColor: COLORS.indigo,
            borderWidth: 2,
          },
          {
            label: 'Rating',
            data: normalize(top5.map(i => parseFloat(i.average_rating ?? 0) * 20)),
            borderColor: COLORS.amber,
            backgroundColor: COLORS.amber + '22',
            pointBackgroundColor: COLORS.amber,
            borderWidth: 2,
          },
          {
            label: 'Ulasan',
            data: normalize(top5.map(i => i.reviews_count ?? 0)),
            borderColor: COLORS.emerald,
            backgroundColor: COLORS.emerald + '22',
            pointBackgroundColor: COLORS.emerald,
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { display: false },
            grid: { color: '#e5e7eb' },
            pointLabels: { font: { size: 10 } },
          },
        },
        plugins: {
          legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 }, usePointStyle: true } },
        },
      },
    });
    return () => destroy('radar');
  }, [data]);

  /* ── 4. Line – harga top items ── */
  useEffect(() => {
    if (!data?.top_items?.length || !lineRef.current) return;
    destroy('line');
    const top5  = data.top_items.slice(0, 5);
    const labels = top5.map(i => i.name.length > 14 ? i.name.slice(0, 14) + '…' : i.name);
    const prices = top5.map(i => parseFloat(i.price ?? 0));

    charts.current.line = new Chart(lineRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Harga (Rp)',
          data: prices,
          borderColor: COLORS.violet,
          backgroundColor: COLORS.violet + '18',
          pointBackgroundColor: COLORS.violet,
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
        }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: {
            grid: { color: '#f3f4f6' },
            ticks: {
              font: { size: 10 },
              callback: v => 'Rp ' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v),
            },
          },
        },
      },
    });
    return () => destroy('line');
  }, [data]);

  /* ─────────────────────────── render ─────────────────────────── */

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader size={26} className="animate-spin text-indigo-400" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-400">{error}</div>
  );

  const { order_summary, top_items } = data;
  const totalOrders = (order_summary.pending + order_summary.paid + order_summary.completed + order_summary.cancelled) || 1;
  const completionRate = Math.round((order_summary.completed / totalOrders) * 100);

  const avgRating = top_items.length
    ? (top_items.reduce((s, i) => s + parseFloat(i.average_rating ?? 0), 0) / top_items.length).toFixed(1)
    : '–';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* Page title */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Ringkasan data SkillNest</p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Users"  value={data.total_users}           icon={Users}       color="indigo" />
          <StatCard label="Total Items"  value={data.total_items}           icon={Package}     color="blue"   />
          <StatCard label="Total Orders" value={data.total_orders}          icon={ShoppingBag} color="green"  />
          <StatCard label="Selesai"      value={order_summary.completed}    icon={TrendingUp}  color="yellow" />
        </div>

        {/* ── Quick metrics row ── */}
        <div className="grid grid-cols-3 gap-4">
          {/* Completion rate */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Activity size={22} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
              <p className="text-xs text-gray-400 mt-0.5">Completion Rate</p>
            </div>
          </div>

          {/* Avg rating */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Star size={22} className="text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{avgRating}</p>
              <p className="text-xs text-gray-400 mt-0.5">Rata-rata Rating</p>
            </div>
          </div>

          {/* Cancelled */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
              <Award size={22} className="text-rose-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{order_summary.cancelled}</p>
              <p className="text-xs text-gray-400 mt-0.5">Dibatalkan</p>
            </div>
          </div>
        </div>

        {/* ── Row 1: Donut + Horizontal Bar ── */}
        <div className="grid md:grid-cols-2 gap-4">

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 text-sm mb-1">Status Pesanan</h2>
            <p className="text-xs text-gray-400 mb-4">Distribusi seluruh transaksi</p>
            <div className="flex items-center justify-center" style={{ height: 250 }}>
              <canvas ref={donutRef} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 text-sm mb-1">Item Terlaris</h2>
            <p className="text-xs text-gray-400 mb-4">Berdasarkan jumlah pesanan</p>
            <div style={{ height: 250 }}>
              <canvas ref={barRef} />
            </div>
          </div>

        </div>

        {/* ── Row 2: Radar + Line ── */}
        <div className="grid md:grid-cols-2 gap-4">

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 text-sm mb-1">Performa Item</h2>
            <p className="text-xs text-gray-400 mb-4">Pesanan · Rating · Ulasan (top 5, dinormalisasi)</p>
            <div className="flex items-center justify-center" style={{ height: 270 }}>
              <canvas ref={radarRef} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 text-sm mb-1">Harga Item Terpopuler</h2>
            <p className="text-xs text-gray-400 mb-4">Perbandingan harga top 5 item</p>
            <div style={{ height: 270 }}>
              <canvas ref={lineRef} />
            </div>
          </div>

        </div>

        {/* ── Top Items Table ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 text-sm mb-4">Item Terpopuler</h2>
          {top_items.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Belum ada data</p>
          ) : (
            top_items.map((item, i) => (
              <TopItemRow key={item.id} item={item} rank={i + 1} />
            ))
          )}
        </div>

      </div>
    </div>
  );
}