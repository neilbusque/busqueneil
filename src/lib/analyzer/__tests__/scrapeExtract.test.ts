import { describe, it, expect } from 'vitest'
import { extractPage } from '../scrapeExtract'

const RICH = `<!doctype html><html><head>
<title>Fix Your Roof Fast</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="NJ roofing">
</head><body>
<nav><a href="/a">Home</a><a href="/b">About</a></nav>
<h1>Stop Roof Leaks in 48 Hours</h1>
<img src="hero.jpg">
<a class="btn" href="/quote">Book my free inspection</a>
<p>Trusted by 300 homeowners. 5-star reviews.</p>
<p>100% money-back guarantee. Limited spots this week.</p>
<form><input type="email" name="e"><button>Get my quote</button></form>
<script src="a.js"></script><script>var x=1</script>
</body></html>`

const THIN = `<!doctype html><html><head><title>App</title></head>
<body><div id="root"></div><script src="bundle.js"></script></body></html>`

describe('extractSignals', () => {
  const s = extractPage(RICH).signals
  it('detects viewport meta', () => expect(s.hasViewportMeta).toBe(true))
  it('counts forms and email input', () => {
    expect(s.formCount).toBe(1)
    expect(s.emailOrTelInput).toBe(true)
  })
  it('captures CTA texts matching the action pattern', () => {
    expect(s.ctaTexts.some(t => /book my free inspection/i.test(t))).toBe(true)
    expect(s.ctaTexts.some(t => /get my quote/i.test(t))).toBe(true)
  })
  it('flags CTA above the fold', () => expect(s.ctaAboveFold).toBe(true))
  it('counts h1, images, scripts, nav links', () => {
    expect(s.h1Count).toBe(1)
    expect(s.imageCount).toBe(1)
    expect(s.scriptCount).toBe(2)
    expect(s.navLinkCount).toBe(2)
  })
  it('detects hero media before first CTA', () => expect(s.hasHeroMedia).toBe(true))
  it('flags social proof, guarantee, urgency', () => {
    expect(s.hasSocialProof).toBe(true)
    expect(s.hasGuarantee).toBe(true)
    expect(s.hasUrgency).toBe(true)
  })
  it('thin page has no viewport, no forms, no proof', () => {
    const t = extractPage(THIN).signals
    expect(t.hasViewportMeta).toBe(false)
    expect(t.formCount).toBe(0)
    expect(t.hasSocialProof).toBe(false)
  })
})
