/* Pointer effect — yellow pixels that appear only while the cursor is moving.

   No shape follows the cursor. Nothing renders at rest. Moving the pointer emits small yellow
   pixels along the path, which fade out and vanish. Stop moving and the trail simply drains.

   Why hand-rolled instead of canvas-ui (canvasui.dev): every cursor component there
   (glass, magnify, frost) is built on the HTML-in-Canvas API — ctx.drawElementImage() and
   canvas.requestPaint(). Both are still flag-gated; Chrome 150 stable reports them undefined.
   They also need the page wrapped in <canvas layoutsubtree>, which is a large accessibility
   and SEO risk for an effect almost nobody could see.

   ⚠️ Mount inside .v8, never <body>. v8.css scopes every rule under `.v8`, which is a div
   INSIDE body, so appending to body leaves these nodes unstyled — static divs in normal flow
   that extend the page sideways. That bug shipped once already. */

const FINE = '(pointer: fine)';
const REDUCED = '(prefers-reduced-motion: reduce)';

/** Reusable pixel pool. Big enough for fast movement, small enough to stay subtle. */
const POOL = 26;
/** Minimum px travelled before another pixel is emitted, so slow drags do not carpet. */
const STEP = 22;
/** How long a pixel lives, in ms. */
const LIFE = 620;

export function initPointer(): void {
  if (!window.matchMedia(FINE).matches || window.matchMedia(REDUCED).matches) return;
  if (document.querySelector('[data-pointer-fx]')) return;

  const host = document.querySelector('.v8.shell') ?? document.querySelector('.v8');
  if (!host) return;

  const layer = document.createElement('div');
  layer.className = 'ptr-px';
  layer.setAttribute('data-pointer-fx', '');
  layer.setAttribute('aria-hidden', 'true');

  const pool: HTMLElement[] = [];
  for (let i = 0; i < POOL; i++) {
    const b = document.createElement('i');
    layer.appendChild(b);
    pool.push(b);
  }
  host.appendChild(layer);

  let next = 0;
  let lastX: number | null = null;
  let lastY: number | null = null;

  function emit(x: number, y: number) {
    const el = pool[next];
    next = (next + 1) % POOL;

    // 2-4px, whole pixels, with a little scatter so the trail is not a ruled line
    const size = 2 + ((next * 7) % 3);
    const jx = ((next * 13) % 9) - 4;
    const jy = ((next * 17) % 9) - 4;

    el.style.width = el.style.height = `${size}px`;
    el.style.transform = `translate3d(${Math.round(x + jx)}px, ${Math.round(y + jy)}px, 0)`;

    // restart the fade even if this element is mid-animation
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = `ptr-fade ${LIFE}ms linear forwards`;
  }

  function onMove(e: PointerEvent) {
    const x = e.clientX;
    const y = e.clientY;
    if (lastX === null || lastY === null) { lastX = x; lastY = y; return; }
    const dx = x - lastX;
    const dy = y - lastY;
    if (dx * dx + dy * dy < STEP * STEP) return;
    lastX = x; lastY = y;
    emit(x, y);
  }

  addEventListener('pointermove', onMove, { passive: true });

  document.addEventListener('astro:before-swap', () => {
    removeEventListener('pointermove', onMove);
    layer.remove();
  }, { once: true });
}
