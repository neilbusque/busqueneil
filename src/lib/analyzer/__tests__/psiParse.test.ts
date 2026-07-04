import { describe, it, expect } from 'vitest'
import { parsePsi } from '../psiParse'

const PSI_OK = {
  lighthouseResult: {
    categories: { performance: { score: 0.42 } },
    audits: {
      'largest-contentful-paint': { numericValue: 3200 },
      'cumulative-layout-shift': { numericValue: 0.08 },
      'total-blocking-time': { numericValue: 210 },
      'viewport': { score: 1 },
      'tap-targets': { score: 0 },
      'font-size': { score: 1 },
      'content-width': { score: 1 },
    },
  },
}

describe('parsePsi', () => {
  it('parses a valid PSI v5 result', () => {
    const r = parsePsi(PSI_OK)!
    expect(r.source).toBe('psi')
    expect(r.performance).toBe(42)
    expect(r.lcp).toBeCloseTo(3.2, 1)
    expect(r.cls).toBeCloseTo(0.08, 2)
    expect(r.inp).toBe(210)
    expect(r.audits.viewport).toBe(true)
    expect(r.audits.tapTargets).toBe(false)
  })
  it('returns null on malformed input', () => {
    expect(parsePsi({})).toBeNull()
    expect(parsePsi(null)).toBeNull()
    expect(parsePsi({ lighthouseResult: {} })).toBeNull()
  })
})
