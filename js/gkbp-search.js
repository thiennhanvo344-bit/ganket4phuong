/* ==========================================================================
   gkbp-search.js — Tìm kiếm thông minh (header + hero trang chủ)
   API: gkSearch.goSearch(q) · onInput(el) · onFocus(el) · onBlur(el)
   Tìm theo: dịch vụ / gói / phụ tùng, sự cố, khu vực, bài viết, trang.
   Không phân biệt dấu tiếng Việt: “va lop” vẫn ra “Vá lốp”.
   ========================================================================== */
(function (W, D) {
  'use strict';
  var RECENT = 'gkbp_search_recent';
  var POPULAR = ['vá lốp', 'kích bình', 'kéo xe', 'hết xăng', 'mở khóa', 'thay nhớt', 'xe điện', 'gói sinh viên'];
  var SYN = { 'thung': 'lop', 'xi lop': 'lop', 'banh': 'lop', 'acquy': 'binh', 'ac quy': 'binh', 'battery': 'binh', 'chet may': 'khoi dong', 'khong no': 'khoi dong', 'chia': 'khoa', 'cuu ho': 'cuu ho', 'keo': 'keo', 'xang': 'xang', 'dau': 'nhien lieu', 'nhot': 'nhot' };

  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function hl(text, q) {
    if (!q) return esc(text);
    var words = norm(q).split(' ').filter(Boolean);
    // highlight theo vị trí ký tự: bỏ dấu từng ký tự nên độ dài chuỗi giữ nguyên
    var plain = String(text).normalize('NFC'), marks = new Array(plain.length).fill(false);
    var np = plain.split('').map(function (c) { var b = c.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); return b === 'đ' ? 'd' : (b.length === 1 ? b : c); }).join('');
    words.forEach(function (w) { var i = np.indexOf(w); while (w && i > -1) { for (var k = i; k < i + w.length; k++) marks[k] = true; i = np.indexOf(w, i + w.length); } });
    var out = '', on = false;
    for (var i = 0; i < plain.length; i++) {
      if (marks[i] && !on) { out += '<span class="ks-highlight">'; on = true; }
      if (!marks[i] && on) { out += '</span>'; on = false; }
      out += esc(plain[i]);
    }
    return out + (on ? '</span>' : '');
  }

  var INDEX = null;
  function build() {
    if (INDEX) return INDEX;
    var G = W.GK_DATA || {}; INDEX = [];
    (G.SERVICES || []).forEach(function (s) {
      INDEX.push({ type: 'svc', title: s.title, meta: s.cat + ' · ' + s.loc, price: s.price, img: s.img, url: 'html_dichvu.html?id=' + s.id, text: norm(s.title + ' ' + s.cat + ' ' + s.loc + ' ' + s.desc) });
    });
    (G.INCIDENTS || []).forEach(function (x) {
      INDEX.push({ type: 'sos', title: 'Báo sự cố: ' + x.name, meta: x.short, icon: x.icon, sos: x.id, text: norm(x.name + ' ' + x.short + ' cuu ho sos') });
    });
    (G.AREAS || []).forEach(function (a) {
      INDEX.push({ type: 'area', title: a.name, meta: a.phase + ' · ' + (a.mechanics ? a.mechanics + ' thợ đối tác' : a.stage), img: a.img, url: 'html_diadiem.html?loc=' + a.id, text: norm(a.name + ' ' + a.city + ' ' + a.hot.join(' ') + ' khu vuc') });
    });
    (G.BLOG_INDEX || []).forEach(function (p) {
      INDEX.push({ type: 'blog', title: p.title, meta: p.cat + ' · ' + p.readTime + ' phút đọc', img: p.img, url: 'html_blog.html?id=' + p.id, text: norm(p.title + ' ' + p.excerpt + ' ' + p.cat) });
    });
    (G.PAGES || []).forEach(function (p) {
      INDEX.push({ type: 'page', title: p.name, meta: 'Trang', icon: p.icon, url: p.url, text: norm(p.name + ' ' + p.kw) });
    });
    return INDEX;
  }
  function search(q) {
    var nq = norm(q); if (!nq) return [];
    Object.keys(SYN).forEach(function (k) { if (nq.indexOf(k) > -1 && nq.indexOf(SYN[k]) < 0) nq += ' ' + SYN[k]; });
    var words = nq.split(' ').filter(function (w) { return w.length > 1 || /\d/.test(w); });
    return build().map(function (it) {
      var sc = 0, tn = norm(it.title);
      words.forEach(function (w) { if (tn.indexOf(w) > -1) sc += 3; else if (it.text.indexOf(w) > -1) sc += 1; });
      if (tn.indexOf(norm(q)) > -1) sc += 4;
      return { it: it, sc: sc };
    }).filter(function (x) { return x.sc > 0; }).sort(function (a, b) { return b.sc - a.sc; }).map(function (x) { return x.it; });
  }

  var LABEL = { svc: ['Dịch vụ & sản phẩm', 'ks-badge-svc', 'Dịch vụ'], sos: ['Gọi cứu hộ ngay', 'ks-badge-sos', 'SOS'], area: ['Khu vực phục vụ', 'ks-badge-area', 'Khu vực'], blog: ['Bài viết cẩm nang', 'ks-badge-blog', 'Blog'], page: ['Trang', 'ks-badge-page', 'Trang'] };
  function dd(el) {
    if (!el) return null;
    if (el.id === 'hero-search-inp') return D.getElementById('hero-search-dropdown');
    return D.getElementById('header-dropdown');
  }
  function itemHtml(it, q, idx) {
    var thumb = it.img ? '<div class="ks-thumb"><img src="' + it.img + '" alt="" loading="lazy"></div>' : '<div class="ks-thumb ks-thumb-icon"><i class="fas ' + (it.icon || 'fa-search') + '"></i></div>';
    var L = LABEL[it.type];
    var attr = it.sos ? 'data-sos-open="' + it.sos + '"' : 'href="' + it.url + '"';
    return '<a class="ks-item" ' + attr + ' data-idx="' + idx + '" role="option">' + thumb +
      '<div class="ks-info"><div class="ks-item-title">' + hl(it.title, q) + '</div><div class="ks-item-meta"><span class="ks-badge ' + L[1] + '">' + L[2] + '</span> ' + esc(it.meta) +
      (it.price ? ' · <span class="ks-price">' + esc(it.price) + '</span>' : '') + '</div></div><i class="fas fa-chevron-right ks-item-arrow"></i></a>';
  }
  function render(el) {
    var box = dd(el); if (!box) return;
    var q = (el.value || '').trim();
    var html = '';
    if (!q) {
      var rec = []; try { rec = JSON.parse(localStorage.getItem(RECENT) || '[]'); } catch (e) {}
      html += '<div class="ks-suggest-wrap">';
      if (rec.length) html += '<div class="ks-suggest-label"><i class="fas fa-history mr-1"></i>Tìm gần đây</div><div class="ks-suggest-tags mb-2">' + rec.slice(0, 6).map(function (r) { return '<span class="ks-tag" data-q="' + esc(r) + '">' + esc(r) + '</span>'; }).join('') + '</div>';
      html += '<div class="ks-suggest-label"><i class="fas fa-fire mr-1"></i>Mọi người hay tìm</div><div class="ks-suggest-tags">' + POPULAR.map(function (r) { return '<span class="ks-tag" data-q="' + r + '">' + r + '</span>'; }).join('') + '</div></div>';
      html += '<a class="ks-footer ks-footer-sos" data-sos-open><i class="fas fa-life-ring mr-1"></i> Đang gặp sự cố? Gọi cứu hộ ngay</a>';
    } else {
      var res = search(q);
      if (!res.length) {
        html = '<div class="ks-empty"><i class="fas fa-tools"></i>Chưa tìm thấy “' + esc(q) + '”.<br><small>Thử “vá lốp”, “ắc quy”, “kéo xe” hoặc bấm SOS để được hỗ trợ.</small></div>';
      } else {
        var groups = {}, order = ['sos', 'svc', 'area', 'blog', 'page'], idx = 0;
        res.forEach(function (r) { (groups[r.type] = groups[r.type] || []).push(r); });
        order.forEach(function (t) {
          if (!groups[t]) return;
          html += '<div class="ks-section-header">' + LABEL[t][0] + '</div>';
          groups[t].slice(0, t === 'svc' ? 5 : 3).forEach(function (it) { html += itemHtml(it, q, idx++); });
        });
      }
      html += '<a class="ks-footer" href="html_dichvu.html?q=' + encodeURIComponent(q) + '">Xem tất cả kết quả cho “' + esc(q) + '” <i class="fas fa-arrow-right ml-1"></i></a>';
    }
    box.innerHTML = html;
    box.classList.add('open');
    var tags = box.querySelectorAll('.ks-tag');
    for (var i = 0; i < tags.length; i++) tags[i].addEventListener('mousedown', function (e) { e.preventDefault(); el.value = this.getAttribute('data-q'); render(el); el.focus(); });
    var it = box.querySelectorAll('[data-sos-open]');
    for (var j = 0; j < it.length; j++) it[j].addEventListener('mousedown', function (e) { e.preventDefault(); close(el); if (W.GKSOS) W.GKSOS.open(this.getAttribute('data-sos-open') || ''); });
    var links = box.querySelectorAll('a[href]');
    for (var k = 0; k < links.length; k++) links[k].addEventListener('mousedown', function () { saveRecent(el.value); });
  }
  function close(el) {
    var box = dd(el); if (box) box.classList.remove('open');
    var w = el && el.closest ? el.closest('.header-search-wrap') : null; if (w) w.classList.remove('focused');
    var hb = D.getElementById('hero-search-box'); if (hb && el && el.id === 'hero-search-inp') hb.classList.remove('expanded');
  }
  function saveRecent(q) {
    q = (q || '').trim(); if (!q) return;
    try { var r = JSON.parse(localStorage.getItem(RECENT) || '[]'); r = r.filter(function (x) { return x !== q; }); r.unshift(q); localStorage.setItem(RECENT, JSON.stringify(r.slice(0, 8))); } catch (e) {}
  }
  function keyNav(e) {
    var el = e.target, box = dd(el); if (!box || !box.classList.contains('open')) return;
    var items = box.querySelectorAll('.ks-item'); if (!items.length) return;
    var cur = box.querySelector('.ks-item.kbd'), i = cur ? [].indexOf.call(items, cur) : -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); if (cur) cur.classList.remove('kbd');
      i = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
      items[i].classList.add('kbd'); items[i].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && cur) {
      e.preventDefault(); e.stopImmediatePropagation(); saveRecent(el.value);
      if (cur.hasAttribute('data-sos-open')) { close(el); if (W.GKSOS) W.GKSOS.open(cur.getAttribute('data-sos-open')); } else location.href = cur.getAttribute('href');
    } else if (e.key === 'Escape') { close(el); el.blur(); }
  }

  var api = {
    onFocus: function (el) {
      var w = el.closest ? el.closest('.header-search-wrap') : null; if (w) w.classList.add('focused');
      var hb = D.getElementById('hero-search-box'); if (hb && el.id === 'hero-search-inp') hb.classList.add('expanded');
      if (!el._gkKey) { el._gkKey = 1; el.addEventListener('keydown', keyNav, true); }
      render(el);
    },
    onInput: function (el) { render(el); },
    onBlur: function (el) { setTimeout(function () { close(el); }, 180); },
    goSearch: function (q) {
      q = (q || '').trim();
      if (!q) { var i = D.getElementById('header-search-inp'); if (i) i.focus(); return; }
      saveRecent(q);
      try { sessionStorage.setItem('gkbp_search_query', q); } catch (e) {}
      location.href = 'html_dichvu.html?q=' + encodeURIComponent(q);
    },
    search: search, norm: norm
  };
  W.gkSearch = api;
})(window, document);
