/**
 * HeroCanvas — lightweight WebGL shader backdrop for the homepage hero.
 * A single full-screen fragment shader: domain-warped value-noise mesh in
 * indigo→violet over near-black, with a soft cursor-reactive central glow.
 *
 * No textures, no models — renders on first paint (no loading screen).
 * Falls back silently (CSS gradient behind shows) if WebGL is unavailable,
 * and renders one static frame under prefers-reduced-motion.
 */
import { useEffect, useRef } from 'preact/hooks';

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

// --- value noise + fbm -------------------------------------------------
float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++){
    v += amp * noise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y;

  float t = u_time * 0.04;

  // domain warp for a flowing, organic mesh
  vec2 q = vec2(fbm(p * 1.6 + vec2(0.0, t)), fbm(p * 1.6 + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p * 1.6 + q * 1.4 + vec2(1.7, 9.2) + t * 0.7),
                fbm(p * 1.6 + q * 1.4 + vec2(8.3, 2.8) - t * 0.6));
  float f = fbm(p * 1.6 + r * 1.2);

  // palette: near-black -> indigo -> violet
  vec3 base   = vec3(0.030, 0.031, 0.050);
  vec3 indigo = vec3(0.231, 0.231, 0.760);
  vec3 violet = vec3(0.420, 0.255, 0.780);

  vec3 col = base;
  col = mix(col, indigo, smoothstep(0.20, 0.95, f));
  col = mix(col, violet, smoothstep(0.45, 1.05, f) * 0.85);

  // cursor-reactive central glow
  vec2 m = (u_mouse - 0.5);
  vec2 gc = vec2(0.06, 0.10) + m * 0.18;        // glow follows cursor slightly
  float d = length((uv - 0.5) - gc);
  float glow = smoothstep(0.62, 0.0, d);
  col += violet * glow * 0.32;
  col += indigo * smoothstep(0.9, 0.0, d) * 0.06;

  // vignette so foreground text stays readable
  float vig = smoothstep(1.15, 0.25, length(uv - 0.5));
  col *= mix(0.55, 1.0, vig);

  // subtle film grain to kill banding
  float g = (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.025;
  col += g;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl =
      (canvas.getContext('webgl', { antialias: false, alpha: false }) as WebGLRenderingContext) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext);
    if (!gl) return; // CSS gradient fallback stays visible

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.5 };
    function onMove(e: PointerEvent) {
      target.x = e.clientX / window.innerWidth;
      target.y = 1 - e.clientY / window.innerHeight;
    }
    window.addEventListener('pointermove', onMove, { passive: true });

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();
    let raf = 0;
    let running = true;

    function frame(now: number) {
      if (!running) return;
      mouse.x += (target.x - mouse.x) * 0.05;
      mouse.y += (target.y - mouse.y) * 0.05;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(frame);
    }
    // first paint immediately, then loop (or stop if reduced-motion)
    frame(start);
    if (!reduce) raf = requestAnimationFrame(frame);

    function onVis() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduce) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    }
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} class="hero-canvas" aria-hidden="true" />;
}
