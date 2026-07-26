/* Pointer effect — a pixel comet.

   A short tail of small yellow squares that trail the cursor, each one lagging a little more
   than the one ahead of it and fading as it goes. No ring, no circle, no cursor replacement:
   the real cursor stays exactly where it is and this sits behind it.

   Why hand-rolled instead of canvas-ui (canvasui.dev): every cursor component there
   (glass, magnify, frost) is built on the HTML-in-Canvas API — ctx.drawElementImage() and
   canvas.requestPaint(). Both are still flag-gated; Chrome 150 stable reports them undefined.
   They also need the page wrapped in <canvas layoutsubtree>, which is a large accessibility
   and SEO risk for an effect almost nobody could see.

   ⚠️ Mount inside .v8, never <body>. v8.css scopes every rule under `.v8`, which is a div
   INSIDE body, so appending to body leaves these nodes completely unstyled — static divs in
   normal flow that extend the page sideways. */

const FINE = '(pointer: fine)';
const REDUCED = '(prefers-reduced-motion: reduce)';

/** Tail length. Enough to read as a comet, short enough to stay subtle. */
const N = 14;

export function initPointer(): void {
  if (!window.matchMedia(FINE).matches || window.matchMedia(REDUCED).matches) return;
  if (document.querySelector('[data-pointer-fx]')) return;

  const host = document.querySelector('.v8.shell') ?? document.querySelector('.v8');
  if (!host) return;

  const wrap = document.createElement('div');
  wrap.className = 'ptr-comet';
  wrap.setAttribute('data-pointer-fx', '');
  wrap.setAttribute('aria-hidden', 'true');

  const bits: HTMLElement[] = [];
  for (let i = 0; i < N; i++) {
    const b = document.createElement('i');
    const t = i / (N - 1);
    // head is biggest and most opaque; the tail thins out to a faint 3px speck
    b.style.width = b.style.height = `${Math.round(9 - t * 6)}px`;
    b.style.opacity = `${(1 - t) * 0.5 + 0.06}`;
    wrap.appendChild(b);
    bits.push(b);
  }
  host.appendChild(wrap);

  let tx = innerWidth / 2, ty = innerHeight / 2;
  const xs = new Array(N).fill(tx);
  const ys = new Array(N).fill(ty);
  let raf = 0, on = false;

  function onMove(e: PointerEvent) {
    tx = e.clientX; ty = e.clientY;
    if (!on) { on = true; wrap.classList.add('on'); }
  }
  function onLeave() { on = false; wrap.classList.remove('on'); }

  function frame() {
    // each square chases the one in front of it, which is what makes the tail curve
    xs[0] += (tx - xs[0]) * 0.34;
    ys[0] += (ty - ys[0]) * 0.34;
    for (let i = 1; i < N; i++) {
      xs[i] += (xs[i - 1] - xs[i]) * 0.34;
      ys[i] += (ys[i - 1] - ys[i]) * 0.34;
    }
    for (let i = 0; i < N; i++) {
      // round to whole pixels so the squares land on the pixel grid and read as pixel art
      bits[i].style.transform = `translate3d(${Math.round(xs[i])}px, ${Math.round(ys[i])}px, 0) translate(-50%, -50%)`;
    }
    raf = requestAnimationFrame(frame);
  }

  addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeave);
  addEventListener('blur', onLeave);
  raf = requestAnimationFrame(frame);

  document.addEventListener('astro:before-swap', () => {
    cancelAnimationFrame(raf);
    removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerleave', onLeave);
    removeEventListener('blur', onLeave);
    wrap.remove();
  }, { once: true });
}
