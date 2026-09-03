import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
          Nấu ăn không giới hạn,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">Hoàn toàn không chạm.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-600 mx-auto mb-10">
          Tạm biệt màn hình dính mỡ. Điều khiển công thức bằng cử chỉ, quản lý tủ lạnh bằng AI và tự động lên thực đơn hàng tuần chỉ trong vài giây.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/register" className="px-8 py-4 text-lg font-semibold rounded-full text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-1">
            Khám phá ngay
          </Link>
          <Link href="/playground" className="px-8 py-4 text-lg font-semibold rounded-full text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all">
            Thử nghiệm AI Playground
          </Link>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-200/30 rounded-full blur-3xl -z-10"></div>
    </section>
  );
}
