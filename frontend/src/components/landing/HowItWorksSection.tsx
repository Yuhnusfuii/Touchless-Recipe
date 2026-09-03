import React from 'react';

const steps = [
  {
    step: '01',
    title: 'Quét nguyên liệu',
    description: 'Mở điện thoại quét tủ lạnh hoặc tìm kiếm công thức bạn muốn nấu.'
  },
  {
    step: '02',
    title: 'Bật Focus Mode',
    description: 'Đặt điện thoại lên giá đỡ ở xa, màn hình sẽ hiển thị to rõ từng bước một.'
  },
  {
    step: '03',
    title: 'Ra lệnh Không chạm',
    description: 'Xòe tay vuốt ngang để chuyển bước, hoặc nói "Bước tiếp theo" để AI phục vụ bạn.'
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Cách hoạt động</h2>
          <p className="mt-4 text-lg text-gray-600">Trải nghiệm phép màu chỉ với 3 bước đơn giản</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-200 -z-10"></div>
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-3xl font-black text-emerald-500 mb-6 border-4 border-white shadow-md">
                {s.step}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-600 max-w-sm">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
