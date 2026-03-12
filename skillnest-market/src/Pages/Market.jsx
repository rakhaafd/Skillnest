import React, { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal, TrendingUp, Users, Grid3X3, ChevronDown } from 'lucide-react';
import Navbar from '../Layouts/Navbar';
import Footer from '../Layouts/Footer';
import Card from '../Components/Card';
import Button from '../Components/Button';

const LEVELS = ['semua', 'Beginner', 'Intermediate', 'Advanced'];

const Market = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [selectedLevel, setSelectedLevel] = useState('semua');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState(['semua']);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    if (token && userData) { setIsLoggedIn(true); setUser(JSON.parse(userData)); }
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://api.skillnest.site/api/items');
        if (!response.ok) throw new Error('Gagal mengambil data');
        const data = await response.json();
        setItems(data);
        setCategories(['semua', ...new Set(data.map(i => i.category))]);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleDetailClick = (item) => { if (item.id) window.location.href = `/details/${item.id}`; };
  const handleItemDeleted = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const clearFilters = () => { setSearchTerm(''); setSelectedCategory('semua'); setSelectedLevel('semua'); };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'semua' || selectedLevel !== 'semua';

  const filteredItems = items.filter(item => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q || item.name.toLowerCase().includes(q) || (item.description || '').toLowerCase().includes(q);
    const matchCategory = selectedCategory === 'semua' || item.category === selectedCategory;
    const matchLevel = selectedLevel === 'semua' || item.skill_level === selectedLevel;
    return matchSearch && matchCategory && matchLevel;
  });

  const stats = [
    { icon: Grid3X3, label: 'Layanan', value: items.length },
    { icon: Users, label: 'Penjual Aktif', value: new Set(items.map(i => i.user_id)).size },
    { icon: TrendingUp, label: 'Kategori', value: new Set(items.map(i => i.category)).size },
  ];

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} user={user} />
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Memuat layanan...</p>
      </div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} user={user} />
      <div className="flex flex-col items-center justify-center py-40 gap-4 text-center px-4">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
          <X size={28} className="text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Gagal memuat data</h2>
        <p className="text-sm text-gray-400">{error}</p>
        <Button text="Coba Lagi" variant="solid" onClick={() => window.location.reload()} />
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} user={user} />

      <section className="relative bg-white border-b border-gray-100 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-violet-100 rounded-full blur-3xl opacity-30 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div>
              <span className="inline-block text-xs font-semibold tracking-widest text-indigo-500 uppercase mb-2">
                Platform Karya Mahasiswa
              </span>
              <h1 className="punchline text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                Temukan Layanan <span className="text-indigo-600">Terbaik</span> untuk Kamu
              </h1>
              <p className="text-gray-400 text-sm mt-1.5">
                Berbagai layanan dari mahasiswa berbakat siap membantu proyek dan kebutuhan digitalmu.
              </p>
            </div>

            {/* Stats + CTA */}
            <div className="flex items-center gap-6 flex-shrink-0">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-1">
                    <Icon size={15} className="text-indigo-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{value}</div>
                  <div className="text-xs text-gray-400">{label}</div>
                </div>
              ))}

              <div className="border-l border-gray-100 pl-6">
                {isLoggedIn ? (
                  <Button
                    text="+ Tambah Karya"
                    variant="solid"
                    size="sm"
                    onClick={() => window.location.href = '/add-item'}
                  />
                ) : (
                  <p className="text-sm text-gray-400 whitespace-nowrap">
                    <a href="/login" className="text-indigo-600 font-semibold hover:underline">Login</a>
                    {' '}untuk menambahkan karya
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Search & Filter Bar ── */}
      <section className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-3 items-center">

            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari layanan..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Desktop: Category & Level selects */}
            <div className="hidden md:flex gap-2">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700 cursor-pointer transition-colors"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c === 'semua' ? 'Semua Kategori' : c}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedLevel}
                  onChange={e => setSelectedLevel(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700 cursor-pointer transition-colors"
                >
                  {LEVELS.map(l => (
                    <option key={l} value={l}>{l === 'semua' ? 'Semua Level' : l}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium rounded-xl hover:bg-indigo-50 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Mobile: Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`md:hidden flex items-center gap-2 px-3 py-2.5 text-sm rounded-xl border transition-colors ${hasActiveFilters
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-600'
                  : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
            >
              <SlidersHorizontal size={15} />
              {hasActiveFilters && (
                <span className="w-4 h-4 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                  {[searchTerm !== '', selectedCategory !== 'semua', selectedLevel !== 'semua'].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile filters dropdown */}
          {showFilters && (
            <div className="md:hidden mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c === 'semua' ? 'Semua Kategori' : c}</option>
                ))}
              </select>
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {LEVELS.map(l => (
                  <option key={l} value={l}>{l === 'semua' ? 'Semua Level' : l}</option>
                ))}
              </select>
              {hasActiveFilters && (
                <button
                  onClick={() => { clearFilters(); setShowFilters(false); }}
                  className="w-full py-2.5 text-sm text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 font-medium transition-colors"
                >
                  Reset Filter
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Results ── */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Result count + active filter chips */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{filteredItems.length}</span> layanan ditemukan
            </p>

            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                "{searchTerm}"
                <button onClick={() => setSearchTerm('')}><X size={12} /></button>
              </span>
            )}
            {selectedCategory !== 'semua' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('semua')}><X size={12} /></button>
              </span>
            )}
            {selectedLevel !== 'semua' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                {selectedLevel}
                <button onClick={() => setSelectedLevel('semua')}><X size={12} /></button>
              </span>
            )}
          </div>

          {/* Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredItems.map(item => (
                <Card
                  key={item.id}
                  variant="product"
                  data={item}
                  showDetailButton={true}
                  onDetailClick={handleDetailClick}
                  onDeleted={handleItemDeleted}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                <Search size={26} className="text-gray-300" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">Tidak ada hasil</h3>
              <p className="text-sm text-gray-400 text-center max-w-xs mb-5">
                Coba kata kunci atau filter yang berbeda.
              </p>
              <Button text="Reset Filter" variant="outline" size="sm" onClick={clearFilters} />
            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Market;