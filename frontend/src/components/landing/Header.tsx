import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            T
          </div>
          <span className="text-xl font-bold text-gray-900">Touchless Recipe</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="#features" className="hover:text-emerald-500 transition-colors">Tính năng</Link>
          <Link href="#how-it-works" className="hover:text-emerald-500 transition-colors">Cách hoạt động</Link>
          <Link href="/playground" className="hover:text-emerald-500 transition-colors text-emerald-600">AI Playground</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
            Đăng nhập
          </Link>
          <Link href="/register" className="text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full transition-colors shadow-sm shadow-emerald-500/30">
            Bắt đầu nấu
          </Link>
        </div>
      </div>
    </header>
  );
}
