const env = (k: string) => process.env[k] ?? (import.meta as any).env?.[k];

export async function sendReportEmail(opts: { to: string; url: string; score: number; pdf: Buffer }): Promise<boolean> {
  const key = env('RESEND_API_KEY');
  if (!key) return false;
  const from = env('ANALYZER_FROM') || 'Neil Busque <neil@busqueneil.com>';
  const html = [
    `<p>Here is your full landing page report for <b>${opts.url}</b>.</p>`,
    `<p>You scored <b>${opts.score}/100</b>. The attached PDF breaks down every fix, with the actual copy to use.</p>`,
    `<p>If you want, just reply here and tell me what the page is for. I read every one.</p>`,
    `<p>Neil</p>`,
  ].join('');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from, to: opts.to, reply_to: 'busqueneil@gmail.com',
      subject: `Your landing page report: ${opts.score}/100`,
      html,
      attachments: [{ filename: 'landing-page-report.pdf', content: opts.pdf.toString('base64') }],
    }),
  });
  return res.ok;
}
