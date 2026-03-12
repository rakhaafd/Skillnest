# SkillNest

## 📖 Deskripsi Proyek
**SkillNest** adalah platform marketplace karya siswa yang dirancang untuk mendorong kreativitas, personal branding, dan jiwa kewirausahaan.

Melalui platform ini, siswa dapat mempublikasikan dan menjual karya mereka kepada pengguna lain, sekaligus membangun reputasi melalui sistem **review dan rating**. SkillNest juga menjadi sarana pembelajaran bagi siswa untuk memahami bagaimana ekosistem **digital marketplace** bekerja.

Selain itu, proyek ini mengimplementasikan konsep **Infrastructure as a Service (IaaS)** dengan membangun serta mengelola infrastruktur server secara mandiri.

---

## 👥 Role Pengguna

### 🛠️ Admin
Admin memiliki kontrol penuh terhadap sistem, termasuk:
- Mengelola pengguna
- Mengelola karya siswa
- Menghapus review yang tidak pantas
- Mengakses **dashboard monitoring** untuk melihat statistik dan visualisasi data

### 🎓 Siswa
Siswa merupakan pengguna utama platform dengan fitur:
- Membuat, mengedit, dan menghapus karya (**CRUD karya**)
- Membeli karya dari siswa lain
- Memberikan **review, rating, dan komentar**

Rating yang diberikan akan mempengaruhi reputasi siswa sebagai kreator di dalam platform.

---

## ⭐ Fitur Utama
- 🔐 **Authentication** — Sistem login untuk mengamankan akses pengguna  
- 🎨 **Manajemen Karya** — CRUD karya yang dipublikasikan siswa
- 💳 **Pembayaran** — Sistem pembayaran yang sepenuhnya diatur oleh pengguna
- 💬 **Review & Rating** — Feedback pengguna setelah transaksi  
- 👤 **Profile Customization** — Pengaturan profil untuk personal branding  
- 📊 **Monitoring System** — Dashboard untuk memantau aktivitas dan statistik platform  

---

## 🌐 Arsitektur DNS & Subdomain

SkillNest menggunakan beberapa **subdomain** untuk memisahkan layanan agar lebih modular dan mudah dikelola.

| Subdomain | Fungsi |
|-----------|--------|
| **skillnest.site** | Landing page utama platform |
| **market.skillnest.site** | Marketplace tempat siswa mempublikasikan dan membeli karya |
| **admin.skillnest.site** | Dashboard admin untuk manajemen sistem |
| **api.skillnest.site** | Backend API berbasis Laravel yang melayani seluruh request aplikasi |
| **monitoring.skillnest.site** | Dashboard monitoring server menggunakan Cacti |

DNS untuk domain ini dikonfigurasi menggunakan **BIND9** pada server.

---

## 🧰 Teknologi yang Digunakan

| Kategori | Teknologi |
|--------|-----------|
| Backend | Laravel API |
| Frontend | React.js, TailwindCSS, Axios |
| Web Server | Apache2 |
| DNS Server | BIND9 |
| Database | MySQL |
| Mail Server | Postfix, Dovecot |
| Proxy | Squid |
| Remote Access | SSH |
| File Transfer | SFTP |
| Monitoring | Cacti |

---

## 🎯 Tujuan Proyek
Proyek ini bertujuan untuk memahami implementasi **Infrastructure as a Service (IaaS)** dengan membangun dan mengelola infrastruktur server secara mandiri, termasuk:

- Konfigurasi **Web Server dan DNS**
- Pengelolaan **Mail Server**
- Monitoring server
- Implementasi **Proxy Server**
- Integrasi backend dan frontend
- Deployment aplikasi pada server

---

## 📝 Catatan
Project ini dibuat sebagai bagian dari pembelajaran **infrastruktur server dan pengembangan web**, di mana seluruh layanan server dikonfigurasi secara mandiri untuk memahami implementasi **IaaS** secara praktis.
