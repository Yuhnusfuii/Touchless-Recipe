import React from 'react';

const features = [
  {
    title: 'Nấu ăn Không Chạm',
    description: 'Chuyển bước công thức bằng cử chỉ tay, AI đọc hướng dẫn bằng giọng nói, không bao giờ lo bẩn màn hình.',
    icon: '🪄'
  },
  {
    title: 'Tủ lạnh AI thông minh',
    description: 'Chụp ảnh tủ lạnh, AI tự động nhận diện nguyên liệu, cảnh báo hết hạn và gợi ý món ăn từ đồ thừa.',
    icon: '🧊'
  },
  {
    title: 'Lên thực đơn & Đi chợ',
    description: 'Tự động tính toán lượng Kcal mục tiêu, lên menu tuần và tạo danh sách đi chợ hoàn toàn tự động.',
    icon: '📅'
  },
  {
    title: 'Cộng đồng Đầu bếp',
    description: 'Chia sẻ thành quả nấu nướng, giữ chuỗi ngày tự nấu ăn (Streak) và theo dõi các Chef nổi tiếng khác.',
    icon: '👨‍🍳'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Trợ lý bếp thông minh toàn diện</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Mọi tính năng bạn cần để biến việc nấu ăn hàng ngày trở nên thú vị và dễ dàng hơn bao giờ hết.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
