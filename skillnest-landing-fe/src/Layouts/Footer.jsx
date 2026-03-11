import React from 'react';
import { ArrowUpRight, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const socialIcons = [
    <svg key="ig" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
    <svg key="tw" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    <svg key="li" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  ];

  return (
    <footer className="relative overflow-hidden bg-white font-sans">

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

      {/* Top CTA strip */}
      <div className="border-b border-gray-100 bg-indigo-50 py-10">
        <div className="mx-auto max-w-6xl px-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Sudah siap?
              </p>
              <h3 className="punchline text-2xl font-bold text-gray-900">
                Mulai hasilkan dari skill-mu hari ini
              </h3>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-indigo-300"
            >
              Daftar Gratis <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Main content — profile only */}
      <div className="mx-auto max-w-6xl px-8 py-14">
        <div className="flex flex-wrap items-start justify-between gap-10">

          {/* Brand + description */}
          <div className="max-w-xs">
            <div className="mb-5 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="punchline text-xl font-extrabold tracking-tight text-gray-900">
                Skill<span className="text-indigo-600">Nest</span>
              </span>
            </div>
            <p className="mb-7 text-sm leading-relaxed text-gray-500">
              Platform freelance #1 untuk mahasiswa Indonesia. Bangun portofolio, hasilkan uang, raih karir impianmu.
            </p>
            <div className="flex gap-2.5">
              {socialIcons.map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-400 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-3">
            {[
              { icon: <MapPin size={14} />, text: 'Semarang, Indonesia' },
              { icon: <Mail size={14} />, text: 'contact@skillnest.site' },
              { icon: <Phone size={14} />, text: '+62 812 3456 7890' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                <span className="text-indigo-500">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 px-8 py-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} SkillNest. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            🇮🇩 Made with ❤️ for Indonesian students
          </p>
        </div>
      </div>
    </footer>
  );
}