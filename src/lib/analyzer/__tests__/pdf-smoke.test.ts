import { describe, it, expect } from 'vitest';
import { renderReportPdf, type ReportPdfData } from '../report-pdf';
import type { PageAudit } from '../audit';
import type { AnalysisReport } from '../report';

const audit: PageAudit = {
  speed: { source: 'heuristic', score: 70 },
  mobile: { hasViewportMeta: true, responsivePass: true, notes: [] },
  conversion: {
    items: [{ key: 'primaryCta', label: 'Primary CTA', present: true, detail: 'e.g. "Book a call"' }],
    presentCount: 1,
    totalCount: 1,
  },
};

const report: AnalysisReport = {
  overallScore: 62,
  grade: 'C',
  verdict: 'Solid start, but the page loses visitors before they act.',
  sections: [],
  findings: [
    {
      id: 'f1',
      severity: 'major',
      section: 'Hero',
      issue: 'The headline does not state a benefit.',
      why: 'Visitors decide to stay or leave within seconds of reading the hero.',
      fix: 'Rewrite the headline to lead with the outcome the visitor gets.',
    },
  ],
  quickWins: [],
};

const data: ReportPdfData = { url: 'https://example.com', score: 62, grade: 'C', audit, report };

describe('renderReportPdf', () => {
  it('renders a real PDF buffer', async () => {
    const buf = await renderReportPdf(data);
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf.length).toBeGreaterThan(1000);
    expect(buf.subarray(0, 5).toString('utf8')).toBe('%PDF-');
  });
});
