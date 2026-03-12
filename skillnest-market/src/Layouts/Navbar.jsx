import React, { useState } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';
import Button from '../Components/Button';

const Navbar = ({ isLoggedIn, user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const Avatar = ({ size = 'md' }) => {
    const dim = size === 'sm' ? 'w-7 h-7 text-[10px]' : 'w-8 h-8 text-xs';
    return (
      <div className={`${dim} rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center overflow-hidden flex-shrink-0`}>
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-bold text-indigo-600">
            {user?.name?.charAt(0).toUpperCase() ?? <User size={12} />}
          </span>
        )}
      </div>
    );
  };

  return (
    <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <a href="/" onClick={() => setIsOpen(false)} className="punchline flex items-center">
            <div className="text-2xl font-bold text-indigo-600">SkillNest</div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="http://skillnest.site" className="text-gray-600 hover:font-semibold transition">
              Home
            </a>
            <a href="/" className="text-gray-600 hover:font-semibold transition">
              Marketplace
            </a>
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <a
                  href="/profile"
                  className="flex items-center gap-2.5 px-3 py-1 rounded-xl transition-colors group bg-gray-200 hover:bg-gray-300"
                >
                  <Avatar />
                  <span className="text-sm text-gray-600">
                    Hi, <span className="font-semibold text-gray-800">{user?.name}</span>
                  </span>
                </a>
                <Button
                  text="Logout"
                  variant="danger"
                  size="sm"
                  icon={<LogOut size={14} />}
                  onClick={handleLogout}
                />
              </>
            ) : (
              <>
                <a href="/login">
                  <Button text="Sign In" variant="outline" size="sm" />
                </a>
                <a href="/register">
                  <Button text="Register" variant="solid" size="sm" />
                </a>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-1">

              <a
                href="http://skillnest.site"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2.5 rounded-lg text-sm transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </a>
              <a
                href="/"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2.5 rounded-lg text-sm transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Marketplace
              </a>

              <div className="pt-3 mt-1 border-t border-gray-100">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <a
                      href="/profile"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Avatar size="sm" />
                      <span className="text-sm text-gray-600">
                        Hi, <span className="font-semibold text-gray-800">{user?.name}</span>
                      </span>
                    </a>
                    <Button
                      text="Logout"
                      variant="ghost"
                      size="sm"
                      icon={<LogOut size={14} />}
                      fullWidth
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="justify-start px-3 text-gray-500 hover:text-red-500"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-1 px-1">
                    <a href="/login">
                      <Button text="Sign In" variant="outline" fullWidth />
                    </a>
                    <a href="/register">
                      <Button text="Register" variant="solid" fullWidth />
                    </a>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;