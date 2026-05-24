/* ═══════════════════════════════════════════════════════════
   CYORA Family Platform — Shared JS Utilities
   引入方式: <script src="../shared/main.js"></script>
   ═══════════════════════════════════════════════════════════

   包含：
   - parallaxSection()   — 區塊背景視差
   - isMobile()          — 判斷手機寬度
   - openSheet()         — 開啟手機 bottom sheet
   - closeSheet()        — 關閉 bottom sheet
   - initDots()          — 初始化白點互動（桌面 hover / 手機 click）
   - initAccordion()     — 初始化手風琴產品列
   - initSwitcher()      — 初始化左右切換模組

   各頁面自行組合所需函數，在頁面底部 <script> 呼叫。
   ═══════════════════════════════════════════════════════════ */

/* ── 工具 ── */
const isMobile = () => window.innerWidth < 900;

/* ── 視差 ──────────────────────────────────────────────────
   用法：
     parallaxSection('myBgId', '.my-section');
   說明：
     bgId         → 背景 div 的 id
     sectionSel   → 所在 section 的 CSS selector
   建議在 scroll 事件中呼叫。
   ──────────────────────────────────────────────────────── */
function parallaxSection(bgId, sectionSel) {
  const bg = document.getElementById(bgId);
  if (!bg) return;
  const section = bg.closest(sectionSel) || bg.parentElement;
  const rect = section.getBoundingClientRect();
  if (rect.bottom > 0 && rect.top < window.innerHeight) {
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    bg.style.transform = `translateY(${(progress - 0.5) * 800}px)`;
  }
}

/* ── 手機 Bottom Sheet ─────────────────────────────────────
   用法：
     openSheet({ tag:'標籤', name:'產品名', spec:'規格', price:'NT$xxx' });
     closeSheet(event);  // event 可選，點遮罩關閉
   ──────────────────────────────────────────────────────── */
function openSheet(d) {
  document.getElementById('sTag').textContent   = d.tag;
  document.getElementById('sName').textContent  = d.name;
  document.getElementById('sSpec').textContent  = d.spec;
  document.getElementById('sPrice').textContent = d.price;
  document.getElementById('sheetOverlay').classList.add('open');
}
function closeSheet(e) {
  if (!e || e.target === document.getElementById('sheetOverlay'))
    document.getElementById('sheetOverlay').classList.remove('open');
}

/* ── 白點互動 ──────────────────────────────────────────────
   用法：
     initDots({
       mod: 'a',                          // data-mod 值
       mobileData: { key: { tag, name, spec, price } },
       onActivate: (key) => { ... },      // 桌面顯示 panel 的邏輯
     });
   ──────────────────────────────────────────────────────── */
function initDots({ mod, mobileData, onActivate }) {
  document.querySelectorAll(`.dot[data-mod="${mod}"]`).forEach(dot => {
    dot.addEventListener('mouseenter', () => {
      if (!isMobile()) onActivate(dot.dataset.key);
    });
    dot.addEventListener('click', () => {
      if (isMobile()) openSheet(mobileData[dot.dataset.key]);
    });
  });
}

/* ── 手風琴產品列 ──────────────────────────────────────────
   用法：
     const { toggleD } = initAccordion('.d-item');
     // HTML onclick="toggleD(0)" 即可
   ──────────────────────────────────────────────────────── */
function initAccordion(selector) {
  let openIdx = -1;
  function toggleD(idx) {
    const items = document.querySelectorAll(selector);
    if (openIdx === idx) {
      items[idx].classList.remove('open');
      openIdx = -1;
    } else {
      if (openIdx >= 0) items[openIdx].classList.remove('open');
      items[idx].classList.add('open');
      openIdx = idx;
    }
  }
  window.toggleD = toggleD; // 掛到 global 供 onclick 使用
  return { toggleD };
}

/* ── 左右切換模組 ──────────────────────────────────────────
   用法：
     initSwitcher({
       imgId: 'swImgPh',
       activeClass: 'cream-bg',       // 第二張圖的 CSS class
       dotSel: '.sw-dot',
       panelSel: '.sw-panel',
       count: 2,
     });
   ──────────────────────────────────────────────────────── */
function initSwitcher({ imgId, activeClass, dotSel, panelSel, count }) {
  let swIdx = 0;
  function updateSw() {
    const ph = document.getElementById(imgId);
    ph.className = 'sw-img-ph' + (swIdx === count - 1 ? ` ${activeClass}` : '');
    document.querySelectorAll(dotSel).forEach((d, i) => d.classList.toggle('active', i === swIdx));
    document.querySelectorAll(panelSel).forEach((p, i) => p.classList.toggle('active', i === swIdx));
  }
  window.switchTo = (idx, e) => { if (e) e.stopPropagation(); swIdx = idx; updateSw(); };
  window.nextSw   = ()       => { swIdx = (swIdx + 1) % count; updateSw(); };
  return { updateSw };
}
