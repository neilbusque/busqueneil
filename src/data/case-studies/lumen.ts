import type { CaseStudy } from './types';

export const lumen: CaseStudy = {
  slug: 'lumen-portal',
  name: 'Lumen Portal',
  tagline: 'The client-facing surface with a lock on it',
  category: 'SaaS · Client Portal',
  year: '2026',
  status: 'Live in production',
  liveUrl: 'https://portal.busqueneil.com',
  summary:
    'A branded client portal with files, docs, reports, and legally binding e-signatures built in-house on Postgres RLS instead of a bolted-on signing vendor.',
  lede:
    'Every agency hits the same wall: the work is good, but the client experience around the work is chaos. Files in email, updates in Slack, contracts in DocuSign, status in someone\'s head. Lumen Portal is the fix I built for myself first. One login, one URL per client, and now, a signature that actually holds up.',

  facts: [
    { k: 'Role', v: 'Solo builder, full stack' },
    { k: 'Timeline', v: 'May 2026 to present, active' },
    { k: 'Version', v: 'v0.36.1' },
    { k: 'Stack', v: 'React, TypeScript, Supabase, Postgres RLS' },
  ],
  stack: [
    'React 19',
    'TypeScript',
    'Vite',
    'Tailwind CSS',
    'Supabase (Postgres, Auth, Storage, Realtime, Edge Functions)',
    'TipTap',
    'dnd-kit',
  ],
  metrics: [
    { value: '4', label: 'signature RPCs, all SECURITY DEFINER' },
    { value: '55', label: 'migrations shipped to prod' },
    { value: 'v0.36.1', label: 'current shipped version' },
  ],

  problem: {
    title: 'The problem',
    body: [
      'Client work doesn\'t fall apart because the deliverable is bad. It falls apart in the gaps around it. A revision note lives in a text message. A final logo file lives in a Google Drive link that expires. A signed statement of work lives in a DocuSign account the client never gets access to again. Six weeks in, nobody, including me, can answer "where do things actually stand" without opening four different tools.',
      'The worst version of this is the contract. Most solo operators and small agencies either sign things over email (no audit trail, no tamper protection, arguably not enforceable) or pay for a signing tool that lives completely outside the project. The client signs in DocuSign, then goes back to Slack for the actual work. Two systems, two logins, and the signed document has no connection to the deliverables it describes.',
      'None of this is a client problem. It\'s an operator problem that clients experience as a lack of professionalism. A scattered engagement reads as a small, disorganized shop even when the work itself is excellent.',
    ],
  },

  approach: {
    title: 'The approach',
    body: [
      'Lumen Portal is the single client-facing surface that sits on top of Orbit\'s data. Orbit is where I run the business, deals, pipeline, tasks. Lumen is what the client actually sees: their board, their files, their docs, their reports, all scoped to one workspace with their branding on it. When a deal closes in Orbit, a signed webhook provisions a Lumen workspace automatically and the client gets a magic-link invite. No separate onboarding, no separate account creation on my end.',
      'The decision that shaped the last month of work was building agreements and e-signatures myself instead of embedding a vendor. An embedded signing widget solves the UI problem but not the trust problem, you\'re still asking the client to believe a third party did the right thing with the document. Building it in-house meant the agreement is just a doc row with `doc_type=\'agreement\'`, so it gets the same editor, the same folder structure, and the same access model as everything else in the portal, plus a lifecycle: draft, sent, signed, with void and reopen for the admin. Every state transition runs through a SECURITY DEFINER Postgres function, `send_agreement`, `sign_document`, `void_agreement`, `reopen_agreement`, so the security boundary lives in the database, not in a client-side check that a modified request could skip.',
      'The same philosophy runs through storage. The `media` bucket that holds every client file was public when I first shipped it, which is the default in most Supabase starters and a real hole once real client work is flowing through it. I moved it to private with signed URLs that expire, which meant rewriting how every image and file reference gets stored and rendered, not just flipping a flag. Documents in the rich-text editor now store the storage path, never the URL, and a render-time hook signs it fresh. A URL that expires can\'t accidentally get baked into a permanent document.',
      'I also chose RPC-first mutations over letting the client talk to tables directly wherever the action matters, who can sign, who can void, who can see a report before it\'s sent. Row-level security policies handle read access well, but anything with a lifecycle or an audit requirement gets a dedicated function with an explicit identity check and an explicit grant. That\'s slower to build than opening a table up to `authenticated` and trusting the UI to behave, but it means a client can\'t forge a signature or alter a sent contract no matter what they send the API directly.',
      'The files, docs, and reports were originally three separate rail items with their own routes. As the portal grew I consolidated them into one Files hub with tabs, on real nested routes rather than local tab state, so deep links, notification links, and the command palette all still resolve correctly. The three data models stayed separate underneath. Consolidation of the interface, not a merge of the data.',
    ],
  },

  timeline: [
    {
      when: 'May 2026',
      title: 'Portal goes live',
      what: 'Provisioning webhook from Orbit, kanban board, in-app messaging, docs, notifications, PWA install. First client workspace stood up on portal.busqueneil.com.',
    },
    {
      when: 'June 26, 2026',
      title: 'Design system parity + digests',
      what: 'Full visual port from Orbit: compact component system, command palette, rotating dashboard quote. Weekly progress digest and 4-hour unread-message email added, both dedupe-guarded and cron-driven.',
    },
    {
      when: 'July 9, 2026 (v0.19.0)',
      title: 'Rebrand, calendar, reports',
      what: 'Deep Space visual system ported in. New Calendar tab on FullCalendar with drag-to-schedule. New Reports tab with read receipts and per-report comments.',
    },
    {
      when: 'July 15, 2026 (v0.30.0)',
      title: 'Files unified, versioning added',
      what: 'Card attachments and the Files section merged into one file record with full version history. A file uploaded on a task and a file in the Files browser became the same row, same comments, same history.',
    },
    {
      when: 'July 15-16, 2026 (v0.34.0-v0.35.0)',
      title: 'Storage locked down',
      what: 'The media bucket flipped from public to private with signed URLs. WebP compression added on upload. Card attachments migrated to a versioned file model with archive support, live on production data.',
    },
    {
      when: 'July 16, 2026 (v0.36.0)',
      title: 'Files hub + signable agreements',
      what: 'Docs and Reports consolidated into one Files hub on real nested routes. Signable agreements shipped: lifecycle states, four SECURITY DEFINER RPCs, a lock trigger, and a sha256 audit trail. Migration 0055 applied to production.',
    },
    {
      when: 'July 16, 2026 (v0.36.1)',
      title: 'Adversarial review fixes',
      what: 'A concurrent-signing race and a lock-bypass path found in review, both fixed and verified against production data before close.',
    },
  ],

  features: [
    {
      group: 'Files hub',
      items: [
        'One consolidated hub with Files, Docs, and Reports as tabs on real nested routes',
        'Grid and list views, folders, drag-and-drop upload, global search',
        'Every file is versioned from the moment it\'s uploaded, with restore-as-new-version history',
        'Archive vs. remove vs. delete as three distinct, deliberate actions',
      ],
    },
    {
      group: 'Docs',
      items: [
        'Rich-text editor with slash commands, callouts, embeds, and tables',
        'Per-folder new-doc button',
        'Autosave with version history',
        'Same editor and folder model shared with Reports and agreements',
      ],
    },
    {
      group: 'Reports',
      items: [
        'Draft and sent states, client sees only what\'s been sent',
        'Read receipts logged on open',
        'Threaded comments on a sent report',
        'Notification fired to the client the moment a report goes out',
      ],
    },
    {
      group: 'Agreements and signing',
      items: [
        'An agreement is a doc with a lifecycle: draft, sent, signed, void, reopen',
        'One row per required signature, created only when the agreement is sent',
        'Type-your-name-to-sign flow with a per-signer status list',
        'Signed document body is frozen at the database level, not just in the UI',
        'sha256 hash of the document body captured at send and again at signing',
      ],
    },
    {
      group: 'Cards and projects',
      items: [
        'Kanban board with drag-and-drop, realtime sync',
        'Per-task activity timeline, subtask checklists with assignees',
        'Calendar view with drag-to-schedule',
        'Card comments with @mentions and pinned file annotations',
      ],
    },
    {
      group: 'Auth and access',
      items: [
        'Magic-link login, no passwords',
        'Workspace-scoped access, a client sees only their own workspace',
        'Admin and team-member roles distinct from client roles at the policy level',
        'Automatic provisioning from a signed webhook when a deal closes',
      ],
    },
  ],

  hardParts: [
    {
      title: 'Making a signed document actually tamper-evident',
      problem:
        'An existing RLS policy let any workspace member update any doc, which is correct for a working draft and dangerous for a document two parties just countersigned. UI-only locking isn\'t real protection, a direct API call bypasses a disabled button.',
      solution:
        'Added a BEFORE UPDATE trigger on the docs table that freezes the body and title once an agreement moves to sent or signed, enforced at the database for every write path including the signing RPCs themselves. Paired it with a sha256 hash of the document body captured at send and again at signing, so any dispute over what was actually agreed to has a server-computed answer, not a client-side claim. The audit trail deliberately omits an IP column: Supabase RPCs see the connection pooler\'s address, not the signer\'s, and a false record is worse than no record.',
    },
    {
      title: 'Flipping a public storage bucket to private without breaking anything live',
      problem:
        'The bucket holding every client file, contracts, deliverables, annotated designs, was public from day one, meaning anyone with a URL could read it, no auth required. Flipping the bucket flag alone wasn\'t enough: a pre-existing storage policy still granted read access to the public role, which includes the anon key, meaning the "public" endpoint and the RLS-governed endpoint were two separate doors and closing one left the other open.',
      solution:
        'Shipped the signed-URL layer first, while the bucket was still public, so reads kept working the entire time. Then dropped the permissive storage policy and flipped the bucket to private in the same change, verified with the anon key directly rather than trusting a URL returning a 403. In the rich-text editor, images now store the storage path, not a URL, a signed URL is minted only at render time. A path can\'t expire inside a saved document; a URL can and does.',
    },
    {
      title: 'Replacing card attachments with a real versioned file model, live',
      problem:
        'Card attachments and the Files section were two separate tables with a workaround stitching them together. A file attached to a task and the "same" file in the Files browser weren\'t actually the same record, so there was no shared comment thread and no version history across the two views. Rebuilding this meant a live data migration on a table already holding real client files, with zero acceptable downtime.',
      solution:
        'Migration 0055 (preceded by 0050-0054 building up to it) merged the two into one files table, archived rather than dropped the old table so the change stayed reversible, and added a trigger that seeds version 1 automatically on every insert so no code path can create a file with no history. Dry-ran the migration twice inside one transaction to prove it was idempotent, then applied it to production and verified row counts before considering it done.',
    },
    {
      title: 'The PostgREST transaction trap',
      problem:
        'A raise inside a Postgres function called via PostgREST rolls back every write that function made in that same call, including writes that happened before the raise. A tempting pattern for anything security-adjacent is to record an attempt, then raise on failure, an audit log plus a rejection in one function. That pattern silently does nothing: the audit row is written, then immediately discarded by the exception.',
      solution:
        'Functions that need to both record an outcome and signal failure now return a status value instead of raising, and raise only on branches that write nothing, so there\'s nothing left to roll back. The client checks the returned value explicitly rather than treating a null error as success, because with this pattern a rejected action and a successful one can otherwise look identical from the client\'s side. The fix generalizes past this codebase: anything that increments a counter and then raises to reject the same request needs to be measured after the fact, not just code-reviewed, to catch this.',
    },
    {
      title: 'Client-scoped access without a table-by-table maze',
      problem:
        'A client should see exactly their workspace and nothing else, while the admin sees everything and a small operator team sits in between with elevated but not unlimited access. Row-level security policies that reference other tables can fail outright if the calling role doesn\'t have read access to those tables, and a stale policy left behind by an earlier migration can silently poison a table for every role, even when a correct policy also exists.',
      solution:
        'Cross-table access checks route through SECURITY DEFINER helper functions rather than raw subqueries in the policy, so the check runs with the function owner\'s privileges regardless of the caller\'s grants. Every policy set gets audited directly against `pg_policies` rather than trusted from memory, because the failure mode here is invisible until you query it, code review alone won\'t catch a duplicate or conflicting policy from three migrations ago.',
    },
  ],

  outcome: {
    title: 'Where it landed',
    body: [
      'Lumen Portal is live at v0.36.1, built as the client-facing layer for every active engagement. A client logs in once and sees their board, their files with full version history, their docs, their sent reports with read receipts, and now, agreements they can review and sign inside the same portal, with a lock and an audit trail that hold up because the database enforces them, not because a UI button happens to be disabled.',
      'The files that matter, contracts, deliverables, revision history, live in one place with private storage instead of a public bucket and a signing step instead of an email chain. Nothing here required a paid signing tool, a separate file-sharing service, or a second login for the client to keep track of.',
    ],
  },

  lessons: [
    'A public storage bucket usually has two doors, the bucket flag and the RLS policy, and closing one without checking the other looks like a fix and isn\'t.',
    'Anything with a lifecycle, especially signatures, should mutate through a database function with an explicit identity check, not a table the client can write to directly.',
    'A raise inside a Postgres RPC rolls back that whole call\'s writes, so audit-then-reject logic has to return a status, not raise after recording the attempt.',
    'Store a reference, not a URL, whenever the thing behind the URL can expire. A path signed at render time can\'t be accidentally frozen into a document.',
    'Dry-run a production migration inside a transaction that force-aborts before you run it for real. It surfaces the exact row counts you\'re about to change with nothing written yet.',
    'An audit trail should only record what the server can actually vouch for. A field you can\'t verify server-side is worse than an empty one.',
  ],

  proof:
    'This is what it looks like to take client trust seriously past the point of "it works in the demo." Storage that\'s actually private, signatures that are actually locked, and mutations that can\'t be forged from the browser console, are the parts that never show up in a screenshot and are exactly what a security-minded client or hiring manager checks for first.',
};
