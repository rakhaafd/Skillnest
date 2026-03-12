import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import { FaInstagram, FaXTwitter, FaLinkedin } from "react-icons/fa6";

export default function Footer() {

  const socialIcons = [
    { icon: FaInstagram, link: "#" },
    { icon: FaXTwitter, link: "#" },
    { icon: FaLinkedin, link: "#" },
  ];

  return (
    <footer className="relative overflow-hidden bg-white font-sans">

      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-8 py-14">
        <div className="flex flex-wrap items-start justify-between gap-10">

          {/* Brand */}
          <div className="max-w-xs">
            <div className="mb-5 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>

              <span className="text-xl font-extrabold tracking-tight text-gray-900">
                Skill<span className="text-indigo-600">Nest</span>
              </span>
            </div>

            <p className="mb-7 text-sm leading-relaxed text-gray-500">
              Platform freelance #1 untuk mahasiswa Indonesia. Bangun portofolio,
              hasilkan uang, raih karir impianmu.
            </p>

            {/* Social Icons */}
            <div className="flex gap-2.5">
              {socialIcons.map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href={item.link}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-400 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Contact */}
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