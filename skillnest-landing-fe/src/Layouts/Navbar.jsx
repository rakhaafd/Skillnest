import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Components/Button';
import { Menu, X } from 'lucide-react';
import { FaShoppingCart } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { name: "About", href: "/#about", section: "about" },
    { name: "Featured", href: "/#featured", section: "featured" },
    { name: "Testimonials", href: "/#testimonials", section: "testimonials" }
  ];

  const handleScroll = (e, sectionId) => {
    e.preventDefault();
    setIsOpen(false);
    
    // Cek apakah sedang di halaman home
    if (window.location.pathname !== '/') {
      // Jika tidak di home, redirect ke home dengan hash
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center"
          >
            <div className="punchline text-2xl font-bold text-indigo-600">SkillNest</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => {
              if (link.href.startsWith('/market')) {
                return (
                  <Link
                    key={index}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-gray-600 hover:text-gray-900 transition cursor-pointer"
                  >
                    {link.name}
                  </Link>
                );
              }
              
              return (
                <a
                  key={index}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.section)}
                  className="text-gray-600 hover:text-gray-900 transition cursor-pointer"
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Desktop Buttons - PASTIKAN PATH INI BENAR */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="http://market.skillnest.site">
              <Button 
                text="Marketplace" 
                variant="solid"
                icon={<FaShoppingCart className="text-sm" />}
                size="sm"
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link, index) => {
                if (link.href.startsWith('/market')) {
                  return (
                    <Link
                      key={index}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-gray-600 hover:text-gray-900 px-2 py-1 cursor-pointer"
                    >
                      {link.name}
                    </Link>
                  );
                }
                
                return (
                  <a
                    key={index}
                    href={link.href}
                    onClick={(e) => {
                      handleScroll(e, link.section);
                      setIsOpen(false);
                    }}
                    className="text-gray-600 hover:text-gray-900 px-2 py-1 cursor-pointer"
                  >
                    {link.name}
                  </a>
                );
              })}
              {/* Mobile Menu Buttons - PASTIKAN PATH INI BENAR */}
              <div className="flex flex-col space-y-2 pt-4">
                <Link to="http://market.skillnest.site" onClick={() => setIsOpen(false)}>
                  <Button 
                    text="MarketPlace" 
                    variant="solid"
                    fullWidth
                  />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}