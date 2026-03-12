import React from 'react';
import {
  ArrowRight, Star, Briefcase, CheckCircle,
  Code, Palette, Camera, Music, BookOpen, Globe,
  Target, Zap, Shield, MessageCircle, ArrowUpRight, Quote,
} from 'lucide-react';
import Button from '../Components/Button';
import Navbar from '../Layouts/Navbar';
import Footer from '../Layouts/Footer';

const Style = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
    .sn { font-family: 'Sora', sans-serif; }

    /* fade-up on load */
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(18px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .au { animation: fadeUp .6s ease both; }
    .d1 { animation-delay:.05s; } .d2 { animation-delay:.15s; }
    .d3 { animation-delay:.25s; } .d4 { animation-delay:.38s; }

    /* card hover */
    .lift { transition: transform .2s ease, box-shadow .2s ease; }
    .lift:hover { transform:translateY(-3px); box-shadow:0 14px 32px -8px rgba(79,70,229,.15); }

    /* category pill hover */
    .cat-pill { transition: background .18s, border-color .18s, color .18s, transform .18s; }
    .cat-pill:hover { background:#4f46e5; border-color:#4f46e5; transform:translateY(-2px); }
    .cat-pill:hover .cp-icon { background:rgba(255,255,255,.18); color:#fff; }
    .cat-pill:hover .cp-name { color:#fff; }
    .cat-pill:hover .cp-count { color:#c7d2fe; }

    /* student card image zoom */
    .stu-img { transition: transform .35s ease; }
    .stu-card:hover .stu-img { transform: scale(1.06); }

    /* scrollbar hide */
    .sh::-webkit-scrollbar { display:none; }
    .sh { -ms-overflow-style:none; scrollbar-width:none; }

    /* testimonial scroll */
    @keyframes tscroll {
      0%   { transform:translateX(0); }
      100% { transform:translateX(-50%); }
    }
    .tscroll-track { animation: tscroll 30s linear infinite; }
    .tscroll-track:hover { animation-play-state:paused; }

    /* avatar initials */
    .avatar-initials {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.02em;
    }
  `}</style>
);

/* Helper: generate a consistent bg color from a name */
const avatarColor = (name) => {
  const colors = [
    ['#e0e7ff', '#4f46e5'], // indigo
    ['#fce7f3', '#db2777'], // pink
    ['#d1fae5', '#059669'], // green
    ['#fef3c7', '#d97706'], // amber
    ['#ede9fe', '#7c3aed'], // violet
    ['#cffafe', '#0891b2'], // cyan
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
};

const Initials = ({ name, size = 'md' }) => {
  const [bg, fg] = avatarColor(name);
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const sizeClass = size === 'lg'
    ? 'h-16 w-16 rounded-2xl text-base'
    : size === 'sm'
      ? 'h-9 w-9 rounded-xl text-xs'
      : 'h-12 w-12 rounded-xl text-sm';
  return (
    <div
      className={`avatar-initials flex-shrink-0 ${sizeClass}`}
      style={{ background: bg, color: fg }}
    >
      {initials}
    </div>
  );
};

export default function Home() {
  const categories = [
    { icon: <Code size={18} />, name: 'Programming & Tech' },
    { icon: <Palette size={18} />, name: 'Design & Creative' },
    { icon: <BookOpen size={18} />, name: 'Writing' },
    { icon: <Globe size={18} />, name: 'Digital Marketing' },
    { icon: <Camera size={18} />, name: 'Handmade' },
    { icon: <Music size={18} />, name: 'Education' },
  ];

  const featuredStudents = [
    {
      name: 'Ahmad Rizki',
      skill: 'Web Developer',
      rating: 4.9,
      projects: 23,
      price: '150k',
      university: 'Universitas Indonesia',
      badge: 'Expert',
      // Young male student, professional look
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    },
    {
      name: 'Sarah Wijaya',
      skill: 'UI/UX Designer',
      rating: 5.0,
      projects: 18,
      price: '200k',
      university: 'Institut Teknologi Bandung',
      badge: 'Expert',
      // Young woman, professional
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    },
    {
      name: 'Budi Santoso',
      skill: 'Content Writer',
      rating: 4.8,
      projects: 31,
      price: '100k',
      university: 'Universitas Gadjah Mada',
      badge: 'Expert',
      // Young man, casual
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    },
    {
      name: 'Dian Purnama',
      skill: 'Graphic Designer',
      rating: 4.9,
      projects: 15,
      price: '175k',
      university: 'Universitas Brawijaya',
      badge: 'Expert',
      // Young woman, smiling
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    },
  ];

  const testimonials = [
    { name: 'Michael Chen', role: 'Klien', content: 'SkillNest membantu saya menemukan talenta mahasiswa yang luar biasa untuk proyek website startup saya. Kualitasnya melebihi ekspektasi.' },
    { name: 'Dr. Ratna Sari', role: 'Partner Universitas', content: 'Platform ini memberikan pengalaman nyata bagi mahasiswa sambil membangun portofolio profesional mereka.' },
    { name: 'Rudi Hermawan', role: 'Mahasiswa', content: 'Berkat SkillNest, saya bisa mendapatkan penghasilan sambil kuliah dan membangun jaringan profesional.' },
    { name: 'Maya Putri', role: 'Klien', content: 'Prosesnya mudah dan cepat. Sangat puas dengan hasil kerja para mahasiswa di sini.' },
    { name: 'Andi Kurniawan', role: 'Mahasiswa', content: 'Platform terbaik untuk memulai karir freelance. Dalam 3 bulan sudah dapat 5 klien tetap!' },
    { name: 'Linda Susanto', role: 'Klien', content: 'Kualitas output sangat professional. Tim mahasiswa yang saya hire benar-benar berdedikasi.' },
  ];

  const stats = [
    { value: '500+', label: 'Mahasiswa Aktif' },
    { value: '1000+', label: 'Proyek Selesai' },
    { value: '50+', label: 'Universitas' },
    { value: '4.8/5', label: 'Rating Rata-rata' },
  ];

  const aboutPoints = [
    { icon: <Target size={20} />, title: 'Visi Kami', description: 'Menjadi platform #1 bagi mahasiswa Indonesia untuk mengembangkan karir profesional' },
    { icon: <Zap size={20} />, title: 'Misi Kami', description: 'Memberdayakan mahasiswa dengan keterampilan praktis dan pengalaman kerja nyata' },
    { icon: <Shield size={20} />, title: 'Nilai Kami', description: 'Trust, Growth, Innovation — Membangun ekosistem freelance yang terpercaya' },
  ];

  const howItWorks = [
    { step: '01', title: 'Buat Portofolio', description: 'Tunjukkan skill, proyek, dan pengalamanmu untuk membangun personal brand' },
    { step: '02', title: 'Tawarkan Jasa', description: 'Pasang layanan dengan harga kompetitif dan dapatkan klien pertama' },
    { step: '03', title: 'Mulai Hasilkan', description: 'Selesaikan proyek, dapatkan ulasan positif, dan bangun reputasi' },
  ];

  /* Badge color variants */
  const badgeStyle = (badge) => {
    if (badge === 'Expert') return 'bg-violet-50 text-violet-600';
    if (badge === 'Rising Star') return 'bg-emerald-50 text-emerald-600';
    return 'bg-indigo-50 text-indigo-600';
  };

  return (
    <div className="sn min-h-screen bg-white text-gray-900">
      <Style />
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-20 pb-0">
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[480px] w-[900px] rounded-full bg-indigo-50 blur-3xl opacity-70" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <span className="au d1 mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm">
            🚀 Platform Freelance untuk Mahasiswa
          </span>

          <h1 className="punchline au d2 text-5xl font-extrabold leading-[1.1] tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
            Skill-mu adalah<br />
            <span className="text-indigo-600">aset terbaikmu.</span>
          </h1>

          <p className="au d3 mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-500 md:text-lg">
            SkillNest membantu mahasiswa menghasilkan uang dari skill mereka sambil membangun portofolio profesional.
          </p>

          <div className="au d4 mt-8 flex flex-wrap justify-center gap-3">
            <a href="#"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-200/50 transition-all hover:bg-indigo-700 hover:gap-3">
              Mulai Jual <ArrowRight size={16} />
            </a>
            <a href="#"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:border-indigo-200 hover:text-indigo-600">
              Cari Talent
            </a>
          </div>

          {/* social proof row — use initials avatars */}
          <div className="au d4 mt-8 flex flex-wrap items-center justify-center gap-5">
            <div className="flex -space-x-2.5">
              {featuredStudents.map((s, i) => (
                <img
                  key={i}
                  src={s.photo}
                  alt={s.name}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-green-400" />50+ universitas</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-green-400" />1000+ proyek</span>
            </div>
          </div>
        </div>

        {/* wide hero image strip */}
        <div className="au d4 relative mt-12 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-indigo-100/60 border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&h=500&fit=crop"
              alt="Mahasiswa berkolaborasi"
              className="w-full object-cover"
              style={{ maxHeight: 420 }}
            />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />

            <div className="absolute bottom-6 left-6 flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-sm px-4 py-2.5 shadow-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-50">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">4.9 / 5.0</p>
                <p className="text-[10px] text-gray-400">Rating rata-rata</p>
              </div>
            </div>
            <div className="absolute bottom-6 right-6 flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-sm px-4 py-2.5 shadow-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                <Briefcase size={14} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">1000+ Proyek</p>
                <p className="text-[10px] text-gray-400">Berhasil diselesaikan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-gray-100 bg-white py-10 mt-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-extrabold text-indigo-600 md:text-4xl">{s.value}</div>
                <div className="mt-1 text-xs text-gray-400 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="py-20 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-indigo-500">Kategori</span>
            <h2 className="punchline text-3xl font-bold text-gray-900 md:text-4xl">Kategori Populer</h2>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-3 sh">
            {categories.map((cat, i) => (
              <button key={i}
                className="cat-pill flex-none flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
                <div className="cp-icon flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-all duration-200 flex-shrink-0">
                  {cat.icon}
                </div>
                <div className="text-left">
                  <p className="cp-name text-sm font-semibold text-gray-900 whitespace-nowrap">{cat.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="bg-gray-50 py-20 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            <div>
              <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-indigo-500">Tentang Kami</span>
              <h2 className=" punchline mb-5 text-3xl font-bold text-gray-900 md:text-4xl leading-snug">
                Platform yang lahir<br />untuk mahasiswa Indonesia.
              </h2>
              <p className="mb-8 text-sm leading-relaxed text-gray-500 max-w-md">
                SkillNest menghubungkan mahasiswa berbakat dengan klien yang membutuhkan jasa mereka — membangun karir profesional sambil kuliah.
              </p>
              <div className="flex flex-col gap-4">
                {aboutPoints.map((p, i) => (
                  <div key={i} className="lift flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm group cursor-default">
                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center transition-all duration-200 group-hover:bg-indigo-600 group-hover:text-white">
                      {p.icon}
                    </div>
                    <div>
                      <h3 className="mb-0.5 font-semibold text-gray-900">{p.title}</h3>
                      <p className="text-sm text-gray-500">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="overflow-hidden rounded-2xl shadow-sm border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=360&fit=crop"
                  alt="Tim SkillNest"
                  className="w-full object-cover"
                  style={{ maxHeight: 240 }}
                />
              </div>

              <div id="how-it-works" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm scroll-mt-20">
                <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-indigo-500">Cara Kerja</p>
                <div className="flex flex-col gap-5">
                  {howItWorks.map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm shadow-indigo-200">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-0.5">{item.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED STUDENTS — with real photos from Unsplash ── */}
      <section id="featured" className="py-20 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-indigo-500">Talent</span>
            <h2 className="punchline text-3xl font-bold text-gray-900 md:text-4xl">Mahasiswa Unggulan</h2>
          </div>

          {/* bento grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* card 0 — tall featured with real photo */}
            <div
              className="stu-card lift cursor-pointer rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden md:row-span-2"
            >
              {/* Photo hero area */}
              <div className="relative overflow-hidden" style={{ height: 260 }}>
                <img
                  src={featuredStudents[0].photo}
                  alt={featuredStudents[0].name}
                  className="stu-img w-full h-full object-cover object-top"
                />
                {/* subtle gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
                {/* badge overlay */}
                <span className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${badgeStyle(featuredStudents[0].badge)} shadow-sm`}>
                  {featuredStudents[0].badge}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">{featuredStudents[0].name}</h3>
                    <p className="text-sm font-medium text-indigo-600">{featuredStudents[0].skill}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 truncate mb-4">{featuredStudents[0].university}</p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-1 text-sm">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-800">{featuredStudents[0].rating}</span>
                    <span className="text-gray-400">({featuredStudents[0].projects})</span>
                  </div>
                </div>
              </div>
            </div>

            {featuredStudents.slice(1).map((student, i) => (
              <div key={i}
                className="stu-card lift cursor-pointer rounded-2xl border border-gray-100 bg-white p-4 shadow-sm flex items-center gap-4"
              >
                {/* Circular photo avatar */}
                <div className="flex-shrink-0 relative overflow-hidden rounded-2xl" style={{ width: 56, height: 56 }}>
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="stu-img w-full h-full object-cover object-top"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{student.name}</h3>
                      <p className="text-xs font-medium text-indigo-600">{student.skill}</p>
                      <p className="text-xs text-gray-400 truncate">{student.university}</p>
                    </div>
                    <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${badgeStyle(student.badge)}`}>
                      {student.badge}
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between border-t border-gray-100 pt-2">
                    <div className="flex items-center gap-1 text-xs">
                      <Star size={11} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-800">{student.rating}</span>
                      <span className="text-gray-400">({student.projects})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS — no images, clean text cards ── */}
      <section id="testimonials" className="bg-gray-50 py-20 overflow-hidden scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-500 shadow-sm">
            <MessageCircle size={12} /> Testimonials
          </span>
          <h2 className="punchline text-3xl font-bold text-gray-900 md:text-4xl">Dipercaya oleh Ribuan Pengguna</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-gray-500">
            Lihat apa yang mereka katakan tentang SkillNest
          </p>
        </div>

        {/* scrolling strip */}
        <div className="relative overflow-hidden">
          <div className="tscroll-track flex gap-4" style={{ width: 'max-content' }}>
            {[...testimonials, ...testimonials].map((t, i) => {
              const [bg, fg] = avatarColor(t.name);
              const initials = t.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
              return (
                <div key={i}
                  className="w-72 flex-none rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex flex-col justify-between"
                >
                  {/* Quote icon */}
                  <div>
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                      <Quote size={14} className="text-indigo-400" />
                    </div>
                    <p className="mb-4 text-xs leading-relaxed text-gray-500 line-clamp-4">{t.content}</p>
                    <div className="mb-4 flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={11} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Author row — initials only, no photo */}
                  <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                    <div
                      className="flex-shrink-0 flex items-center justify-center rounded-xl text-xs font-bold"
                      style={{ width: 36, height: 36, background: bg, color: fg }}
                    >
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-indigo-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="punchline text-3xl font-bold text-white md:text-4xl">Siap Memulai Perjalananmu?</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-indigo-100 md:text-base">
            Bergabung dengan SkillNest dan ubah skill-mu menjadi penghasilan. Ribuan mahasiswa telah merasakan manfaatnya.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-indigo-600 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl">
              Daftar sebagai Mahasiswa <ArrowUpRight size={16} />
            </a>
            <a href="#"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20">
              Cari Talent
            </a>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-indigo-100">
            {['Gratis Daftar', 'Pembayaran Aman', 'Dukungan 24/7'].map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle size={14} /><span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}