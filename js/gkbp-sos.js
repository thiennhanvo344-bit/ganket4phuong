/* ==========================================================================
   gkbp-sos.js — Cứu hộ nhanh không cần cài app (tính năng trọng tâm)
   Luồng 8 bước của dự án rút gọn trên web:
   Sự cố → (Trợ lý triệu chứng) → Phương tiện & vị trí → Giá trần → Ghép thợ 3–5 km
   → Thợ đang đến (mã gặp mặt, bản đồ, chia sẻ hành trình) → Xác nhận đúng thợ
   → Hoàn tất: hóa đơn + hộp đen chuyến cứu hộ + đánh giá 4 tiêu chí.
   API: GKSOS.open(incidentId?) · GKSOS.close() · mọi phần tử [data-sos-open] đều mở được.
   ========================================================================== */
(function (W, D) {
  'use strict';
  var G = function () { return W.GK_DATA || {}; };
  var C = function () { return W.GKBP; };
  var AKEY = 'gkbp_active_rescue';
  var EV_MAP = { lop: 'xd03', binh: 'xd01', xang: 'xd01', may: 'xd02', khoa: 'ch09', keo: 'xd04' };
  var NIGHT_FEE = 30000;

  var st = null, root = null, timers = [];
  function clearTimers() { timers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); timers = []; }
  function fmt(n) { return (Math.round(n) || 0).toLocaleString('vi-VN') + 'đ'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function isNight(d) { var h = (d || new Date()).getHours(); return h >= 22 || h < 5; }
  function hhmm(t) { var d = new Date(t); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function incident(id) { return (G().INCIDENTS || []).filter(function (x) { return x.id === id; })[0]; }
  function saveActive() { try { localStorage.setItem(AKEY, JSON.stringify(st)); } catch (e) {} }
  function loadActive() { try { return JSON.parse(localStorage.getItem(AKEY) || 'null'); } catch (e) { return null; } }
  function dropActive() { try { localStorage.removeItem(AKEY); } catch (e) {} }

  function serviceFor(s) {
    var inc = incident(s.incident); if (!inc) return null;
    var id = s.veh === 'Ô tô' ? inc.svc.car : s.veh === 'Xe điện' ? EV_MAP[inc.id] : inc.svc.moto;
    return G().findService ? G().findService(id) : null;
  }
  function quote(s) {
    var svc = serviceFor(s); if (!svc) return null;
    var opt = (svc.options || []).filter(function (o) { return o.id === s.vtype; })[0] || (svc.options || [])[0] || { add: 0, label: '' };
    var lines = [{ k: 'Phí dịch vụ ' + svc.title.toLowerCase() + ' (đã gồm di chuyển 5 km)', v: svc.priceNum }];
    if (opt.add) lines.push({ k: 'Điều chỉnh theo loại xe: ' + opt.label, v: opt.add });
    if (s.night) lines.push({ k: 'Phụ phí ca đêm 22h–5h (100% chuyển cho thợ trực SOS)', v: NIGHT_FEE });
    var total = lines.reduce(function (a, l) { return a + l.v; }, 0);
    return { svc: svc, opt: opt, lines: lines, total: total };
  }

  /* ---------------- Khung modal ---------------- */
  function build() {
    if (root) return root;
    var fab = D.createElement('button');
    fab.id = 'gk-sos-fab'; fab.type = 'button'; fab.setAttribute('data-sos-open', ''); fab.setAttribute('aria-label', 'Gọi cứu hộ ngay');
    fab.innerHTML = '<span class="gk-sos-fab-pulse"></span><span class="gk-sos-fab-core"><i class="fas fa-life-ring"></i><b>SOS</b></span><span class="gk-sos-fab-label">Cứu hộ ngay<small>Thợ đến ~15 phút</small></span>';
    D.body.appendChild(fab);

    var pill = D.createElement('button'); pill.id = 'gk-sos-pill'; pill.type = 'button';
    pill.innerHTML = '<i class="fas fa-motorcycle"></i><span id="gk-sos-pill-txt">Thợ đang đến</span><b id="gk-sos-pill-eta">--:--</b>';
    pill.onclick = function () { open(); };
    D.body.appendChild(pill);

    root = D.createElement('div'); root.id = 'gk-sos'; root.className = 'gk-sos'; root.setAttribute('aria-hidden', 'true');
    root.innerHTML =
      '<div class="gk-sos-backdrop" data-sos-close></div>' +
      '<div class="gk-sos-panel" role="dialog" aria-modal="true" aria-labelledby="gk-sos-title">' +
      '<div class="gk-sos-head"><div class="gk-sos-head-ico"><i class="fas fa-truck-pickup"></i></div>' +
      '<div class="gk-sos-head-txt"><div id="gk-sos-title">Cứu hộ nhanh</div><small id="gk-sos-sub">Không cần cài ứng dụng · Báo giá trước khi làm</small></div>' +
      '<button class="gk-sos-x" type="button" data-sos-close aria-label="Đóng"><i class="fas fa-times"></i></button></div>' +
      '<div class="gk-sos-steps" id="gk-sos-steps"><span data-s="1">Sự cố</span><span data-s="2">Vị trí</span><span data-s="3">Giá trần</span><span data-s="4">Ghép thợ</span><span data-s="5">Hoàn tất</span></div>' +
      '<div class="gk-sos-body" id="gk-sos-body"></div>' +
      '<div class="gk-sos-foot" id="gk-sos-foot"></div></div>';
    D.body.appendChild(root);
    root.addEventListener('click', function (e) { if (e.target.closest('[data-sos-close]')) close(); });
    D.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('open')) close(); });
    return root;
  }
  function stepBar(n) {
    var s = D.querySelectorAll('#gk-sos-steps span');
    for (var i = 0; i < s.length; i++) { var k = +s[i].getAttribute('data-s'); s[i].className = k < n ? 'done' : k === n ? 'cur' : ''; }
  }
  function body(html) { var b = D.getElementById('gk-sos-body'); b.innerHTML = html; b.scrollTop = 0; return b; }
  function foot(html) { D.getElementById('gk-sos-foot').innerHTML = html || ''; }
  function title(t, sub) { D.getElementById('gk-sos-title').textContent = t; if (sub !== undefined) D.getElementById('gk-sos-sub').textContent = sub; }

  /* ---------------- Bước 1: chọn sự cố ---------------- */
  function s1() {
    stepBar(1); title('Bạn đang gặp sự cố gì?', 'Chọn 1 sự cố – không cần đăng nhập, không cần cài app');
    var inc = G().INCIDENTS || [];
    body((isNight() ? '<div class="gk-sos-night"><i class="fas fa-moon"></i><div><b>Chế độ an toàn đêm đang bật</b><span>Đội thợ SOS trực 22h–5h. Hãy đứng nơi có ánh sáng và bật chia sẻ hành trình.</span></div></div>' : '') +
      '<div class="gk-sos-grid">' + inc.map(function (x) {
        return '<button type="button" class="gk-sos-tile' + (st.incident === x.id ? ' sel' : '') + '" data-inc="' + x.id + '"><span class="gk-sos-tile-ico"><i class="fas ' + x.icon + '"></i></span>' +
          '<b>' + x.name + '</b><small>' + x.short + '</small><em>Từ ' + fmt(x.moto) + '</em></button>';
      }).join('') + '</div>' +
      '<button type="button" class="gk-sos-assist-link" id="gk-sos-assist"><i class="fas fa-stethoscope"></i> Chưa rõ xe bị gì? <b>Hỏi trợ lý triệu chứng</b><i class="fas fa-chevron-right"></i></button>' +
      '<div class="gk-sos-emerg"><i class="fas fa-exclamation-triangle"></i> Có người bị thương? Gọi ngay <a href="tel:115">115</a> (cấp cứu) · <a href="tel:113">113</a> (công an) · <a href="tel:114">114</a> (cứu hỏa)</div>');
    var tiles = D.querySelectorAll('.gk-sos-tile');
    for (var i = 0; i < tiles.length; i++) tiles[i].onclick = function () { st.incident = this.getAttribute('data-inc'); s2(); };
    D.getElementById('gk-sos-assist').onclick = function () { assistant(0); };
    foot('<a class="gk-sos-hot" href="tel:0345264103"><i class="fas fa-phone-alt"></i> Hotline 24/7: <b>0345 264 103</b></a>');
  }

  /* ---------------- Trợ lý triệu chứng ---------------- */
  var QA = [
    { q: 'Xe của bạn đang ở tình trạng nào?', a: [['Bật khóa, đề hoặc đạp nổ không lên', 1], ['Đang chạy thì tự tắt máy', 'may'], ['Bánh xe xẹp, tay lái nặng hoặc lắc', 'lop'], ['Kim xăng báo hết / xe điện báo hết pin', 'xang'], ['Không mở được khóa, cửa hoặc cốp', 'khoa'], ['Tai nạn, hư nặng hoặc bị ngập nước', 'keo']] },
    { q: 'Khi bật khóa điện, đèn và còi như thế nào?', a: [['Đèn rất mờ, còi rè hoặc không có điện', 'binh'], ['Đèn, còi bình thường nhưng máy không nổ', 'may'], ['Đã đổ thêm xăng mà vẫn không nổ', 'may']] }
  ];
  var WHY = {
    binh: 'Đèn mờ và còi rè cho thấy ắc quy không đủ điện để khởi động – thường do bình đã yếu hoặc xe để lâu ngày.',
    may: 'Có điện nhưng máy không nổ thường do bugi, nghẹt xăng hoặc lỗi đánh lửa – thợ sẽ kiểm tra theo quy trình 3 bước.',
    lop: 'Bánh xẹp và lái nặng là dấu hiệu thủng/xì lốp. Đừng cố chạy tiếp vì dễ làm rách lốp, cong vành.',
    xang: 'Hết nhiên liệu chỉ cần tiếp xăng (hoặc sạc cứu hộ cho xe điện) là có thể đi tiếp.',
    khoa: 'Thợ khóa đã xác minh sẽ mở khóa không phá ổ, sau khi đối chiếu giấy tờ xe để bảo vệ bạn.',
    keo: 'Xe hư nặng hoặc ngập nước không nên tự khởi động. Kéo xe về tiệm đối tác là phương án an toàn nhất.'
  };
  function assistant(i) {
    stepBar(1); title('Trợ lý triệu chứng', 'Trả lời 1–2 câu, hệ thống gợi ý sự cố phù hợp');
    var Q = QA[i];
    body('<div class="gk-assist"><div class="gk-assist-bubble"><i class="fas fa-robot"></i><span>' + Q.q + '</span></div>' +
      Q.a.map(function (a, k) { return '<button type="button" class="gk-assist-opt" data-k="' + k + '">' + a[0] + '<i class="fas fa-chevron-right"></i></button>'; }).join('') + '</div>');
    var o = D.querySelectorAll('.gk-assist-opt');
    for (var j = 0; j < o.length; j++) o[j].onclick = function () {
      var r = Q.a[+this.getAttribute('data-k')][1];
      if (typeof r === 'number') assistant(r); else assistResult(r);
    };
    foot('<button type="button" class="gk-sos-btn ghost" id="gk-sos-back"><i class="fas fa-arrow-left"></i> Quay lại</button>');
    D.getElementById('gk-sos-back').onclick = i ? function () { assistant(0); } : s1;
  }
  function assistResult(id) {
    var x = incident(id);
    body('<div class="gk-assist-result"><div class="gk-assist-ico"><i class="fas ' + x.icon + '"></i></div><small>Gợi ý của trợ lý</small><h4>' + x.name + '</h4><p>' + WHY[id] + '</p>' +
      '<div class="gk-assist-note"><i class="fas fa-info-circle"></i> Đây là gợi ý ban đầu. Thợ sẽ kiểm tra thực tế và báo giá trước khi làm.</div></div>');
    foot('<button type="button" class="gk-sos-btn ghost" id="gk-sos-back"><i class="fas fa-redo"></i> Hỏi lại</button><button type="button" class="gk-sos-btn" id="gk-sos-next">Chọn sự cố này <i class="fas fa-arrow-right"></i></button>');
    D.getElementById('gk-sos-back').onclick = function () { assistant(0); };
    D.getElementById('gk-sos-next').onclick = function () { st.incident = id; s2(); };
  }

  /* ---------------- Bước 2: phương tiện & vị trí ---------------- */
  function s2() {
    stepBar(2); var inc = incident(st.incident);
    title(inc.name, 'Cho thợ biết xe gì và bạn đang ở đâu');
    var u = C() && C().getUser();
    var areas = (G().AREAS || []).filter(function (a) { return a.phase !== 'Sắp ra mắt'; });
    if (st.nightMode === undefined) st.nightMode = isNight();
    body('<div class="gk-sos-field"><label>Loại phương tiện</label><div class="gk-seg" id="gk-veh">' +
      ['Xe máy', 'Ô tô', 'Xe điện'].map(function (v) { return '<button type="button" data-v="' + v + '" class="' + (st.veh === v ? 'on' : '') + '"><i class="fas ' + (v === 'Ô tô' ? 'fa-car-side' : v === 'Xe điện' ? 'fa-charging-station' : 'fa-motorcycle') + '"></i>' + v + '</button>'; }).join('') + '</div></div>' +
      '<div class="gk-sos-field"><label for="gk-vtype">Dòng xe</label><select id="gk-vtype" class="gk-input"></select></div>' +
      '<div class="gk-sos-field"><label>Vị trí của bạn</label><button type="button" class="gk-gps" id="gk-gps"><i class="fas fa-crosshairs"></i><span id="gk-gps-txt">' + (st.gps ? 'Đã ghim vị trí GPS (' + st.gps + ')' : 'Dùng vị trí hiện tại') + '</span></button>' +
      '<div class="gk-row2"><select id="gk-area" class="gk-input">' + areas.map(function (a) { return '<option value="' + a.id + '"' + (st.area === a.id ? ' selected' : '') + '>' + a.name + (a.phase === 'Mở rộng' ? ' (đang mở rộng)' : '') + '</option>'; }).join('') + '</select>' +
      '<input id="gk-addr" class="gk-input" placeholder="Số nhà, tên đường hoặc mốc dễ nhận biết" value="' + esc(st.addr || '') + '"></div></div>' +
      '<div class="gk-sos-field"><label for="gk-phone">Số điện thoại liên hệ</label><input id="gk-phone" class="gk-input" inputmode="tel" placeholder="VD: 0912 345 678" value="' + esc(st.phone || (u && u.phone) || '') + '"><small class="gk-err" id="gk-phone-err"></small></div>' +
      '<div class="gk-sos-field"><label for="gk-note">Mô tả thêm (không bắt buộc)</label><textarea id="gk-note" class="gk-input" rows="2" placeholder="VD: lốp sau bị đinh, đang đứng trước cửa hàng tiện lợi">' + esc(st.note || '') + '</textarea></div>' +
      '<div class="gk-sos-field"><label class="gk-photo"><input type="file" accept="image/*" id="gk-photo" hidden><i class="fas fa-camera"></i><span id="gk-photo-txt">' + (st.photo ? 'Đã đính kèm ảnh' : 'Chụp/đính kèm ảnh xe (giúp thợ chuẩn bị đúng đồ nghề)') + '</span></label></div>' +
      '<div class="gk-switches"><label class="gk-switch"><input type="checkbox" id="gk-share"' + (st.share ? ' checked' : '') + '><span></span>Chia sẻ hành trình cứu hộ cho người thân</label>' +
      '<label class="gk-switch"><input type="checkbox" id="gk-night"' + (st.nightMode ? ' checked' : '') + '><span></span>Chế độ an toàn đêm (ưu tiên thợ Đội SOS)</label></div>');
    function fillTypes() {
      var svc = serviceFor(st); var opts = (svc && svc.options) || [];
      D.getElementById('gk-vtype').innerHTML = opts.map(function (o) { return '<option value="' + o.id + '"' + (st.vtype === o.id ? ' selected' : '') + '>' + o.label + (o.add > 0 ? ' (+' + fmt(o.add) + ')' : o.add < 0 ? ' (−' + fmt(-o.add) + ')' : '') + '</option>'; }).join('');
      if (!opts.some(function (o) { return o.id === st.vtype; })) st.vtype = opts[0] && opts[0].id;
    }
    var segs = D.querySelectorAll('#gk-veh button');
    for (var i = 0; i < segs.length; i++) segs[i].onclick = function () { st.veh = this.getAttribute('data-v'); for (var j = 0; j < segs.length; j++) segs[j].classList.toggle('on', segs[j] === this); fillTypes(); };
    fillTypes();
    D.getElementById('gk-gps').onclick = function () {
      var t = D.getElementById('gk-gps-txt'); t.textContent = 'Đang xác định vị trí…';
      var done = function (txt) { st.gps = txt; t.textContent = 'Đã ghim vị trí GPS (' + txt + ')'; D.getElementById('gk-gps').classList.add('ok'); };
      if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function (p) { done(p.coords.latitude.toFixed(4) + ', ' + p.coords.longitude.toFixed(4)); },
        function () { done('vị trí gần đúng theo khu vực đã chọn'); }, { timeout: 6000 });
      else done('vị trí gần đúng theo khu vực đã chọn');
    };
    D.getElementById('gk-photo').onchange = function () { if (this.files && this.files[0]) { st.photo = this.files[0].name; D.getElementById('gk-photo-txt').textContent = '✓ ' + this.files[0].name; } };
    foot('<button type="button" class="gk-sos-btn ghost" id="gk-sos-back"><i class="fas fa-arrow-left"></i></button><button type="button" class="gk-sos-btn" id="gk-sos-next">Xem giá trần <i class="fas fa-arrow-right"></i></button>');
    D.getElementById('gk-sos-back').onclick = s1;
    D.getElementById('gk-sos-next').onclick = function () {
      var ph = D.getElementById('gk-phone').value.replace(/[\s.\-]/g, '');
      if (!/^(03|05|07|08|09)\d{8}$/.test(ph)) { D.getElementById('gk-phone-err').textContent = 'Số điện thoại chưa đúng (10 số, bắt đầu 03/05/07/08/09).'; D.getElementById('gk-phone').focus(); return; }
      st.phone = ph; st.vtype = D.getElementById('gk-vtype').value; st.area = D.getElementById('gk-area').value;
      st.addr = D.getElementById('gk-addr').value.trim(); st.note = D.getElementById('gk-note').value.trim();
      st.share = D.getElementById('gk-share').checked;
      st.nightMode = D.getElementById('gk-night').checked;   // ưu tiên thợ Đội SOS
      st.night = isNight();                                  // phụ phí chỉ tính khi thực sự trong khung 22h–5h
      s3();
    };
  }

  /* ---------------- Bước 3: giá trần ---------------- */
  function s3() {
    stepBar(3); var q = quote(st); if (!q) return s1();
    title('Giá trần trước khi thợ đến', 'Không phát sinh hạng mục mới thì không vượt mức này');
    var area = (G().AREAS || []).filter(function (a) { return a.id === st.area; })[0] || {};
    body('<div class="gk-quote"><div class="gk-quote-svc"><img src="' + q.svc.img + '" alt=""><div><b>' + q.svc.title + '</b><small>' + st.veh + ' · ' + (q.opt.label || '') + ' · ' + (area.name || '') + '</small></div></div>' +
      '<ul class="gk-quote-lines">' + q.lines.map(function (l) { return '<li><span>' + l.k + '</span><b>' + (l.v < 0 ? '−' : '') + fmt(Math.abs(l.v)) + '</b></li>'; }).join('') +
      '<li class="muted"><span>Phụ tùng thay thế (nếu cần) – báo giá trên app, bạn duyệt mới làm</span><b>Theo báo giá</b></li></ul>' +
      '<div class="gk-quote-total"><span>GIÁ TRẦN</span><b>' + fmt(q.total) + '</b></div>' +
      '<div class="gk-quote-promise"><i class="fas fa-shield-alt"></i><div><b>Cam kết minh bạch giá</b><span>Nếu bị thu vượt giá trần mà không có hạng mục phát sinh được bạn duyệt, nền tảng hoàn 100% phần chênh lệch.</span></div></div>' +
      '<div class="gk-sos-field"><label>Thanh toán sau khi hoàn tất</label><div class="gk-seg gk-seg-pay" id="gk-pay">' +
      [['cash', 'fa-money-bill-wave', 'Tiền mặt'], ['wallet', 'fa-wallet', 'Ví điện tử'], ['card', 'fa-credit-card', 'Thẻ / QR']].map(function (p) { return '<button type="button" data-p="' + p[0] + '" class="' + ((st.pay || 'cash') === p[0] ? 'on' : '') + '"><i class="fas ' + p[1] + '"></i>' + p[2] + '</button>'; }).join('') + '</div></div></div>');
    var pays = D.querySelectorAll('#gk-pay button');
    for (var i = 0; i < pays.length; i++) pays[i].onclick = function () { st.pay = this.getAttribute('data-p'); for (var j = 0; j < pays.length; j++) pays[j].classList.toggle('on', pays[j] === this); };
    foot('<button type="button" class="gk-sos-btn ghost" id="gk-sos-back"><i class="fas fa-arrow-left"></i></button><button type="button" class="gk-sos-btn pulse" id="gk-sos-next"><i class="fas fa-search-location"></i> Tìm thợ ngay</button>');
    D.getElementById('gk-sos-back').onclick = s2;
    D.getElementById('gk-sos-next').onclick = function () { st.total = q.total; st.svcId = q.svc.id; st.svcTitle = q.svc.title; st.lines = q.lines; s4(); };
  }

  /* ---------------- Bước 4: ghép thợ ---------------- */
  function pickMechanic() {
    var list = (G().MECHANICS || []).filter(function (m) {
      if (st.veh === 'Ô tô') return m.skills.indexOf('Ô tô') > -1;
      if (st.veh === 'Xe điện') return m.skills.indexOf('Xe điện') > -1 || m.skills.indexOf('Xe máy') > -1;
      return m.skills.indexOf('Xe máy') > -1;
    });
    if (st.nightMode) { var sos = list.filter(function (m) { return /SOS/.test(m.tier); }); if (sos.length) list = sos; }
    var m = list[Math.floor(Math.random() * list.length)] || (G().MECHANICS || [])[0];
    var dist = Math.round((0.8 + Math.random() * 1.8) * 10) / 10;
    return { m: m, dist: dist, eta: Math.min(15, Math.round(dist * 4 + 4)) };
  }
  function s4() {
    stepBar(4); clearTimers();
    title('Đang tìm thợ gần bạn', 'Ưu tiên thợ trong bán kính 3–5 km, đang sẵn sàng');
    st.createdAt = st.createdAt || Date.now(); st.step = 4; saveActive();
    body('<div class="gk-radar"><div class="gk-radar-ring r1"></div><div class="gk-radar-ring r2"></div><div class="gk-radar-ring r3"></div><div class="gk-radar-sweep"></div>' +
      '<span class="gk-radar-dot d1"><i class="fas fa-motorcycle"></i></span><span class="gk-radar-dot d2"><i class="fas fa-tools"></i></span><span class="gk-radar-dot d3"><i class="fas fa-truck-pickup"></i></span><span class="gk-radar-dot d4"><i class="fas fa-motorcycle"></i></span>' +
      '<div class="gk-radar-me"><i class="fas fa-map-marker-alt"></i></div></div>' +
      '<ul class="gk-match-log" id="gk-log"><li class="on"><i class="fas fa-circle-notch fa-spin"></i> Đang quét thợ trong bán kính 3 km…</li></ul>');
    foot('<button type="button" class="gk-sos-btn ghost wide" id="gk-sos-cancel">Hủy yêu cầu (miễn phí)</button>');
    D.getElementById('gk-sos-cancel').onclick = cancel;
    var log = D.getElementById('gk-log');
    var add = function (txt) { var lis = log.querySelectorAll('li'); for (var i = 0; i < lis.length; i++) { lis[i].className = 'ok'; lis[i].querySelector('i').className = 'fas fa-check-circle'; } var li = D.createElement('li'); li.className = 'on'; li.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> ' + txt; log.appendChild(li); };
    timers.push(setTimeout(function () { add('Đã gửi yêu cầu tới 4 thợ phù hợp với ' + st.veh.toLowerCase()); }, 1100));
    timers.push(setTimeout(function () { add('Thợ đang xem vị trí và tình trạng xe của bạn…'); }, 2300));
    timers.push(setTimeout(function () {
      var p = pickMechanic(); st.mech = p.m; st.dist = p.dist; st.eta = p.eta;
      st.code = String(Math.floor(1000 + Math.random() * 9000));
      st.acceptAt = Date.now(); st.arriveAt = Date.now() + p.eta * 60000; st.step = 5; saveActive(); s5();
    }, 3500));
  }

  /* ---------------- Bước 5: thợ đang đến ---------------- */
  function initials(n) { var p = String(n).split(' '); return (p[p.length - 2] ? p[p.length - 2][0] : '') + p[p.length - 1][0]; }
  function s5() {
    stepBar(5); clearTimers();
    var m = st.mech || {};
    title('Thợ đã nhận yêu cầu', 'Nhận trong ' + Math.max(1, Math.round((st.acceptAt - st.createdAt) / 1000)) + ' giây · cam kết dưới 3 phút');
    body('<div class="gk-track"><div class="gk-map-wrap"><svg class="gk-map" viewBox="0 0 320 170" aria-label="Bản đồ theo dõi thợ">' +
      '<rect width="320" height="170" rx="14" fill="#EAF1F9"/>' +
      '<g stroke="#fff" stroke-width="10" stroke-linecap="round"><path d="M0 120H320"/><path d="M0 55H320"/><path d="M70 0V170"/><path d="M200 0V170"/><path d="M265 0V170"/></g>' +
      '<g fill="#d6e3f2"><rect x="84" y="68" width="102" height="40" rx="6"/><rect x="12" y="68" width="44" height="40" rx="6"/><rect x="214" y="68" width="38" height="40" rx="6"/><rect x="84" y="8" width="102" height="34" rx="6"/><rect x="214" y="132" width="38" height="30" rx="6"/><rect x="12" y="132" width="44" height="30" rx="6"/></g>' +
      '<path id="gk-route" d="M30 120 H200 V55 H265 V30" fill="none" stroke="#FA7806" stroke-width="4" stroke-dasharray="8 6" stroke-linecap="round"/>' +
      '<g id="gk-me" transform="translate(265 30)"><circle r="14" fill="rgba(250,120,6,.18)"><animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite"/></circle><circle r="6" fill="#FA7806" stroke="#fff" stroke-width="2"/></g>' +
      '</svg><span class="gk-map-mech" id="gk-mech"><i class="fas fa-motorcycle"></i></span></div>' +
      '<div class="gk-eta"><div><small>Thợ đến sau</small><b id="gk-eta">--:--</b></div><div><small>Khoảng cách</small><b id="gk-dist">' + String(st.dist).replace('.', ',') + ' km</b></div><div><small>Giá trần</small><b>' + fmt(st.total) + '</b></div></div>' +
      '<div class="gk-mech"><div class="gk-mech-av">' + esc(initials(m.name || 'Thợ')) + '</div><div class="gk-mech-info"><b>' + esc(m.name) + '</b><span class="gk-tier">' + esc(m.tier) + '</span>' +
      '<small><i class="fas fa-star"></i> ' + String(m.rating).replace('.', ',') + ' · ' + (m.jobs || 0).toLocaleString('vi-VN') + ' cuốc · ' + (m.years || 0) + ' năm nghề</small></div>' +
      '<a class="gk-mech-call" href="tel:0345264103" aria-label="Gọi thợ"><i class="fas fa-phone-alt"></i></a></div>' +
      '<details class="gk-why" open><summary><i class="fas fa-lightbulb"></i> Vì sao là thợ này?</summary><ul>' +
      '<li>Gần bạn nhất trong số thợ đang sẵn sàng (' + String(st.dist).replace('.', ',') + ' km)</li><li>Có kỹ năng ' + esc((m.skills || []).join(', ')) + ' – phù hợp ' + st.veh.toLowerCase() + '</li><li>Điểm đánh giá ' + String(m.rating).replace('.', ',') + '★, hạng ' + esc(m.tier) + (st.nightMode ? ' – ưu tiên Đội SOS ca đêm' : '') + '</li></ul></details>' +
      '<div class="gk-code"><div><small>MÃ GẶP MẶT</small><b>' + st.code.split('').join(' ') + '</b></div><p>Chỉ giao xe khi thợ đọc đúng mã này. Sai mã? Bấm SOS khẩn cấp.</p></div>' +
      '<div class="gk-track-actions"><button type="button" id="gk-share-btn"><i class="fas fa-share-alt"></i>Chia sẻ hành trình</button><button type="button" id="gk-chat-btn"><i class="fas fa-comment-dots"></i>Nhắn thợ</button><a href="tel:113"><i class="fas fa-shield-alt"></i>SOS khẩn cấp</a></div></div>');
    foot('<button type="button" class="gk-sos-btn ghost" id="gk-sos-cancel">Hủy cuốc</button><button type="button" class="gk-sos-btn" id="gk-sos-arrive"><i class="fas fa-forward"></i> Mô phỏng: thợ đã đến</button>');
    D.getElementById('gk-sos-cancel').onclick = cancel;
    D.getElementById('gk-sos-arrive').onclick = arrived;
    D.getElementById('gk-share-btn').onclick = function () {
      var txt = 'Mình đang được cứu hộ bởi Gắn Kết Bốn Phương – thợ ' + m.name + ', mã gặp mặt ' + st.code + ', dự kiến đến lúc ' + hhmm(st.arriveAt) + '.';
      if (navigator.share) navigator.share({ title: 'Hành trình cứu hộ', text: txt }).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { C().showToast('success', 'Đã sao chép thông tin hành trình để gửi người thân.'); });
      else C().showToast('info', txt);
    };
    D.getElementById('gk-chat-btn').onclick = function () { C().showToast('info', 'Thợ ' + m.name + ' đã nhận tin: “Mình đang đứng ở ' + (st.addr || 'vị trí đã ghim') + '”.'); };
    runTracking();
  }
  function runTracking() {
    var path = D.getElementById('gk-route'), mech = D.getElementById('gk-mech');
    var L = path ? path.getTotalLength() : 0, total = st.arriveAt - st.acceptAt;
    function tick() {
      var left = Math.max(0, st.arriveAt - Date.now()), p = total > 0 ? 1 - left / total : 1;
      var e = D.getElementById('gk-eta'); if (e) e.textContent = Math.floor(left / 60000) + ':' + ('0' + Math.floor(left % 60000 / 1000)).slice(-2);
      if (path && mech) { var pt = path.getPointAtLength(L * Math.min(1, p)); mech.style.left = (pt.x / 320 * 100) + '%'; mech.style.top = (pt.y / 170 * 100) + '%'; }
      var d = D.getElementById('gk-dist'); if (d) d.textContent = String(Math.max(0, st.dist * (1 - p)).toFixed(1)).replace('.', ',') + ' km';
      pillUpdate(left);
      if (left <= 0) { clearTimers(); if (root.classList.contains('open')) arrived(); }
    }
    tick(); timers.push(setInterval(tick, 1000));
  }

  /* ---------------- Thợ đến: xác nhận mã → xử lý → hoàn tất ---------------- */
  function arrived() {
    clearTimers(); st.arrivedAt = st.arrivedAt || Date.now(); st.step = 6; saveActive(); pillUpdate(-1);
    title('Thợ đã đến nơi', 'Đối chiếu mã gặp mặt trước khi giao xe');
    body('<div class="gk-arrive"><div class="gk-arrive-ico"><i class="fas fa-user-check"></i></div><p>Thợ <b>' + esc(st.mech.name) + '</b> đọc mã gặp mặt:</p><div class="gk-code big"><b>' + st.code.split('').join(' ') + '</b></div>' +
      '<p class="muted">Mã khớp với mã trên màn hình của bạn?</p></div>');
    foot('<a class="gk-sos-btn ghost" href="tel:113"><i class="fas fa-exclamation-triangle"></i> Không khớp</a><button type="button" class="gk-sos-btn" id="gk-sos-ok"><i class="fas fa-check"></i> Đúng thợ – bắt đầu</button>');
    D.getElementById('gk-sos-ok').onclick = working;
  }
  function working() {
    title('Đang xử lý sự cố', 'Thợ kiểm tra thực tế và gửi báo giá để bạn duyệt');
    st.quoteAt = Date.now();
    body('<div class="gk-work"><div class="gk-wrench"><i class="fas fa-wrench"></i></div><ul class="gk-match-log" id="gk-log2"><li class="ok"><i class="fas fa-check-circle"></i> Thợ đã kiểm tra phương tiện</li><li class="ok"><i class="fas fa-check-circle"></i> Báo giá ' + fmt(st.total) + ' – bằng giá trần, đã duyệt</li><li class="on"><i class="fas fa-circle-notch fa-spin"></i> Đang ' + esc(st.svcTitle.toLowerCase()) + '…</li></ul>' +
      '<div class="gk-workbar"><span id="gk-workbar"></span></div></div>');
    foot('');
    var bar = D.getElementById('gk-workbar'), k = 0;
    timers.push(setInterval(function () { k += 4; bar.style.width = Math.min(100, k) + '%'; if (k >= 100) { clearTimers(); finish(); } }, 80));
  }
  function finish() {
    st.doneAt = Date.now(); st.step = 7;
    title('Hoàn tất – chúc bạn thượng lộ bình an!', 'Hóa đơn điện tử & hộp đen chuyến cứu hộ đã được lưu');
    var ev = [['fa-paper-plane', 'Gửi yêu cầu', st.createdAt], ['fa-user-check', 'Thợ nhận cuốc', st.acceptAt], ['fa-map-marker-alt', 'Thợ đến nơi', st.arrivedAt], ['fa-file-invoice-dollar', 'Báo giá được duyệt', st.quoteAt], ['fa-flag-checkered', 'Hoàn tất', st.doneAt]];
    var crit = ['Thời gian phản hồi', 'Thái độ phục vụ', 'Minh bạch báo giá', 'Kết quả xử lý'];
    body('<div class="gk-done"><div class="gk-done-check"><i class="fas fa-check"></i></div>' +
      '<div class="gk-invoice"><div class="gk-inv-row head"><span>' + esc(st.svcTitle) + '</span><b>' + fmt(st.total) + '</b></div>' +
      (st.lines || []).map(function (l) { return '<div class="gk-inv-row"><span>' + l.k + '</span><span>' + fmt(l.v) + '</span></div>'; }).join('') +
      '<div class="gk-inv-row"><span>Thanh toán</span><span>' + ({ cash: 'Tiền mặt', wallet: 'Ví điện tử', card: 'Thẻ / QR' }[st.pay || 'cash']) + '</span></div></div>' +
      '<div class="gk-blackbox"><div class="gk-bb-title"><i class="fas fa-box"></i> Hộp đen chuyến cứu hộ</div><ol>' + ev.map(function (e) { return '<li><i class="fas ' + e[0] + '"></i><span>' + e[1] + '</span><b>' + hhmm(e[2]) + '</b></li>'; }).join('') + '</ol></div>' +
      '<div class="gk-rate"><div class="gk-bb-title"><i class="fas fa-star"></i> Đánh giá thợ ' + esc(st.mech.name) + '</div>' +
      crit.map(function (c, i) { return '<div class="gk-rate-row"><span>' + c + '</span><div class="gk-stars" data-i="' + i + '">' + [1, 2, 3, 4, 5].map(function (n) { return '<i class="fas fa-star on" data-n="' + n + '"></i>'; }).join('') + '</div></div>'; }).join('') +
      '<textarea id="gk-review" class="gk-input" rows="2" placeholder="Chia sẻ trải nghiệm của bạn (không bắt buộc)"></textarea></div></div>');
    var rows = D.querySelectorAll('.gk-stars'); st.scores = [5, 5, 5, 5];
    for (var i = 0; i < rows.length; i++) rows[i].addEventListener('click', function (e) {
      var n = +(e.target.getAttribute('data-n') || 0); if (!n) return; var idx = +this.getAttribute('data-i'); st.scores[idx] = n;
      var s = this.querySelectorAll('i'); for (var j = 0; j < s.length; j++) s[j].classList.toggle('on', j < n);
    });
    foot('<button type="button" class="gk-sos-btn wide" id="gk-sos-submit"><i class="fas fa-paper-plane"></i> Gửi đánh giá & lưu vào Garage số</button>');
    D.getElementById('gk-sos-submit').onclick = submit;
  }
  function submit() {
    var c = C(), avg = st.scores.reduce(function (a, b) { return a + b; }, 0) / 4;
    var order = {
      id: 'SOS-' + String(Date.now()).slice(-6), type: 'sos', title: st.svcTitle, svcId: st.svcId, veh: st.veh,
      area: ((G().AREAS || []).filter(function (a) { return a.id === st.area; })[0] || {}).name || '', addr: st.addr,
      total: st.total, status: 'Hoàn tất', createdAt: st.createdAt, doneAt: st.doneAt, mech: st.mech && st.mech.name,
      code: st.code, rating: Math.round(avg * 10) / 10, review: (D.getElementById('gk-review') || {}).value || '',
      timeline: { create: st.createdAt, accept: st.acceptAt, arrive: st.arrivedAt, quote: st.quoteAt, done: st.doneAt }
    };
    if (c) { c.addOrder(order); if (c.isLoggedIn()) c.addPoints(Math.floor(st.total / 1000)); }
    dropActive(); clearTimers();
    if (c) c.showToast('success', 'Cảm ơn bạn đã đánh giá! ' + (c.isLoggedIn() ? 'Đã cộng ' + Math.floor(st.total / 1000) + ' điểm Bốn Phương.' : 'Đăng nhập để tích điểm cho các lần sau.'));
    st = fresh(); close(); pillUpdate(-1);
  }
  function cancel() {
    clearTimers(); dropActive(); pillUpdate(-1);
    var free = !st.acceptAt || Date.now() - st.acceptAt < 120000;
    if (C()) C().showToast('info', free ? 'Đã hủy yêu cầu cứu hộ – không mất phí.' : 'Đã hủy cuốc. Phí hủy sau 2 phút: 20.000đ (bù chi phí di chuyển cho thợ).');
    st = fresh(); close();
  }

  /* ---------------- Viên thông báo nổi khi đang có cuốc ---------------- */
  function pillUpdate(left) {
    var p = D.getElementById('gk-sos-pill'); if (!p) return;
    if (left === -1 || !st || !st.mech || st.step < 5) { p.classList.remove('show'); return; }
    var done = left <= 0 || st.step >= 6;
    D.getElementById('gk-sos-pill-txt').textContent = done ? 'Thợ ' + st.mech.name.split(' ').pop() + ' đã đến' : 'Thợ ' + st.mech.name.split(' ').pop() + ' đang đến';
    D.getElementById('gk-sos-pill-eta').textContent = done ? 'Xem' : Math.floor(left / 60000) + ':' + ('0' + Math.floor(left % 60000 / 1000)).slice(-2);
    p.classList.toggle('show', !root.classList.contains('open'));
  }

  /* ---------------- Mở / đóng ---------------- */
  function fresh() { var u = C() && C().getUser(); return { veh: 'Xe máy', phone: u && u.phone ? u.phone : '', pay: 'cash' }; }
  function open(incId) {
    build();
    var act = loadActive();
    if (act && act.step >= 4 && (!st || !st.step)) st = act;
    if (!st) st = fresh();
    root.classList.add('open'); root.setAttribute('aria-hidden', 'false'); D.body.classList.add('gk-sos-lock');
    var p = D.getElementById('gk-sos-pill'); if (p) p.classList.remove('show');
    if (st.step === 4) return s4();
    if (st.step === 5) return s5();
    if (st.step === 6) return arrived();
    if (incId && incident(incId)) { st.incident = incId; return s2(); }
    s1();
  }
  function close() {
    if (!root) return;
    root.classList.remove('open'); root.setAttribute('aria-hidden', 'true'); D.body.classList.remove('gk-sos-lock');
    if (st && st.step === 5) { clearTimers(); var t = setInterval(function () { pillUpdate(Math.max(0, st.arriveAt - Date.now())); }, 1000); timers.push(t); pillUpdate(Math.max(0, st.arriveAt - Date.now())); }
    else if (st && st.step === 6) pillUpdate(0);
    else if (st && st.step < 4) { /* giữ lựa chọn dở dang */ }
  }

  D.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-sos-open]') : null;
    if (t && !(root && root.contains(t))) { e.preventDefault(); open(t.getAttribute('data-sos-open') || ''); }
  });
  function boot() {
    build();
    var act = loadActive();
    if (act && act.step >= 5 && act.mech) {
      st = act;
      if (st.step === 5) { var t = setInterval(function () { pillUpdate(Math.max(0, st.arriveAt - Date.now())); }, 1000); timers.push(t); pillUpdate(Math.max(0, st.arriveAt - Date.now())); }
      else pillUpdate(0);
    }
    var q = new URLSearchParams(location.search); if (q.get('sos') !== null) open(q.get('sos'));
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', boot); else boot();

  W.GKSOS = { open: open, close: close, quote: function (incId, veh) { return quote({ incident: incId, veh: veh || 'Xe máy', night: isNight() }); }, isNight: isNight };
})(window, document);
