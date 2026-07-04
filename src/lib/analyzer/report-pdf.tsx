/** @jsxImportSource react */
import { Document, Page, Text, View, StyleSheet, Link, renderToBuffer } from '@react-pdf/renderer';
import type { AnalysisReport } from './report';
import type { PageAudit } from './audit';
import { mobileScore } from './audit';

export interface ReportPdfData {
  url: string; score: number; grade: string; audit: PageAudit; report: AnalysisReport;
}

const INK = '#0b0b12', VIOLET = '#7c3aed', MAGENTA = '#db2777', MUTE = '#6b7280', LINE = '#e5e7eb';
const s = StyleSheet.create({
  page: { padding: 44, fontSize: 10, color: INK, fontFamily: 'Helvetica', lineHeight: 1.5 },
  h1: { fontSize: 24, fontFamily: 'Helvetica-Bold' },
  h2: { fontSize: 13, fontFamily: 'Helvetica-Bold', marginTop: 18, marginBottom: 6, color: VIOLET },
  muted: { color: MUTE },
  scoreBig: { fontSize: 60, fontFamily: 'Helvetica-Bold', color: VIOLET },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottom: `1 solid ${LINE}`, paddingVertical: 4 },
  finding: { marginBottom: 10, paddingBottom: 8, borderBottom: `1 solid ${LINE}` },
  sevCrit: { color: MAGENTA, fontFamily: 'Helvetica-Bold' },
  cta: { marginTop: 10, padding: 10, backgroundColor: VIOLET, color: '#fff', borderRadius: 6, textAlign: 'center' },
});

function ReportDoc({ url, score, grade, audit, report }: ReportPdfData) {
  const conv = audit.conversion;
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.muted}>Landing Page Report</Text>
        <Text style={s.h1}>{url}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 12 }}>
          <Text style={s.scoreBig}>{score}</Text>
          <Text style={{ fontSize: 18, marginLeft: 6, marginBottom: 10 }}>/100  ·  Grade {grade}</Text>
        </View>

        <Text style={s.h2}>The four numbers</Text>
        <View style={s.metricRow}><Text>Page speed (Lighthouse mobile)</Text><Text>{audit.speed.score}/100</Text></View>
        <View style={s.metricRow}><Text>Mobile friendliness</Text><Text>{mobileScore(audit)}/100</Text></View>
        <View style={s.metricRow}><Text>Conversion elements present</Text><Text>{conv.presentCount}/{conv.totalCount}</Text></View>
        <View style={{ marginTop: 6 }}>
          {conv.items.map(i => (
            <Text key={i.key} style={s.muted}>{i.present ? '[x] ' : '[ ] '}{i.label}{i.detail ? ` (${i.detail})` : ''}</Text>
          ))}
        </View>

        <Text style={s.h2}>The verdict</Text>
        <Text>{report.verdict}</Text>

        <Text style={s.h2}>Quick wins</Text>
        {report.quickWins.length
          ? report.findings.filter(f => report.quickWins.includes(f.id)).map(f => <Text key={f.id}>• {f.issue}</Text>)
          : <Text style={s.muted}>See the findings below.</Text>}
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.h2}>What to fix, in order</Text>
        {report.findings.map((f, n) => (
          <View key={f.id} style={s.finding}>
            <Text><Text style={f.severity === 'critical' ? s.sevCrit : undefined}>{n + 1}. [{f.severity}] {f.section}</Text></Text>
            <Text>Issue: {f.issue}</Text>
            <Text style={s.muted}>Why: {f.why}</Text>
            <Text>Fix: {f.fix}</Text>
          </View>
        ))}
        {report.benchmarks?.length ? (
          <>
            <Text style={s.h2}>How you compare</Text>
            {report.benchmarks.map((b, i) => (
              <View key={i} style={s.metricRow}><Text>{b.metric}</Text><Text>{b.yours} vs {b.benchmark} ({b.source})</Text></View>
            ))}
          </>
        ) : null}
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.h2}>Who put this together</Text>
        <Text style={s.h1}>Neil Busque</Text>
        <Text style={{ marginTop: 8 }}>
          I am a builder and marketer who ships. I take ideas from a blank file to a live product, usually solo, often in days.
          My path went from design to web to funnels and CRM to automation, and now I build with AI every day.
        </Text>
        <Text style={s.h2}>How I can help with this page</Text>
        <Text>I fix the exact issues in this report: sharper hook and offer, a single clear call to action, proof that builds trust, a faster mobile page, and the follow-up behind it so leads do not slip. I also build the CRM, automations, and AI systems around it.</Text>
        <Link src="https://api.whatsapp.com/send/?phone=9083164140" style={s.cta}>Message me on WhatsApp</Link>
        <Text style={{ marginTop: 12 }} >More at busqueneil.com  ·  linkedin.com/in/neilbusque  ·  busqueneil@gmail.com</Text>
      </Page>
    </Document>
  );
}

export async function renderReportPdf(data: ReportPdfData): Promise<Buffer> {
  return await renderToBuffer(<ReportDoc {...data} />);
}
