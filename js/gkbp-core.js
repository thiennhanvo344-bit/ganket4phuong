/* ==========================================================================
   gkbp-core.js — Lõi hệ thống Gắn Kết Bốn Phương (load ngay sau bootstrap)
   • Lưu trữ an toàn (localStorage / sessionStorage)  • Tài khoản & phiên đăng nhập
   • Giỏ dịch vụ + badge                              • Toast thông báo
   • Kiểm tra dữ liệu (email, SĐT, họ tên)           • Vùng tài khoản trên header
   • Thanh tiến trình “con đường”, nút về đầu trang hình bánh xe
   • Thanh điều hướng đáy cho điện thoại + menu “Thêm”
   ========================================================================== */
(function (W, D) {
  'use strict';

  var K = {
    user: 'gkbp_user', accounts: 'gkbp_accounts', cart: 'gkbp_cart', carts: 'gkbp_carts',
    redirect: 'gkbp_redirect_after_login', history: 'gkbp_history', orders: 'gkbp_orders',
    points: 'gkbp_points', garage: 'gkbp_garage', wishlist: 'gkbp_wishlist', vouchers: 'gkbp_saved_vouchers'
  };

  function _ls(key, fallback) {
    try { var v = W.localStorage.getItem(key); return v === null ? (fallback === undefined ? null : fallback) : JSON.parse(v); }
    catch (e) { return fallback === undefined ? null : fallback; }
  }
  function _lsSet(key, val) {
    try { W.localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; }
  }
  function _lsDel(key) { try { W.localStorage.removeItem(key); } catch (e) {} }
  function _ss(key, fallback) {
    try { var v = W.sessionStorage.getItem(key); return v === null ? (fallback === undefined ? null : fallback) : JSON.parse(v); }
    catch (e) { return fallback === undefined ? null : fallback; }
  }
  function _ssSet(key, val) { try { W.sessionStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

  function fmt(n) { n = Math.round(Number(n) || 0); return n.toLocaleString('vi-VN') + 'đ'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------------- Tài khoản ---------------- */
  function getUser() { var u = _ls(K.user); return u && (u.email || u.phone || u.name) ? u : null; }
  function isLoggedIn() { return !!getUser(); }
  function userKey(u) { u = u || getUser(); return u ? (u.email || u.phone || u.name) : 'guest'; }
  function setUser(u) {
    _lsSet(K.user, u);
    var carts = _ls(K.carts, {}) || {};
    var mine = carts[userKey(u)];
    var cur = getCart();
    if (mine && mine.length) {               // gộp giỏ khách vãng lai với giỏ đã lưu của tài khoản
      var ids = {}; mine.forEach(function (x) { ids[x.cartId || x.id + x.addedAt] = 1; });
      cur.forEach(function (x) { if (!ids[x.cartId || x.id + x.addedAt]) mine.push(x); });
      _lsSet(K.cart, mine);
    }
    persistCart(); renderAuthZone(); syncCartBadge();
  }
  function logout() {
    persistCart();
    _lsDel(K.user); _lsSet(K.cart, []);
    renderAuthZone(); syncCartBadge();
    showToast('info', 'Bạn đã đăng xuất. Hẹn gặp lại trên mọi nẻo đường!');
    setTimeout(function () { if (/thongtin|thanhtoan/.test(location.pathname)) location.href = 'html_trangchu.html'; }, 900);
  }
  function requireLogin(redirect, reason) {
    if (isLoggedIn()) return true;
    try { W.localStorage.setItem(K.redirect, redirect || location.pathname.split('/').pop() + location.search); } catch (e) {}
    showToast('warning', reason || 'Vui lòng đăng nhập để tiếp tục.');
    setTimeout(function () { location.href = 'html_dangnhap_dangky.html?mode=login'; }, 700);
    return false;
  }

  /* ---------------- Giỏ dịch vụ ---------------- */
  function getCart() { var c = _ls(K.cart, []); return Array.isArray(c) ? c : []; }
  function setCart(c) { _lsSet(K.cart, c || []); persistCart(); syncCartBadge(); }
  function persistCart() {
    var u = getUser(); if (!u) return;
    var carts = _ls(K.carts, {}) || {}; carts[userKey(u)] = getCart(); _lsSet(K.carts, carts);
  }
  function addToCart(item) {
    var c = getCart(); item.cartId = item.cartId || ('c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
    item.addedAt = item.addedAt || Date.now(); c.push(item); setCart(c); bumpCart(); return item;
  }
  function cartCount() { return getCart().reduce(function (s, x) { return s + (Number(x.adult) || Number(x.qty) || 1); }, 0); }
  function syncCartBadge() {
    var n = getCart().length;
    var els = D.querySelectorAll('#cart-badge, .gk-bn-badge');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = n > 99 ? '99+' : n;
      els[i].style.display = n > 0 ? 'flex' : 'none';
    }
  }
  function bumpCart() {
    var b = D.getElementById('cart-badge'); if (!b) return;
    b.classList.remove('gk-bump'); void b.offsetWidth; b.classList.add('gk-bump');
  }

  /* ---------------- Toast ---------------- */
  var TYPES = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
  function showToast(a, b) {
    var type = 'success', msg = a;
    if (TYPES[a] && b !== undefined) { type = a; msg = b; } else if (TYPES[b]) { type = b; }
    var wrap = D.getElementById('gk-toast-wrap');
    if (!wrap) { wrap = D.createElement('div'); wrap.id = 'gk-toast-wrap'; D.body.appendChild(wrap); }
    var t = D.createElement('div');
    t.className = 'gk-toast gk-toast-' + type;
    t.setAttribute('role', 'status');
    t.innerHTML = '<i class="fas ' + TYPES[type] + '"></i><div class="gk-toast-msg">' + msg + '</div><button class="gk-toast-x" aria-label="Đóng">&times;</button><span class="gk-toast-bar"></span>';
    wrap.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    var kill = function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 350); };
    t.querySelector('.gk-toast-x').onclick = kill;
    setTimeout(kill, 3800);
  }

  /* ---------------- Kiểm tra dữ liệu ---------------- */
  function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim()); }
  function isValidPhone(v) { return /^(03|05|07|08|09)\d{8}$/.test(String(v || '').replace(/[\s.\-]/g, '')); }
  function isValidName(v) { v = String(v || '').trim(); return v.length >= 2 && /^[a-zA-ZÀ-ỹ\s'.-]+$/.test(v); }
  function titleCase(v) { return String(v || '').toLowerCase().replace(/(^|\s)(\S)/g, function (m, s, c) { return s + c.toUpperCase(); }); }
  function attachNameInput(el) {
    if (typeof el === 'string') el = D.getElementById(el);
    if (!el || el._gkName) return; el._gkName = 1;
    el.addEventListener('input', function () { var p = el.selectionStart, v = el.value.replace(/[0-9!@#$%^&*()_+=\[\]{};:"\\|,<>\/?~`]/g, ''); if (v !== el.value) { el.value = v; try { el.setSelectionRange(p - 1, p - 1); } catch (e) {} } });
    el.addEventListener('blur', function () { el.value = titleCase(el.value.replace(/\s+/g, ' ').trim()); });
  }

  /* ---------------- Điểm thưởng & lịch sử ---------------- */
  function getPoints() { var p = _ls(K.points, null); if (p === null) { var u = getUser(); p = u ? 120 : 0; } return p; }
  function addPoints(n) { var p = getPoints() + Math.round(n); _lsSet(K.points, p); return p; }
  function getOrders() { var o = _ls(K.orders, []); return Array.isArray(o) ? o : []; }
  function addOrder(o) { var a = getOrders(); a.unshift(o); _lsSet(K.orders, a.slice(0, 50)); return o; }

  /* ---------------- Header: vùng tài khoản ---------------- */
  function initials(name) {
    var p = String(name || '?').trim().split(/\s+/);
    return (p.length > 1 ? p[p.length - 1][0] : p[0][0] || '?').toUpperCase();
  }
  function renderAuthZone() {
    var z = D.getElementById('auth-zone'); if (!z) return;
    var u = getUser();
    if (!u) {
      z.innerHTML = '<a class="nav-item nav-link mr-3 font-weight-bold d-none d-sm-block" href="html_dangnhap_dangky.html?mode=register">Đăng ký</a>' +
        '<a class="btn btn-login font-weight-bold" href="html_dangnhap_dangky.html?mode=login" aria-label="Đăng nhập"><i class="fas fa-user-circle"></i><span class="gk-login-txt"> Đăng nhập</span></a>';
      return;
    }
    var name = esc(u.name || u.fullName || 'Thành viên');
    z.innerHTML =
      '<div class="dropdown user-profile-dropdown">' +
      '<button class="user-avatar-btn" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="' + name + '">' +
      (u.avatar ? '<img src="' + esc(u.avatar) + '" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover">' : '<span class="avatar-initial">' + initials(u.name) + '</span>') + '</button>' +
      '<div class="dropdown-menu dropdown-menu-right">' +
      '<div class="dropdown-header"><div style="font-weight:800;color:#0A2B54;font-size:14px">' + name + '</div>' +
      '<div style="font-size:12px;color:#64748b">' + esc(u.email || u.phone || '') + '</div>' +
      '<div class="gk-dd-points"><i class="fas fa-coins"></i> ' + getPoints().toLocaleString('vi-VN') + ' điểm Bốn Phương</div></div>' +
      '<a class="dropdown-item" href="html_thongtin.html#tab-profile"><i class="fas fa-user-circle mr-2"></i>Hồ sơ của tôi</a>' +
      '<a class="dropdown-item" href="html_thongtin.html#tab-garage"><i class="fas fa-warehouse mr-2"></i>Garage số</a>' +
      '<a class="dropdown-item" href="html_thongtin.html#tab-orders"><i class="fas fa-route mr-2"></i>Lịch sử cứu hộ</a>' +
      '<a class="dropdown-item" href="html_thongtin.html#tab-voucher"><i class="fas fa-ticket-alt mr-2"></i>Kho voucher</a>' +
      '<div class="dropdown-divider"></div>' +
      '<a class="dropdown-item text-danger" href="#" id="gk-logout"><i class="fas fa-sign-out-alt mr-2"></i>Đăng xuất</a>' +
      '</div></div>';
    var lo = D.getElementById('gk-logout');
    if (lo) lo.onclick = function (e) { e.preventDefault(); logout(); };
  }

  /* ---------------- Thanh tiến trình con đường ---------------- */
  function initRoadProgress() {
    if (D.getElementById('gk-road')) return;
    var r = D.createElement('div'); r.id = 'gk-road';
    r.innerHTML = '<div class="gk-road-fill"></div><i class="fas fa-motorcycle gk-road-bike"></i>';
    D.body.appendChild(r);
    var fill = r.firstChild, bike = r.lastChild, ticking = false;
    function upd() {
      var h = D.documentElement.scrollHeight - W.innerHeight;
      var p = h > 0 ? Math.min(1, W.scrollY / h) : 0;
      fill.style.width = (p * 100) + '%';
      bike.style.left = 'calc(' + (p * 100) + '% - ' + (p * 22) + 'px)';
      r.classList.toggle('on', W.scrollY > 40);
      ticking = false;
    }
    W.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  /* ---------------- Nút về đầu trang hình bánh xe ---------------- */
  function initBackToTop() {
    if (D.getElementById('gk-btt')) return;
    var b = D.createElement('button'); b.id = 'gk-btt'; b.setAttribute('aria-label', 'Về đầu trang'); b.title = 'Về đầu trang';
    b.innerHTML = '<svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#0A2B54"/><circle cx="24" cy="24" r="17" fill="none" stroke="#1E5C9E" stroke-width="4" stroke-dasharray="3 3"/><circle cx="24" cy="24" r="9" fill="#FA7806"/><g stroke="#fff" stroke-width="2.4" stroke-linecap="round"><line x1="24" y1="15" x2="24" y2="33"/><line x1="15" y1="24" x2="33" y2="24"/></g><circle cx="24" cy="24" r="3" fill="#fff"/></svg><i class="fas fa-arrow-up"></i>';
    D.body.appendChild(b);
    b.onclick = function () { W.scrollTo({ top: 0, behavior: 'smooth' }); };
    W.addEventListener('scroll', function () { b.classList.toggle('show', W.scrollY > 500); }, { passive: true });
  }

  /* ---------------- Điều hướng đáy cho điện thoại ---------------- */
  var PAGE = (location.pathname.split('/').pop() || 'html_trangchu.html').toLowerCase();
  function initBottomNav() {
    if (D.getElementById('gk-bottom-nav') || D.body.hasAttribute('data-no-bottomnav')) return;
    var items = [
      { href: 'html_trangchu.html', icon: 'fa-home', label: 'Trang chủ' },
      { href: 'html_dichvu.html', icon: 'fa-tools', label: 'Dịch vụ' },
      { sos: true },
      { href: 'html_giohang.html', icon: 'fa-shopping-cart', label: 'Giỏ', badge: true },
      { menu: true, icon: 'fa-bars', label: 'Thêm' }
    ];
    var nav = D.createElement('nav'); nav.id = 'gk-bottom-nav'; nav.setAttribute('aria-label', 'Điều hướng nhanh');
    nav.innerHTML = items.map(function (it) {
      if (it.sos) return '<button class="gk-bn-sos" type="button" data-sos-open aria-label="Gọi cứu hộ ngay"><span class="gk-bn-sos-ring"></span><span class="gk-bn-sos-core"><i class="fas fa-life-ring"></i><b>SOS</b></span></button>';
      if (it.menu) return '<button class="gk-bn-item" type="button" id="gk-bn-more"><i class="fas ' + it.icon + '"></i><span>' + it.label + '</span></button>';
      var act = PAGE === it.href ? ' active' : '';
      return '<a class="gk-bn-item' + act + '" href="' + it.href + '"><i class="fas ' + it.icon + '"></i><span>' + it.label + '</span>' + (it.badge ? '<em class="gk-bn-badge">0</em>' : '') + '</a>';
    }).join('');
    D.body.appendChild(nav);
    D.body.classList.add('gk-has-bottomnav');

    var sheet = D.createElement('div'); sheet.id = 'gk-more-sheet';
    var links = [
      ['html_diadiem.html', 'fa-map-marked-alt', 'Khu vực phục vụ'], ['html_khuyenmaivatiepthi.html', 'fa-ticket-alt', 'Voucher & ưu đãi'],
      ['html_thongtin.html', 'fa-warehouse', 'Garage số'], ['html_gioithieu.html', 'fa-info-circle', 'Giới thiệu'],
      ['html_blog.html', 'fa-newspaper', 'Blog cẩm nang'], ['html_lienhe_chinhsach.html', 'fa-headset', 'Liên hệ & chính sách'],
      ['html_lienhe_chinhsach.html#doi-tac', 'fa-hard-hat', 'Trở thành thợ đối tác'], ['html_sitemap.html', 'fa-sitemap', 'Sơ đồ website']
    ];
    var u = getUser();
    sheet.innerHTML = '<div class="gk-sheet-backdrop"></div><div class="gk-sheet-panel" role="dialog" aria-label="Menu">' +
      '<div class="gk-sheet-handle"></div>' +
      '<div class="gk-sheet-head"><img src="img/logo-mark.png" alt=""><div><b>Gắn Kết Bốn Phương</b><small>Đồng hành mọi nẻo đường</small></div></div>' +
      (u ? '' : '<div class="gk-sheet-auth"><a href="html_dangnhap_dangky.html?mode=login" class="gk-btn-orange">Đăng nhập</a><a href="html_dangnhap_dangky.html?mode=register" class="gk-btn-ghost">Đăng ký</a></div>') +
      '<div class="gk-sheet-grid">' + links.map(function (l) { return '<a href="' + l[0] + '"><i class="fas ' + l[1] + '"></i><span>' + l[2] + '</span></a>'; }).join('') + '</div>' +
      '<a class="gk-sheet-hotline" href="tel:0345264103"><i class="fas fa-phone-alt"></i> Hotline cứu hộ 24/7: <b>0345 264 103</b></a></div>';
    D.body.appendChild(sheet);
    var open = function () { sheet.classList.add('open'); D.body.style.overflow = 'hidden'; };
    var close = function () { sheet.classList.remove('open'); D.body.style.overflow = ''; };
    D.getElementById('gk-bn-more').onclick = open;
    sheet.querySelector('.gk-sheet-backdrop').onclick = close;
    var sy = 0; var panel = sheet.querySelector('.gk-sheet-panel');
    panel.addEventListener('touchstart', function (e) { sy = e.touches[0].clientY; }, { passive: true });
    panel.addEventListener('touchend', function (e) { if (e.changedTouches[0].clientY - sy > 70) close(); }, { passive: true });
    syncCartBadge();
  }

  /* ---------------- Phím tắt Ctrl/⌘ + K ---------------- */
  function initShortcut() {
    D.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        var i = D.getElementById('header-search-inp'); if (i) { e.preventDefault(); i.focus(); }
      }
      if (e.key === 'Escape') { var s = D.getElementById('gk-more-sheet'); if (s) s.classList.remove('open'); }
    });
  }

  /* ---------------- Hiện dần khi cuộn ---------------- */
  function initReveal() {
    var els = D.querySelectorAll('.gk-reveal'); if (!els.length) return;
    if (!('IntersectionObserver' in W)) { for (var i = 0; i < els.length; i++) els[i].classList.add('in'); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { threshold: 0.12 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  }

  /* ---------------- Footer: đăng ký nhận tin ---------------- */
  function initNewsletter() {
    var btns = D.querySelectorAll('.footer-nl-btn');
    for (var i = 0; i < btns.length; i++) (function (b) {
      b.addEventListener('click', function () {
        var inp = b.parentNode.querySelector('.footer-nl-input');
        if (!inp || !isValidEmail(inp.value)) { showToast('error', 'Email chưa hợp lệ, vui lòng kiểm tra lại.'); if (inp) inp.focus(); return; }
        var list = _ls('gkbp_newsletter', []); if (list.indexOf(inp.value) < 0) list.push(inp.value); _lsSet('gkbp_newsletter', list);
        inp.value = ''; showToast('success', 'Đăng ký thành công! Ưu đãi cứu hộ và mẹo giữ xe bền sẽ được gửi đến hộp thư của bạn.');
      });
    })(btns[i]);
  }

  /* ---------------- Tìm kiếm trên điện thoại ---------------- */
  function initMobileSearch() {
    var b = D.querySelector('.gk-m-search-btn'), h = D.querySelector('header.gk-header'); if (!b || !h) return;
    b.addEventListener('click', function () {
      var on = h.classList.toggle('gk-msearch-open');
      b.innerHTML = on ? '<i class="fas fa-times"></i>' : '<i class="fas fa-search"></i>';
      var i = D.getElementById('header-search-inp'); if (on && i) setTimeout(function () { i.focus(); }, 30);
    });
  }

  /* ---------------- Khởi tạo ---------------- */
  function boot() {
    renderAuthZone(); syncCartBadge(); initRoadProgress(); initBackToTop(); initBottomNav(); initShortcut(); initReveal(); initNewsletter(); initMobileSearch();
    D.documentElement.classList.add('gk-ready');
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', boot); else boot();
  W.addEventListener('storage', function (e) { if (e.key === K.cart || e.key === K.user) { syncCartBadge(); renderAuthZone(); } });

  W.GKBP = {
    KEYS: K, _ls: _ls, _lsSet: _lsSet, _lsDel: _lsDel, _ss: _ss, _ssSet: _ssSet, fmt: fmt, esc: esc,
    getUser: getUser, isLoggedIn: isLoggedIn, setUser: setUser, logout: logout, requireLogin: requireLogin,
    getCart: getCart, setCart: setCart, persistCart: persistCart, addToCart: addToCart, cartCount: cartCount, syncCartBadge: syncCartBadge,
    showToast: showToast, isValidEmail: isValidEmail, isValidPhone: isValidPhone, isValidName: isValidName, titleCase: titleCase, attachNameInput: attachNameInput,
    getPoints: getPoints, addPoints: addPoints, getOrders: getOrders, addOrder: addOrder, renderAuthZone: renderAuthZone, initReveal: initReveal
  };
})(window, document);
