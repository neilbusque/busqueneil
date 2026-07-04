import { describe, it, expect } from 'vitest';
import { validateReport, gradeForScore } from '../report';

describe('validateReport', () => {
  it('clamps score, mirrors grade, keeps usable findings', () => {
    const r = validateReport({
      overallScore: 120, grade: 'F', verdict: 'v',
      sections: [{ title: 'Hook & headline', score: 40, findingIds: ['f1'] }],
      findings: [{ id: 'f1', severity: 'critical', section: 'Hook & headline', issue: 'i', why: 'w', fix: 'do x' }],
      quickWins: ['f1'],
    });
    expect(r.overallScore).toBe(100);
    expect(r.grade).toBe('A');
    expect(r.findings).toHaveLength(1);
  });
  it('throws when findings are empty', () => {
    expect(() => validateReport({ overallScore: 50, verdict: 'v', sections: [], findings: [] })).toThrow();
  });
  it('gradeForScore boundaries', () => {
    expect(gradeForScore(90)).toBe('A');
    expect(gradeForScore(49)).toBe('F');
  });
});
