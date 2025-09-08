// Логируем wheel/scroll + bounding rect изменений
const el = document.querySelector('.hero__img') || document.querySelector('.hero');
let last;

window.addEventListener('wheel', (e) => {
  console.log('wheel', e.deltaX, e.deltaY, 'mode', e.deltaMode);
}, {passive: true});

if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => console.log('visualViewport resize', window.visualViewport.width));
  window.visualViewport.addEventListener('scroll', () => console.log('visualViewport scroll', window.visualViewport.offsetTop, window.visualViewport.offsetLeft));
}

window.addEventListener('scroll', () => {
  window.requestAnimationFrame(() => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const key = `${r.left}|${r.top}|${r.width}|${r.height}`;
    if (key !== last) {
      console.log('rect changed', { left: r.left, top: r.top, width: r.width, height: r.height });
      last = key;
    }
  });
}, {passive: true});
