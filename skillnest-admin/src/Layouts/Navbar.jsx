import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Button from '../Components/Button';

const Navbar = ({ isLoggedIn, user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <a
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center"
          >
            <div className="punchline text-2xl font-bold text-indigo-600">
              <a href="/dashboard">Admin SkillNest</a>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/dashboard"
              className="text-gray-600 hover:font-semibold"
            >
              Home
            </a>

            <a
              href="/users"
              className="text-gray-600 hover:font-semibold"
            >
              Users
            </a>
            <a
              href="/items"
              className="text-gray-600 hover:font-semibold"
            >
              Items
            </a>

             <Button
                    text="Logout"
                    variant="danger"
                    fullWidth
                    onClick={() => {
                      handleLogout(); 
                      setIsOpen(false);
                    }}
                  />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
          </div>

        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">

              <a
                href="/dashboard"
                className="text-gray-600 hover:font-semibold px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Home
              </a>

              <a
                href="/users"
                className="text-gray-600 hover:font-semibold px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Users
              </a>

              <a
                href="/items"
                className="text-gray-600 hover:font-semibold px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Items
              </a>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;