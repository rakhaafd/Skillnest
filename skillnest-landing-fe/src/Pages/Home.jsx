import React from 'react';
import { 
  ArrowRight, 
  Star, 
  Users, 
  Briefcase, 
  ChevronRight,
  CheckCircle,
  Code,
  Palette,
  Camera,
  Music,
  BookOpen,
  Globe,
  Award,
  Target,
  Zap,
  Shield,
  MessageCircle
} from 'lucide-react';
import Button from '../Components/Button';
import Navbar from '../Layouts/Navbar';
import Footer from '../Layouts/Footer';
import Card from '../Components/Card';

const Home = () => {
  const categories = [
    { icon: <Code size={24} />, name: "Programming", count: 245, color: "blue" },
    { icon: <Palette size={24} />, name: "Design", count: 189, color: "purple" },
    { icon: <Camera size={24} />, name: "Fotografi", count: 123, color: "green" },
    { icon: <Music size={24} />, name: "Musik & Audio", count: 98, color: "orange" },
    { icon: <BookOpen size={24} />, name: "Menulis", count: 156, color: "yellow" },
    { icon: <Globe size={24} />, name: "Digital Marketing", count: 87, color: "red" },
  ];

  const featuredStudents = [
    {
      name: "Ahmad Rizki",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
      skill: "Web Developer",
      rating: 4.9,
      projects: 23,
      price: "150k",
      university: "Universitas Indonesia",
      badge: "Top Rated"
    },
    {
      name: "Sarah Wijaya",
      avatar: "https://images.unsplash.com/photo-1494790108777-466d689b580a?w=150&h=150&fit=crop&crop=faces",
      skill: "UI/UX Designer",
      rating: 5.0,
      projects: 18,
      price: "200k",
      university: "Institut Teknologi Bandung",
      badge: "Expert"
    },
    {
      name: "Budi Santoso",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
      skill: "Content Writer",
      rating: 4.8,
      projects: 31,
      price: "100k",
      university: "Universitas Gadjah Mada",
      badge: "Rising Star"
    },
    {
      name: "Dian Purnama",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
      skill: "Graphic Designer",
      rating: 4.9,
      projects: 15,
      price: "175k",
      university: "Universitas Brawijaya",
      badge: "Top Rated"
    }
  ];

  const testimonials = [
    {
      name: "Michael Chen",
      role: "Klien",
      content: "SkillNest membantu saya menemukan talenta mahasiswa yang luar biasa untuk proyek website startup saya. Kualitasnya melebihi ekspektasi.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces"
    },
    {
      name: "Dr. Ratna Sari",
      role: "Partner Universitas",
      content: "Platform ini memberikan pengalaman nyata bagi mahasiswa sambil membangun portofolio profesional mereka.",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=faces"
    },
    {
      name: "Rudi Hermawan",
      role: "Mahasiswa",
      content: "Berkat SkillNest, saya bisa mendapatkan penghasilan sambil kuliah dan membangun jaringan profesional.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces"
    },
    {
      name: "Maya Putri",
      role: "Klien",
      content: "Prosesnya mudah dan cepat. Sangat puas dengan hasil kerja para mahasiswa di sini.",
      avatar: "https://images.unsplash.com/photo-1494790108777-466d689b580a?w=150&h=150&fit=crop&crop=faces"
    }
  ];

  const stats = [
    { value: "500+", label: "Mahasiswa Aktif" },
    { value: "1000+", label: "Proyek Selesai" },
    { value: "50+", label: "Universitas" },
    { value: "4.8/5", label: "Rating Rata-rata" },
  ];

  const aboutPoints = [
    {
      icon: <Target size={28} />,
      title: "Visi Kami",
      description: "Menjadi platform #1 bagi mahasiswa Indonesia untuk mengembangkan karir profesional"
    },
    {
      icon: <Zap size={28} />,
      title: "Misi Kami",
      description: "Memberdayakan mahasiswa dengan keterampilan praktis dan pengalaman kerja nyata"
    },
    {
      icon: <Shield size={28} />,
      title: "Nilai Kami",
      description: "Trust, Growth, Innovation - Membangun ekosistem freelance yang terpercaya"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Buat Portofolio",
      description: "Tunjukkan skill, proyek, dan pengalamanmu untuk membangun personal brand"
    },
    {
      step: "2",
      title: "Tawarkan Jasa",
      description: "Pasang layanan dengan harga kompetitif dan dapatkan klien pertama"
    },
    {
      step: "3",
      title: "Mulai Hasilkan",
      description: "Selesaikan proyek, dapatkan ulasan positif, dan bangun reputasi"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4">
                <span className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold">
                  🚀 Platform Freelance untuk Mahasiswa
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Tunjukkan Skill-mu,{' '}
                <span className="text-indigo-600">Mulai Hasilkan</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                SkillNest membantu mahasiswa menghasilkan uang dari skill mereka sambil membangun portofolio profesional. Bergabunglah dengan ribuan mahasiswa berbakat yang sudah menghasilkan.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button 
                  text="Mulai Jual"
                  icon={<ArrowRight size={20} />}
                  variant="solid"
                  size="lg"
                />
                <Button 
                  text="Cari Talent"
                  variant="outline"
                  size="lg"
                />
              </div>
              <div className="mt-8 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 border-2 border-white"></div>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>50+ universitas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>1000+ proyek</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-2xl opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                alt="Mahasiswa berkolaborasi"
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-indigo-600">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tentang SkillNest</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              SkillNest adalah platform yang menghubungkan mahasiswa berbakat dengan klien yang membutuhkan jasa mereka. Kami membantu mahasiswa membangun karir sambil kuliah.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {aboutPoints.map((point, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  {point.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{point.title}</h3>
                <p className="text-gray-600 leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-indigo-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cara Kerja</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mulai perjalananmu sebagai freelancer dalam tiga langkah mudah
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (hidden on mobile) */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-indigo-200"></div>
            
            {howItWorks.map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 relative z-10">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kategori Populer</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Temukan berbagai keahlian dari mahasiswa berbakat di seluruh Indonesia
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card
                key={index}
                variant="category"
                data={{
                  icon: category.icon,
                  name: category.name,
                  count: category.count,
                  countLabel: "mahasiswa"
                }}
                onClick={() => window.location.href = '/market'}
                className="text-center hover:border-indigo-600"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Students Section */}
      <section id="featured" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Mahasiswa Unggulan</h2>
              <p className="text-lg text-gray-600">Talent terbaik siap bekerja untuk proyekmu</p>
            </div>
            <Button 
              text="Lihat Semua"
              icon={<ChevronRight size={20} />}
              variant="ghost"
              className="mt-4 md:mt-0"
              onClick={() => window.location.href = '/market'}
            />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredStudents.map((student, index) => (
              <Card
                key={index}
                variant="student"
                data={student}
                onClick={() => window.location.href = `/market?student=${student.name}`}
              />
            ))}
          </div>
        </div>
      </section>

{/* Testimonials Section - Option 2: Carousel Style */}
<section id="testimonials" className="py-20 bg-white scroll-mt-20 overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-4">
        <MessageCircle size={16} className="text-indigo-600" />
        <span className="text-indigo-600 font-semibold text-sm">Testimonials</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Dipercaya oleh Ribuan Pengguna
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Lihat apa yang mereka katakan tentang pengalaman menggunakan SkillNest
      </p>
    </div>

    <div className="relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200"></div>
      </div>
      
      <div className="relative flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="flex-none w-full md:w-1/2 lg:w-1/3 snap-center px-2"
          >
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
              {/* Quote Icon */}
              <div className="text-5xl font-serif text-indigo-200/50 mb-4">"</div>
              
              {/* Content */}
              <p className="text-gray-700 leading-relaxed mb-6 line-clamp-4">
                {testimonial.content}
              </p>
              
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              {/* Profile */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover ring-4 ring-indigo-50 group-hover:ring-indigo-100 transition-all"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-indigo-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {[...Array(4)].map((_, i) => (
          <button
            key={i}
            className="w-2 h-2 rounded-full bg-indigo-200 hover:bg-indigo-600 transition-colors"
          ></button>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap Memulai Perjalananmu?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Bergabung dengan SkillNest sekarang dan ubah skill-mu menjadi penghasilan. Ribuan mahasiswa telah merasakan manfaatnya.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              text="Daftar sebagai Mahasiswa"
              variant="solid"
              size="lg"
            />
            <Button 
              text="Cari Talent"
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            />
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-indigo-100">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} />
              <span>Gratis Daftar</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={20} />
              <span>Pembayaran Aman</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={20} />
              <span>Dukungan 24/7</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;