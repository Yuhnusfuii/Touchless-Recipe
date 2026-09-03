import React from 'react';

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl mb-12">Người dùng nói gì?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-emerald-800/50 p-8 rounded-2xl backdrop-blur-sm border border-emerald-700/50 text-left">
            <p className="text-lg italic text-emerald-50 mb-6">"Từ ngày dùng app, mình không còn lo tay ướt làm hỏng điện thoại hay phải rửa tay liên tục mỗi khi chuyển bước công thức nữa. Thực sự thay đổi cách mình nấu ăn!"</p>
            <div className="font-bold text-emerald-400">Minh Ngọc</div>
            <div className="text-emerald-200 text-sm">Nội trợ</div>
          </div>
          <div className="bg-emerald-800/50 p-8 rounded-2xl backdrop-blur-sm border border-emerald-700/50 text-left">
            <p className="text-lg italic text-emerald-50 mb-6">"Tính năng quét tủ lạnh sinh công thức quá đỉnh. Cuối tuần dọn tủ lạnh gom đồ thừa quăng vào app là có ngay món mới ăn siêu ngon mà không bị phí đồ."</p>
            <div className="font-bold text-emerald-400">Hoàng Nam</div>
            <div className="text-emerald-200 text-sm">Sinh viên IT</div>
          </div>
        </div>
      </div>
    </section>
  );
}
