"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Feather,
  LogOut,
  User,
  Home,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";
import { useState } from "react";
import Logo from "./Logo";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  console.log('Navbar - user state:', user);

  return (
    <nav className="glass-effect sticky top-0 z-40 border-b border-neutral-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <Logo size="default" />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/create"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Feather className="h-4 w-4" />
                  <span className="hidden sm:inline">Write</span>
                </Link>

                <div className="flex items-center space-x-3 bg-white/50 rounded-xl px-4 py-2">
                  <div className="h-8 w-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-sm font-medium text-neutral-700">
                      {user.name}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="btn-primary">
                  Login
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200/50 animate-slide-up">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>

              {user && (
                <Link
                  href="/create"
                  className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Feather className="h-4 w-4" />
                  <span>Write</span>
                </Link>
              )}

              <div className="px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search stories..."
                    className="pl-10 pr-4 py-2 w-full bg-neutral-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
