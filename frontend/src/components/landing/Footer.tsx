import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            T
          </div>
          <span className="text-xl font-bold text-gray-900">Touchless Recipe</span>
        </div>
        <div className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Touchless Recipe. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-emerald-500 transition-colors">Điều khoản</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Bảo mật</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Liên hệ</a>
        </div>
      </div>
    </footer>
  );
}
