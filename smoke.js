/* 冒烟测试：无浏览器环境下验证数据完整性 + 全部视图渲染可执行 */
'use strict';
const fs = require('fs');
const path = require('path');
const dir = __dirname;

/* --- 最小 DOM 桩 --- */
const stubEl = () => ({
  innerHTML: '', textContent: '', dataset: {},
  classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
  addEventListener() {}, appendChild() {}, remove() {},
  querySelector() { return stubEl(); }, querySelectorAll() { return []; },
});
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
global.location = { hash: '#/home' };
global.window = { addEventListener() {}, scrollTo() {} };
global.history = { back() {}, length: 1 };
global.document = {
  querySelector: stubEl, querySelectorAll: () => [],
  getElementById: stubEl, createElement: stubEl, addEventListener() {},
};

const data = fs.readFileSync(path.join(dir, 'js/data.js'), 'utf8');
const app = fs.readFileSync(path.join(dir, 'js/app.js'), 'utf8');

const testCode = `
const errors = [];
const cIds = new Set(CANTEENS.map(c => c.id));
WINDOWS.forEach(w => { if (!cIds.has(w.canteenId)) errors.push('窗口 ' + w.id + ' 食堂引用错误'); });
DISHES.forEach(d => {
  const w = WINDOWS.find(x => x.id === d.windowId);
  if (!w) errors.push('菜品 ' + d.id + ' 窗口引用错误: ' + d.windowId);
  else if (w.canteenId !== d.canteenId) errors.push('菜品 ' + d.id + ' 食堂/窗口不匹配');
  if (!d.m || d.m.t == null || d.m.p == null || d.m.v == null || d.m.s == null) errors.push('菜品 ' + d.id + ' 缺少四维评分');
});
const dIds = new Set(DISHES.map(d => d.id));
SEED_REVIEWS.forEach(r => { if (!dIds.has(r.dishId)) errors.push('评价引用了不存在的菜品: ' + r.dishId); });

const renderers = {
  home: () => renderHome(),
  canteens: () => renderCanteens(),
  canteen: () => CANTEENS.forEach(c => { state.cTab='dishes'; renderCanteen(c.id); state.cTab='windows'; renderCanteen(c.id); state.cTab='reviews'; renderCanteen(c.id); }),
  dish: () => DISHES.forEach(d => renderDish(d.id)),
  blacklist: () => renderBlacklist(),
  me: () => renderMe(),
  search: () => renderSearch('鸡'),
  dice: () => { openDice(); rollDice(); rollDice(); },
  reviewSheet: () => { openReview('d15'); setModal(reviewSheetHTML(D('d15'))); },
};
for (const name of Object.keys(renderers)) {
  try { renderers[name](); console.log('ok render: ' + name); }
  catch (e) { errors.push('渲染 ' + name + ' 失败: ' + (e && e.message)); }
}
if (errors.length) { console.error('FAIL'); errors.forEach(e => console.error(' - ' + e)); process.exit(1); }
console.log('SMOKE PASS · 食堂 ' + CANTEENS.length + ' · 窗口 ' + WINDOWS.length + ' · 菜品 ' + DISHES.length + ' · 评价 ' + SEED_REVIEWS.length);
`;

eval(data + '\n' + app + '\n' + testCode);
