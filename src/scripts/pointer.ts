/* Pointer effect — a soft sun-yellow spotlight that trails the cursor, plus a ring that
   snaps onto interactive elements.

   Why this is hand-rolled instead of canvas-ui (canvasui.dev): every cursor-lens component
   there (glass, magnify, frost) is built on the HTML-in-Canvas API — `ctx.drawElementImage()`
   and `canvas.requestPaint()`. Both are still behind an experimental flag; Chrome 150 stable
   reports them undefined. They also require wrapping the whole page in a
   `<canvas layoutsubtree>`, which would put the real DOM inside a canvas. For a site whose
   job is ranking and converting, that is a large accessibility and SEO risk in exchange for
   an effect essentially nobody would see.

   This does the same job with a compositor-only transform: no layout, no paint of page
   content, no DOM restructure, and it degrades to nothing where it should. */

const FINE = '(pointer: fine)';
const REDUCED = '(prefers-reduced-motion: reduce)';

export function initPointer(): void {
  // Touch and stylus users have no hover state to decorate, and a trailing glow on a
  // reduced-motion setting is exactly the kind of thing that setting exists to stop.
  if (!window.matchMedia(FINE).matches || window.matchMedia(REDUCED).matches) return;
  if (document.querySelector('[data-pointer-fx]')) return;

  const glow = document.createElement('div');
  glow.className = 'ptr-glow';
  glow.setAttribute('data-pointer-fx', '');
  glow.setAttribute('aria-hidden', 'true');

  const ring = document.createElement('div');
  ring.className = 'ptr-ring';
  ring.setAttribute('aria-hidden', 'true');

  document.body.append(glow, ring);

  let tx = window.innerWidth / 2;
  let ty = window.innerHeight / 2;
  let gx = tx, gy = ty, rx = tx, ry = ty;
  let raf = 0;
  let visible = false;

  const INTERACTIVE = 'a, button, summary, input, textarea, select, [role="button"]';

  function onMove(e: PointerEvent) {
    tx = e.clientX;
    ty = e.clientY;
    if (!visible) {
      visible = true;
      glow.classList.add('on');
      ring.classList.add('on');
    }
    // Snap the ring to whatever interactive element is under the cursor. elementFromPoint
    // rather than :hover so it also works for elements that arrive under a still cursor.
    const hit = (e.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
    ring.classList.toggle('over', Boolean(hit));
  }

  function onLeave() {
    visible = false;
    glow.classList.remove('on');
    ring.classList.remove('on');
  }

  function frame() {
    // Two different follow rates: the glow lags for weight, the ring is nearly immediate so
    // it still reads as a cursor rather than a delayed blob.
    gx += (tx - gx) * 0.12;
    gy += (ty - gy) * 0.12;
    rx += (tx - rx) * 0.35;
    ry += (ty - ry) * 0.35;
    glow.style.transform = `translate3d(${gx}px, ${gy}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    raf = requestAnimationFrame(frame);
  }

  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeave);
  window.addEventListener('blur', onLeave);
  raf = requestAnimationFrame(frame);

  // Astro's ClientRouter swaps <body>; without this the nodes are orphaned and the rAF
  // keeps running against detached elements on every navigation.
  document.addEventListener('astro:before-swap', () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('blur', onLeave);
    glow.remove();
    ring.remove();
  }, { once: true });
}
