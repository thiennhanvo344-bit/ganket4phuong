/* ==========================================================================
   gkbp-voucher.js — Hệ thống voucher Gắn Kết Bốn Phương
   GK_VOUCHER.LIST · saveVoucher(code) · validate(code, subtotal) · getBestVoucher(sub)
   renderQuickSelect(containerId, inputId, sub, items?) · renderInventory(containerId) · markUsed(code)
   • Mã “công khai” áp dụng ngay; các mã còn lại cần LƯU vào kho voucher của tài khoản.
   • Mỗi mã có phạm vi (nhóm dịch vụ / dịch vụ cụ thể), đơn tối thiểu, mức giảm tối đa, hạn dùng.
   ========================================================================== */
(function (W, D) {
  'use strict';
  var KEY = 'gkbp_saved_vouchers';

  function V(o) { return o; }
  var LIST = [
    /* ── CỨU HỘ (6) ── */
    V({ id: 'v01', cat: 'cuuho', headClass: 'km-vc-cuuho', badge: '🔥 Hot', code: 'CUUHO15', title: 'Cứu hộ khẩn cấp – Giảm 15%', desc: 'Giảm 15% cho mọi cuốc cứu hộ: vá lốp, kích bình, chết máy, hết xăng, mở khóa, kéo xe. Áp dụng tại cả 3 quận thí điểm và các quận mở rộng.', discount: 'Giảm 15%', applies: 'Nhóm Cứu hộ khẩn cấp · tối đa 50.000đ', expires: '31/12/2026', icon: '🚨', img: 'img/dv/ch01-2.jpg', type: 'pct', value: 15, max: 50000, min: 100000, cats: ['Cứu hộ khẩn cấp'], public: true }),
    V({ id: 'v02', cat: 'cuuho', headClass: 'km-vc-cuuho', badge: '🌙 Ca đêm', code: 'DEMANTOAN', title: 'Ca đêm an toàn – Giảm 30.000đ', desc: 'Gặp sự cố từ 22h đến 5h sáng? Đội thợ SOS trực đêm luôn sẵn sàng, kèm chế độ chia sẻ hành trình và mã gặp mặt.', discount: '−30.000đ', applies: 'Cứu hộ khẩn cấp · đơn từ 120.000đ', expires: '31/12/2026', icon: '🌙', img: 'img/dv/ch05-2.jpg', type: 'fixed', value: 30000, min: 120000, cats: ['Cứu hộ khẩn cấp'] }),
    V({ id: 'v03', cat: 'cuuho', headClass: 'km-vc-cuuho', badge: '🌧️ Mùa mưa', code: 'MUANGAP25', title: 'Mùa mưa ngập – Giảm 25% kéo xe', desc: 'Xe chết máy vì ngập nước tuyệt đối không đề nổ. Gọi kéo xe về tiệm đối tác, giảm ngay 25% phí kéo.', discount: 'Giảm 25%', applies: 'Kéo xe máy, ô tô, xe điện · tối đa 150.000đ', expires: '30/11/2026', icon: '🌧️', img: 'img/dv/ch12-2.jpg', type: 'pct', value: 25, max: 150000, min: 200000, ids: ['ch11', 'ch12', 'xd04'] }),
    V({ id: 'v04', cat: 'cuuho', headClass: 'km-vc-cuuho', badge: '🛞 Vá lốp', code: 'VALOP20K', title: 'Vá lốp tận nơi – Giảm 20.000đ', desc: 'Thủng lốp giữa đường không còn là nỗi lo: thợ đến trong khoảng 15 phút, báo giá trước, vá xong có ảnh trước – sau.', discount: '−20.000đ', applies: 'Vá lốp xe máy, ô tô, xe điện', expires: '31/12/2026', icon: '🛞', img: 'img/dv/ch01-1.jpg', type: 'fixed', value: 20000, min: 100000, ids: ['ch01', 'ch02', 'xd03'] }),
    V({ id: 'v05', cat: 'cuuho', headClass: 'km-vc-cuuho', badge: '🔋 Ắc quy', code: 'KICHBINH30', title: 'Kích bình ắc quy – Giảm 30.000đ', desc: 'Xe để lâu không đề được? Kích bình tận nơi và đo kiểm hệ thống sạc miễn phí trong cùng cuốc.', discount: '−30.000đ', applies: 'Kích bình xe máy & ô tô', expires: '31/12/2026', icon: '🔋', img: 'img/dv/ch03-1.jpg', type: 'fixed', value: 30000, min: 150000, ids: ['ch03', 'ch04'] }),
    V({ id: 'v06', cat: 'cuuho', headClass: 'km-vc-cuuho', badge: '🚛 Ô tô', code: 'KEOXE100', title: 'Xe cứu hộ sàn trượt – Giảm 100.000đ', desc: 'Áp dụng cho xe cứu hộ sàn trượt kéo ô tô trong khu vực phục vụ, không kéo lê bánh, an toàn cho xe số tự động.', discount: '−100.000đ', applies: 'Xe cứu hộ sàn trượt · đơn từ 800.000đ', expires: '31/01/2027', icon: '🚛', img: 'img/dv/ch12-1.jpg', type: 'fixed', value: 100000, min: 800000, ids: ['ch12'] }),
    /* ── SỬA CHỮA (5) ── */
    V({ id: 'v07', cat: 'suachua', headClass: 'km-vc-suachua', badge: '🔧 Phổ biến', code: 'SUAXE10', title: 'Sửa chữa tại chỗ – Giảm 10%', desc: 'Bugi, phanh, điện, dây curoa, nhông xích… sửa ngay tại nhà hoặc nơi làm việc, bảo hành tối thiểu 30 ngày.', discount: 'Giảm 10%', applies: 'Nhóm Sửa chữa tại chỗ · tối đa 80.000đ', expires: '31/12/2026', icon: '🔧', img: 'img/dv/sc01-1.jpg', type: 'pct', value: 10, max: 80000, min: 150000, cats: ['Sửa chữa tại chỗ'], public: true }),
    V({ id: 'v08', cat: 'suachua', headClass: 'km-vc-suachua', badge: '⚙️ Tay ga', code: 'CUROA50', title: 'Thay dây curoa – Giảm 50.000đ', desc: 'Xe tay ga ì máy, rú ga không chạy? Thay dây curoa kèm vệ sinh lốc nồi tận nơi, bảo hành 3 tháng.', discount: '−50.000đ', applies: 'Thay dây curoa xe tay ga', expires: '31/12/2026', icon: '⚙️', img: 'img/dv/sc04-1.jpg', type: 'fixed', value: 50000, min: 400000, ids: ['sc04'] }),
    V({ id: 'v09', cat: 'suachua', headClass: 'km-vc-suachua', badge: '🛑 An toàn', code: 'PHANHAN20', title: 'Phanh an toàn – Giảm 20%', desc: 'Kiểm tra và thay má phanh cho xe máy, ô tô. Phanh tốt là lớp bảo vệ đầu tiên trên mọi nẻo đường.', discount: 'Giảm 20%', applies: 'Sửa phanh xe máy & ô tô · tối đa 60.000đ', expires: '31/12/2026', icon: '🛑', img: 'img/dv/sc02-1.jpg', type: 'pct', value: 20, max: 60000, min: 150000, ids: ['sc02', 'sc06'] }),
    V({ id: 'v10', cat: 'suachua', headClass: 'km-vc-suachua', badge: '💡 Điện xe', code: 'DIENXE25', title: 'Sửa điện xe máy – Giảm 25.000đ', desc: 'Đèn chập chờn, còi tắt tiếng, xi-nhan không chớp – dò mạch và xử lý tận nơi.', discount: '−25.000đ', applies: 'Sửa điện: đèn, còi, xi-nhan, sạc', expires: '31/12/2026', icon: '💡', img: 'img/dv/sc03-1.jpg', type: 'fixed', value: 25000, min: 150000, ids: ['sc03'] }),
    V({ id: 'v11', cat: 'suachua', headClass: 'km-vc-suachua', badge: '🚗 Ô tô', code: 'OTO100K', title: 'Dịch vụ ô tô – Giảm 100.000đ', desc: 'Giảm 100.000đ cho các dịch vụ ô tô từ 500.000đ: thay má phanh, bảo dưỡng tại hầm, chẩn đoán OBD…', discount: '−100.000đ', applies: 'Dịch vụ dành cho ô tô · đơn từ 500.000đ', expires: '31/01/2027', icon: '🚗', img: 'img/dv/sc06-1.jpg', type: 'fixed', value: 100000, min: 500000, ids: ['ch02', 'ch04', 'ch06', 'ch08', 'ch10', 'ch12', 'sc06', 'bd04'] }),
    /* ── BẢO DƯỠNG (5) ── */
    V({ id: 'v12', cat: 'baoduong', headClass: 'km-vc-baoduong', badge: '🛢️ Tận nhà', code: 'NHOT20', title: 'Thay nhớt tận nhà – Giảm 20%', desc: 'Không cần xếp hàng ở tiệm: thợ đến tận nhà, ký túc xá, bãi xe công ty và ghi sổ bảo dưỡng điện tử.', discount: 'Giảm 20%', applies: 'Thay nhớt tận nhà · tối đa 40.000đ', expires: '31/12/2026', icon: '🛢️', img: 'img/dv/bd01-1.jpg', type: 'pct', value: 20, max: 40000, min: 100000, ids: ['bd01'] }),
    V({ id: 'v13', cat: 'baoduong', headClass: 'km-vc-baoduong', badge: '📋 Định kỳ', code: 'BAODUONG50', title: 'Bảo dưỡng định kỳ – Giảm 50.000đ', desc: 'Áp dụng cho gói bảo dưỡng xe tay ga, xe số và ô tô cấp nhỏ, có checklist ảnh từng hạng mục.', discount: '−50.000đ', applies: 'Gói bảo dưỡng định kỳ · đơn từ 250.000đ', expires: '31/12/2026', icon: '📋', img: 'img/dv/bd02-1.jpg', type: 'fixed', value: 50000, min: 250000, ids: ['bd02', 'bd03', 'bd04'] }),
    V({ id: 'v14', cat: 'baoduong', headClass: 'km-vc-baoduong', badge: '🛣️ Về quê', code: 'VEQUE25', title: 'Hành trình về quê – Giảm 25%', desc: 'Kiểm tra 25 hạng mục trước khi chạy xe đường dài dịp lễ Tết, tặng kèm tem QR cứu hộ và lộ trình điểm dừng nghỉ.', discount: 'Giảm 25%', applies: 'Gói kiểm tra 25 hạng mục', expires: '28/02/2027', icon: '🛣️', img: 'img/dv/bd05-1.jpg', type: 'pct', value: 25, max: 60000, min: 150000, ids: ['bd05'] }),
    V({ id: 'v15', cat: 'baoduong', headClass: 'km-vc-baoduong', badge: '🧪 Tiết kiệm xăng', code: 'KIMPHUN30', title: 'Vệ sinh kim phun – Giảm 30.000đ', desc: 'Xe phun xăng điện tử hao xăng, ga không bốc? Vệ sinh kim phun bằng máy chuyên dụng, không cần rã máy.', discount: '−30.000đ', applies: 'Vệ sinh kim phun – buồng đốt', expires: '31/12/2026', icon: '🧪', img: 'img/dv/bd06-1.jpg', type: 'fixed', value: 30000, min: 200000, ids: ['bd06'] }),
    V({ id: 'v16', cat: 'baoduong', headClass: 'km-vc-baoduong', badge: '⚡ Xe điện', code: 'XEDIEN20', title: 'Dịch vụ xe điện – Giảm 20%', desc: 'Sạc lưu động, kiểm tra pin, vá lốp và kéo xe điện – dịch vụ mới cho người dùng xe máy điện.', discount: 'Giảm 20%', applies: 'Nhóm Xe điện · tối đa 50.000đ', expires: '31/12/2026', icon: '⚡', img: 'img/dv/xd01-1.jpg', type: 'pct', value: 20, max: 50000, min: 120000, cats: ['Xe điện'] }),
    /* ── THÀNH VIÊN (5) ── */
    V({ id: 'v17', cat: 'thanhvien', headClass: 'km-vc-thanhvien', badge: '🎁 Chào mừng', code: 'CHAOBAN30', title: 'Chào thành viên mới – Giảm 30.000đ', desc: 'Quà chào mừng khi tạo tài khoản: giảm 30.000đ cho đơn đầu tiên bất kỳ từ 80.000đ.', discount: '−30.000đ', applies: 'Mọi dịch vụ · đơn từ 80.000đ', expires: '31/12/2026', icon: '🎁', img: 'img/dv/gt01-1.jpg', type: 'fixed', value: 30000, min: 80000, all: true }),
    V({ id: 'v18', cat: 'thanhvien', headClass: 'km-vc-thanhvien', badge: '🎓 Sinh viên', code: 'SINHVIEN20', title: 'Gói Sinh viên – Giảm 20%', desc: 'Sinh viên đăng ký Lá Chắn Số – Gói Sinh viên được giảm thêm 20%, an tâm cả năm học.', discount: 'Giảm 20%', applies: 'Lá Chắn Số – Gói Sinh viên', expires: '31/12/2026', icon: '🎓', img: 'img/dv/gt02-1.jpg', type: 'pct', value: 20, max: 30000, min: 90000, ids: ['gt02'] }),
    V({ id: 'v19', cat: 'thanhvien', headClass: 'km-vc-thanhvien', badge: '🛡️ Lá Chắn Số', code: 'LACHANSO50', title: 'Gói Cá nhân & Gia đình – Giảm 50.000đ', desc: 'Kích hoạt gói bảo vệ cả năm với ưu tiên điều phối giờ cao điểm và các lượt miễn phí di chuyển.', discount: '−50.000đ', applies: 'Gói Cá nhân, Gói Gia đình', expires: '31/12/2026', icon: '🛡️', img: 'img/dv/gt03-1.jpg', type: 'fixed', value: 50000, min: 199000, ids: ['gt03', 'gt04'] }),
    V({ id: 'v20', cat: 'thanhvien', headClass: 'km-vc-thanhvien', badge: '👨‍👩‍👧 Gia đình', code: 'GIADINH10', title: 'Gói Gia đình – Giảm 10%', desc: 'Một gói bảo vệ đến 3 xe, chia sẻ hành trình cứu hộ cho người thân.', discount: 'Giảm 10%', applies: 'Lá Chắn Số – Gói Gia đình', expires: '31/01/2027', icon: '👨‍👩‍👧', img: 'img/dv/gt04-1.jpg', type: 'pct', value: 10, max: 60000, min: 400000, ids: ['gt04'] }),
    V({ id: 'v21', cat: 'thanhvien', headClass: 'km-vc-thanhvien', badge: '🎉 Ra mắt', code: 'BONPHUONG50', title: 'Mừng ra mắt – Giảm 50%', desc: 'Mừng Gắn Kết Bốn Phương ra mắt thí điểm: giảm 50% tối đa 100.000đ cho đơn từ 300.000đ.', discount: 'Giảm 50%', applies: 'Mọi dịch vụ · tối đa 100.000đ', expires: '30/11/2026', icon: '🎉', img: 'img/dv/ch12-3.jpg', type: 'pct', value: 50, max: 100000, min: 300000, all: true }),
    /* ── PHỤ TÙNG (5) ── */
    V({ id: 'v22', cat: 'phutung', headClass: 'km-vc-phutung', badge: '📦 Phụ tùng', code: 'PHUTUNG10', title: 'Phụ tùng & phụ kiện – Giảm 10%', desc: 'Lốp, ắc quy, nhớt, bộ vá lốp… giao trong 2 giờ hoặc thợ mang đến lắp tận nơi.', discount: 'Giảm 10%', applies: 'Nhóm Phụ tùng & Phụ kiện · tối đa 100.000đ', expires: '31/12/2026', icon: '📦', img: 'img/dv/pt01-2.jpg', type: 'pct', value: 10, max: 100000, min: 150000, cats: ['Phụ tùng & Phụ kiện'], public: true }),
    V({ id: 'v23', cat: 'phutung', headClass: 'km-vc-phutung', badge: '🔋 Ắc quy', code: 'ACQUY50', title: 'Ắc quy xe máy – Giảm 50.000đ', desc: 'Ắc quy khô 12V – 5Ah lắp tận nơi, thu hồi bình cũ đúng quy định, bảo hành 12 tháng.', discount: '−50.000đ', applies: 'Ắc quy khô xe máy', expires: '31/12/2026', icon: '🔋', img: 'img/dv/pt02-1.jpg', type: 'fixed', value: 50000, min: 400000, ids: ['pt02'] }),
    V({ id: 'v24', cat: 'phutung', headClass: 'km-vc-phutung', badge: '🛞 Lốp mới', code: 'LOPMOI40', title: 'Lốp không săm – Giảm 40.000đ', desc: 'Lốp gai đa dụng bám đường mùa mưa, giá đã gồm công thay tận nơi.', discount: '−40.000đ', applies: 'Lốp không săm xe tay ga', expires: '31/12/2026', icon: '🛞', img: 'img/dv/pt03-1.jpg', type: 'fixed', value: 40000, min: 450000, ids: ['pt03'] }),
    V({ id: 'v25', cat: 'phutung', headClass: 'km-vc-phutung', badge: '📱 Độc quyền', code: 'TEMQR', title: 'Tem QR cứu hộ – Miễn phí', desc: 'Quét mã là gọi cứu hộ, không cần cài ứng dụng. Miễn phí 1 tem khi mua kèm.', discount: 'Miễn phí tem', applies: 'Tem QR cứu hộ dán xe', expires: '31/12/2026', icon: '📱', img: 'img/dv/pt05-1.jpg', type: 'fixed', value: 29000, min: 29000, ids: ['pt05'] }),
    V({ id: 'v26', cat: 'phutung', headClass: 'km-vc-phutung', badge: '🎒 Bán chạy', code: 'BOVALOP60', title: 'Bộ vá lốp mini – Giảm 60.000đ', desc: 'Bơm điện mini sạc USB-C, keo vá và dụng cụ cắm vá nấm – tự xử lý tình huống xì lốp cơ bản.', discount: '−60.000đ', applies: 'Bộ vá lốp khẩn cấp mini', expires: '31/12/2026', icon: '🎒', img: 'img/dv/pt01-1.jpg', type: 'fixed', value: 60000, min: 350000, ids: ['pt01'] })
  ];
  var BY = {}; LIST.forEach(function (v) { BY[v.code] = v; });

  function core() { return W.GKBP; }
  function uk() { var u = core() && core().getUser(); return u ? (u.email || u.phone || u.name) : null; }
  function store() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function mine() { var k = uk(); if (!k) return []; return store()[k] || []; }
  function setMine(arr) { var k = uk(); if (!k) return; var s = store(); s[k] = arr; save(s); }
  function fmtVND(n) { return (Math.round(n) || 0).toLocaleString('vi-VN') + 'đ'; }
  function parseDate(d) { var p = String(d).split('/'); return new Date(+p[2], +p[1] - 1, +p[0], 23, 59, 59); }
  function expired(v) { return parseDate(v.expires) < new Date(); }
  function toast(t, m) { if (core()) core().showToast(t, m); }

  function currentItems() {
    try { var co = JSON.parse(sessionStorage.getItem('gkbp_checkout') || 'null'); if (co) return [co]; } catch (e) {}
    return core() ? core().getCart() : [];
  }
  function lineTotal(it) {
    if (it.totalPrice) return Number(it.totalPrice);
    return (Number(it.price) || 0) * (Number(it.adult) || Number(it.qty) || 1);
  }
  function eligibleSub(v, items, sub) {
    if (v.all) return sub;
    var s = 0, hit = false;
    (items || []).forEach(function (it) {
      var svc = W.GK_DATA ? W.GK_DATA.findService(it.id) : null;
      var cat = it.cat || (svc && svc.cat);
      if ((v.cats && v.cats.indexOf(cat) > -1) || (v.ids && v.ids.indexOf(it.id) > -1)) { s += lineTotal(it); hit = true; }
    });
    return hit ? Math.min(s, sub || s) : 0;
  }
  function calc(v, base) { return v.type === 'pct' ? Math.min(Math.round(base * v.value / 100), v.max || Infinity) : Math.min(v.value, base); }

  function isSaved(code) { return mine().some(function (x) { return x.code === code; }); }
  function isUsed(code) { return mine().some(function (x) { return x.code === code && x.used; }); }

  function validate(code, sub, items) {
    code = String(code || '').trim().toUpperCase();
    if (!code) return { success: false, msg: 'Vui lòng nhập mã voucher.' };
    var v = BY[code];
    if (!v) return { success: false, msg: 'Mã “' + code + '” không tồn tại. Kiểm tra lại hoặc xem trang Voucher.' };
    if (expired(v)) return { success: false, msg: 'Mã ' + code + ' đã hết hạn sử dụng (' + v.expires + ').' };
    if (!v.public && !uk()) return { success: false, msg: 'Vui lòng đăng nhập để dùng mã trong kho voucher.' };
    if (!v.public && !isSaved(code)) return { success: false, msg: 'Mã ' + code + ' chưa có trong kho voucher của bạn – vào trang Voucher và bấm “Lưu mã”.' };
    if (isUsed(code)) return { success: false, msg: 'Bạn đã sử dụng mã ' + code + ' cho một đơn trước đó.' };
    sub = Number(sub) || 0;
    if (sub < (v.min || 0)) return { success: false, msg: 'Đơn tối thiểu ' + fmtVND(v.min) + ' để dùng mã ' + code + ' (còn thiếu ' + fmtVND(v.min - sub) + ').' };
    var base = eligibleSub(v, items || currentItems(), sub);
    if (!base) return { success: false, msg: 'Mã ' + code + ' chỉ áp dụng cho: ' + v.applies + '.' };
    var d = calc(v, base);
    return { success: true, discountAmount: d, voucher: v, msg: '<i class="fas fa-check-circle mr-1"></i>Áp dụng thành công! Giảm <b>' + fmtVND(d) + '</b> với mã ' + code + '.' };
  }

  function candidates() {
    var codes = mine().filter(function (x) { return !x.used; }).map(function (x) { return x.code; });
    LIST.forEach(function (v) { if (v.public && codes.indexOf(v.code) < 0) codes.push(v.code); });
    return codes.map(function (c) { return BY[c]; }).filter(Boolean);
  }
  function getBestVoucher(sub, items) {
    var best = null;
    candidates().forEach(function (v) { var r = validate(v.code, sub, items); if (r.success && (!best || r.discountAmount > best.discountAmount)) best = { voucher: v, discountAmount: r.discountAmount }; });
    return best;
  }

  function saveVoucher(code, btn) {
    var v = BY[String(code || '').toUpperCase()];
    if (!v) { toast('error', 'Mã voucher không tồn tại.'); return false; }
    if (!uk()) { if (core()) core().requireLogin('html_khuyenmaivatiepthi.html', 'Đăng nhập để lưu voucher vào kho của bạn.'); return false; }
    var arr = mine();
    if (arr.some(function (x) { return x.code === v.code; })) { toast('info', 'Mã ' + v.code + ' đã có trong kho voucher.'); markButtons(); return true; }
    arr.push({ code: v.code, savedAt: Date.now(), used: false }); setMine(arr);
    toast('success', 'Đã lưu mã <b>' + v.code + '</b> vào kho voucher!');
    markButtons(); return true;
  }
  function markUsed(code) {
    var arr = mine(), hit = false;
    arr.forEach(function (x) { if (x.code === code) { x.used = true; x.usedAt = Date.now(); hit = true; } });
    if (!hit && BY[code] && !BY[code].public) arr.push({ code: code, savedAt: Date.now(), used: true, usedAt: Date.now() });
    setMine(arr);
  }
  function markButtons() {
    var btns = D.querySelectorAll('[data-voucher-code]');
    for (var i = 0; i < btns.length; i++) {
      var c = btns[i].getAttribute('data-voucher-code');
      if (isSaved(c)) { btns[i].classList.add('saved'); btns[i].innerHTML = '<i class="fas fa-check mr-1"></i>Đã lưu'; }
    }
  }

  function renderQuickSelect(containerId, inputId, sub, items) {
    var box = D.getElementById(containerId); if (!box) return;
    var list = candidates();
    if (!list.length) { box.innerHTML = '<div class="kmv-empty"><i class="fas fa-ticket-alt mr-1"></i>Chưa có voucher. <a href="html_khuyenmaivatiepthi.html">Săn mã ngay</a></div>'; return; }
    var rows = list.map(function (v) { var r = validate(v.code, sub, items); return { v: v, r: r }; })
      .sort(function (a, b) { return (b.r.success ? b.r.discountAmount : -1) - (a.r.success ? a.r.discountAmount : -1); });
    box.innerHTML = '<div class="kmv-quick-title">Voucher dùng được' + (uk() ? '' : ' (mã công khai)') + '</div>' + rows.map(function (x) {
      return '<button type="button" class="kmv-chip' + (x.r.success ? '' : ' off') + '" data-code="' + x.v.code + '" title="' + (x.r.success ? 'Giảm ' + fmtVND(x.r.discountAmount) : String(x.r.msg).replace(/<[^>]+>/g, '')) + '">' +
        '<span class="kmv-chip-ico">' + x.v.icon + '</span><span class="kmv-chip-code">' + x.v.code + '</span>' +
        '<span class="kmv-chip-val">' + (x.r.success ? '−' + fmtVND(x.r.discountAmount) : 'Chưa đủ điều kiện') + '</span></button>';
    }).join('');
    var chips = box.querySelectorAll('.kmv-chip');
    for (var i = 0; i < chips.length; i++) chips[i].addEventListener('click', function () {
      var inp = D.getElementById(inputId); if (inp) { inp.value = this.getAttribute('data-code'); inp.disabled = false; }
      if (typeof W.applyCoupon === 'function') W.applyCoupon();
    });
  }

  function renderInventory(containerId) {
    var box = D.getElementById(containerId || 'kmv-inventory-container'); if (!box) return;
    var arr = mine();
    if (!arr.length) { box.innerHTML = '<div class="kmv-inv-empty"><div class="kmv-inv-empty-ico">🎟️</div><b>Kho voucher đang trống</b><p>Lưu mã ở trang Voucher để dùng khi đặt cứu hộ, sửa xe hoặc mua phụ tùng.</p><a href="html_khuyenmaivatiepthi.html" class="gk-btn-orange">Săn voucher ngay</a></div>'; return; }
    box.innerHTML = '<div class="kmv-inv-grid">' + arr.slice().reverse().map(function (x) {
      var v = BY[x.code]; if (!v) return '';
      var st = x.used ? ['Đã dùng', 'used'] : expired(v) ? ['Hết hạn', 'exp'] : ['Còn hạn', 'ok'];
      return '<div class="kmv-inv-card ' + st[1] + '"><div class="kmv-inv-left ' + v.headClass + '"><span>' + v.icon + '</span><b>' + v.discount + '</b></div>' +
        '<div class="kmv-inv-body"><div class="kmv-inv-title">' + v.title + '</div><div class="kmv-inv-meta">' + v.applies + '</div>' +
        '<div class="kmv-inv-foot"><code>' + v.code + '</code><span class="kmv-inv-st">' + st[0] + '</span><small>HSD ' + v.expires + '</small></div></div></div>';
    }).join('') + '</div>';
  }

  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', markButtons); else setTimeout(markButtons, 0);

  W.GK_VOUCHER = {
    LIST: LIST, get: function (c) { return BY[String(c || '').toUpperCase()] || null; },
    saveVoucher: saveVoucher, validate: validate, getBestVoucher: getBestVoucher, markUsed: markUsed, isSaved: isSaved,
    renderQuickSelect: renderQuickSelect, renderInventory: renderInventory, mine: mine, markButtons: markButtons, _fmtVND: fmtVND,
    grantWelcome: function () { var arr = mine(); if (!arr.some(function (x) { return x.code === 'CHAOBAN30'; })) { arr.push({ code: 'CHAOBAN30', savedAt: Date.now(), used: false }); setMine(arr); } }
  };
})(window, document);
