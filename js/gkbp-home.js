/* ==========================================================================
   gkbp-home.js — Hiệu ứng & tiện ích trang chủ Gắn Kết Bốn Phương
   toggleAllPanel · scrollSection · luuSanPhamDaXem · xemGanDayPage · xoaLichSuXem
   whyFocus/whyBlur · hiệu ứng giới thiệu (split, đếm số, nghiêng thẻ, nam châm)
   hành trình một cuốc (canvas con đường) · tầm nhìn 5 năm · đội ngũ 10 người
   đồng hồ SLA · ước tính giá trần · máy tính thu nhập đối tác thợ
   ========================================================================== */
(function (W, D) {
  'use strict';
  var HKEY = 'gkbp_history';
  var touch = ('ontouchstart' in W) || navigator.maxTouchPoints > 0;
  function $(s, r) { return (r || D).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); }
  function fmt(n) { return (Math.round(n) || 0).toLocaleString('vi-VN') + 'đ'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function onView(els, cb, th) {
    if (!els.length) return;
    if (!('IntersectionObserver' in W)) { els.forEach(cb); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { cb(x.target); io.unobserve(x.target); } }); }, { threshold: th || 0.2 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Panel tất cả dịch vụ ---------- */
  W.toggleAllPanel = function (e) {
    if (e) e.preventDefault();
    var p = $('#all-services-panel'), o = $('#all-panel-overlay'); if (!p) return;
    var open = !p.classList.contains('open');
    p.classList.toggle('open', open); if (o) o.classList.toggle('open', open);
    p.setAttribute('aria-hidden', open ? 'false' : 'true');
    D.body.style.overflow = open ? 'hidden' : '';
  };
  D.addEventListener('keydown', function (e) { if (e.key === 'Escape') { var p = $('#all-services-panel'); if (p && p.classList.contains('open')) W.toggleAllPanel(); } });
  D.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('#all-services-panel [data-sos-open]'); if (a) { var p = $('#all-services-panel'); if (p && p.classList.contains('open')) W.toggleAllPanel(); } }, true);

  /* ---------- Cuộn ngang khu vực ---------- */
  W.scrollSection = function (id, dir) {
    var el = D.getElementById(id); if (!el) return;
    var step = Math.max(240, el.clientWidth * 0.8);
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  /* ---------- Lịch sử xem gần đây ---------- */
  function hist() { try { var h = JSON.parse(localStorage.getItem(HKEY) || '[]'); return Array.isArray(h) ? h : []; } catch (e) { return []; } }
  W.luuSanPhamDaXem = function (el, e) {
    var it = { ten: el.getAttribute('data-ten'), anh: el.getAttribute('data-anh'), link: el.getAttribute('data-link'), gia: el.getAttribute('data-gia') || '', meta: el.getAttribute('data-meta') || '', t: Date.now() };
    var h = hist().filter(function (x) { return x.link !== it.link; }); h.unshift(it);
    try { localStorage.setItem(HKEY, JSON.stringify(h.slice(0, 12))); } catch (er) {}
    if (e && (e.target.closest('a') || e.ctrlKey || e.metaKey)) return;
    location.href = it.link;
  };
  var xgdPage = 0, XGD = 4;
  function renderRecent() {
    var row = $('#scroll-xem-gan-day'); if (!row) return;
    var h = hist(), btn = $('#btn-xoa-lich-su');
    if (!h.length) { if (btn) btn.style.display = 'none'; toggleArrows(0, 0); return; }
    if (btn) btn.style.display = 'inline-block';
    var per = W.innerWidth < 768 ? h.length : XGD, max = Math.max(0, Math.ceil(h.length / per) - 1);
    if (xgdPage > max) xgdPage = max;
    var list = W.innerWidth < 768 ? h : h.slice(xgdPage * per, xgdPage * per + per);
    row.innerHTML = list.map(function (x) {
      return '<div class="col-md-3 col-sm-6 mb-3"><a class="card product-card border-0 shadow-sm h-100 recent-card" href="' + esc(x.link) + '">' +
        '<img src="' + esc(x.anh) + '" class="card-img-top" alt="' + esc(x.ten) + '" loading="lazy"><div class="card-body p-3">' +
        '<small class="text-muted">' + esc(x.meta || 'Đã xem gần đây') + '</small><h6 class="card-title font-weight-bold mt-1">' + esc(x.ten) + '</h6>' +
        (x.gia ? '<p class="text-danger font-weight-bold mb-0">' + esc(x.gia) + '</p>' : '') + '</div></a></div>';
    }).join('');
    toggleArrows(xgdPage, max);
  }
  function toggleArrows(p, max) {
    var l = $('#xgd-btn-left'), r = $('#xgd-btn-right');
    if (l) l.classList.toggle('disabled', p <= 0); if (r) r.classList.toggle('disabled', p >= max);
  }
  W.xemGanDayPage = function (dir) { xgdPage += dir === 'left' ? -1 : 1; if (xgdPage < 0) xgdPage = 0; renderRecent(); };
  W.xoaLichSuXem = function () {
    try { localStorage.removeItem(HKEY); } catch (e) {}
    var row = $('#scroll-xem-gan-day');
    if (row) row.innerHTML = [0, 1, 2, 3].map(function (i) { return '<div class="col-md-3 col-sm-6 mb-3 recent-placeholder-col"><div class="recent-placeholder"><div class="recent-placeholder-img"><i class="fas fa-tools"></i></div><p class="recent-placeholder-text">' + (i ? '' : 'Nhấn vào dịch vụ<br>để lưu lịch sử xem') + '</p></div></div>'; }).join('');
    var b = $('#btn-xoa-lich-su'); if (b) b.style.display = 'none';
    if (W.GKBP) W.GKBP.showToast('info', 'Đã xóa lịch sử xem gần đây.');
  };

  /* ---------- Vì sao chọn chúng tôi ---------- */
  W.whyFocus = function (el) { var w = $('#whyCardsWrap'); if (!w || W.innerWidth < 992) return; w.classList.add('why-active'); $$('.why-card', w).forEach(function (c) { c.classList.toggle('why-focused', c === el); }); };
  W.whyBlur = function () { var w = $('#whyCardsWrap'); if (!w) return; w.classList.remove('why-active'); $$('.why-card', w).forEach(function (c) { c.classList.remove('why-focused'); }); };

  /* ---------- Đếm số ---------- */
  function countUp(el, dur) {
    var to = parseFloat(el.getAttribute('data-target')) || 0, t0 = null, dec = String(to).indexOf('.') > -1 ? 1 : 0;
    function step(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / (dur || 1600)); var v = to * (1 - Math.pow(1 - p, 3)); el.textContent = dec ? v.toFixed(1).replace('.', ',') : Math.round(v).toLocaleString('vi-VN'); if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }

  /* ---------- Phần giới thiệu ---------- */
  function initAbout() {
    var trig = $('#about-title-trigger');
    if (trig) onView([trig], function () {
      $$('[data-split]', trig).forEach(function (el, i) { setTimeout(function () { el.classList.add('visible'); }, i * 140); });
      $$('.split-word', trig).forEach(function (el, i) { setTimeout(function () { el.classList.add('visible'); }, 250 + i * 160); });
    }, 0.3);
    onView($$('.counter-up'), function (el) { countUp(el, 1800); }, 0.4);
    var blocks = $$('[data-parallax]');
    if (blocks.length && !touch) W.addEventListener('scroll', function () {
      blocks.forEach(function (b) { var r = b.getBoundingClientRect(); if (r.bottom < -200 || r.top > W.innerHeight + 200) return; var off = (r.top + r.height / 2 - W.innerHeight / 2) * parseFloat(b.getAttribute('data-parallax')) * -0.12; off = Math.max(-18, Math.min(18, off)); b.style.transform = 'translateY(' + off.toFixed(1) + 'px)'; });
    }, { passive: true });
    if (!touch) $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) { var r = el.getBoundingClientRect(); el.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.35).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1) + 'px)'; });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
    var card = $('[data-tilt-card]');
    if (card && !touch) {
      var glow = $('.tilt-card-glow', card);
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = 'perspective(900px) rotateX(' + (-y * 12).toFixed(2) + 'deg) rotateY(' + (x * 14).toFixed(2) + 'deg) translateZ(6px)';
        if (glow) glow.style.background = 'radial-gradient(circle at ' + ((x + .5) * 100) + '% ' + ((y + .5) * 100) + '%, rgba(255,159,67,.35), transparent 60%)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; if (glow) glow.style.background = ''; });
    }
  }

  /* ---------- Hành trình một cuốc ---------- */
  function initJourney() {
    var head = $('.journey-headline');
    if (head) onView([head], function () { $$('.journey-word', head).forEach(function (w) { w.classList.add('visible'); }); }, 0.4);
    $$('.jrn-card').forEach(function (c) {
      var bg = $('.jrn-bg-layer', c), img = c.getAttribute('data-img');
      if (bg && img) bg.style.backgroundImage = 'url(' + img + ')';
      if (!touch) {
        c.addEventListener('mousemove', function (e) { var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = 'perspective(1000px) rotateX(' + (-y * 6) + 'deg) rotateY(' + (x * 6) + 'deg)'; if (bg) bg.style.transform = 'translate(' + (x * -14) + 'px,' + (y * -14) + 'px)'; });
        c.addEventListener('mouseleave', function () { c.style.transform = ''; if (bg) bg.style.transform = ''; });
      } else {
        c.addEventListener('click', function (e) { if (e.target.closest('a,button')) return; var on = !c.classList.contains('is-open'); $$('.jrn-card').forEach(function (x) { x.classList.remove('is-open'); }); c.classList.toggle('is-open', on); });
      }
    });
    onView($$('.jrn-stat-num'), function (el) { countUp(el, 1400); }, 0.5);
    var cv = $('#journey-canvas'); if (!cv || !cv.getContext) return;
    var ctx = cv.getContext('2d'), sec = $('#section-journey'), cars = [], running = false;
    function size() { cv.width = sec.offsetWidth; cv.height = sec.offsetHeight; }
    function seed() { cars = []; for (var i = 0; i < 9; i++) cars.push({ lane: i % 3, x: Math.random() * cv.width, v: .6 + Math.random() * 1.2, c: i % 3 ? 'rgba(13,64,118,.18)' : 'rgba(250,120,6,.28)' }); }
    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, cv.width, cv.height);
      var base = cv.height - 70;
      ctx.fillStyle = 'rgba(10,43,84,.05)'; ctx.fillRect(0, base - 36, cv.width, 92);
      ctx.strokeStyle = 'rgba(250,120,6,.25)'; ctx.lineWidth = 3; ctx.setLineDash([26, 22]); ctx.lineDashOffset = -(Date.now() / 30 % 48);
      ctx.beginPath(); ctx.moveTo(0, base + 10); ctx.lineTo(cv.width, base + 10); ctx.stroke(); ctx.setLineDash([]);
      cars.forEach(function (c) {
        c.x += c.v; if (c.x > cv.width + 40) c.x = -40;
        var y = base - 22 + c.lane * 22; ctx.fillStyle = c.c;
        ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(c.x, y, 30, 12, 6); else ctx.rect(c.x, y, 30, 12); ctx.fill();
        ctx.beginPath(); ctx.arc(c.x + 7, y + 13, 3.5, 0, 6.3); ctx.arc(c.x + 23, y + 13, 3.5, 0, 6.3); ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    size(); seed(); W.addEventListener('resize', function () { size(); seed(); });
    if ('IntersectionObserver' in W) new IntersectionObserver(function (en) { var v = en[0].isIntersecting; if (v && !running) { running = true; draw(); } else if (!v) running = false; }).observe(sec);
  }

  /* ---------- Tầm nhìn 5 năm ---------- */
  function initVision() {
    onView($$('.vision-line'), function (el) { el.classList.add('visible'); }, 0.3);
    var items = $$('.vtl-item'); onView(items, function (el) { var i = items.indexOf(el); setTimeout(function () { el.classList.add('visible'); }, i * 120); }, 0.2);
    var panel = $('#visionYearPanel'), orbit = $('#visionOrbit'); if (!panel || !items.length) return;
    var hideT = null;
    function show(it) {
      clearTimeout(hideT);
      $('#vypYearBig').textContent = it.getAttribute('data-year');
      $('#vypBadge').textContent = it.getAttribute('data-vtl-badge') || '';
      $('#vypTitle').textContent = it.getAttribute('data-vtl-title');
      $('#vypDesc').textContent = it.getAttribute('data-vtl-desc');
      $('#vypLocs').textContent = it.getAttribute('data-vtl-locs');
      var ms = (it.getAttribute('data-vtl-ms') || '').split(' | '), ic = ['fa-map-marker-alt', 'fa-users-cog', 'fa-truck-pickup'];
      $('#vypMilestones').innerHTML = ms.map(function (m, i) { return '<div class="vyp-ms-item"><i class="fas ' + ic[i % 3] + '"></i><span>' + esc(m) + '</span></div>'; }).join('');
      var pr = it.getAttribute('data-vtl-prog') || 25;
      $('#vypProgressBar').style.width = pr + '%'; $('#vypProgressLabel').textContent = 'Lộ trình: ' + pr + '% chặng đường 5 năm';
      items.forEach(function (x) { x.classList.toggle('vtl-active', x === it); });
      panel.classList.remove('panel-visible'); void panel.offsetWidth; panel.classList.add('panel-visible');
      if (orbit) orbit.classList.add('orbit-hidden');
    }
    function hide() { hideT = setTimeout(function () { panel.classList.remove('panel-visible'); if (orbit) orbit.classList.remove('orbit-hidden'); items.forEach(function (x) { x.classList.remove('vtl-active'); }); }, 350); }
    items.forEach(function (it) {
      it.addEventListener('mouseenter', function () { if (!touch) show(it); });
      it.addEventListener('click', function () { if (it.classList.contains('vtl-active') && touch) hide(); else show(it); });
    });
    var tl = $('.vision-timeline'); if (tl && !touch) tl.addEventListener('mouseleave', hide);
    panel.addEventListener('mouseenter', function () { clearTimeout(hideT); });
    panel.addEventListener('mouseleave', function () { if (!touch) hide(); });
  }

  /* ---------- Đội ngũ ---------- */
  function initTeam() {
    var wraps = $$('.team-card-wrap');
    onView(wraps, function (el) { setTimeout(function () { el.classList.add('visible'); }, (parseFloat(el.getAttribute('data-delay')) || 0) * 1000); }, 0.15);
    onView($$('.team-funfact'), function (el) { el.classList.add('visible'); }, 0.3);
    $$('.team-card').forEach(function (c) {
      c.addEventListener('click', function (e) { if (e.target.closest('a')) return; if (touch) c.classList.toggle('flipped'); });
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.classList.toggle('flipped'); } });
    });
    $$('img[data-photo]').forEach(function (img) {      // dùng ảnh thật nếu có trong thư mục img/, nếu không giữ ảnh minh họa
      var p = img.getAttribute('data-photo'); if (!p) return;
      var t = new Image(); t.onload = function () { if (t.naturalWidth > 10) img.src = p; }; t.src = p;
    });
    var sec = $('#section-team'), spot = $('#teamSpotlight');
    if (sec && spot && !touch) sec.addEventListener('mousemove', function (e) { var r = sec.getBoundingClientRect(); spot.style.left = (e.clientX - r.left) + 'px'; spot.style.top = (e.clientY - r.top) + 'px'; });
  }

  /* ---------- Đồng hồ SLA ---------- */
  function initGauges() {
    onView($$('.gk-gauge'), function (g) {
      var p = parseFloat(g.getAttribute('data-pct')) || 0;
      var f = $('.gk-gauge-fill', g), n = $('.gk-gauge-needle', g);
      setTimeout(function () { if (f) f.style.strokeDasharray = (p * 100) + ' 100'; if (n) n.style.transform = 'rotate(' + (-90 + p * 180) + 'deg)'; }, 150);
    }, 0.4);
  }

  /* ---------- Ước tính giá trần ---------- */
  function initEstimator() {
    var box = $('#section-gia-tran'); if (!box || !W.GKSOS) return;
    var st = { inc: 'lop', veh: 'Xe máy', night: W.GKSOS.isNight() };
    var nightEl = $('#estNight'); if (nightEl) nightEl.checked = st.night;
    function render() {
      var q = W.GKSOS.quote(st.inc, st.veh); if (!q) return;
      var lines = [{ k: 'Phí dịch vụ (đã gồm di chuyển 5 km)', v: q.svc.priceNum }];
      if (st.night) lines.push({ k: 'Phụ phí ca đêm 22h–5h (100% cho thợ SOS)', v: 30000 });
      lines.push({ k: 'Phụ tùng thay thế (nếu cần)', v: null });
      var total = lines.reduce(function (a, l) { return a + (l.v || 0); }, 0);
      $('#estSvc').textContent = q.svc.title + ' · ' + st.veh;
      $('#estLines').innerHTML = lines.map(function (l) { return '<li><span>' + l.k + '</span><b>' + (l.v === null ? 'Báo giá – bạn duyệt' : fmt(l.v)) + '</b></li>'; }).join('');
      var t = $('#estTotal'); t.textContent = fmt(total); t.classList.remove('bump'); void t.offsetWidth; t.classList.add('bump');
    }
    $$('.est-inc', box).forEach(function (b) { b.addEventListener('click', function () { st.inc = b.getAttribute('data-inc'); $$('.est-inc', box).forEach(function (x) { x.classList.toggle('on', x === b); }); render(); }); });
    $$('#estVeh button').forEach(function (b) { b.addEventListener('click', function () { st.veh = b.getAttribute('data-v'); $$('#estVeh button').forEach(function (x) { x.classList.toggle('on', x === b); }); render(); }); });
    if (nightEl) nightEl.addEventListener('change', function () { st.night = nightEl.checked; render(); });
    var go = $('#estGo'); if (go) go.addEventListener('click', function () { W.GKSOS.open(st.inc); });
    render();
  }

  /* ---------- Máy tính thu nhập đối tác ---------- */
  function initIncome() {
    var box = $('#gkIncome'); if (!box) return;
    var f = $('#incFee'), pa = $('#incParts'), ti = $('#incTier'), jb = $('#incJobs'), bo = $('#incBonus'), so = $('#incSos');
    function calc() {
      var fee = +f.value, parts = +pa.value, rate = +ti.value, jobs = +jb.value, bonus = bo.checked ? 20000 : 0, sos = so.checked ? 30000 : 0;
      var com = Math.round(fee * rate), per = fee + parts + bonus + sos - com, day = per * jobs;
      if (so.checked && sos * jobs < 200000) day = (per - sos) * jobs + Math.max(200000, sos * jobs);
      $('#incJobsTxt').textContent = jobs;
      $('#incPer').textContent = fmt(per); $('#incDay').textContent = fmt(day); $('#incMonth').textContent = fmt(day * 26);
      $('#incFormula').innerHTML = (fee / 1000) + '.000 công' + (parts ? ' + ' + (parts / 1000) + '.000 phụ tùng' : '') + (bonus ? ' + 20.000 thưởng' : '') + (sos ? ' + 30.000 SOS' : '') + (com ? ' − ' + com.toLocaleString('vi-VN') + ' hoa hồng' : ' (miễn hoa hồng)') + ' = <b>' + fmt(per) + '</b>/cuốc' + (so.checked ? ' · ca SOS bảo đảm tối thiểu 200.000đ/đêm' : '');
    }
    [f, pa, ti, jb, bo, so].forEach(function (el) { el.addEventListener('input', calc); el.addEventListener('change', calc); });
    calc();
  }

  function boot() { renderRecent(); initAbout(); initJourney(); initVision(); initTeam(); initGauges(); initEstimator(); initIncome(); W.addEventListener('resize', function () { renderRecent(); }); }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', boot); else boot();
})(window, document);
