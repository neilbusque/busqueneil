-- Seed: the May 2026 /now entry from the v1 static site (its only entry).
-- body_html rendered to match the markdown pipeline's output shape.

insert into public.posts (type, slug, title, body_md, body_html, excerpt, status, published_at)
values (
  'now',
  'now-2026-05',
  'May 2026.',
  E'**Where I am.** Back in New Jersey after a stretch in Korea. Just wrapped a six-month run at a digital marketing agency. Re-settling into Elizabeth. Reading more, scrolling less. Drinking too much coffee.\n\n**What I''m building.** NeilOS, my personal AI command system. I built it while running the agency''s operations. Now it''s the workbench I run almost everything from. 20+ n8n workflows shipped this year. 8 MCP servers. A daily journal. A stack of skills. Slowly turning into the most interesting thing I''ve ever built.\n\n**What I''m thinking about.** The gap between "agency that ships campaigns" and "operations layer that ships infrastructure." Most agencies sell the first; the second is where the durable value is. Also: what an operator''s job looks like when AI does the rote work and the human owns the judgment.\n\n**What''s next.** Looking for my next full-time operator role. Somewhere big ideas need to become shipped systems. Open to project work in the meantime. If that sounds like a fit, I''d love to hear about it: busqueneil@gmail.com.',
  E'<p><strong>Where I am.</strong> Back in New Jersey after a stretch in Korea. Just wrapped a six-month run at a digital marketing agency. Re-settling into Elizabeth. Reading more, scrolling less. Drinking too much coffee.</p>\n<p><strong>What I''m building.</strong> NeilOS, my personal AI command system. I built it while running the agency''s operations. Now it''s the workbench I run almost everything from. 20+ n8n workflows shipped this year. 8 MCP servers. A daily journal. A stack of skills. Slowly turning into the most interesting thing I''ve ever built.</p>\n<p><strong>What I''m thinking about.</strong> The gap between "agency that ships campaigns" and "operations layer that ships infrastructure." Most agencies sell the first; the second is where the durable value is. Also: what an operator''s job looks like when AI does the rote work and the human owns the judgment.</p>\n<p><strong>What''s next.</strong> Looking for my next full-time operator role. Somewhere big ideas need to become shipped systems. Open to project work in the meantime. If that sounds like a fit, I''d love to hear about it: busqueneil@gmail.com.</p>',
  'Back in New Jersey, building NeilOS, looking for the next operator role.',
  'published',
  '2026-05-13T12:00:00Z'
);
