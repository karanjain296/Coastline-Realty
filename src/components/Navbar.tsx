import React, { useState } from 'react';
import { Building2, Search, User as UserIcon, Menu, X, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-zinc-900 tracking-tight">Coastline Realty <span className="text-emerald-600">AI</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <a href="#" className="hover:text-emerald-600 transition-colors">Buy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Sell</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Commercial</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">NRI Services</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-500 hover:text-emerald-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            {user ? (
              <div className="flex items-center gap-4">
                <button className="p-2 text-zinc-400 hover:text-emerald-600 transition-colors relative">
                  <Heart className="w-5 h-5" />
                  {user.savedProperties.length > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-600 text-white text-[10px] flex items-center justify-center rounded-full">
                      {user.savedProperties.length}
                    </span>
                  )}
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-zinc-100">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-bold text-zinc-900">{user.name}</p>
                    <button onClick={logout} className="text-[10px] text-zinc-400 hover:text-red-500 flex items-center gap-1 ml-auto">
                      <LogOut className="w-3 h-3" /> Sign Out
                    </button>
                  </div>
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                    {user.name.charAt(0)}
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all"
              >
                <UserIcon className="w-4 h-4" />
                Sign In
              </button>
            )}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-zinc-500">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-zinc-100 p-4 space-y-4">
          <a href="#" className="block px-4 py-2 text-zinc-600 font-semibold">Buy</a>
          <a href="#" className="block px-4 py-2 text-zinc-600 font-semibold">Sell</a>
          <a href="#" className="block px-4 py-2 text-zinc-600 font-semibold">Commercial</a>
          <a href="#" className="block px-4 py-2 text-zinc-600 font-semibold">NRI Services</a>
          {user ? (
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="font-bold text-zinc-900">{user.name}</span>
              </div>
              <button onClick={logout} className="p-2 text-zinc-400"><LogOut /></button>
            </div>
          ) : (
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold"
            >
              Sign In
            </button>
          )}
        </div>
      )}

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </nav>
  );
}
