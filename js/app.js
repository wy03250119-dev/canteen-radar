/* =====================================================
 * 食堂雷达 · 校园食堂点评推荐 —— 交互逻辑
 * 纯前端 SPA：hash 路由 + 事件委托 + localStorage
 * 无任何构建依赖，双击 index.html 或任意静态托管即可运行
 * ===================================================== */

'use strict';

/* ---------- 本地存储 ---------- */
const LS = { reviews: 'cr_reviews', prefs: 'cr_prefs', avoid: 'cr_avoid', rec: 'cr_rec', likes: 'cr_likes' };
const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

const state = {
  reviews: load(LS.reviews, []),   // 用户发布的点评
  prefs: load(LS.prefs, []),       // 口味偏好
  avoid: load(LS.avoid, []),       // 用户标记避雷的菜品 id
  rec: load(LS.rec, []),           // 用户安利的菜品 id
  likes: load(LS.likes, []),       // 用户点赞的评价 id
  cTab: 'dishes',                  // 食堂详情当前 tab
  cFilter: 'all',                  // 食堂列表筛选
  cCampus: 'all',                  // 校区筛选
  rTab: 'hot',                     // 榜单 tab
  draft: null,                     // 正在编辑的点评
  lastDice: null,
};

/* ---------- 工具 ---------- */
const $ = (sel, root) => (root || document).querySelector(sel);
const view = $('#view');
const modalRoot = $('#modalRoot');
const toastRoot = $('#toastRoot');
const searchBar = $('#searchBar');
const searchInput = $('#searchInput');

const C = id => CANTEENS.find(c => c.id === id);
const W = id => WINDOWS.find(w => w.id === id);
const D = id => DISHES.find(d => d.id === id);

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

const fmtHour = x => { const h = Math.floor(x), m = Math.round((x - h) * 60); return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'); };
const fmtHours = c => fmtHour(c.hours[0]) + ' - ' + fmtHour(c.hours[1]);

function isOpen(c) { const n = new Date(); const h = n.getHours() + n.getMinutes() / 60; return h >= c.hours[0] && h < c.hours[1]; }
const openCount = () => CANTEENS.filter(isOpen).length;

/* ---------- 实时排队指数（按当前时间+窗口高峰时段模拟） ---------- */
function crowdOf(w) {
  const c = C(w.canteenId), n = new Date();
  const h = n.getHours() + n.getMinutes() / 60;
  if (h < c.hours[0] || h >= c.hours[1]) return 0;
  let lvl = w.base + ((w.id.charCodeAt(2) * 7) % 9) - 4;
  for (const [s, e] of (w.peak || [])) if (h >= s && h < e) lvl += 34;
  return Math.max(4, Math.min(100, Math.round(lvl)));
}
function crowdLabel(lvl) {
  if (lvl === 0) return { txt: '已打烊', cls: '' };
  if (lvl < 40) return { txt: '🟢 空闲', cls: '' };
  if (lvl < 70) return { txt: '🟡 适中', cls: 'l2' };
  return { txt: '🔴 拥挤', cls: 'l3' };
}
function crowdLevelHTML(lvl) {
  const lb = crowdLabel(lvl);
  return `<div class="crowd"><div class="crowd-head"><span>实时排队指数</span><b class="${lvl >= 70 ? 'c-warn' : ''}">${lb.txt} ${lvl}%</b></div><div class="crowd-bar"><i class="${lb.cls}" style="width:${lvl}%"></i></div></div>`;
}
const crowdOfWindowHTML = w => crowdLevelHTML(crowdOf(w));

/* ---------- 评分 ---------- */
function dishStats(d) {
  const mine = state.reviews.filter(r => r.dishId === d.id);
  if (!mine.length) return { rating: d.rating, count: d.ratingCount };
  const sum = mine.reduce((a, r) => a + r.stars, 0);
  return { rating: (d.rating * d.ratingCount + sum) / (d.ratingCount + mine.length), count: d.ratingCount + mine.length };
}
function starsHTML(r) {
  let out = '<span class="stars">';
  for (let i = 1; i <= 5; i++) out += `<i class="star ${r >= i ? 'on' : (r >= i - 0.5 ? 'half' : '')}">★</i>`;
  return out + '</span>';
}
function scoreHTML(r) {
  const cls = r >= 4.5 ? 's-high' : r >= 4 ? 's-mid' : r >= 3.5 ? 's-ok' : 's-low';
  return `<span class="score ${cls}">${r.toFixed(1)}</span>`;
}
function tagChips(d) {
  const map = { '招牌': 'tag-hot', '新菜': 'tag-new', '踩雷预警': 'tag-danger', '避雷常客': 'tag-danger' };
  return (d.tags || []).filter(t => map[t]).slice(0, 2).map(t => `<span class="tag ${map[t]}">${t}</span>`).join('');
}
function reviewsOf(dishId) {
  const list = SEED_REVIEWS.filter(r => r.dishId === dishId)
    .map((r, i) => Object.assign({ id: 's' + dishId + '_' + i }, r))
    .concat(state.reviews.filter(r => r.dishId === dishId));
  return list.sort((a, b) => (b.likes + (state.likes.includes(b.id) ? 1 : 0)) - (a.likes + (state.likes.includes(a.id) ? 1 : 0)));
}

/* ---------- 组件 ---------- */
function emptyHTML(title, sub) {
  return `<div class="empty"><span class="e-emoji">🍽️</span><div class="e-title">${title}</div><div class="e-sub">${sub || ''}</div></div>`;
}

function dishRowHTML(d, rank) {
  const c = C(d.canteenId), w = W(d.windowId), st = dishStats(d);
  return `
  <div class="dish-row" data-action="go-dish" data-id="${d.id}">
    ${rank ? `<span class="rank r${rank <= 3 ? rank : 'n'}">${rank}</span>` : ''}
    <div class="dish-emoji">${d.emoji}</div>
    <div class="dish-main">
      <div class="dish-name">${d.name}${tagChips(d)}</div>
      <div class="dish-sub">${c.name} · ${w.name} · <span class="dish-price">${d.price}</span></div>
      <div class="dish-meta">${starsHTML(st.rating)}<span class="dish-score">${st.rating.toFixed(1)}</span><span class="dot">·</span><span>${st.count}人评</span></div>
    </div>
    <div class="dish-side">${scoreHTML(st.rating)}</div>
  </div>`;
}

function canteenCardHTML(c) {
  const open = isOpen(c);
  const wlist = WINDOWS.filter(w => w.canteenId === c.id);
  const maxCrowd = Math.max(...wlist.map(crowdOf));
  return `
  <a class="canteen-card" href="#/canteen/${c.id}">
    <div class="cc-emoji">${c.emoji}</div>
    <div class="cc-body">
      <div class="cc-title"><span class="cc-name">${c.name}</span>${open ? '<span class="pill open">营业中</span>' : '<span class="pill closed">已打烊</span>'}</div>
      <div class="cc-meta">${scoreHTML(c.rating)}<span>${c.rating.toFixed(1)}分</span><span class="dot">·</span><span>人均¥${c.avgPrice}</span><span class="dot">·</span><span>${c.distance}m</span></div>
      <div class="cc-tags">${(CAMPUS.campuses && CAMPUS.campuses.length > 1) ? `<span class="chip campus-chip">${c.campus}</span>` : ''}${c.tags.map(t => `<span class="chip">${t}</span>`).join('')}</div>
      ${open ? crowdLevelHTML(maxCrowd) : ''}
    </div>
  </a>`;
}

function windowCardHTML(w) {
  const c = C(w.canteenId);
  const ds = DISHES.filter(d => d.windowId === w.id);
  const minD = ds.length ? ds.reduce((a, b) => (a.rating <= b.rating ? a : b)) : null;
  const warn = minD && minD.rating < 3.5;
  return `
  <a class="window-card" href="#/canteen/${c.id}">
    <div class="wc-top">
      <span class="wc-emoji">${w.emoji}</span>
      <div class="wc-main">
        <div class="wc-name">${w.name}</div>
        <div class="wc-sub">${ds.length} 道菜 · ${warn ? `<span class="warn">⚠ 含踩雷菜「${minD.name}」</span>` : '口碑稳定'}</div>
      </div>
      ${scoreHTML(w.rating)}
    </div>
    ${crowdOfWindowHTML(w)}
  </a>`;
}

function reviewItemHTML(r, dishName, mine) {
  const liked = state.likes.includes(r.id);
  const likes = r.likes + (liked ? 1 : 0);
  return `
  <div class="review">
    <div class="rv-head">
      <span class="rv-avatar">${r.avatar}</span>
      <div class="rv-user">
        <div class="rv-name">${esc(r.user)}${mine ? '<span class="badge-me">我</span>' : ''}</div>
        <div class="rv-time">${esc(r.time)}${dishName ? ' · ' + esc(dishName) : ''}</div>
      </div>
      <span class="rv-stars">${starsHTML(r.stars)}</span>
    </div>
    <div class="rv-text">${esc(r.text)}</div>
    ${(r.tags && r.tags.length) ? `<div class="rv-tags">${r.tags.map(t => `<span class="chip sm">${esc(t)}</span>`).join('')}</div>` : ''}
    <div class="rv-foot" style="display:flex;justify-content:space-between;align-items:center">
      <button class="like-btn ${liked ? 'on' : ''}" data-action="like-review" data-id="${r.id}">${liked ? '❤️' : '🤍'} ${likes}</button>
      ${mine ? `<button class="btn sm ghost" data-action="delete-review" data-id="${r.id}">删除</button>` : ''}
    </div>
  </div>`;
}

/* ---------- 视图：首页 ---------- */
function renderHome() {
  const n = new Date(), h = n.getHours();
  const greet = h < 6 ? '夜深了' : h < 11 ? '早上好' : h < 14 ? '中午好' : h < 18 ? '下午好' : '晚上好';
  const hot = [...DISHES].sort((a, b) => b.hot - a.hot);
  const top = hot.slice(0, 8);
  const news = DISHES.filter(d => d.isNew);
  const banner = hot[0];
  const bc = C(banner.canteenId), bw = W(banner.windowId);
  const avoidTotal = DISHES.reduce((a, d) => a + d.avoid, 0) + state.avoid.length;

  view.innerHTML = `
  <div class="hero">
    <div class="hero-title">${greet}，今天想吃点什么？</div>
    <div class="hero-sub">${CAMPUS.name} · ${CAMPUS.slogan}</div>
    <div class="hero-stats">
      <span><b>${DISHES.length}</b> 道菜品</span>
      <span><b>${openCount()}</b> 个食堂营业中</span>
      <span><b>${avoidTotal}</b> 次避雷提醒</span>
    </div>
    <a class="hero-btn" href="#/blacklist">🚫 查看避雷榜</a>
  </div>

  <div class="quick-grid">
    <a class="qv" data-action="scroll-to" data-id="hotSec"><span class="qv-emoji">🔥</span><span class="qv-name">今日爆款</span></a>
    <a class="qv" data-action="scroll-to" data-id="newSec"><span class="qv-emoji">🆕</span><span class="qv-name">新菜速递</span></a>
    <a class="qv" href="#/blacklist"><span class="qv-emoji">🚫</span><span class="qv-name">避雷榜</span></a>
    <a class="qv" data-action="dice-open"><span class="qv-emoji">🎲</span><span class="qv-name">吃什么</span></a>
  </div>

  <div class="section">
    <div class="sec-head"><div class="sec-title"><span class="tt-emoji">🔥</span>今日人气王</div></div>
    <a href="#/dish/${banner.id}" style="display:flex;align-items:center;gap:14px;background:var(--card);border-radius:var(--radius);padding:14px;box-shadow:var(--shadow);transition:transform .12s">
      <span style="font-size:46px">${banner.emoji}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:16px;font-weight:800">${banner.name}${tagChips(banner)}</div>
        <div style="font-size:11px;color:var(--ink-2);margin-top:4px">${bc.name} · ${bw.name} · ¥${banner.price}</div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:6px">${scoreHTML(banner.rating)}<span style="font-size:11px;color:var(--ink-2)">${banner.desc || ''}</span></div>
      </div>
    </a>
  </div>

  <div class="section" id="hotSec">
    <div class="sec-head"><div class="sec-title"><span class="tt-emoji">🏆</span>人气菜品 TOP8<span class="sec-sub">按今日热度</span></div></div>
    <div class="hscroll">${top.map((d, i) => `
      <a class="hc-card" href="#/dish/${d.id}">
        <span class="rank-badge">${i + 1}</span>
        <span class="hc-emoji">${d.emoji}</span>
        <div class="hc-name">${d.name}</div>
        <div class="hc-sub">${W(d.windowId).name}</div>
        <div class="hc-foot"><span class="hc-price">${d.price}</span><span class="hc-score">${d.rating.toFixed(1)}分</span></div>
      </a>`).join('')}</div>
  </div>

  <div class="section" id="newSec">
    <div class="sec-head"><div class="sec-title"><span class="tt-emoji">🆕</span>本周新菜<span class="sec-sub">抢先尝鲜</span></div></div>
    <div class="hscroll">${news.map(d => `
      <a class="hc-card" href="#/dish/${d.id}">
        <span class="hc-emoji">${d.emoji}</span>
        <div class="hc-name">${d.name} <span class="tag tag-new">新菜</span></div>
        <div class="hc-sub">${C(d.canteenId).name}</div>
        <div class="hc-foot"><span class="hc-price">${d.price}</span><span class="hc-score">${d.rating.toFixed(1)}分</span></div>
      </a>`).join('')}</div>
  </div>

  <div class="section">
    <div class="sec-head"><div class="sec-title"><span class="tt-emoji">🏫</span>全部食堂</div><a class="more" href="#/canteens">查看全部 ›</a></div>
    ${CANTEENS.slice(0, 4).map(canteenCardHTML).join('')}
  </div>`;
}

/* ---------- 视图：食堂列表 ---------- */
function renderCanteens() {
  const f = state.cFilter || 'all';
  const cc = state.cCampus || 'all';
  let list = [...CANTEENS];
  if (cc !== 'all') list = list.filter(c => c.campus === cc);
  if (f === 'open') list = list.filter(isOpen);
  else if (f === 'rating') list.sort((a, b) => b.rating - a.rating);
  else if (f === 'dist') list.sort((a, b) => a.distance - b.distance);
  view.innerHTML = `
  <div class="section" style="margin-top:2px">
    <div class="sec-head"><div class="sec-title"><span class="tt-emoji">🏫</span>${CAMPUS.name}食堂一览<span class="sec-sub">${list.length} 个</span></div></div>
    ${(CAMPUS.campuses && CAMPUS.campuses.length > 1) ? `
    <div class="seg" style="margin:0 0 10px">
      ${[['all', '全部校区'], ...CAMPUS.campuses.map(x => [x, x])].map(([k, n]) => `<button data-action="campus-filter" data-v="${k}" class="${cc === k ? 'on' : ''}">${n}</button>`).join('')}
    </div>` : ''}
    <div class="seg" style="margin:0 0 12px">
      ${[['all', '全部'], ['open', '营业中'], ['rating', '评分优先'], ['dist', '距离最近']].map(([k, n]) => `<button data-action="canteen-filter" data-v="${k}" class="${f === k ? 'on' : ''}">${n}</button>`).join('')}
    </div>
    ${list.map(canteenCardHTML).join('')}
  </div>`;
}

/* ---------- 视图：食堂详情 ---------- */
function renderCanteen(id) {
  const c = C(id);
  if (!c) { view.innerHTML = emptyHTML('食堂不存在', '换个入口试试'); return; }
  const open = isOpen(c);
  const wlist = WINDOWS.filter(w => w.canteenId === c.id);
  const dishes = DISHES.filter(d => d.canteenId === c.id);
  const maxCrowd = Math.max(...wlist.map(crowdOf));
  const tab = state.cTab || 'dishes';

  let body = '';
  if (tab === 'dishes') {
    const sig = dishes.filter(d => d.tags.includes('招牌') || d.rating >= 4.5).sort((a, b) => b.hot - a.hot);
    const list = sig.length ? sig : dishes.slice().sort((a, b) => b.rating - a.rating).slice(0, 6);
    body = list.map(dishRowHTML).join('');
  } else if (tab === 'windows') {
    body = wlist.map(windowCardHTML).join('');
  } else {
    const allRev = dishes.flatMap(d => reviewsOf(d.id).map(r => Object.assign({ dishName: d.name }, r)))
      .sort((a, b) => b.likes - a.likes).slice(0, 20);
    body = allRev.map(r => reviewItemHTML(r, r.dishName)).join('') || emptyHTML('这个食堂还没有评价', '快去尝鲜写第一条吧');
  }

  view.innerHTML = `
  <div class="sub-nav"><a class="back-btn" href="#/canteens">‹ 返回</a></div>
  <div class="canteen-hero">
    <div class="ch-emoji">${c.emoji}</div>
    <div class="ch-info">
      <div class="ch-title"><span class="ch-name">${c.name}</span>${open ? '<span class="pill open">营业中</span>' : '<span class="pill closed">已打烊</span>'}</div>
      <div class="ch-meta">${scoreHTML(c.rating)}<span>${c.rating.toFixed(1)}分</span><span class="dot">·</span><span>人均¥${c.avgPrice}</span><span class="dot">·</span><span>${c.distance}m</span></div>
      <div class="ch-meta"><span>⏰ ${fmtHours(c)}</span><span class="dot">·</span><span>📍 ${c.floors}</span></div>
    </div>
  </div>
  <div class="ch-desc" style="margin-top:10px;padding:0 4px;font-size:12px;color:var(--ink-2)">${c.desc}</div>
  <div class="ch-tags" style="padding:0 4px">${c.tags.map(t => `<span class="chip">${t}</span>`).join('')}</div>
  ${open ? `<div style="background:var(--card);border-radius:var(--radius);padding:10px 14px;margin-top:12px;box-shadow:var(--shadow)">${crowdLevelHTML(maxCrowd)}</div>` : ''}

  <div class="seg">
    ${[['dishes', '招牌菜'], ['windows', '窗口'], ['reviews', '评价']].map(([k, n]) => `<button data-action="ctab" data-v="${k}" class="${tab === k ? 'on' : ''}">${n}</button>`).join('')}
  </div>
  ${body}`;
}

/* ---------- 视图：菜品详情 ---------- */
function renderDish(id) {
  const d = D(id);
  if (!d) { view.innerHTML = emptyHTML('菜品不存在', '可能已经下架了'); return; }
  const c = C(d.canteenId), w = W(d.windowId);
  const st = dishStats(d);
  const open = isOpen(c);
  const avoided = state.avoid.includes(d.id);
  const reced = state.rec.includes(d.id);
  const avoidN = d.avoid + (avoided ? 1 : 0);
  const recN = d.rec + (reced ? 1 : 0);
  const revs = reviewsOf(d.id);
  const similar = DISHES.filter(x => x.canteenId === d.canteenId && x.id !== d.id).sort((a, b) => b.hot - a.hot).slice(0, 3);
  const verdict = st.rating >= 4.5 ? ['good', '✅ 大家说好：大部分同学吃完都会安利给室友']
    : st.rating >= 3.5 ? ['mid', '🙂 中规中矩：可以吃，但不算惊喜']
    : ['bad', `🚫 踩雷预警：已有 ${avoidN} 人标记踩雷，下单前请三思`];

  view.innerHTML = `
  <div class="sub-nav"><a class="back-btn" data-action="back">‹ 返回</a><span class="crumb">${c.name}</span></div>
  <div class="dish-hero">
    <div class="dh-emoji">${d.emoji}</div>
    <div class="dh-name">${d.name}${tagChips(d)}</div>
    <div class="dh-rating">
      <span class="dh-score-num">${st.rating.toFixed(1)}</span>
      <div style="text-align:left">
        <div>${starsHTML(st.rating)}</div>
        <div class="dh-count">${st.count} 人评价 · 安利 ${recN} 次</div>
      </div>
    </div>
    <div class="dh-meta"><b style="color:var(--primary-deep);font-size:15px">¥${d.price}</b><span class="dot">·</span>${c.name} ${w.name}${d.trend ? `<span class="trend-chip ${d.trend === 'up' ? 'up' : 'down'}">${d.trend === 'up' ? '📈' : '📉'} 近7天 ${d.trendDelta > 0 ? '+' : ''}${d.trendDelta.toFixed(1)}</span>` : ''}</div>
    ${d.desc ? `<div class="dh-desc">💬 ${esc(d.desc)}</div>` : ''}
  </div>

  <div class="metrics">
    <div class="sec-head" style="margin-bottom:2px"><div class="sec-title" style="font-size:14px">📊 多维度评分</div></div>
    ${[['口味', d.m.t], ['分量', d.m.p], ['性价比', d.m.v], ['出餐速度', d.m.s]].map(([l, v]) => `
      <div class="metric"><span class="m-label">${l}</span><div class="m-bar"><i style="width:${v * 20}%"></i></div><span class="m-val">${v.toFixed(1)}</span></div>`).join('')}
  </div>

  <div class="verdict ${verdict[0]}"><b>${verdict[1]}</b></div>

  <div class="loc-card">
    <div class="loc-row"><span>所在窗口</span><b>${w.emoji} ${w.name} <a href="#/canteen/${c.id}" style="color:var(--primary)">进入 ›</a></b></div>
    <div class="loc-row"><span>营业时间</span><b>${fmtHours(c)}</b></div>
    <div class="loc-row"><span>位置</span><b>${c.floors} · 距宿舍 ${c.distance}m</b></div>
    ${open ? `<div style="margin-top:6px">${crowdOfWindowHTML(w)}</div>` : '<div style="margin-top:8px"><span class="pill closed">当前已打烊</span></div>'}
  </div>

  <div class="sticky-bar">
    <button class="btn ${avoided ? 'danger' : 'ghost'}" data-action="mark-avoid" data-id="${d.id}" style="flex:1">🚫 ${avoided ? '已标记避雷' : '标记踩雷'}</button>
    <button class="btn ${reced ? 'primary' : 'ghost'}" data-action="mark-rec" data-id="${d.id}" style="flex:1">❤️ ${reced ? '已安利' : '安利一下'}</button>
    <button class="btn primary" data-action="write-review" data-id="${d.id}" style="flex:1.2">✍️ 写点评</button>
  </div>

  <div class="section">
    <div class="sec-head"><div class="sec-title"><span class="tt-emoji">🍽️</span>同食堂人气</div></div>
    ${similar.map(dishRowHTML).join('')}
  </div>

  <div class="section">
    <div class="sec-head"><div class="sec-title"><span class="tt-emoji">💬</span>同学评价 (${revs.length})</div></div>
    ${revs.map(r => reviewItemHTML(r)).join('') || emptyHTML('还没有评价', '来做第一个点评的人吧')}
    <button class="btn primary block" data-action="write-review" data-id="${d.id}" style="width:100%;margin-top:4px">✍️ 写点评，帮同学避雷</button>
  </div>`;
}

/* ---------- 视图：避雷榜 ---------- */
function renderBlacklist() {
  const ranked = [...DISHES].filter(d => d.avoid > 0 || d.rating < 3.5)
    .sort((a, b) => (b.avoid - a.avoid) || (a.rating - b.rating)).slice(0, 10);
  const totalAvoid = DISHES.reduce((a, d) => a + d.avoid, 0) + state.avoid.length;
  const badWindows = WINDOWS.map(w => {
    const ds = DISHES.filter(d => d.windowId === w.id);
    const bad = ds.filter(d => d.rating < 3.5);
    return { w, bad, avoid: bad.reduce((a, d) => a + d.avoid, 0) };
  }).filter(x => x.bad.length).sort((a, b) => b.avoid - a.avoid).slice(0, 5);

  view.innerHTML = `
  <div class="black-stat">
    <div class="bs-title">🚫 食堂避雷榜</div>
    <div class="bs-num">${totalAvoid} 次</div>
    <div class="bs-sub">全校同学累计踩雷标记 · 实时更新</div>
  </div>

  <div class="section">
    <div class="sec-head"><div class="sec-title"><span class="tt-emoji">💣</span>踩雷菜品 TOP${ranked.length}</div></div>
    ${ranked.map((d, i) => {
      const c = C(d.canteenId), w = W(d.windowId);
      return `
      <div class="black-row" data-action="go-dish" data-id="${d.id}">
        <span class="rank r${i < 3 ? i + 1 : 'n'}">${i + 1}</span>
        <span class="black-emoji">${d.emoji}</span>
        <div class="black-main">
          <div class="black-name">${d.name}</div>
          <div class="black-sub">${c.name} · ${w.name} · ¥${d.price}</div>
        </div>
        <div class="black-side">
          <div class="black-avoid"><b>${d.avoid}</b>人踩雷</div>
          <div class="black-rate">评分 ${d.rating.toFixed(1)}</div>
        </div>
      </div>`;
    }).join('')}
  </div>

  <div class="section">
    <div class="sec-head"><div class="sec-title"><span class="tt-emoji">⚠️</span>避雷窗口</div></div>
    ${badWindows.map(x => windowCardHTML(x.w)).join('') || '<div class="empty">暂无踩雷窗口</div>'}
  </div>

  <div class="section">
    <div class="sec-head"><div class="sec-title"><span class="tt-emoji">💡</span>学长学姐避雷心得</div></div>
    ${AVOID_TIPS.map(t => `<div class="tip-card"><span class="tip-emoji">${t.emoji}</span><div><div class="tip-title">${t.title}</div><div class="tip-text">${t.text}</div></div></div>`).join('')}
  </div>
  <div class="disclaimer">* 以上数据为产品原型演示用虚构数据，请以食堂实际情况为准</div>`;
}

/* ---------- 视图：榜单 ---------- */
function renderRankings() {
  const tab = state.rTab || 'hot';
  let list = [];
  let sub = '';
  if (tab === 'hot') { list = [...DISHES].sort((a, b) => b.hot - a.hot).slice(0, 10); sub = '按今日实时热度'; }
  else if (tab === 'rating') { list = [...DISHES].sort((a, b) => b.rating - a.rating).slice(0, 10); sub = '按综合评分'; }
  else { list = DISHES.filter(d => d.trend === 'up').sort((a, b) => (b.trendDelta || 0) - (a.trendDelta || 0)).slice(0, 10); sub = '近7天口碑上升最快'; }
  view.innerHTML = `
  <div class="black-stat">
    <div class="bs-title">🏆 全校榜单</div>
    <div class="bs-num">${DISHES.length} 道</div>
    <div class="bs-sub">覆盖 ${CANTEENS.length} 个食堂 · ${CAMPUS.campuses.join(' / ')}</div>
  </div>
  <div class="seg">
    ${[['hot', '🔥人气榜'], ['rating', '⭐评分榜'], ['rise', '🚀口碑上升榜']].map(([k, n]) => `<button data-action="rtab" data-v="${k}" class="${tab === k ? 'on' : ''}">${n}</button>`).join('')}
  </div>
  <div class="sec-sub" style="margin:6px 2px 10px;color:var(--ink-3)">${sub}</div>
  ${list.length ? list.map((d, i) => dishRowHTML(d, i + 1)).join('') : emptyHTML('暂无数据', '口碑上升榜需要趋势数据')}
  <div class="disclaimer">* 榜单按热度/评分/近7天口碑增量实时计算（演示数据）</div>`;
}

/* ---------- 视图：我的 ---------- */
function renderMe() {
  const myRev = state.reviews.slice().reverse();
  const contrib = state.reviews.length * 10 + state.avoid.length * 2 + state.rec.length * 2;
  view.innerHTML = `
  <div class="me-card">
    <div class="me-avatar">🍚</div>
    <div>
      <div class="me-name">干饭新生</div>
      <div class="me-sub">${CAMPUS.name} · Lv.${Math.max(1, Math.floor(contrib / 10))} 干饭人 · 贡献值 ${contrib}</div>
    </div>
  </div>
  <div class="me-stats">
    <div class="ms-item"><b>${state.reviews.length}</b><span>我的点评</span></div>
    <div class="ms-item"><b>${state.avoid.length}</b><span>我的避雷</span></div>
    <div class="ms-item"><b>${state.rec.length}</b><span>我的安利</span></div>
  </div>

  <div class="section">
    <div class="sec-head"><div class="sec-title"><span class="tt-emoji">👅</span>口味偏好<span class="sec-sub">用于智能推荐</span></div></div>
    <div class="pref-grid">${PREF_TAGS.map(t => `<button class="pref ${state.prefs.includes(t) ? 'on' : ''}" data-action="pick-pref" data-v="${t}">${t}</button>`).join('')}</div>
  </div>

  <div class="section">
    <div class="sec-head"><div class="sec-title"><span class="tt-emoji">✍️</span>我的点评</div></div>
    ${myRev.map(r => reviewItemHTML(r, D(r.dishId) ? D(r.dishId).name : '', true)).join('') || emptyHTML('还没有点评', '吃到好吃的/踩雷的都来记一笔')}
  </div>

  <div class="section">
    <div class="sec-head"><div class="sec-title"><span class="tt-emoji">🚫</span>我的避雷清单</div></div>
    ${state.avoid.length ? state.avoid.map(id => D(id)).filter(Boolean).map(dishRowHTML).join('') : emptyHTML('清单为空', '看到踩雷预警就随手标记吧')}
  </div>

  <div class="section">
    <div class="sec-head"><div class="sec-title"><span class="tt-emoji">❤️</span>我的安利</div></div>
    ${state.rec.length ? state.rec.map(id => D(id)).filter(Boolean).map(dishRowHTML).join('') : emptyHTML('还没有安利', '在菜品页点「安利一下」收藏好菜')}
  </div>

  <div class="section">
    <div class="sec-head"><div class="sec-title"><span class="tt-emoji">📖</span>关于食堂雷达</div></div>
    <div class="about-card">
      <b>食堂雷达</b> 是面向大学生的一站式校园食堂点评推荐工具：<br>
      · <b>发现</b>：人气榜 / 新菜速递，不错过每个窗口的好味道<br>
      · <b>避雷</b>：踩雷黑榜 + 晚市提醒，避开每一口坑<br>
      · <b>决策</b>：选择困难时，让「吃什么」帮你摇一摇<br>
      当前为 v0.1 产品原型，全部数据为虚构演示。
    </div>
  </div>`;
}

/* ---------- 搜索 ---------- */
function renderSearch(q) {
  q = (q || '').trim().toLowerCase();
  if (!q) { hideSearch(); return; }
  const hitD = DISHES.filter(d => (d.name + ' ' + (d.tags || []).join('') + ' ' + W(d.windowId).name + ' ' + C(d.canteenId).name).toLowerCase().includes(q));
  const hitW = WINDOWS.filter(w => (w.name + ' ' + (w.tags || []).join('') + ' ' + C(w.canteenId).name).toLowerCase().includes(q));
  const hitC = CANTEENS.filter(c => (c.name + ' ' + (c.campus || '')).toLowerCase().includes(q));
  const total = hitD.length + hitW.length + hitC.length;
  view.innerHTML = total ? `
  ${hitD.length ? `<div class="group-label">🍽️ 菜品 <span class="sec-sub">${hitD.length}</span></div>` + hitD.slice(0, 12).map(dishRowHTML).join('') : ''}
  ${hitW.length ? `<div class="group-label">🏪 窗口 <span class="sec-sub">${hitW.length}</span></div>` + hitW.slice(0, 8).map(windowCardHTML).join('') : ''}
  ${hitC.length ? `<div class="group-label">🏫 食堂 <span class="sec-sub">${hitC.length}</span></div>` + hitC.map(canteenCardHTML).join('') : ''}`
    : emptyHTML('没有找到「' + esc(q) + '」', '换个关键词试试，比如「黄焖鸡」「奶茶」');
}

function openSearch() { searchBar.classList.add('show'); searchInput.focus(); }
function hideSearch() { searchBar.classList.remove('show'); searchInput.value = ''; route(); }

/* ---------- 弹窗 / Toast ---------- */
function showModal(html) { modalRoot.innerHTML = `<div class="modal-backdrop" data-action="close-modal"><div class="sheet">${html}</div></div>`; }
function setModal(html) { const sheet = modalRoot.querySelector('.sheet'); if (sheet) sheet.innerHTML = html; else showModal(html); }
function closeModal() { modalRoot.innerHTML = ''; }
function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast'; el.textContent = msg;
  toastRoot.appendChild(el);
  setTimeout(() => el.classList.add('out'), 1500);
  setTimeout(() => el.remove(), 1950);
}

/* ---------- 写点评 ---------- */
function openReview(id) {
  const d = D(id); if (!d) return;
  state.draft = { dishId: id, stars: 5, tags: [], text: '' };
  showModal(reviewSheetHTML(d));
}
function reviewSheetHTML(d) {
  const df = state.draft;
  return `
  <div class="sheet-head"><div class="sheet-title">✍️ 写点评</div><button class="sheet-close" data-action="close-modal">✕</button></div>
  <div class="sheet-sub">${d.emoji} ${d.name} · ${C(d.canteenId).name} ${W(d.windowId).name}</div>
  <div class="sp-row">${[1, 2, 3, 4, 5].map(n => `<button class="sp-btn ${df.stars >= n ? 'on' : ''}" data-action="set-stars" data-v="${n}">★</button>`).join('')}</div>
  <div class="rtag-row">${REVIEW_TAGS.map(t => `<button class="rtag ${df.tags.includes(t) ? 'on' : ''}" data-action="toggle-rtag" data-v="${t}">${t}</button>`).join('')}</div>
  <div class="form-label">说点什么…</div>
  <textarea class="textarea" id="rvText" placeholder="口味如何？排队久吗？给后来的同学指条明路…">${esc(df.text)}</textarea>
  <div style="margin-top:14px"><button class="btn primary block" data-action="submit-review" style="width:100%">发布点评 (+10贡献值)</button></div>`;
}
function submitReview() {
  const df = state.draft; if (!df) return;
  const textEl = $('#rvText');
  const text = (textEl ? textEl.value : '').trim();
  if (!text) { toast('写两句再发布吧 ✏️'); if (textEl) textEl.focus(); return; }
  state.reviews.push({ id: 'u' + Date.now(), dishId: df.dishId, user: '我', avatar: '🙋', stars: df.stars, time: '刚刚', text: text.slice(0, 300), tags: df.tags.slice(0, 3), likes: 0 });
  save(LS.reviews, state.reviews);
  state.draft = null; closeModal();
  toast('点评发布成功 🎉 贡献值 +10');
  route();
}

/* ---------- 吃什么（决策摇一摇） ---------- */
function openDice() {
  showModal(`
  <div class="sheet-head"><div class="sheet-title">🤖 AI 推荐 · 吃什么？</div><button class="sheet-close" data-action="close-modal">✕</button></div>
  <div class="sheet-sub">基于全校评分热度 + 你的口味偏好实时推荐 · 选择困难终结者</div>
  <div id="decResult"></div>
  <div style="display:flex;gap:8px">
    <button class="btn primary block" data-action="dice">🎲 换一个</button>
    <button class="btn ghost block" data-action="close-modal">就它了</button>
  </div>`);
  rollDice();
}
function prefMatchTags(tags) {
  const map = { '无辣不欢': ['辣'], '微辣': ['辣'], '不吃辣': ['清淡', '甜口'], '甜口': ['甜口'], '清淡': ['清淡'], '减脂': ['减脂友好'], '素食': ['素食友好'], '不吃香菜': ['清淡'], '重口': ['辣', '锅气'] };
  const wanted = new Set(state.prefs.flatMap(p => map[p] || []));
  return [...wanted].some(x => (tags || []).includes(x));
}
function rollDice() {
  let cands = DISHES.filter(d => d.rating >= 4.3 && d.id !== state.lastDice);
  if (state.prefs.length) {
    const pref = cands.filter(d => prefMatchTags(d.tags));
    if (pref.length) cands = pref;
  }
  if (!cands.length) cands = DISHES.filter(d => d.rating >= 4.0 && d.id !== state.lastDice);
  const d = cands[Math.floor(Math.random() * cands.length)] || DISHES[0];
  state.lastDice = d.id;
  const c = C(d.canteenId), w = W(d.windowId);
  const box = $('#decResult');
  if (box) box.innerHTML = `<div class="dec-card" data-action="go-dish" data-id="${d.id}">
    <div class="dec-emoji">${d.emoji}</div>
    <div class="dec-name">${d.name}</div>
    <div class="dec-sub">${c.name} · ${w.name} · ¥${d.price} · ${d.rating.toFixed(1)}分 · 热度${d.hot}</div>
    <div class="dec-cta">点我看点评 →</div>
  </div>`;
}

/* ---------- 路由 ---------- */
function parseRoute() {
  const h = (location.hash || '#/home').replace(/^#\/?/, '');
  const [name, arg] = h.split('/');
  return { name: name || 'home', arg };
}
function route() {
  if (searchBar.classList.contains('show')) { searchBar.classList.remove('show'); searchInput.value = ''; }
  const { name, arg } = parseRoute();
  switch (name) {
    case 'canteens': renderCanteens(); break;
    case 'canteen': renderCanteen(arg); break;
    case 'dish': renderDish(arg); break;
    case 'rankings': renderRankings(); break;
    case 'blacklist': renderBlacklist(); break;
    case 'me': renderMe(); break;
    default: renderHome();
  }
  const tab = { home: 'home', canteens: 'canteens', canteen: 'canteens', rankings: 'rankings', blacklist: 'blacklist', me: 'me' }[name] || 'home';
  document.querySelectorAll('.tabbar a').forEach(a => a.classList.toggle('on', a.dataset.tab === tab));
  $('#campusLabel').textContent = `${CAMPUS.name}${(CAMPUS.campuses && CAMPUS.campuses.length > 1) ? ' · 双校区' : ''} · ${openCount()}个食堂营业中`;
  window.scrollTo(0, 0);
}

/* ---------- 交互分发 ---------- */
function toggleList(list, key, id, onMsg, offMsg) {
  const i = list.indexOf(id);
  if (i < 0) { list.push(id); toast(onMsg); } else { list.splice(i, 1); toast(offMsg); }
  save(key, list); route();
}

function handleAction(action, el) {
  const id = el.dataset.id, v = el.dataset.v;
  switch (action) {
    case 'go-dish': closeModal(); location.hash = '#/dish/' + id; break;
    case 'back': if (history.length > 1) history.back(); else location.hash = '#/home'; break;
    case 'mark-avoid': toggleList(state.avoid, LS.avoid, id, '已加入避雷清单 🚫', '已取消避雷标记'); break;
    case 'mark-rec': toggleList(state.rec, LS.rec, id, '安利成功 ❤️', '已取消安利'); break;
    case 'write-review': openReview(id); break;
    case 'like-review': {
      const i = state.likes.indexOf(id);
      if (i < 0) state.likes.push(id); else state.likes.splice(i, 1);
      save(LS.likes, state.likes); route(); break;
    }
    case 'delete-review':
      state.reviews = state.reviews.filter(r => r.id !== id);
      save(LS.reviews, state.reviews); toast('点评已删除'); route(); break;
    case 'close-modal': closeModal(); break;
    case 'set-stars':
      if (state.draft) { state.draft.stars = +v; setModal(reviewSheetHTML(D(state.draft.dishId))); } break;
    case 'toggle-rtag':
      if (state.draft) {
        const i = state.draft.tags.indexOf(v);
        if (i < 0) state.draft.tags.push(v); else state.draft.tags.splice(i, 1);
        setModal(reviewSheetHTML(D(state.draft.dishId)));
      } break;
    case 'submit-review': submitReview(); break;
    case 'dice-open': openDice(); break;
    case 'dice': rollDice(); break;
    case 'pick-pref': {
      const i = state.prefs.indexOf(v);
      if (i < 0) state.prefs.push(v); else state.prefs.splice(i, 1);
      save(LS.prefs, state.prefs); route(); break;
    }
    case 'ctab': state.cTab = v; route(); break;
    case 'canteen-filter': state.cFilter = v; route(); break;
    case 'campus-filter': state.cCampus = v; route(); break;
    case 'rtab': state.rTab = v; route(); break;
    case 'scroll-to': { const t = document.getElementById(v); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); break; }
    case 'open-search': openSearch(); break;
    case 'cancel-search': hideSearch(); break;
  }
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (el) handleAction(el.dataset.action, el);
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (modalRoot.innerHTML) closeModal();
  else hideSearch();
});

/* ---------- 启动 ---------- */
function boot() {
  if (!location.hash) location.hash = '#/home';
  window.addEventListener('hashchange', route);
  $('#searchTopBtn').addEventListener('click', openSearch);
  $('#searchCancel').addEventListener('click', hideSearch);
  searchInput.addEventListener('input', () => { if (searchBar.classList.contains('show')) renderSearch(searchInput.value); });
  route();
}
boot();
