/* ==========================================================================
   gkbp-data.js — Kho dữ liệu dùng chung của website Gắn Kết Bốn Phương
   Dự án: "Gắn kết bốn phương – Đồng hành mọi nẻo đường"
   Nội dung: thương hiệu, 6 nhóm sự cố, danh mục dịch vụ / gói / phụ tùng,
             khu vực phục vụ, đối tác thợ, hạng thợ, chỉ mục blog, trang.
   Thứ tự load: jquery → bootstrap → gkbp-core → gkbp-data → (trang) → gkbp-search
   ========================================================================== */
(function (W) {
  'use strict';

  /* ---------- Thương hiệu ---------- */
  var BRAND = {
    name: 'Gắn Kết Bốn Phương',
    slogan: 'Đồng hành mọi nẻo đường',
    hotline: '0345 264 103',
    hotlineRaw: '0345264103',
    email: 'vonam583@gmail.com',
    address: '12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, TP. Hồ Chí Minh',
    vision: 'Trở thành “lá chắn số” đáng tin cậy cho mọi hành trình giao thông tại Việt Nam, nơi không ai bị bỏ lại giữa đường.',
    mission: ['Kết nối minh bạch', 'Hỗ trợ tức thì', 'Nâng tầm uy tín'],
    values: ['Trung thực', 'Minh bạch', 'Tôn trọng', 'Trách nhiệm'],
    uvpCustomer: 'Cứu hộ nhanh trong 15 phút – Minh bạch giá – An tâm chất lượng',
    uvpMechanic: 'Gia tăng thu nhập từ thời gian rảnh – Mở rộng tệp khách hàng số – Bảo vệ quyền lợi',
    sla: { accept: 3, arrive: 15, acceptRate: 95, cancelMax: 5, radius: '3–5 km' }
  };

  /* ---------- Loại phương tiện ---------- */
  var VEHICLES = ['Xe máy', 'Ô tô', 'Xe điện', 'Mọi loại xe'];

  /* ---------- 6 nhóm sự cố cốt lõi (dùng cho nút SOS, trang chủ, trợ lý triệu chứng) ---------- */
  var INCIDENTS = [
    { id: 'lop', icon: 'fa-life-ring', emoji: '🛞', name: 'Thủng / xì lốp', short: 'Vá lốp, thay ruột, thay lốp dự phòng', moto: 120000, car: 250000, svc: { moto: 'ch01', car: 'ch02' } },
    { id: 'binh', icon: 'fa-car-battery', emoji: '🔋', name: 'Hết bình ắc quy', short: 'Kích bình, kiểm tra sạc, thay ắc quy', moto: 150000, car: 300000, svc: { moto: 'ch03', car: 'ch04' } },
    { id: 'may', icon: 'fa-cogs', emoji: '⚙️', name: 'Chết máy, không khởi động', short: 'Kiểm tra bugi, xăng, điện, chẩn đoán lỗi', moto: 150000, car: 350000, svc: { moto: 'ch05', car: 'ch06' } },
    { id: 'xang', icon: 'fa-gas-pump', emoji: '⛽', name: 'Hết xăng giữa đường', short: 'Tiếp nhiên liệu tận nơi, kiểm tra rò rỉ', moto: 80000, car: 200000, svc: { moto: 'ch07', car: 'ch08' } },
    { id: 'khoa', icon: 'fa-key', emoji: '🔑', name: 'Mất / quên chìa khóa', short: 'Mở khóa, làm chìa, mở cửa xe', moto: 200000, car: 400000, svc: { moto: 'ch09', car: 'ch10' } },
    { id: 'keo', icon: 'fa-truck-pickup', emoji: '🚛', name: 'Cần kéo xe', short: 'Kéo xe về tiệm, xe sàn trượt cho ô tô', moto: 200000, car: 800000, svc: { moto: 'ch11', car: 'ch12' } }
  ];

  /* ---------- Danh mục dịch vụ ---------- */
  var CATS = [
    { id: 'Cứu hộ khẩn cấp', icon: 'fa-life-ring', emoji: '🚨', color: '#FA7806', desc: '6 sự cố thường gặp, thợ đến trong khoảng 15 phút' },
    { id: 'Sửa chữa tại chỗ', icon: 'fa-tools', emoji: '🔧', color: '#0D4076', desc: 'Bugi, phanh, điện, dây curoa… sửa ngay tại vị trí' },
    { id: 'Bảo dưỡng tại nhà', icon: 'fa-oil-can', emoji: '🛢️', color: '#1E5C9E', desc: 'Đặt lịch, thợ đến tận nhà hoặc nơi làm việc' },
    { id: 'Xe điện', icon: 'fa-charging-station', emoji: '⚡', color: '#10b981', desc: 'Sạc lưu động, kiểm tra pin, cứu hộ xe máy điện' },
    { id: 'Gói thành viên', icon: 'fa-shield-alt', emoji: '🛡️', color: '#E06400', desc: 'Lá Chắn Số – bảo vệ cả năm, ưu tiên điều phối' },
    { id: 'Phụ tùng & Phụ kiện', icon: 'fa-box-open', emoji: '📦', color: '#0A2B54', desc: 'Lốp, ắc quy, nhớt, bộ vá lốp – lắp tận nơi' }
  ];

  /* helpers */
  function S(t, h, d, tip) { return { t: t, h: h, d: d, tip: tip || '' }; }
  function R(name, loc, date, rate, text, verified) { return { name: name, loc: loc, date: date, rate: rate, text: text, verified: verified !== false }; }
  function H(icon, label, value) { return { icon: icon, label: label, value: value }; }
  function vnd(n) { return n.toLocaleString('vi-VN') + 'đ'; }
  function imgs(id) { return ['img/dv/' + id + '-1.jpg', 'img/dv/' + id + '-2.jpg', 'img/dv/' + id + '-3.jpg']; }

  /* Quy trình chuẩn 8 bước của dự án, rút gọn cho từng nhóm */
  function rescueSteps(issue, fix, tipFix) {
    return [
      S('Phút 0', 'Báo sự cố trên web/app', 'Chọn “' + issue + '”, ghim vị trí GPS, chụp 1–2 ảnh phương tiện. Không cần cài app – gửi yêu cầu ngay trên trình duyệt.', 'Dắt xe sát lề, bật đèn cảnh báo; buổi tối hãy đứng ở nơi có ánh sáng.'),
      S('Dưới 3 phút', 'Ghép thợ trong bán kính 3–5 km', 'Hệ thống ưu tiên thợ gần nhất, đang sẵn sàng và có kỹ năng phù hợp. Bạn thấy tên, ảnh, hạng thợ, điểm đánh giá và lý do “Vì sao là thợ này?”.', 'Nếu chưa có thợ phù hợp, phạm vi tìm kiếm tự mở rộng.'),
      S('~15 phút', 'Thợ đến & kiểm tra thực tế', 'Theo dõi thợ trên bản đồ theo thời gian thực. Khi gặp, đối chiếu mã gặp mặt 4 số trước khi giao xe.', 'Không giao xe nếu mã gặp mặt không khớp – bấm SOS ngay.'),
      S('Trước khi làm', 'Báo giá & xác nhận', 'Thợ ghi rõ chi phí di chuyển, nhân công, phụ tùng (nếu có) trên ứng dụng. Bạn duyệt giá rồi thợ mới thực hiện.', 'Giá không vượt giá trần đã hiển thị nếu không phát sinh hạng mục mới.'),
      S('Thực hiện', fix.h, fix.d, tipFix),
      S('Hoàn tất', 'Nghiệm thu, thanh toán & đánh giá', 'Xem ảnh trước – sau trong “hộp đen chuyến cứu hộ”, thanh toán ví/thẻ/tiền mặt và chấm điểm thợ theo 4 tiêu chí.', 'Hóa đơn điện tử và phiếu bảo hành được lưu trong Garage số của bạn.')
    ];
  }
  function homeSteps(job, jobD, tip) {
    return [
      S('Bước 1', 'Đặt lịch theo khung giờ', 'Chọn ngày, khung giờ và địa chỉ (nhà, công ty, ký túc xá). Có thể đặt trước tối đa 14 ngày.', 'Đặt trước 1 ngày để được chọn thợ quen.'),
      S('Bước 2', 'Xác nhận thợ & vật tư', 'Hệ thống gửi thông tin thợ, danh sách vật tư dự kiến và giá trọn gói trước khi đến.', 'Bạn có thể yêu cầu dùng phụ tùng chính hãng hoặc tương đương.'),
      S('Bước 3', job, jobD, tip),
      S('Bước 4', 'Kiểm tra sau bảo dưỡng', 'Chạy thử, đối chiếu checklist, chụp ảnh từng hạng mục và cập nhật vào sổ bảo dưỡng điện tử.', 'Ứng dụng nhắc lịch bảo dưỡng lần sau theo số km.'),
      S('Bước 5', 'Thanh toán & bảo hành', 'Thanh toán không tiền mặt hoặc tiền mặt, nhận phiếu bảo hành điện tử ngay trên tài khoản.', '')
    ];
  }
  function shopSteps(product, fit) {
    return [
      S('Bước 1', 'Chọn sản phẩm & phương án nhận', 'Chọn ' + product + ', số lượng và hình thức: giao tận nơi hoặc thợ mang đến lắp đặt.', ''),
      S('Bước 2', 'Đối chiếu thông số xe', 'Nhập dòng xe hoặc chọn xe trong Garage số để hệ thống kiểm tra độ tương thích.', 'Sai thông số? Được đổi miễn phí trong 7 ngày.'),
      S('Bước 3', 'Giao hàng / lắp đặt', fit, ''),
      S('Bước 4', 'Bảo hành điện tử', 'Phiếu bảo hành gắn với tài khoản và biển số, không lo thất lạc giấy tờ.', '')
    ];
  }

  var M = { y: 'Tháng 10, 2026', s: 'Tháng 9, 2026', a: 'Tháng 8, 2026', j: 'Tháng 7, 2026' };

  /* ---------- Tùy chọn đặt dịch vụ ---------- */
  var OPT_MOTO = [{ id: 'so', label: 'Xe số', add: 0 }, { id: 'ga', label: 'Xe tay ga', add: 0 }, { id: 'con', label: 'Xe côn tay', add: 20000 }, { id: 'pkl', label: 'Phân khối lớn (>175cc)', add: 60000 }];
  var OPT_CAR = [{ id: 'c5', label: 'Ô tô 4–5 chỗ', add: 0 }, { id: 'c7', label: 'Ô tô 7 chỗ / SUV', add: 50000 }, { id: 'ban', label: 'Bán tải', add: 80000 }];
  var OPT_EV = [{ id: 'evm', label: 'Xe máy điện', add: 0 }, { id: 'evd', label: 'Xe đạp điện', add: -20000 }];
  var OPT_ALL = [{ id: 'xm', label: 'Xe máy', add: 0 }, { id: 'ot', label: 'Ô tô', add: 0 }];

  var SERVICES = [
    /* ═══════ CỨU HỘ KHẨN CẤP (12) ═══════ */
    {
      id: 'ch01', cat: 'Cứu hộ khẩn cấp', loc: 'Xe máy', time: '~15 phút', priceNum: 120000, unit: '/lượt', badge: 'Phổ biến', warranty: '7 ngày',
      title: 'Vá lốp xe máy tận nơi',
      desc: 'Thủng lốp, xì lốp giữa đường? Thợ gần nhất trong bán kính 3–5 km mang đồ nghề đến tận nơi, vá lốp không săm hoặc thay ruột ngay tại chỗ, báo giá trước khi làm.',
      highlights: [H('⏱️', 'Thợ đến', '~15 phút'), H('🛞', 'Loại lốp', 'Có săm & không săm'), H('💰', 'Giá trần', '120.000đ'), H('🛡️', 'Bảo hành', '7 ngày')],
      included: ['Phí di chuyển trong bán kính 5 km', 'Kiểm tra toàn bộ vỏ, van và vành', 'Vá 1 điểm thủng bằng miếng vá nấm/keo chuyên dụng', 'Bơm lại đúng áp suất khuyến nghị', 'Ảnh trước – sau lưu trong hộp đen chuyến cứu hộ'],
      excluded: ['Ruột hoặc lốp mới (báo giá riêng nếu cần thay)', 'Điểm thủng thứ 2 trở đi (+30.000đ/điểm)', 'Quãng đường ngoài 5 km (+10.000đ/km)'],
      itinerary: rescueSteps('Thủng / xì lốp', { h: 'Vá lốp & bơm chuẩn áp suất', d: 'Tháo vật nhọn, làm sạch, vá nấm hoặc keo, bơm đúng áp suất rồi thử rò rỉ bằng nước xà phòng.' }, 'Vết thủng dưới 6 mm vá nấm dùng được lâu dài; lớn hơn nên thay lốp.'),
      reviews: [R('Minh Khang', 'Quận 1', M.y, 5, 'Thủng lốp lúc 10 giờ đêm trên đường Lê Lợi, 12 phút sau thợ tới, vá xong còn bơm lại bánh trước giúp mình.'), R('Thu Trang', 'Quận 3', M.s, 5, 'Giá đúng như app báo, có ảnh trước sau rõ ràng. Lần đầu sửa xe mà không sợ bị “chặt chém”.'), R('Quốc Bảo', 'Quận 10', M.a, 4, 'Thợ đến nhanh, vá kỹ. Trừ 1 sao vì hôm đó mưa nên phải chờ thêm vài phút.'), R('Hải Yến', 'Bình Thạnh', M.j, 5, 'Mã gặp mặt giúp mình yên tâm hơn hẳn khi đi một mình buổi tối.', false)]
    },
    {
      id: 'ch02', cat: 'Cứu hộ khẩn cấp', loc: 'Ô tô', time: '~20 phút', priceNum: 250000, unit: '/lượt', warranty: '7 ngày',
      title: 'Thay lốp dự phòng ô tô',
      desc: 'Xe nổ lốp hoặc xẹp lốp trên đường? Kỹ thuật viên mang kích nâng, cờ lê lực đến thay lốp dự phòng an toàn, kiểm tra áp suất 4 bánh và đặt cảnh báo phía sau xe.',
      highlights: [H('⏱️', 'Thợ đến', '~20 phút'), H('🔧', 'Dụng cụ', 'Kích thủy lực, cờ lê lực'), H('💰', 'Giá trần', '250.000đ'), H('🚧', 'An toàn', 'Đặt tam giác cảnh báo')],
      included: ['Phí di chuyển trong bán kính 5 km', 'Tháo lốp hỏng, lắp lốp dự phòng của xe', 'Siết ốc bằng cờ lê lực đúng mô-men', 'Kiểm tra áp suất cả 4 bánh và lốp dự phòng', 'Đặt tam giác cảnh báo trong lúc thao tác'],
      excluded: ['Lốp mới (có thể đặt kèm trong mục Phụ tùng)', 'Vá lốp không săm tại chỗ (+100.000đ)', 'Xe không có lốp dự phòng (chuyển sang gói kéo xe)'],
      itinerary: rescueSteps('Thủng / xì lốp', { h: 'Thay lốp dự phòng đúng kỹ thuật', d: 'Kê chèn bánh, nâng xe đúng điểm kích, thay lốp và siết chéo các ốc bằng cờ lê lực.' }, 'Lốp dự phòng loại nhỏ chỉ nên chạy dưới 80 km/h và dưới 80 km quãng đường.'),
      reviews: [R('Anh Tuấn', 'Quận 1', M.y, 5, 'Nổ lốp gần cầu Khánh Hội, kỹ thuật viên đến trong 18 phút, làm rất bài bản, có đặt biển cảnh báo.'), R('Ngọc Hân', 'Quận 3', M.s, 5, 'Mình là nữ, không biết thay lốp. Thợ lịch sự, giải thích từng bước, còn chỉ cách kiểm tra áp suất.'), R('Trọng Nghĩa', 'Phú Nhuận', M.a, 4, 'Giá hợp lý so với gọi cứu hộ ngoài. App báo vị trí thợ chính xác.')]
    },
    {
      id: 'ch03', cat: 'Cứu hộ khẩn cấp', loc: 'Xe máy', time: '~15 phút', priceNum: 150000, unit: '/lượt', badge: 'Phổ biến', warranty: '3 ngày',
      title: 'Kích bình ắc quy xe máy',
      desc: 'Đề không lên, đèn còi yếu sau nhiều ngày không chạy? Thợ mang bộ kích bình đến nổ máy cho xe, đo điện áp sạc và tư vấn có cần thay ắc quy hay không.',
      highlights: [H('⏱️', 'Thợ đến', '~15 phút'), H('🔋', 'Đo kiểm', 'Điện áp & dòng sạc'), H('💰', 'Giá trần', '150.000đ'), H('🧾', 'Báo cáo', 'Tình trạng ắc quy')],
      included: ['Phí di chuyển trong bán kính 5 km', 'Kích bình nổ máy bằng bộ kích chuyên dụng', 'Đo điện áp tĩnh và điện áp sạc khi nổ máy', 'Vệ sinh, siết lại cọc bình', 'Tư vấn thay ắc quy nếu bình đã chai'],
      excluded: ['Ắc quy mới (từ 350.000đ, lắp ngay nếu đồng ý)', 'Sửa bộ sạc/IC (báo giá sau kiểm tra)'],
      itinerary: rescueSteps('Hết bình ắc quy', { h: 'Kích bình & đo hệ thống sạc', d: 'Đấu kẹp đúng cực, nổ máy, đo điện áp ở 3 mức vòng tua để biết lỗi do bình hay do bộ sạc.' }, 'Sau khi kích nên chạy liên tục 20–30 phút để bình nạp lại.'),
      reviews: [R('Gia Huy', 'Quận 10', M.y, 5, 'Xe để cả tuần không đề được, thợ tới kích 5 phút là chạy, còn đo giúp bộ sạc vẫn tốt.'), R('Mai Phương', 'Quận 1', M.s, 5, 'Thợ không ép thay bình mà nói rõ bình còn dùng được, rất trung thực.'), R('Văn Lộc', 'Gò Vấp', M.a, 4, 'Nhanh và gọn, có hóa đơn điện tử gửi về email.')]
    },
    {
      id: 'ch04', cat: 'Cứu hộ khẩn cấp', loc: 'Ô tô', time: '~20 phút', priceNum: 300000, unit: '/lượt', warranty: '3 ngày',
      title: 'Kích bình & thay ắc quy ô tô',
      desc: 'Quên tắt đèn, xe để lâu ngày hay ắc quy hết tuổi thọ – kỹ thuật viên đến kích bình bằng bộ booster, kiểm tra máy phát và thay ắc quy mới ngay tại chỗ nếu cần.',
      highlights: [H('⏱️', 'Thợ đến', '~20 phút'), H('⚡', 'Thiết bị', 'Booster 12V chuyên dụng'), H('💰', 'Giá trần', '300.000đ'), H('🔍', 'Kiểm tra', 'Máy phát & dòng rò')],
      included: ['Phí di chuyển trong bán kính 5 km', 'Kích bình bằng booster, không cần xe khác', 'Đo sức khỏe ắc quy bằng máy test CCA', 'Kiểm tra điện áp máy phát', 'Gợi ý dung lượng ắc quy phù hợp nếu cần thay'],
      excluded: ['Ắc quy mới (báo giá theo dung lượng)', 'Xử lý dòng rò điện phức tạp (đặt lịch riêng)'],
      itinerary: rescueSteps('Hết bình ắc quy', { h: 'Kích bình & test CCA', d: 'Dùng booster để khởi động, sau đó đo CCA, điện áp máy phát và dòng rò khi tắt máy.' }, 'Ắc quy ô tô thường dùng 2–3 năm; nếu CCA dưới 60% nên thay sớm.'),
      reviews: [R('Đức Anh', 'Quận 3', M.y, 5, 'Xe chết máy ở bãi giữ xe chung cư, thợ tới nhanh, test bình và thay luôn bình mới, giá rõ ràng.'), R('Phương Linh', 'Quận 1', M.a, 5, 'Rất chuyên nghiệp, có máy đo in kết quả gửi qua app.'), R('Hoàng Long', 'Bình Thạnh', M.j, 4, 'Ổn, thợ đến hơi trễ 5 phút do kẹt xe nhưng có báo trước.')]
    },
    {
      id: 'ch05', cat: 'Cứu hộ khẩn cấp', loc: 'Xe máy', time: '~15 phút', priceNum: 150000, unit: '/lượt', warranty: '7 ngày',
      title: 'Xe máy chết máy, không khởi động',
      desc: 'Xe tắt máy giữa đường, đề nổ không lên hoặc nổ rồi tắt? Thợ kiểm tra theo quy trình 3 bước: nhiên liệu – đánh lửa – điện, xử lý tại chỗ các lỗi phổ biến như bugi, lọc gió, nghẹt xăng.',
      highlights: [H('⏱️', 'Thợ đến', '~15 phút'), H('🧪', 'Chẩn đoán', '3 bước có checklist'), H('💰', 'Phí kiểm tra', '150.000đ'), H('📷', 'Minh bạch', 'Ảnh lỗi trước khi sửa')],
      included: ['Phí di chuyển trong bán kính 5 km', 'Kiểm tra bugi, lọc gió, bơm xăng, hệ thống điện', 'Xử lý tại chỗ các lỗi đơn giản (vệ sinh bugi, thông nghẹt)', 'Báo giá chi tiết nếu phải thay linh kiện', 'Tư vấn kéo xe nếu không thể xử lý tại chỗ'],
      excluded: ['Linh kiện thay thế (bugi, IC, bơm xăng… báo giá riêng)', 'Sửa chữa lớn động cơ (chuyển về xưởng đối tác)'],
      itinerary: rescueSteps('Chết máy, không khởi động', { h: 'Chẩn đoán 3 bước & xử lý', d: 'Kiểm tra nhiên liệu → đánh lửa → điện. Lỗi xử lý được tại chỗ sẽ sửa ngay; lỗi lớn sẽ đề xuất kéo về xưởng.' }, 'Đừng đề liên tục quá 5 giây/lần – dễ làm cạn ắc quy và nóng củ đề.'),
      reviews: [R('Thanh Tâm', 'Quận 10', M.y, 5, 'Xe tắt máy giữa ngã tư 3/2, thợ tới thay bugi là chạy ngay, tổng chi phí đúng như báo giá.'), R('Bảo Ngọc', 'Quận 3', M.s, 4, 'Thợ giải thích rõ lỗi, có gửi ảnh bugi bị muội.'), R('Kim Long', 'Quận 1', M.a, 5, 'Đi làm sáng sớm xe không nổ, đặt trên web không cần cài app, rất tiện.')]
    },
    {
      id: 'ch06', cat: 'Cứu hộ khẩn cấp', loc: 'Ô tô', time: '~20 phút', priceNum: 350000, unit: '/lượt', warranty: '7 ngày',
      title: 'Ô tô không nổ máy – chẩn đoán OBD tại chỗ',
      desc: 'Đèn check engine sáng, xe đề không nổ hoặc rung giật bất thường? Kỹ thuật viên dùng máy chẩn đoán OBD-II đọc mã lỗi, khoanh vùng nguyên nhân và xử lý các lỗi có thể khắc phục ngay.',
      highlights: [H('⏱️', 'Thợ đến', '~20 phút'), H('💻', 'Thiết bị', 'Máy đọc lỗi OBD-II'), H('💰', 'Giá trần', '350.000đ'), H('📄', 'Kết quả', 'Báo cáo mã lỗi')],
      included: ['Phí di chuyển trong bán kính 5 km', 'Đọc và giải thích mã lỗi OBD-II', 'Kiểm tra ắc quy, củ đề, hệ thống nhiên liệu', 'Xử lý các lỗi đơn giản tại chỗ', 'Báo cáo lỗi lưu trong Garage số'],
      excluded: ['Linh kiện thay thế', 'Sửa chữa cần nâng hạ, tháo máy (chuyển về xưởng đối tác)'],
      itinerary: rescueSteps('Chết máy, không khởi động', { h: 'Đọc lỗi OBD & khoanh vùng', d: 'Cắm máy đọc lỗi, đối chiếu dữ liệu cảm biến trực tiếp, xóa lỗi tạm thời và chạy thử.' }, 'Không nên cố đề liên tục khi đèn check engine nhấp nháy.'),
      reviews: [R('Minh Quân', 'Quận 1', M.y, 5, 'Máy đọc lỗi cho thấy cảm biến trục cam, thợ giải thích dễ hiểu và đề xuất xưởng gần nhất.'), R('Thùy Dung', 'Phú Nhuận', M.s, 4, 'Có báo cáo PDF rất chuyên nghiệp, mang ra hãng sửa tiếp được luôn.'), R('Việt Hoàng', 'Quận 3', M.j, 5, 'Xe chỉ bị lỏng cọc bình, thợ xử lý trong 10 phút.')]
    },
    {
      id: 'ch07', cat: 'Cứu hộ khẩn cấp', loc: 'Xe máy', time: '~15 phút', priceNum: 80000, unit: '/lượt', warranty: '—',
      title: 'Tiếp xăng tận nơi cho xe máy',
      desc: 'Kim xăng chạm vạch đỏ và cây xăng còn xa? Thợ mang 2 lít xăng trong can chuyên dụng đến tận nơi, đổ xăng an toàn và giúp bạn nổ máy đi tiếp.',
      highlights: [H('⏱️', 'Thợ đến', '~15 phút'), H('⛽', 'Nhiên liệu', '2 lít xăng RON 95'), H('💰', 'Phí dịch vụ', '80.000đ'), H('🧯', 'An toàn', 'Can xăng đạt chuẩn')],
      included: ['Phí di chuyển trong bán kính 5 km', 'Can chứa xăng đạt chuẩn, chống tràn', 'Đổ xăng và hỗ trợ nổ máy', 'Chỉ đường đến cây xăng gần nhất'],
      excluded: ['Tiền xăng tính theo giá niêm yết trong ngày', 'Lượng xăng vượt 2 lít'],
      itinerary: rescueSteps('Hết xăng giữa đường', { h: 'Tiếp xăng & nổ máy', d: 'Đổ xăng bằng phễu chống tràn, mồi xăng (với xe chế hòa khí) và nổ máy kiểm tra.' }, 'Bật ứng dụng nhắc mức xăng trong Garage số để không lặp lại sự cố.'),
      reviews: [R('Tuấn Kiệt', 'Quận 10', M.y, 5, 'Hết xăng trên cầu, đặt xong 13 phút có thợ mang xăng tới. Cứu cả buổi phỏng vấn của mình.'), R('Lan Anh', 'Quận 1', M.s, 5, 'Phí hợp lý, tiền xăng tính đúng giá niêm yết.'), R('Hữu Phước', 'Gò Vấp', M.a, 4, 'Nhanh, tiện, nhưng nên cho chọn thêm số lít.')]
    },
    {
      id: 'ch08', cat: 'Cứu hộ khẩn cấp', loc: 'Ô tô', time: '~20 phút', priceNum: 200000, unit: '/lượt', warranty: '—',
      title: 'Tiếp nhiên liệu ô tô (xăng/dầu)',
      desc: 'Xe hết xăng hoặc dầu diesel trên đường nội đô? Kỹ thuật viên giao tối đa 10 lít nhiên liệu đúng loại, hỗ trợ mồi dầu cho xe máy dầu và kiểm tra rò rỉ.',
      highlights: [H('⏱️', 'Thợ đến', '~20 phút'), H('⛽', 'Nhiên liệu', 'Xăng hoặc diesel'), H('💰', 'Phí dịch vụ', '200.000đ'), H('🛢️', 'Tối đa', '10 lít/lượt')],
      included: ['Phí di chuyển trong bán kính 5 km', 'Can chứa đạt chuẩn phòng cháy', 'Đổ nhiên liệu, mồi dầu với xe diesel', 'Kiểm tra rò rỉ đường ống cơ bản'],
      excluded: ['Tiền nhiên liệu theo giá niêm yết', 'Xử lý đổ nhầm nhiên liệu (cần kéo xe về xưởng)'],
      itinerary: rescueSteps('Hết xăng giữa đường', { h: 'Tiếp nhiên liệu đúng loại', d: 'Xác nhận loại nhiên liệu qua nắp bình, đổ bằng vòi chống tràn và khởi động lại xe.' }, 'Đổ nhầm xăng – dầu tuyệt đối không nổ máy, hãy chọn dịch vụ kéo xe.'),
      reviews: [R('Quang Vinh', 'Quận 3', M.s, 5, 'Xe dầu hết nhiên liệu, thợ mồi dầu chuẩn, nổ máy ngon.'), R('Hoài Thương', 'Quận 1', M.a, 5, 'Có giấy tờ nguồn gốc nhiên liệu, cảm thấy yên tâm.')]
    },
    {
      id: 'ch09', cat: 'Cứu hộ khẩn cấp', loc: 'Xe máy', time: '~20 phút', priceNum: 200000, unit: '/lượt', warranty: '30 ngày',
      title: 'Mở khóa & làm chìa xe máy',
      desc: 'Mất chìa, gãy chìa trong ổ hay quên chìa trong cốp? Thợ khóa đã xác minh mở khóa không phá ổ, làm chìa cơ mới tại chỗ. Bắt buộc đối chiếu giấy tờ xe trước khi thực hiện.',
      highlights: [H('⏱️', 'Thợ đến', '~20 phút'), H('🔐', 'Xác minh', 'Đối chiếu cà-vẹt xe'), H('💰', 'Giá trần', '200.000đ'), H('🛡️', 'Bảo hành', 'Chìa 30 ngày')],
      included: ['Phí di chuyển trong bán kính 5 km', 'Mở ổ khóa không phá hỏng', 'Làm 1 chìa cơ mới theo ổ', 'Kiểm tra lại ổ khóa cổ và cốp'],
      excluded: ['Chìa smartkey/remote (báo giá theo dòng xe)', 'Thay ổ khóa mới (báo giá riêng)'],
      itinerary: rescueSteps('Mất / quên chìa khóa', { h: 'Xác minh chủ xe & mở khóa', d: 'Đối chiếu cà-vẹt/CCCD, mở ổ bằng dụng cụ chuyên dụng và cắt chìa mới ngay tại chỗ.' }, 'Hệ thống từ chối mở khóa khi không xác minh được chủ xe – bảo vệ chính bạn.'),
      reviews: [R('Phúc Thịnh', 'Quận 1', M.y, 5, 'Gãy chìa trong ổ, thợ lấy ra và làm chìa mới chỉ 15 phút, có hỏi giấy tờ rất cẩn thận.'), R('Diễm Quỳnh', 'Quận 10', M.s, 5, 'Quên chìa trong cốp, được mở mà không trầy xe.')]
    },
    {
      id: 'ch10', cat: 'Cứu hộ khẩn cấp', loc: 'Ô tô', time: '~25 phút', priceNum: 400000, unit: '/lượt', warranty: '30 ngày',
      title: 'Mở cửa ô tô bị khóa trong xe',
      desc: 'Lỡ khóa chìa trong xe, remote hết pin hay khóa cửa bị kẹt? Kỹ thuật viên dùng bộ dụng cụ mở cửa không gây trầy xước, xác minh chủ xe theo đăng ký xe trước khi mở.',
      highlights: [H('⏱️', 'Thợ đến', '~25 phút'), H('🚗', 'Không trầy xước', 'Dụng cụ chuyên dụng'), H('💰', 'Giá trần', '400.000đ'), H('🔐', 'Xác minh', 'Đăng ký xe + CCCD')],
      included: ['Phí di chuyển trong bán kính 5 km', 'Mở cửa bằng túi khí nêm và cần móc chuyên dụng', 'Kiểm tra lại cơ cấu khóa cửa', 'Thay pin remote phổ thông'],
      excluded: ['Làm chìa thông minh mới', 'Sửa mô-tơ khóa cửa'],
      itinerary: rescueSteps('Mất / quên chìa khóa', { h: 'Mở cửa không trầy xước', d: 'Dùng túi khí nêm tạo khe nhỏ, cần móc mở chốt cửa; kiểm tra gioăng và sơn sau khi mở.' }, 'Luôn cất chìa dự phòng ở nhà và lưu ảnh đăng ký xe trong Garage số.'),
      reviews: [R('Thành Đạt', 'Quận 3', M.y, 5, 'Khóa chìa trong xe trước siêu thị, 22 phút có người tới mở, xe không một vết xước.'), R('Bích Ngọc', 'Phú Nhuận', M.a, 4, 'Dịch vụ tốt, thủ tục xác minh hơi lâu nhưng hiểu là để an toàn.')]
    },
    {
      id: 'ch11', cat: 'Cứu hộ khẩn cấp', loc: 'Xe máy', time: '~20 phút', priceNum: 200000, unit: '/5 km đầu', warranty: '—',
      title: 'Kéo xe máy về tiệm',
      desc: 'Hư hỏng nặng không sửa tại chỗ được? Xe cứu hộ chuyên chở xe máy hoặc thợ kéo bằng dây kéo an toàn đưa xe về tiệm đối tác gần nhất hoặc về nhà bạn.',
      highlights: [H('⏱️', 'Xe đến', '~20 phút'), H('🚚', 'Phương án', 'Xe chở hoặc kéo dây'), H('💰', '5 km đầu', '200.000đ'), H('➕', 'Mỗi km thêm', '15.000đ')],
      included: ['5 km di chuyển đầu tiên', 'Chằng buộc chống trầy xước', 'Đưa đến tiệm đối tác hoặc địa chỉ bạn chọn', 'Bàn giao xe có ảnh tình trạng'],
      excluded: ['Km thứ 6 trở đi (+15.000đ/km)', 'Chi phí sửa chữa tại tiệm'],
      itinerary: rescueSteps('Cần kéo xe', { h: 'Chằng buộc & vận chuyển', d: 'Cố định xe trên thùng hoặc kéo dây chuyên dụng, di chuyển với tốc độ an toàn và bàn giao kèm ảnh.' }, 'Bạn có thể đi cùng xe cứu hộ hoặc theo dõi hành trình trên bản đồ.'),
      reviews: [R('Đăng Khoa', 'Gò Vấp', M.y, 5, 'Xe bể nồi, được chở về tiệm đối tác gần nhà, chủ tiệm báo giá luôn qua app.'), R('Ngọc Trâm', 'Quận 10', M.s, 4, 'Ổn áp, tính tiền theo km rõ ràng trên bản đồ.')]
    },
    {
      id: 'ch12', cat: 'Cứu hộ khẩn cấp', loc: 'Ô tô', time: '~30 phút', priceNum: 800000, unit: '/10 km đầu', warranty: '—',
      title: 'Xe cứu hộ sàn trượt kéo ô tô',
      desc: 'Tai nạn, hỏng hộp số hay ngập nước – xe cứu hộ sàn trượt đưa ô tô về gara/hãng an toàn, không kéo lê bánh, phù hợp cả xe số tự động và xe gầm thấp.',
      highlights: [H('⏱️', 'Xe đến', '~30 phút'), H('🚛', 'Phương tiện', 'Xe sàn trượt 3,5 tấn'), H('💰', '10 km đầu', '800.000đ'), H('➕', 'Mỗi km thêm', '25.000đ')],
      included: ['10 km vận chuyển đầu tiên', 'Tời kéo, chằng bánh đúng chuẩn', 'Bảo hiểm hàng hóa trong quá trình vận chuyển', 'Ảnh tình trạng xe trước khi nhận'],
      excluded: ['Km thứ 11 trở đi (+25.000đ/km)', 'Phí cầu đường, bến bãi (nếu có)'],
      itinerary: rescueSteps('Cần kéo xe', { h: 'Đưa xe lên sàn trượt', d: 'Hạ sàn, tời xe lên, chằng 4 bánh và vận chuyển về địa chỉ bạn chọn với hành trình hiển thị trực tiếp.' }, 'Xe ngập nước tuyệt đối không đề nổ – hãy gọi kéo xe ngay.'),
      reviews: [R('Hữu Nhân', 'Quận 1', M.y, 5, 'Mưa ngập đường Nguyễn Hữu Cảnh, xe chết máy, xe sàn tới trong 28 phút. Rất chuyên nghiệp.'), R('Thảo Vy', 'Bình Thạnh', M.s, 5, 'Giá rõ ràng ngay từ đầu, không phát sinh như các bên gọi ngoài.'), R('Gia Bảo', 'Quận 3', M.j, 4, 'Tài xế cẩn thận, chằng bánh kỹ.')]
    },

    /* ═══════ SỬA CHỮA TẠI CHỖ (6) ═══════ */
    {
      id: 'sc01', cat: 'Sửa chữa tại chỗ', loc: 'Xe máy', time: '~30 phút', priceNum: 180000, unit: '/xe', warranty: '30 ngày',
      title: 'Thay bugi & vệ sinh chế hòa khí',
      desc: 'Xe khó nổ buổi sáng, hao xăng, chạy hụt ga? Thợ thay bugi đúng chủng loại, vệ sinh chế hòa khí/họng ga và chỉnh lại garanti để xe nổ êm, tiết kiệm nhiên liệu.',
      highlights: [H('🔧', 'Thời gian làm', '~30 phút'), H('🧰', 'Bao gồm', 'Bugi tiêu chuẩn'), H('💰', 'Trọn gói', '180.000đ'), H('🛡️', 'Bảo hành', '30 ngày')],
      included: ['1 bugi tiêu chuẩn đúng dòng xe', 'Vệ sinh chế hòa khí hoặc họng ga', 'Chỉnh garanti, kiểm tra lọc gió', 'Chạy thử và đo vòng tua'],
      excluded: ['Bugi Iridium cao cấp (+120.000đ)', 'Thay lọc gió (+60.000đ)'],
      itinerary: homeSteps('Thay bugi & vệ sinh', 'Tháo bugi cũ, kiểm tra màu điện cực để đánh giá tình trạng máy, lắp bugi mới và vệ sinh họng ga.', 'Bugi nên thay mỗi 8.000–10.000 km.'),
      reviews: [R('Hoàng Phúc', 'Quận 10', M.y, 5, 'Xe nổ êm hẳn, thợ còn chụp bugi cũ cho xem tình trạng.'), R('Minh Thư', 'Quận 3', M.s, 5, 'Hẹn giờ trưa ở công ty, thợ làm gọn trong 25 phút.')]
    },
    {
      id: 'sc02', cat: 'Sửa chữa tại chỗ', loc: 'Xe máy', time: '~25 phút', priceNum: 160000, unit: '/xe', warranty: '30 ngày',
      title: 'Sửa phanh, thay má phanh xe máy',
      desc: 'Phanh kêu rít, ăn không đều hoặc bóp sát tay? Thợ kiểm tra phanh đĩa/phanh cơ, thay má phanh, xả gió dầu phanh và căn chỉnh để phanh an toàn.',
      highlights: [H('🔧', 'Thời gian làm', '~25 phút'), H('🛑', 'Loại phanh', 'Đĩa & cơ (đùm)'), H('💰', 'Từ', '160.000đ'), H('🛡️', 'Bảo hành', '30 ngày')],
      included: ['1 bộ má phanh tiêu chuẩn', 'Vệ sinh heo dầu, đĩa phanh', 'Xả gió và châm dầu phanh', 'Căn chỉnh hành trình tay phanh'],
      excluded: ['Đĩa phanh mới', 'Thay heo dầu/ống dầu'],
      itinerary: homeSteps('Thay má phanh & căn chỉnh', 'Tháo má phanh cũ, đo độ mòn đĩa, lắp má mới, xả gió và thử phanh ở tốc độ thấp.', 'Má phanh còn dưới 1,5 mm là phải thay ngay.'),
      reviews: [R('Quốc Thái', 'Quận 1', M.s, 5, 'Phanh hết kêu, thợ còn chỉ cách nhìn độ mòn má phanh.'), R('Yến Nhi', 'Phú Nhuận', M.a, 4, 'Giá tốt, làm cẩn thận.')]
    },
    {
      id: 'sc03', cat: 'Sửa chữa tại chỗ', loc: 'Xe máy', time: '~30 phút', priceNum: 150000, unit: '/xe', warranty: '30 ngày',
      title: 'Sửa điện: đèn, còi, xi-nhan, sạc',
      desc: 'Đèn pha chập chờn, xi-nhan không chớp, còi tắt tiếng hay bình nhanh hết điện? Thợ dò mạch bằng đồng hồ đo, xử lý chập chạm, thay bóng, rơ-le và kiểm tra bộ sạc.',
      highlights: [H('🔧', 'Thời gian làm', '~30 phút'), H('💡', 'Hạng mục', 'Đèn, còi, xi-nhan, sạc'), H('💰', 'Phí công', '150.000đ'), H('🛡️', 'Bảo hành', '30 ngày')],
      included: ['Dò mạch, tìm điểm chập chạm', 'Thay bóng/cầu chì phổ thông', 'Kiểm tra rơ-le, bộ sạc, điện áp bình', 'Bọc cách điện, cố định dây'],
      excluded: ['Bóng LED cao cấp, IC, bộ sạc mới (báo giá riêng)'],
      itinerary: homeSteps('Dò mạch & xử lý', 'Đo thông mạch từng nhánh, thay linh kiện hỏng và bọc lại dây theo chuẩn chống nước.', 'Không tự gắn thêm đèn trợ sáng công suất lớn – dễ quá tải bộ sạc.'),
      reviews: [R('Tấn Phát', 'Quận 10', M.y, 5, 'Xi-nhan chết cả tuần, thợ tìm ra dây đứt trong 10 phút.'), R('Ánh Dương', 'Quận 3', M.j, 4, 'Làm kỹ, có giải thích nguyên nhân.')]
    },
    {
      id: 'sc04', cat: 'Sửa chữa tại chỗ', loc: 'Xe máy', time: '~45 phút', priceNum: 450000, unit: '/xe', warranty: '3 tháng',
      title: 'Thay dây curoa xe tay ga',
      desc: 'Xe tay ga rú ga không chạy, ì máy hoặc nghe tiếng rít ở lốc nồi? Thợ thay dây curoa, vệ sinh nồi, kiểm tra bi nồi và chuông – trọn gói ngay tại nhà hoặc nơi làm việc.',
      highlights: [H('🔧', 'Thời gian làm', '~45 phút'), H('⚙️', 'Bao gồm', 'Dây curoa tiêu chuẩn'), H('💰', 'Trọn gói', '450.000đ'), H('🛡️', 'Bảo hành', '3 tháng')],
      included: ['1 dây curoa đúng mã xe', 'Vệ sinh lốc nồi, chuông, puly', 'Kiểm tra bi nồi, lò xo, bố ba càng', 'Chạy thử đánh giá độ bốc'],
      excluded: ['Bi nồi, bố ba càng mới (báo giá riêng)'],
      itinerary: homeSteps('Thay dây curoa & vệ sinh nồi', 'Tháo lốc nồi, thay dây, vệ sinh bụi bố, kiểm tra bi nồi và lắp lại đúng lực siết.', 'Dây curoa nên kiểm tra mỗi 15.000 km, thay ở 20.000–25.000 km.'),
      reviews: [R('Nhật Minh', 'Bình Thạnh', M.s, 5, 'Xe đi êm như mới, thợ làm tại bãi xe công ty.'), R('Kiều Oanh', 'Quận 1', M.a, 5, 'Giá trọn gói, không phát sinh gì thêm.')]
    },
    {
      id: 'sc05', cat: 'Sửa chữa tại chỗ', loc: 'Xe máy', time: '~40 phút', priceNum: 420000, unit: '/xe', warranty: '3 tháng',
      title: 'Thay nhông – xích – đĩa (bộ NSD)',
      desc: 'Xích kêu lạch cạch, nhảy răng hay chùng quá mức? Thợ thay trọn bộ nhông – xích – đĩa, căn tăng xích và tra dầu xích chuyên dụng, giúp xe số/côn tay chạy êm và bền.',
      highlights: [H('🔧', 'Thời gian làm', '~40 phút'), H('⛓️', 'Bao gồm', 'Bộ NSD tiêu chuẩn'), H('💰', 'Trọn gói', '420.000đ'), H('🛡️', 'Bảo hành', '3 tháng')],
      included: ['Bộ nhông – xích – đĩa đúng dòng xe', 'Căn tăng xích, thẳng bánh', 'Tra dầu xích chuyên dụng', 'Kiểm tra bạc đạn bánh sau'],
      excluded: ['Bộ NSD cao cấp (+150.000đ)', 'Thay bạc đạn (báo giá riêng)'],
      itinerary: homeSteps('Thay bộ NSD', 'Tháo bánh sau, thay đĩa – nhông – xích, chỉnh độ chùng 20–30 mm và căn thẳng bánh.', 'Vệ sinh và tra dầu xích mỗi 500 km khi đi mưa nhiều.'),
      reviews: [R('Văn Toàn', 'Gò Vấp', M.y, 5, 'Xe côn tay chạy mượt hẳn, thợ căn xích chuẩn.'), R('Hồng Nhung', 'Quận 10', M.s, 4, 'Làm tại nhà, sạch sẽ, có dọn dẹp sau khi xong.')]
    },
    {
      id: 'sc06', cat: 'Sửa chữa tại chỗ', loc: 'Ô tô', time: '~60 phút', priceNum: 600000, unit: '/trục', warranty: '3 tháng',
      title: 'Thay má phanh ô tô tại chỗ',
      desc: 'Bàn đạp phanh sâu, có tiếng kim loại khi phanh hoặc đèn báo mòn má phanh bật sáng? Kỹ thuật viên thay má phanh một trục ngay tại nhà/văn phòng, kiểm tra đĩa và dầu phanh.',
      highlights: [H('🔧', 'Thời gian làm', '~60 phút'), H('🛑', 'Phạm vi', '1 trục (2 bánh)'), H('💰', 'Phí công + má', '600.000đ'), H('🛡️', 'Bảo hành', '3 tháng')],
      included: ['Bộ má phanh tiêu chuẩn cho 1 trục', 'Vệ sinh cùm phanh, bôi mỡ chốt dẫn hướng', 'Đo độ dày đĩa phanh', 'Kiểm tra mức và độ ẩm dầu phanh'],
      excluded: ['Láng hoặc thay đĩa phanh', 'Thay dầu phanh toàn hệ thống (+350.000đ)'],
      itinerary: homeSteps('Thay má phanh 1 trục', 'Nâng xe bằng kích chuyên dụng, thay má, vệ sinh cùm và chạy thử phanh ở tốc độ thấp.', 'Dầu phanh nên thay mỗi 2 năm hoặc 40.000 km.'),
      reviews: [R('Trung Kiên', 'Quận 3', M.a, 5, 'Làm ngay tầng hầm chung cư, rất gọn gàng.'), R('Thanh Hương', 'Quận 1', M.j, 4, 'Kỹ thuật viên đúng giờ, giải thích rõ độ mòn đĩa.')]
    },

    /* ═══════ BẢO DƯỠNG TẠI NHÀ (6) ═══════ */
    {
      id: 'bd01', cat: 'Bảo dưỡng tại nhà', loc: 'Xe máy', time: 'Theo lịch hẹn', priceNum: 150000, unit: '/xe', badge: 'Thí điểm', warranty: '1.500 km',
      title: 'Thay nhớt tận nhà cho xe máy',
      desc: 'Không cần xếp hàng ở tiệm – thợ đến tận nhà, ký túc xá hay bãi xe công ty để thay nhớt máy, kiểm tra nhớt hộp số và ghi sổ bảo dưỡng điện tử.',
      highlights: [H('📅', 'Đặt lịch', 'Trước tối đa 14 ngày'), H('🛢️', 'Bao gồm', 'Nhớt 0,8L tiêu chuẩn'), H('💰', 'Trọn gói', '150.000đ'), H('📒', 'Sổ bảo dưỡng', 'Điện tử')],
      included: ['0,8 lít nhớt tiêu chuẩn theo dòng xe', 'Kiểm tra nhớt láp (xe tay ga)', 'Vệ sinh lưới lọc nhớt', 'Thu gom nhớt thải đúng quy định'],
      excluded: ['Nhớt tổng hợp cao cấp (+80.000đ)', 'Nhớt hộp số (+50.000đ)'],
      itinerary: homeSteps('Thay nhớt tận nơi', 'Xả nhớt cũ vào khay kín, vệ sinh lưới lọc, châm nhớt mới đúng dung tích và kiểm tra rò rỉ.', 'Xe đi trong phố nên thay nhớt mỗi 1.500–2.000 km.'),
      reviews: [R('Bảo Trâm', 'Quận 3', M.y, 5, 'Thợ tới tận ký túc xá thay nhớt, sạch sẽ không văng giọt nào.'), R('Đức Thắng', 'Quận 10', M.s, 5, 'Ứng dụng tự nhắc lịch thay nhớt lần sau, rất tiện.')]
    },
    {
      id: 'bd02', cat: 'Bảo dưỡng tại nhà', loc: 'Xe máy', time: 'Theo lịch hẹn', priceNum: 350000, unit: '/xe', badge: 'Thí điểm', warranty: '30 ngày',
      title: 'Bảo dưỡng định kỳ xe tay ga',
      desc: 'Gói bảo dưỡng 18 hạng mục cho xe tay ga: nhớt máy, nhớt láp, lọc gió, nồi, phanh, đèn, lốp… thực hiện tại nhà trong khoảng 60 phút, có checklist ảnh từng hạng mục.',
      highlights: [H('📋', 'Checklist', '18 hạng mục'), H('⏳', 'Thời gian', '~60 phút'), H('💰', 'Trọn gói', '350.000đ'), H('🛡️', 'Bảo hành', '30 ngày')],
      included: ['Thay nhớt máy + nhớt láp', 'Vệ sinh lọc gió, nồi, họng ga', 'Kiểm tra phanh, đèn, còi, áp suất lốp', 'Cập nhật sổ bảo dưỡng và nhắc lịch lần sau'],
      excluded: ['Phụ tùng thay thế ngoài danh mục', 'Thay dây curoa (dịch vụ riêng)'],
      itinerary: homeSteps('Bảo dưỡng 18 hạng mục', 'Thực hiện theo checklist, chụp ảnh từng hạng mục và đánh dấu mức độ: Tốt – Cần theo dõi – Cần thay.', 'Bảo dưỡng tổng quát mỗi 4.000 km giúp xe bền và tiết kiệm xăng.'),
      reviews: [R('Phương Thảo', 'Quận 1', M.y, 5, 'Checklist có ảnh rõ ràng, lần đầu thấy bảo dưỡng xe minh bạch vậy.'), R('Duy Khánh', 'Bình Thạnh', M.a, 4, 'Thợ tới đúng giờ hẹn, làm ngay hẻm trước nhà.')]
    },
    {
      id: 'bd03', cat: 'Bảo dưỡng tại nhà', loc: 'Xe máy', time: 'Theo lịch hẹn', priceNum: 280000, unit: '/xe', badge: 'Thí điểm', warranty: '30 ngày',
      title: 'Bảo dưỡng định kỳ xe số',
      desc: 'Gói 15 hạng mục cho xe số: nhớt, bugi, xích, phanh, côn, đèn… phù hợp xe đi làm hằng ngày và xe chạy giao hàng. Thợ làm tại nhà, kèm sổ bảo dưỡng điện tử.',
      highlights: [H('📋', 'Checklist', '15 hạng mục'), H('⏳', 'Thời gian', '~50 phút'), H('💰', 'Trọn gói', '280.000đ'), H('🛵', 'Phù hợp', 'Xe đi làm, giao hàng')],
      included: ['Thay nhớt máy', 'Vệ sinh bugi, tăng chỉnh xích', 'Chỉnh côn, phanh, kiểm tra đèn còi', 'Cập nhật sổ bảo dưỡng điện tử'],
      excluded: ['Bộ nhông xích đĩa mới', 'Phụ tùng ngoài danh mục'],
      itinerary: homeSteps('Bảo dưỡng 15 hạng mục', 'Làm theo checklist chuẩn, ưu tiên các hạng mục an toàn: phanh, lốp, đèn.', 'Tài xế công nghệ nên bảo dưỡng 2 tháng/lần.'),
      reviews: [R('Văn Hậu', 'Quận 10', M.s, 5, 'Chạy giao hàng cả ngày, đặt lịch tối thợ tới tận phòng trọ, quá tiện.'), R('Ngọc Lan', 'Gò Vấp', M.j, 5, 'Rẻ hơn ra tiệm mà còn có sổ bảo dưỡng.')]
    },
    {
      id: 'bd04', cat: 'Bảo dưỡng tại nhà', loc: 'Ô tô', time: 'Theo lịch hẹn', priceNum: 900000, unit: '/xe', badge: 'Thí điểm', warranty: '5.000 km',
      title: 'Bảo dưỡng ô tô cấp nhỏ 5.000 km',
      desc: 'Thay dầu máy, lọc dầu, kiểm tra 20 hạng mục an toàn ngay tại tầng hầm chung cư hoặc bãi xe công ty – tiết kiệm nửa ngày chờ ở gara.',
      highlights: [H('📋', 'Checklist', '20 hạng mục'), H('⏳', 'Thời gian', '~75 phút'), H('💰', 'Trọn gói', '900.000đ'), H('🛢️', 'Bao gồm', 'Dầu 4L + lọc dầu')],
      included: ['4 lít dầu máy tiêu chuẩn + lọc dầu', 'Kiểm tra phanh, lốp, đèn, gạt mưa, nước làm mát', 'Vệ sinh lọc gió động cơ', 'Reset nhắc bảo dưỡng trên đồng hồ'],
      excluded: ['Dầu tổng hợp toàn phần (+350.000đ)', 'Lọc gió điều hòa (+180.000đ)'],
      itinerary: homeSteps('Bảo dưỡng cấp nhỏ', 'Xả dầu bằng máy hút chuyên dụng (không cần cầu nâng), thay lọc, kiểm tra 20 hạng mục và chụp ảnh.', 'Bảo dưỡng cấp nhỏ mỗi 5.000 km hoặc 6 tháng.'),
      reviews: [R('Hải Đăng', 'Quận 1', M.a, 5, 'Làm ngay hầm chung cư, không cần nghỉ làm để mang xe đi hãng.'), R('Mỹ Duyên', 'Quận 3', M.j, 4, 'Kỹ thuật viên chuyên nghiệp, có báo cáo ảnh đầy đủ.')]
    },
    {
      id: 'bd05', cat: 'Bảo dưỡng tại nhà', loc: 'Mọi loại xe', time: 'Theo lịch hẹn', priceNum: 199000, unit: '/xe', badge: 'Mới', warranty: '—',
      title: 'Kiểm tra 25 hạng mục trước chuyến về quê',
      desc: 'Chuẩn bị chạy đường dài dịp lễ Tết? Gói “Hành trình về quê” kiểm tra 25 hạng mục từ lốp, phanh, đèn đến nước làm mát, kèm bộ dụng cụ khẩn cấp và lộ trình gợi ý điểm dừng nghỉ.',
      highlights: [H('📋', 'Checklist', '25 hạng mục'), H('🛣️', 'Lộ trình', 'Gợi ý điểm dừng nghỉ'), H('💰', 'Từ', '199.000đ'), H('🎁', 'Tặng', 'Tem QR cứu hộ')],
      included: ['Kiểm tra lốp, phanh, đèn, xích/dây curoa, ắc quy', 'Kiểm tra dầu, nước làm mát (ô tô)', 'Báo cáo tình trạng có ảnh', 'Tặng 1 tem QR cứu hộ dán xe'],
      excluded: ['Phụ tùng thay thế', 'Cứu hộ ngoài phạm vi phục vụ'],
      itinerary: homeSteps('Kiểm tra 25 hạng mục', 'Đánh giá từng hạng mục theo 3 mức, đề xuất thay thế những hạng mục rủi ro trước khi lên đường.', 'Chạy đường dài: cứ 2 giờ nên dừng nghỉ 15 phút.'),
      reviews: [R('Thanh Bình', 'Quận 10', M.s, 5, 'Trước khi chạy về Bến Tre được kiểm tra kỹ, phát hiện má phanh mòn kịp thời.'), R('Quỳnh Như', 'Phú Nhuận', M.a, 5, 'Có cả lộ trình gợi ý trạm dừng nghỉ, rất chu đáo.')]
    },
    {
      id: 'bd06', cat: 'Bảo dưỡng tại nhà', loc: 'Xe máy', time: 'Theo lịch hẹn', priceNum: 250000, unit: '/xe', badge: 'Thí điểm', warranty: '30 ngày',
      title: 'Vệ sinh kim phun – buồng đốt',
      desc: 'Xe phun xăng điện tử hao xăng, nổ không đều, ga không bốc? Thợ dùng máy vệ sinh kim phun chuyên dụng và dung dịch làm sạch buồng đốt không cần rã máy.',
      highlights: [H('🧪', 'Công nghệ', 'Máy vệ sinh kim phun'), H('⏳', 'Thời gian', '~40 phút'), H('💰', 'Trọn gói', '250.000đ'), H('⛽', 'Hiệu quả', 'Giảm hao xăng')],
      included: ['Vệ sinh kim phun bằng máy chuyên dụng', 'Dung dịch làm sạch buồng đốt', 'Vệ sinh họng ga, cảm biến', 'Chạy thử, reset ECU'],
      excluded: ['Thay kim phun mới', 'Xe chế hòa khí (chọn gói vệ sinh chế hòa khí)'],
      itinerary: homeSteps('Vệ sinh kim phun & buồng đốt', 'Kết nối máy vệ sinh, chạy dung dịch theo chu trình, vệ sinh họng ga và reset ECU.', 'Nên vệ sinh mỗi 10.000 km với xe phun xăng điện tử.'),
      reviews: [R('Minh Trí', 'Quận 3', M.y, 4, 'Xe bốc hơn và đỡ hao xăng thấy rõ.'), R('Hoài An', 'Quận 1', M.s, 5, 'Thợ làm cẩn thận, có video quá trình vệ sinh.')]
    },

    /* ═══════ XE ĐIỆN (4) ═══════ */
    {
      id: 'xd01', cat: 'Xe điện', loc: 'Xe điện', time: '~20 phút', priceNum: 180000, unit: '/lượt', badge: 'Mới', warranty: '—',
      title: 'Cứu hộ xe máy điện hết pin – sạc lưu động',
      desc: 'Xe máy điện báo hết pin giữa đường? Thợ mang bộ sạc nhanh lưu động đến sạc cứu hộ đủ để bạn đi tiếp 10–15 km tới trạm sạc hoặc về nhà.',
      highlights: [H('⏱️', 'Thợ đến', '~20 phút'), H('🔌', 'Sạc cứu hộ', 'Đủ đi 10–15 km'), H('💰', 'Giá trần', '180.000đ'), H('🗺️', 'Gợi ý', 'Trạm sạc gần nhất')],
      included: ['Phí di chuyển trong bán kính 5 km', 'Sạc nhanh lưu động 20–30 phút', 'Kiểm tra cổng sạc, giắc cắm', 'Chỉ đường đến trạm sạc gần nhất'],
      excluded: ['Sạc đầy pin', 'Sửa bộ điều khiển/BMS'],
      itinerary: rescueSteps('Xe điện hết pin', { h: 'Sạc cứu hộ lưu động', d: 'Đấu bộ sạc lưu động đúng điện áp pin, sạc đến mức an toàn và kiểm tra nhiệt độ pin.' }, 'Đừng để pin xe điện xuống dưới 10% thường xuyên – giảm tuổi thọ pin.'),
      reviews: [R('Gia Linh', 'Quận 1', M.y, 5, 'Xe điện hết pin giữa đường Hai Bà Trưng, được sạc 20 phút đủ về nhà.'), R('Tuấn Anh', 'Quận 10', M.s, 4, 'Dịch vụ mới nhưng rất hữu ích cho người đi xe điện.')]
    },
    {
      id: 'xd02', cat: 'Xe điện', loc: 'Xe điện', time: 'Theo lịch hẹn', priceNum: 200000, unit: '/xe', badge: 'Mới', warranty: '—',
      title: 'Kiểm tra pin & bộ điều khiển xe điện',
      desc: 'Pin sụt nhanh, xe yếu khi lên dốc hay báo lỗi trên đồng hồ? Kỹ thuật viên đo dung lượng thực của pin, kiểm tra BMS, bộ điều khiển và motor, xuất báo cáo sức khỏe pin.',
      highlights: [H('🔋', 'Đo dung lượng', 'Pin thực tế'), H('🧠', 'Kiểm tra', 'BMS & điều khiển'), H('💰', 'Trọn gói', '200.000đ'), H('📄', 'Báo cáo', 'Sức khỏe pin %')],
      included: ['Đo dung lượng và nội trở pin', 'Kiểm tra BMS, bộ điều khiển, motor', 'Vệ sinh cổng sạc, giắc kết nối', 'Báo cáo sức khỏe pin lưu trong Garage số'],
      excluded: ['Thay cell pin, BMS', 'Sửa motor'],
      itinerary: homeSteps('Đo kiểm pin & điều khiển', 'Kết nối thiết bị đo, xả thử có tải và đối chiếu với thông số nhà sản xuất.', 'Sạc xe điện ở nơi thoáng mát, không sạc qua đêm khi pin đã đầy.'),
      reviews: [R('Phương Nam', 'Quận 3', M.a, 5, 'Biết được pin còn 78% sức khỏe, yên tâm hơn khi đi xa.'), R('Bảo Hân', 'Bình Thạnh', M.j, 4, 'Báo cáo dễ hiểu.')]
    },
    {
      id: 'xd03', cat: 'Xe điện', loc: 'Xe điện', time: '~20 phút', priceNum: 140000, unit: '/lượt', warranty: '7 ngày',
      title: 'Vá / thay lốp xe điện tận nơi',
      desc: 'Xe điện thủng lốp rất khó dắt vì nặng và không có số mo. Thợ đến tận nơi vá lốp không săm hoặc thay ruột cho xe máy điện, xe đạp điện, kiểm tra động cơ bánh.',
      highlights: [H('⏱️', 'Thợ đến', '~20 phút'), H('🛞', 'Phù hợp', 'Xe máy & xe đạp điện'), H('💰', 'Giá trần', '140.000đ'), H('🛡️', 'Bảo hành', '7 ngày')],
      included: ['Phí di chuyển trong bán kính 5 km', 'Vá 1 điểm thủng hoặc thay ruột (ruột tính riêng)', 'Kiểm tra dây động cơ bánh (hub motor)', 'Bơm đúng áp suất'],
      excluded: ['Lốp/ruột mới', 'Sửa motor bánh'],
      itinerary: rescueSteps('Thủng / xì lốp', { h: 'Vá lốp xe điện an toàn', d: 'Ngắt nguồn, cố định xe, tháo bánh motor cẩn thận, vá và lắp lại đúng chiều dây.' }, 'Luôn ngắt nguồn trước khi kiểm tra bánh xe điện.'),
      reviews: [R('Hữu Tài', 'Quận 10', M.s, 5, 'Xe đạp điện của con bị thủng, thợ tới tận cổng trường vá giúp.')]
    },
    {
      id: 'xd04', cat: 'Xe điện', loc: 'Xe điện', time: '~25 phút', priceNum: 220000, unit: '/5 km đầu', warranty: '—',
      title: 'Kéo xe điện về trạm sạc / xưởng',
      desc: 'Pin hỏng, motor lỗi hay xe bị ngập? Xe chuyên chở đưa xe điện về trạm sạc, đại lý hoặc xưởng đối tác, đảm bảo không làm ảnh hưởng pin và hệ thống điện.',
      highlights: [H('⏱️', 'Xe đến', '~25 phút'), H('🚚', 'Phương tiện', 'Xe chở chuyên dụng'), H('💰', '5 km đầu', '220.000đ'), H('➕', 'Mỗi km thêm', '15.000đ')],
      included: ['5 km vận chuyển đầu tiên', 'Ngắt nguồn, cố định pin an toàn', 'Bàn giao kèm ảnh tình trạng', 'Hỗ trợ liên hệ đại lý chính hãng'],
      excluded: ['Km thứ 6 trở đi (+15.000đ/km)', 'Chi phí sửa chữa tại xưởng'],
      itinerary: rescueSteps('Cần kéo xe', { h: 'Vận chuyển xe điện an toàn', d: 'Ngắt nguồn chính, cố định xe trên thùng và vận chuyển tới địa chỉ bạn chọn.' }, 'Xe điện bị ngập: không bật nguồn, không sạc cho tới khi được kiểm tra.'),
      reviews: [R('Minh Hiếu', 'Phú Nhuận', M.a, 5, 'Xe điện ngập nước được chở về đại lý, nhân viên rất cẩn thận.')]
    },

    /* ═══════ GÓI THÀNH VIÊN LÁ CHẮN SỐ (5) ═══════ */
    {
      id: 'gt01', cat: 'Gói thành viên', loc: 'Mọi loại xe', time: 'Kích hoạt ngay', priceNum: 0, unit: '/năm', badge: 'Miễn phí', warranty: '—', member: true,
      title: 'Thành viên Lá Chắn Số – Cơ bản',
      desc: 'Tạo tài khoản là trở thành thành viên: lưu Garage số, theo dõi lịch sử cứu hộ, tích điểm Bốn Phương cho mọi đơn và nhận voucher chào mừng.',
      highlights: [H('🆓', 'Phí', '0đ'), H('🚗', 'Garage số', '2 xe'), H('⭐', 'Tích điểm', '1%/đơn'), H('🎁', 'Chào mừng', 'Voucher 30.000đ')],
      included: ['Garage số lưu tối đa 2 xe', 'Lịch sử cứu hộ, hóa đơn, bảo hành điện tử', 'Tích 1% điểm Bốn Phương mỗi đơn', 'Voucher chào mừng 30.000đ'],
      excluded: ['Lượt cứu hộ miễn phí', 'Ưu tiên điều phối giờ cao điểm'],
      itinerary: [S('Bước 1', 'Đăng ký tài khoản', 'Đăng ký bằng email hoặc số điện thoại trong 30 giây.', ''), S('Bước 2', 'Thêm xe vào Garage số', 'Nhập biển số, dòng xe, ngày bảo dưỡng gần nhất.', ''), S('Bước 3', 'Dùng dịch vụ & tích điểm', 'Mỗi đơn hoàn tất được cộng điểm, đổi voucher trong kho.', '')],
      reviews: [R('Ngọc Ánh', 'Quận 3', M.y, 5, 'Miễn phí mà có Garage số lưu lịch bảo dưỡng, rất thích.')]
    },
    {
      id: 'gt02', cat: 'Gói thành viên', loc: 'Xe máy', time: 'Kích hoạt ngay', priceNum: 99000, unit: '/năm', badge: 'Sinh viên', warranty: '12 tháng', member: true,
      title: 'Lá Chắn Số – Gói Sinh viên',
      desc: 'Dành riêng cho học sinh, sinh viên đi xe máy: 2 lượt cứu hộ miễn phí phí di chuyển, giảm 15% phí công, tem QR cứu hộ và ưu đãi bảo dưỡng tại ký túc xá.',
      highlights: [H('🎓', 'Đối tượng', 'HS – SV có thẻ'), H('🚨', 'Cứu hộ', '2 lượt miễn phí di chuyển'), H('💰', 'Phí năm', '99.000đ'), H('🏷️', 'Giảm', '15% phí công')],
      included: ['2 lượt miễn phí di chuyển trong 5 km', 'Giảm 15% phí công mọi dịch vụ', 'Tặng tem QR cứu hộ dán xe', 'Ưu đãi bảo dưỡng tại ký túc xá'],
      excluded: ['Phụ tùng, vật tư', 'Áp dụng cho ô tô'],
      itinerary: [S('Bước 1', 'Xác minh sinh viên', 'Tải ảnh thẻ sinh viên còn hạn, duyệt trong 15 phút.', ''), S('Bước 2', 'Kích hoạt gói', 'Thanh toán 99.000đ, gói có hiệu lực ngay trong 12 tháng.', ''), S('Bước 3', 'Dùng quyền lợi', 'Quyền lợi tự áp dụng khi đặt cứu hộ, không cần nhập mã.', '')],
      reviews: [R('Thanh Tùng', 'Gò Vấp', M.s, 5, 'Sinh viên IUH dùng gói này, đã được cứu 1 lần thủng lốp mà không mất phí di chuyển.'), R('Khánh Linh', 'Quận 10', M.a, 5, 'Rẻ như một ly trà sữa mỗi tháng mà an tâm cả năm.')]
    },
    {
      id: 'gt03', cat: 'Gói thành viên', loc: 'Mọi loại xe', time: 'Kích hoạt ngay', priceNum: 199000, unit: '/năm', badge: 'Phổ biến', warranty: '12 tháng', member: true,
      title: 'Lá Chắn Số – Gói Cá nhân',
      desc: 'Bảo vệ 1 xe suốt 12 tháng: 3 lượt cứu hộ miễn phí di chuyển, ưu tiên điều phối giờ cao điểm, giảm 10% phí công, chế độ an toàn đêm và hỗ trợ khiếu nại ưu tiên.',
      highlights: [H('🛡️', 'Bảo vệ', '1 xe / 12 tháng'), H('🚨', 'Cứu hộ', '3 lượt miễn phí di chuyển'), H('💰', 'Xe máy', '199.000đ/năm'), H('⚡', 'Ưu tiên', 'Điều phối giờ cao điểm')],
      included: ['3 lượt miễn phí di chuyển trong 5 km', 'Ưu tiên điều phối khi cao điểm, mưa ngập', 'Giảm 10% phí công', 'Kênh hỗ trợ ưu tiên 24/7'],
      excluded: ['Phụ tùng, vật tư', 'Ô tô tính phụ phí +300.000đ/năm'],
      options: [{ id: 'xm', label: 'Xe máy', add: 0 }, { id: 'ot', label: 'Ô tô', add: 300000 }],
      itinerary: [S('Bước 1', 'Chọn xe được bảo vệ', 'Chọn 1 xe trong Garage số hoặc thêm xe mới.', ''), S('Bước 2', 'Thanh toán & kích hoạt', 'Gói kích hoạt ngay sau thanh toán, có thẻ thành viên điện tử.', ''), S('Bước 3', 'Gặp sự cố – bấm SOS', 'Quyền lợi tự trừ vào hóa đơn, không cần nhập mã.', '')],
      reviews: [R('Quang Huy', 'Quận 1', M.y, 5, 'Mưa ngập vẫn có thợ nhận trong 2 phút nhờ ưu tiên điều phối.'), R('Thu Hà', 'Quận 3', M.s, 5, 'Đã dùng 2 lượt, quá đáng tiền.')]
    },
    {
      id: 'gt04', cat: 'Gói thành viên', loc: 'Mọi loại xe', time: 'Kích hoạt ngay', priceNum: 449000, unit: '/năm', warranty: '12 tháng', member: true,
      title: 'Lá Chắn Số – Gói Gia đình (3 xe)',
      desc: 'Một gói cho cả nhà: bảo vệ đến 3 xe máy hoặc 2 xe máy + 1 ô tô, 8 lượt cứu hộ miễn phí di chuyển dùng chung, chia sẻ vị trí an toàn cho người thân.',
      highlights: [H('👨‍👩‍👧', 'Bảo vệ', 'Đến 3 xe'), H('🚨', 'Cứu hộ', '8 lượt dùng chung'), H('💰', 'Phí năm', '449.000đ'), H('📍', 'Chia sẻ', 'Hành trình cho người thân')],
      included: ['8 lượt miễn phí di chuyển dùng chung', 'Chia sẻ hành trình cứu hộ cho người thân', 'Giảm 10% phí công, 5% phụ tùng', '1 lần kiểm tra 25 hạng mục miễn phí'],
      excluded: ['Phụ tùng, vật tư ngoài ưu đãi'],
      itinerary: [S('Bước 1', 'Thêm thành viên & xe', 'Mời tối đa 4 thành viên gia đình, gắn tối đa 3 xe.', ''), S('Bước 2', 'Kích hoạt gói', 'Thanh toán một lần cho cả năm.', ''), S('Bước 3', 'An tâm cả nhà', 'Khi người thân bấm SOS, bạn nhận thông báo và theo dõi được hành trình.', '')],
      reviews: [R('Hồng Phúc', 'Bình Thạnh', M.a, 5, 'Con gái đi học về khuya, mình theo dõi được khi bé gọi cứu hộ, rất an tâm.')]
    },
    {
      id: 'gt05', cat: 'Gói thành viên', loc: 'Mọi loại xe', time: 'Tư vấn trong 24h', priceNum: 2900000, unit: '/năm', badge: 'B2B', warranty: '12 tháng', member: true,
      title: 'Lá Chắn Số – Gói Doanh nghiệp / đội xe',
      desc: 'Dành cho doanh nghiệp giao hàng, cho thuê xe, đội xe công ty: cổng quản lý đội xe, báo cáo chi phí theo tháng, SLA riêng và xuất hóa đơn VAT tập trung. Giá từ 10 xe.',
      highlights: [H('🏢', 'Quy mô', 'Từ 10 xe'), H('📊', 'Cổng quản lý', 'Báo cáo theo tháng'), H('💰', 'Từ', '2.900.000đ/năm'), H('🧾', 'Hóa đơn', 'VAT tập trung')],
      included: ['Cổng doanh nghiệp quản lý đội xe', 'SLA phản hồi ưu tiên theo hợp đồng', 'Báo cáo chi phí, sự cố theo tháng', 'Hóa đơn VAT tập trung, công nợ 30 ngày'],
      excluded: ['Phụ tùng, vật tư (giá đối tác ưu đãi)'],
      itinerary: [S('Bước 1', 'Gửi yêu cầu tư vấn', 'Để lại số lượng xe, khu vực hoạt động.', ''), S('Bước 2', 'Khảo sát & báo giá', 'Chuyên viên B2B liên hệ trong 24 giờ làm việc.', ''), S('Bước 3', 'Ký hợp đồng & tích hợp', 'Cấp tài khoản quản trị, kết nối API nếu cần.', '')],
      reviews: [R('Anh Hoàng – quản lý đội xe', 'Quận 10', M.s, 5, 'Đội 25 xe giao hàng giảm hẳn thời gian chết xe nhờ cứu hộ ưu tiên.')]
    },

    /* ═══════ PHỤ TÙNG & PHỤ KIỆN (6) ═══════ */
    {
      id: 'pt01', cat: 'Phụ tùng & Phụ kiện', loc: 'Mọi loại xe', time: 'Giao 2 giờ', priceNum: 390000, unit: '/bộ', badge: 'Bán chạy', warranty: '6 tháng',
      title: 'Bộ vá lốp khẩn cấp mini + bơm điện',
      desc: 'Bộ dụng cụ gọn trong cốp xe: bơm điện mini sạc USB, keo vá không săm, dụng cụ cắm vá nấm và đồng hồ đo áp suất – tự xử lý tình huống xì lốp cơ bản.',
      highlights: [H('🎒', 'Kích thước', 'Vừa cốp xe tay ga'), H('🔌', 'Bơm điện', 'Sạc USB-C'), H('💰', 'Giá', '390.000đ'), H('🛡️', 'Bảo hành', '6 tháng')],
      included: ['Bơm điện mini có đồng hồ số', 'Bộ 10 que vá nấm + keo', 'Dụng cụ dùi và cắm vá', 'Túi đựng chống nước'],
      excluded: ['Lắp đặt (không cần)', 'Lốp có săm (cần thay ruột)'],
      itinerary: shopSteps('bộ vá lốp khẩn cấp', 'Giao trong 2 giờ nội thành khu vực phục vụ, kèm video hướng dẫn sử dụng.'),
      reviews: [R('Đình Phong', 'Quận 1', M.y, 5, 'Bơm nhỏ mà mạnh, đã tự cứu mình một lần.'), R('Mỹ Tiên', 'Quận 3', M.s, 4, 'Video hướng dẫn dễ hiểu.')]
    },
    {
      id: 'pt02', cat: 'Phụ tùng & Phụ kiện', loc: 'Xe máy', time: 'Lắp tận nơi', priceNum: 420000, unit: '/bình', warranty: '12 tháng',
      title: 'Ắc quy khô xe máy 12V – 5Ah',
      desc: 'Ắc quy khô miễn bảo dưỡng cho phần lớn xe số và xe tay ga phổ thông. Thợ mang đến lắp tận nơi, đo kiểm bộ sạc và thu hồi bình cũ đúng quy định môi trường.',
      highlights: [H('🔋', 'Thông số', '12V – 5Ah'), H('🧰', 'Lắp đặt', 'Tận nơi, miễn phí công'), H('💰', 'Giá', '420.000đ'), H('🛡️', 'Bảo hành', '12 tháng')],
      included: ['1 ắc quy khô 12V – 5Ah', 'Công lắp đặt tận nơi', 'Đo kiểm bộ sạc sau khi lắp', 'Thu hồi bình cũ'],
      excluded: ['Bình dung lượng lớn cho xe phân khối lớn'],
      itinerary: shopSteps('ắc quy phù hợp dòng xe', 'Thợ đến lắp tận nơi trong khung giờ bạn chọn, đo điện áp sạc và dán tem bảo hành.'),
      reviews: [R('Văn Nam', 'Quận 10', M.s, 5, 'Thay bình ngay trước cửa nhà, có thu bình cũ.')]
    },
    {
      id: 'pt03', cat: 'Phụ tùng & Phụ kiện', loc: 'Xe máy', time: 'Lắp tận nơi', priceNum: 480000, unit: '/lốp', warranty: '6 tháng',
      title: 'Lốp không săm xe tay ga 90/90-14',
      desc: 'Lốp không săm gai đa dụng, bám đường tốt khi trời mưa, phù hợp nhiều dòng xe tay ga phổ thông. Giá đã gồm công thay và cân chỉnh tại nơi bạn chọn.',
      highlights: [H('🛞', 'Kích thước', '90/90-14'), H('🌧️', 'Gai lốp', 'Thoát nước tốt'), H('💰', 'Giá', '480.000đ'), H('🛡️', 'Bảo hành', '6 tháng')],
      included: ['1 lốp không săm 90/90-14', 'Van mới', 'Công thay tận nơi', 'Bơm đúng áp suất'],
      excluded: ['Kích thước khác (chọn trong ghi chú)'],
      itinerary: shopSteps('kích thước lốp', 'Thợ thay lốp tận nơi, kiểm tra vành và bơm đúng áp suất khuyến nghị.'),
      reviews: [R('Anh Khoa', 'Phú Nhuận', M.a, 5, 'Giá ngang tiệm mà được thay tận nơi.')]
    },
    {
      id: 'pt04', cat: 'Phụ tùng & Phụ kiện', loc: 'Xe máy', time: 'Giao 2 giờ', priceNum: 160000, unit: '/chai 1L', warranty: '—',
      title: 'Nhớt tổng hợp 10W-40 (1 lít)',
      desc: 'Nhớt tổng hợp cho xe số và xe tay ga, giúp máy êm, giảm ma sát khi chạy trong phố đông. Có thể đặt kèm dịch vụ thay nhớt tận nhà.',
      highlights: [H('🛢️', 'Độ nhớt', '10W-40'), H('🏍️', 'Phù hợp', 'Xe số & tay ga'), H('💰', 'Giá', '160.000đ'), H('🚚', 'Giao', 'Trong 2 giờ')],
      included: ['1 chai nhớt tổng hợp 1 lít', 'Giao tận nơi trong khu vực phục vụ'],
      excluded: ['Công thay nhớt (đặt kèm dịch vụ Thay nhớt tận nhà)'],
      itinerary: shopSteps('loại nhớt', 'Giao trong 2 giờ, hoặc thợ mang theo khi bạn đặt kèm dịch vụ thay nhớt.'),
      reviews: [R('Phú Quý', 'Quận 1', M.j, 4, 'Giao nhanh, hàng có tem chống giả.')]
    },
    {
      id: 'pt05', cat: 'Phụ tùng & Phụ kiện', loc: 'Mọi loại xe', time: 'Giao 1 ngày', priceNum: 29000, unit: '/tem', badge: 'Độc quyền', warranty: '—',
      title: 'Tem QR cứu hộ dán xe',
      desc: 'Dán tem lên xe, khi gặp sự cố chỉ cần quét mã là gửi yêu cầu cứu hộ kèm thông tin xe – không cần cài ứng dụng. Người khác cũng có thể quét để báo giúp khi bạn gặp nạn.',
      highlights: [H('📱', 'Quét là gọi', 'Không cần cài app'), H('🚗', 'Gắn với', 'Xe trong Garage số'), H('💰', 'Giá', '29.000đ'), H('💧', 'Chất liệu', 'Chống nước, phản quang')],
      included: ['1 tem QR phản quang, chống nước', 'Liên kết với 1 xe trong Garage số', 'Trang cứu hộ nhanh riêng cho xe'],
      excluded: ['Đổi xe liên kết quá 2 lần/năm'],
      itinerary: shopSteps('số lượng tem', 'Tem được giao qua bưu điện hoặc thợ mang đến trong lần dịch vụ kế tiếp.'),
      reviews: [R('Bảo Long', 'Quận 3', M.y, 5, 'Ý tưởng hay, bố mẹ lớn tuổi cũng gọi cứu hộ được dễ dàng.'), R('Thanh Xuân', 'Quận 10', M.s, 5, 'Tem bền, phản quang đẹp.')]
    },
    {
      id: 'pt06', cat: 'Phụ tùng & Phụ kiện', loc: 'Ô tô', time: 'Giao 2 giờ', priceNum: 1290000, unit: '/bộ', warranty: '12 tháng',
      title: 'Bộ kích bình đa năng 12V cho ô tô',
      desc: 'Bộ kích bình cầm tay 12V tích hợp đèn pin và sạc dự phòng, khởi động được ô tô máy xăng đến 3.0L. Kèm hướng dẫn đấu kẹp an toàn.',
      highlights: [H('⚡', 'Dòng khởi động', 'Tối đa 1000A'), H('🔦', 'Tích hợp', 'Đèn pin, sạc dự phòng'), H('💰', 'Giá', '1.290.000đ'), H('🛡️', 'Bảo hành', '12 tháng')],
      included: ['Bộ kích bình 12V', 'Kẹp thông minh chống ngược cực', 'Cáp sạc, túi đựng', 'Video hướng dẫn'],
      excluded: ['Xe máy dầu trên 2.0L'],
      itinerary: shopSteps('bộ kích bình', 'Giao trong 2 giờ nội thành khu vực phục vụ, có hướng dẫn trực tiếp nếu cần.'),
      reviews: [R('Minh Đức', 'Quận 1', M.a, 5, 'Đã dùng cứu xe hàng xóm, rất mạnh.')]
    }
  ];

  /* lượt đặt lũy kế giai đoạn thí điểm (tổng nhóm cứu hộ ≈ 6.500 lượt) */
  var BOOKINGS = { ch01: 1350, ch03: 1080, ch05: 860, ch07: 720, ch02: 560, ch04: 480, ch11: 400, ch09: 330, ch12: 280, ch06: 230, ch08: 120, ch10: 90,
    sc01: 310, sc02: 280, sc03: 240, sc04: 220, sc05: 150, sc06: 70, bd01: 260, bd02: 210, bd03: 180, bd04: 60, bd05: 240, bd06: 95,
    xd01: 170, xd02: 85, xd03: 120, xd04: 45, gt01: 2100, gt02: 540, gt03: 620, gt04: 190, gt05: 24, pt01: 310, pt02: 240, pt03: 180, pt04: 290, pt05: 860, pt06: 95 };

  /* chuẩn hóa: giá hiển thị, ảnh, điểm đánh giá */
  SERVICES.forEach(function (s) {
    s.price = s.priceNum === 0 ? 'Miễn phí' : vnd(s.priceNum);
    s.img = 'img/dv/' + s.id + '-1.jpg';
    s.images = imgs(s.id);
    if (!s.options) {
      s.options = s.loc === 'Xe máy' ? OPT_MOTO : s.loc === 'Ô tô' ? OPT_CAR : s.loc === 'Xe điện' ? OPT_EV : OPT_ALL;
    }
    var sum = 0; s.reviews.forEach(function (r) { sum += r.rate; });
    s.rating = s.reviews.length ? Math.round(sum / s.reviews.length * 10) / 10 : 5;
    s.bookings = BOOKINGS[s.id] || 50;
  });

  /* ---------- Khu vực phục vụ ---------- */
  var AREAS = [
    { id: 'quan-1', name: 'Quận 1', city: 'TP. Hồ Chí Minh', phase: 'Đang phục vụ', stage: 'Thí điểm – Năm 1', mechanics: 58, eta: 12, jobs: 2480, rating: 4.8,
      hot: ['Lê Lợi – Nguyễn Huệ', 'Cầu Ông Lãnh', 'Trần Hưng Đạo', 'Võ Văn Kiệt'], stations: ['Tiệm sửa xe đối tác Bến Thành', 'Trạm cứu hộ cơ động Tân Định'],
      desc: 'Trung tâm thí điểm đầu tiên, mật độ thợ cao nhất. Thợ SOS trực ca đêm 22h–5h phủ toàn quận.', tip: 'Giờ cao điểm 17h–19h nên ghim vị trí chính xác ở làn sát lề để thợ tiếp cận nhanh.' },
    { id: 'quan-3', name: 'Quận 3', city: 'TP. Hồ Chí Minh', phase: 'Đang phục vụ', stage: 'Thí điểm – Năm 1', mechanics: 47, eta: 13, jobs: 2050, rating: 4.7,
      hot: ['Cách Mạng Tháng 8', 'Nam Kỳ Khởi Nghĩa', 'Võ Thị Sáu', 'Hồ Con Rùa'], stations: ['Garage đối tác Võ Văn Tần', 'Điểm vá lốp đối tác Kỳ Đồng'],
      desc: 'Nhiều tuyến đường một chiều, hệ thống tự tính lộ trình cho thợ theo chiều lưu thông thực tế.', tip: 'Đường một chiều: ghi chú số nhà hoặc mốc nhận diện giúp thợ tìm bạn nhanh hơn.' },
    { id: 'quan-10', name: 'Quận 10', city: 'TP. Hồ Chí Minh', phase: 'Đang phục vụ', stage: 'Thí điểm – Năm 1', mechanics: 45, eta: 14, jobs: 1970, rating: 4.7,
      hot: ['Ba Tháng Hai', 'Lý Thường Kiệt', 'Sư Vạn Hạnh', 'Vòng xoay Dân Chủ'], stations: ['Tiệm đối tác Thành Thái', 'Trạm cứu hộ cơ động Lý Thái Tổ'],
      desc: 'Khu vực đông sinh viên và tài xế công nghệ – nhu cầu vá lốp, kích bình buổi sáng rất cao.', tip: 'Sinh viên dùng Gói Sinh viên để miễn phí di chuyển 2 lượt/năm.' },
    { id: 'binh-thanh', name: 'Bình Thạnh', city: 'TP. Hồ Chí Minh', phase: 'Mở rộng', stage: 'Năm 2 – Quận thứ 4', mechanics: 26, eta: 17, jobs: 640, rating: 4.6,
      hot: ['Xô Viết Nghệ Tĩnh', 'Điện Biên Phủ', 'Nguyễn Hữu Cảnh', 'Hàng Xanh'], stations: ['Garage đối tác Đinh Bộ Lĩnh'],
      desc: 'Đang mở rộng mạng lưới, ưu tiên các điểm hay ngập khi mưa lớn như Nguyễn Hữu Cảnh.', tip: 'Bật chế độ thời tiết/ngập để nhận cảnh báo tuyến đường ngập trước khi đi.' },
    { id: 'phu-nhuan', name: 'Phú Nhuận', city: 'TP. Hồ Chí Minh', phase: 'Mở rộng', stage: 'Năm 2 – Quận thứ 5', mechanics: 18, eta: 18, jobs: 410, rating: 4.6,
      hot: ['Phan Đăng Lưu', 'Hoàng Văn Thụ', 'Phan Xích Long', 'Nguyễn Kiệm'], stations: ['Điểm vá lốp đối tác Phan Xích Long'],
      desc: 'Giáp sân bay, nhiều xe công nghệ hoạt động; đang tuyển thêm thợ cơ động ca tối.', tip: 'Khu vực gần sân bay hay kẹt xe – thời gian đến có thể dài hơn 3–5 phút.' },
    { id: 'go-vap', name: 'Gò Vấp', city: 'TP. Hồ Chí Minh', phase: 'Mở rộng', stage: 'Năm 2 – Quận thứ 6', mechanics: 22, eta: 18, jobs: 520, rating: 4.7,
      hot: ['Nguyễn Văn Bảo', 'Quang Trung', 'Phạm Văn Đồng', 'Lê Đức Thọ'], stations: ['Trạm đối tác gần ĐH Công nghiệp TP.HCM'],
      desc: 'Khu vực đông sinh viên, gần trụ sở nhóm dự án – đang thử nghiệm điểm bảo dưỡng tại ký túc xá.', tip: 'Sinh viên khu Nguyễn Văn Bảo có ưu đãi bảo dưỡng tại ký túc xá vào cuối tuần.' },
    { id: 'tan-binh', name: 'Tân Bình', city: 'TP. Hồ Chí Minh', phase: 'Sắp ra mắt', stage: 'Năm 3 – Toàn thành phố', mechanics: 0, eta: 0, jobs: 0, rating: 0,
      hot: ['Cộng Hòa', 'Trường Chinh', 'Hoàng Văn Thụ'], stations: [],
      desc: 'Thuộc kế hoạch mở rộng toàn TP.HCM ở Năm 3. Đăng ký sớm để nhận thông báo khi ra mắt.', tip: 'Thợ tại Tân Bình có thể đăng ký đối tác trước để được miễn phí hoa hồng 3 tháng đầu.' },
    { id: 'thu-duc', name: 'TP. Thủ Đức', city: 'TP. Hồ Chí Minh', phase: 'Sắp ra mắt', stage: 'Năm 3 – Toàn thành phố', mechanics: 0, eta: 0, jobs: 0, rating: 0,
      hot: ['Xa lộ Hà Nội', 'Võ Văn Ngân', 'Mai Chí Thọ'], stations: [],
      desc: 'Khu vực rộng, nhiều trường đại học và khu công nghệ cao – dự kiến bố trí trạm cứu hộ cơ động theo cụm.', tip: 'Đăng ký nhận tin để được ưu đãi khai trương.' },
    { id: 'ha-noi', name: 'Hà Nội', city: 'Hà Nội', phase: 'Sắp ra mắt', stage: 'Năm 4 – Quý 2', mechanics: 0, eta: 0, jobs: 0, rating: 0,
      hot: ['Hoàn Kiếm', 'Đống Đa', 'Cầu Giấy'], stations: [],
      desc: 'Thành phố thứ hai trong lộ trình phát triển, ra mắt cùng chuỗi cung ứng phụ tùng cho thợ đối tác.', tip: 'Thợ tại Hà Nội có thể đăng ký trước để được đào tạo theo chuẩn dịch vụ.' },
    { id: 'da-nang', name: 'Đà Nẵng', city: 'Đà Nẵng', phase: 'Sắp ra mắt', stage: 'Năm 4 – Quý 3', mechanics: 0, eta: 0, jobs: 0, rating: 0,
      hot: ['Hải Châu', 'Thanh Khê', 'Sơn Trà'], stations: [],
      desc: 'Ra mắt cùng gói thành viên/bảo hiểm cứu hộ theo năm và các hợp đồng doanh nghiệp B2B đầu tiên.', tip: 'Doanh nghiệp vận tải tại Đà Nẵng có thể liên hệ trước để khảo sát.' }
  ];
  AREAS.forEach(function (a) { a.img = 'img/kv/' + a.id + '.jpg'; });

  /* ---------- Hạng đối tác thợ (theo dự án) ---------- */
  var TIERS = [
    { id: 'moi', name: 'Thợ Mới', range: 'Dưới 20 cuốc đầu', fee: '0% (miễn phí 3 tháng đầu)', perks: 'Đào tạo chuẩn dịch vụ, kèm cặp bởi thợ Tinh hoa', color: '#94a3b8' },
    { id: 'chuan', name: 'Thợ Chuẩn', range: '4,0 – dưới 4,6 ★', fee: '15% phí công', perks: 'Nhận đơn tiêu chuẩn trong bán kính 3–5 km', color: '#1E5C9E' },
    { id: 'uutu', name: 'Thợ Ưu tú', range: '4,6 – dưới 4,9 ★', fee: '12% phí công', perks: 'Ưu tiên đơn giá trị cao, huy hiệu Ưu tú', color: '#FA7806' },
    { id: 'tinhhoa', name: 'Tinh hoa · Đội SOS', range: '4,9 – 5,0 ★', fee: '12% phí công', perks: 'Trực ca SOS 22h–5h: 30.000đ/cuốc, bảo đảm 200.000đ/đêm', color: '#0A2B54' }
  ];

  /* ---------- Đối tác thợ tiêu biểu (minh họa) ---------- */
  var MECHANICS = [
    { id: 'm01', name: 'Nguyễn Văn Hùng', tier: 'Tinh hoa · Đội SOS', rating: 4.97, jobs: 1284, area: 'Quận 1', years: 12, skills: ['Xe máy', 'Ô tô', 'Kéo xe'], quote: 'Đêm nào trực SOS cũng nghĩ: mình đến sớm một phút là khách bớt lo một phút.' },
    { id: 'm02', name: 'Trần Minh Tâm', tier: 'Thợ Ưu tú', rating: 4.88, jobs: 862, area: 'Quận 3', years: 8, skills: ['Xe máy', 'Điện xe'], quote: 'Báo giá rõ ràng trên app giúp tôi được khách tin, khách quen tăng gấp đôi.' },
    { id: 'm03', name: 'Lê Hoàng Phúc', tier: 'Thợ Ưu tú', rating: 4.86, jobs: 731, area: 'Quận 10', years: 6, skills: ['Xe máy', 'Xe điện'], quote: 'Thời gian rảnh ở tiệm giờ thành thu nhập thêm mỗi ngày.' },
    { id: 'm04', name: 'Phạm Quốc Việt', tier: 'Tinh hoa · Đội SOS', rating: 4.95, jobs: 1102, area: 'Quận 1', years: 15, skills: ['Ô tô', 'Chẩn đoán OBD'], quote: 'Khách cứu hộ ô tô ban đêm cần sự bình tĩnh và chuyên nghiệp nhất.' },
    { id: 'm05', name: 'Võ Thanh Sang', tier: 'Thợ Chuẩn', rating: 4.52, jobs: 214, area: 'Gò Vấp', years: 4, skills: ['Xe máy'], quote: 'Đang cố lên hạng Ưu tú trong quý này!' },
    { id: 'm06', name: 'Đặng Ngọc Thảo', tier: 'Thợ Ưu tú', rating: 4.9, jobs: 498, area: 'Quận 3', years: 5, skills: ['Xe máy', 'Bảo dưỡng tại nhà'], quote: 'Khách nữ thường yên tâm hơn khi thấy thợ nữ, mình tự hào vì điều đó.' }
  ];

  /* ---------- Chỉ mục blog (nội dung đầy đủ nằm trong html_blog.html) ---------- */
  var BLOG_CATS = ['Cứu hộ', 'Cẩm nang', 'Bảo dưỡng', 'Xe điện', 'An toàn', 'Câu chuyện thợ', 'Bốn Phương'];
  var BLOG_INDEX = [
    { id: 1, cat: 'Cứu hộ', featured: true, title: 'Thủng lốp giữa đêm: 5 bước xử lý an toàn trước khi thợ đến', excerpt: 'Dắt xe vào lề, bật cảnh báo, ghim vị trí và kiểm tra mã gặp mặt – những việc nên làm trong 15 phút chờ thợ.', date: '28/10/2026', readTime: 6 },
    { id: 2, cat: 'Cứu hộ', title: 'Xe chết máy giữa ngã tư: làm gì trong 60 giây đầu tiên?', excerpt: 'Giữ bình tĩnh, tín hiệu cho xe phía sau và đưa xe ra khỏi luồng giao thông đúng cách.', date: '24/10/2026', readTime: 5 },
    { id: 3, cat: 'Cứu hộ', title: 'Mưa ngập Sài Gòn: vì sao tuyệt đối không đề nổ khi xe chết máy trong nước?', excerpt: 'Nước vào buồng đốt gây thủy kích – lỗi có thể khiến bạn tốn cả chục triệu đồng chỉ vì một lần đề.', date: '20/10/2026', readTime: 7 },
    { id: 4, cat: 'Cứu hộ', title: 'Quên chìa trong cốp xe: cách xác minh chủ xe giúp bạn được mở khóa nhanh', excerpt: 'Chuẩn bị ảnh cà-vẹt trong Garage số để thợ khóa xác minh trong vòng 1 phút.', date: '15/10/2026', readTime: 4 },
    { id: 5, cat: 'Cứu hộ', title: 'Kéo xe máy đúng cách: dây kéo, tốc độ và những điều cấm', excerpt: 'Kéo xe bằng chân hay dây đều tiềm ẩn nguy hiểm. Đây là cách cứu hộ chuyên nghiệp thực hiện.', date: '10/10/2026', readTime: 5 },
    { id: 6, cat: 'Cẩm nang', featured: true, title: 'Đọc hiểu báo giá sửa xe: phí di chuyển, phí công và phụ tùng', excerpt: 'Ba dòng chi phí trên mọi hóa đơn và cách nhận biết khi báo giá “có vấn đề”.', date: '26/10/2026', readTime: 6 },
    { id: 7, cat: 'Cẩm nang', title: 'Giá trần là gì? Vì sao bạn không bao giờ phải trả quá mức này', excerpt: 'Cơ chế giá trần và hoàn chênh lệch giúp khách hàng yên tâm trước khi thợ đến.', date: '18/10/2026', readTime: 5 },
    { id: 8, cat: 'Cẩm nang', title: '7 dấu hiệu ắc quy xe máy sắp “hết đát”', excerpt: 'Đề yếu, đèn mờ, còi rè… nhận biết sớm để không bị kẹt giữa đường.', date: '12/10/2026', readTime: 4 },
    { id: 9, cat: 'Cẩm nang', title: 'Lốp có săm và không săm: chọn loại nào cho xe đi phố?', excerpt: 'So sánh độ an toàn, chi phí và cách xử lý khi thủng của hai loại lốp phổ biến.', date: '05/10/2026', readTime: 6 },
    { id: 10, cat: 'Cẩm nang', title: 'Đèn check engine sáng: khi nào cần dừng xe ngay?', excerpt: 'Đèn sáng liên tục và đèn nhấp nháy mang ý nghĩa khác nhau – đừng chủ quan.', date: '28/09/2026', readTime: 5 },
    { id: 11, cat: 'Bảo dưỡng', featured: true, title: 'Lịch bảo dưỡng xe tay ga theo số km: bảng tra nhanh', excerpt: 'Nhớt máy, nhớt láp, dây curoa, bugi… mỗi hạng mục nên thay khi nào?', date: '22/10/2026', readTime: 7 },
    { id: 12, cat: 'Bảo dưỡng', title: 'Thay nhớt bao lâu một lần? Câu trả lời cho người đi phố đông', excerpt: 'Xe chạy ngắn, dừng nhiều trong đô thị cần thay nhớt sớm hơn bạn nghĩ.', date: '14/10/2026', readTime: 4 },
    { id: 13, cat: 'Bảo dưỡng', title: 'Checklist 25 hạng mục trước chuyến về quê dịp Tết', excerpt: 'Danh sách kiểm tra gọn trong một trang, in ra dán cốp xe cũng được.', date: '08/10/2026', readTime: 8 },
    { id: 14, cat: 'Bảo dưỡng', title: 'Bảo dưỡng ô tô tại tầng hầm chung cư: có an toàn không?', excerpt: 'Những hạng mục làm được tại chỗ và những hạng mục nên đưa xe về gara.', date: '30/09/2026', readTime: 6 },
    { id: 15, cat: 'Bảo dưỡng', title: 'Xích kêu, nhông mòn: tự kiểm tra trong 2 phút', excerpt: 'Cách đo độ chùng xích và nhận biết răng nhông mòn bằng mắt thường.', date: '20/09/2026', readTime: 4 },
    { id: 16, cat: 'Xe điện', featured: true, title: 'Xe máy điện hết pin giữa đường: các phương án cứu hộ', excerpt: 'Sạc lưu động, kéo về trạm hay đổi pin – chọn cách nào nhanh và rẻ nhất?', date: '25/10/2026', readTime: 6 },
    { id: 17, cat: 'Xe điện', title: 'Sạc xe điện qua đêm: thói quen cần bỏ ngay', excerpt: 'Nhiệt độ, thời gian sạc và vị trí đặt xe ảnh hưởng thế nào tới tuổi thọ pin.', date: '16/10/2026', readTime: 5 },
    { id: 18, cat: 'Xe điện', title: 'Xe điện đi mưa ngập: bảo vệ pin và bộ điều khiển', excerpt: 'Mức nước an toàn, cách xử lý sau khi lội nước và khi nào cần gọi cứu hộ.', date: '02/10/2026', readTime: 5 },
    { id: 19, cat: 'Xe điện', title: 'Đọc báo cáo sức khỏe pin: con số % nói lên điều gì?', excerpt: 'Dung lượng thực, nội trở và chu kỳ sạc – hiểu đúng để dùng pin bền hơn.', date: '22/09/2026', readTime: 5 },
    { id: 20, cat: 'An toàn', featured: true, title: 'Đi xe một mình ban đêm: bật chế độ an toàn trước khi gọi cứu hộ', excerpt: 'Chia sẻ hành trình, mã gặp mặt và nút SOS – ba lớp bảo vệ khi bạn gặp sự cố lúc khuya.', date: '27/10/2026', readTime: 6 },
    { id: 21, cat: 'An toàn', title: 'Mã gặp mặt 4 số: vì sao thợ phải đọc đúng mã mới được nhận xe?', excerpt: 'Cơ chế xác thực đơn giản giúp chống mạo danh và bảo vệ tài sản của bạn.', date: '19/10/2026', readTime: 4 },
    { id: 22, cat: 'An toàn', title: 'Bộ đồ nghề tối thiểu nên có trong cốp xe máy', excerpt: 'Bơm mini, keo vá, đèn pin, áo mưa… gọn nhẹ mà cứu bạn nhiều lần.', date: '11/10/2026', readTime: 4 },
    { id: 23, cat: 'An toàn', title: 'Dừng xe khẩn cấp trên cầu và đường cao tốc: quy tắc vàng', excerpt: 'Vị trí đứng, cách đặt cảnh báo và những sai lầm có thể gây tai nạn liên hoàn.', date: '03/10/2026', readTime: 5 },
    { id: 24, cat: 'Câu chuyện thợ', featured: true, title: 'Một đêm trực SOS cùng anh Hùng – thợ Tinh hoa Quận 1', excerpt: 'Từ 22h đến 5h sáng, 9 cuốc cứu hộ và câu chuyện về nghề “đến sớm một phút”.', date: '23/10/2026', readTime: 7 },
    { id: 25, cat: 'Câu chuyện thợ', title: 'Từ tiệm sửa xe vắng khách đến 30 cuốc mỗi tuần', excerpt: 'Anh Tâm chia sẻ cách tận dụng thời gian rảnh để tăng thu nhập cùng nền tảng.', date: '13/10/2026', readTime: 6 },
    { id: 26, cat: 'Câu chuyện thợ', title: 'Thu nhập một cuốc cứu hộ được tính như thế nào?', excerpt: 'Ví dụ minh bạch: 200.000đ phí công + 100.000đ phụ tùng + thưởng – hoa hồng = 320.000đ.', date: '06/10/2026', readTime: 5 },
    { id: 27, cat: 'Bốn Phương', featured: true, title: 'Gắn Kết Bốn Phương ra mắt thí điểm tại 3 quận trung tâm TP.HCM', excerpt: '150 thợ đối tác đạt chuẩn, mục tiêu thợ đến trong 15 phút và minh bạch giá từng cuốc.', date: '01/09/2026', readTime: 5 },
    { id: 28, cat: 'Bốn Phương', title: 'Lá Chắn Số – gói thành viên bảo vệ bạn cả năm', excerpt: 'Từ gói Sinh viên 99.000đ đến gói Doanh nghiệp, quyền lợi nào phù hợp với bạn?', date: '15/09/2026', readTime: 5 },
    { id: 29, cat: 'Bốn Phương', title: 'Quy trình khiếu nại 4 bước: cam kết phản hồi trong 24 giờ', excerpt: 'Tiếp nhận trong 2 giờ, phản hồi ban đầu 24 giờ, vụ việc phức tạp xử lý tối đa 72 giờ.', date: '29/09/2026', readTime: 5 },
    { id: 30, cat: 'Bốn Phương', title: 'Hành trình 5 năm: từ 150 thợ đến 1.900 đối tác trên toàn quốc', excerpt: 'Lộ trình mở rộng từ 3 quận trung tâm ra toàn TP.HCM, Hà Nội và Đà Nẵng.', date: '07/10/2026', readTime: 6 }
  ];
  BLOG_INDEX.forEach(function (p) { p.img = 'img/blog/b' + (p.id < 10 ? '0' : '') + p.id + '.jpg'; });

  /* ---------- Trang (cho tìm kiếm & sơ đồ) ---------- */
  var PAGES = [
    { url: 'html_trangchu.html', name: 'Trang chủ', icon: 'fa-home', kw: 'trang chủ cứu hộ sửa xe' },
    { url: 'html_dichvu.html', name: 'Dịch vụ cứu hộ & sửa xe', icon: 'fa-tools', kw: 'dịch vụ gói phụ tùng bảng giá' },
    { url: 'html_diadiem.html', name: 'Khu vực phục vụ', icon: 'fa-map-marked-alt', kw: 'khu vực quận trạm đối tác' },
    { url: 'html_khuyenmaivatiepthi.html', name: 'Voucher & ưu đãi', icon: 'fa-ticket-alt', kw: 'voucher khuyến mãi mã giảm giá' },
    { url: 'html_gioithieu.html', name: 'Giới thiệu dự án', icon: 'fa-info-circle', kw: 'giới thiệu đội ngũ tầm nhìn sứ mệnh' },
    { url: 'html_blog.html', name: 'Blog cẩm nang', icon: 'fa-newspaper', kw: 'blog bài viết cẩm nang' },
    { url: 'html_lienhe_chinhsach.html', name: 'Liên hệ & chính sách', icon: 'fa-headset', kw: 'liên hệ chính sách khiếu nại bảo hành đối tác thợ' },
    { url: 'html_giohang.html', name: 'Giỏ dịch vụ', icon: 'fa-shopping-cart', kw: 'giỏ hàng' },
    { url: 'html_thanhtoan.html', name: 'Thanh toán', icon: 'fa-credit-card', kw: 'thanh toán' },
    { url: 'html_thongtin.html', name: 'Garage số – Tài khoản', icon: 'fa-user-cog', kw: 'tài khoản garage xe của tôi lịch sử' },
    { url: 'html_dangnhap_dangky.html', name: 'Đăng nhập / Đăng ký', icon: 'fa-sign-in-alt', kw: 'đăng nhập đăng ký' },
    { url: 'html_sitemap.html', name: 'Sơ đồ website', icon: 'fa-sitemap', kw: 'sơ đồ sitemap' }
  ];

  W.GK_DATA = {
    BRAND: BRAND, VEHICLES: VEHICLES, INCIDENTS: INCIDENTS, CATS: CATS, SERVICES: SERVICES,
    AREAS: AREAS, TIERS: TIERS, MECHANICS: MECHANICS, BLOG_CATS: BLOG_CATS, BLOG_INDEX: BLOG_INDEX, PAGES: PAGES,
    findService: function (id) { for (var i = 0; i < SERVICES.length; i++) if (SERVICES[i].id === id) return SERVICES[i]; return null; },
    vnd: vnd
  };
})(window);
