import type { CaseStudy } from './types';

export const lumen: CaseStudy = {
  slug: 'lumen-portal',
  title: 'Branded client portal with e-signatures',
  category: 'Software',
  year: '2026',
  seoTitle: 'Case study: a client portal with e-signatures',
  seoDescription:
    'A branded client portal with files, docs, reports and legally binding e-signatures, built on Postgres security rules instead of a separate signing tool.',
  summary:
    'Files, reports, boards and legally binding signatures in one place for a firm\'s clients, with signing built in instead of bolted on.',
  lede:
    "Client work rarely falls apart because the work is bad. It falls apart in the gaps: files in email, updates in chat, contracts in a signing tool, status in someone's head. This portal gives each client one login and one place for all of it, and now a signature that holds up.",

  facts: {
    whoFor: 'Agencies and firms that share files, reports and contracts with clients',
    built: 'A branded client portal with boards, files, docs, reports and e-signatures',
    timeline: 'Live in May 2026, signing added in July',
    stack: 'React, TypeScript, Supabase, Postgres security rules',
  },

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
    { value: '55', label: 'Database migrations shipped to production' },
    { value: '4', label: 'Signing functions, each checking who is calling' },
    { value: 'v0.36', label: 'The release where signing went live' },
  ],

  problem: {
    body: [
      'A revision note lives in a text message. A final logo file lives in a shared-drive link that expires. A signed statement of work lives in a signing account the client never opens again. Six weeks in, nobody can say where things stand without opening four different tools.',
      'Contracts are the worst of it. Small firms either agree to things over email, with no audit trail and no protection against edits, or pay for a signing tool that lives outside the project. The client signs in one place, then goes back to chat for the actual work. Two systems, two logins, and the signed document has no link to the work it describes.',
      "None of this is the client's problem. It is the firm's problem, and clients feel it as a lack of polish, even when the work itself is excellent.",
    ],
  },

  approach: {
    body: [
      "The portal is the one surface a client sees: their board, their files, their docs and their reports, scoped to one workspace with their branding on it. It sits on top of my CRM's data. When a deal closes there, a signed webhook sets up a portal workspace on its own and the client gets a magic-link invite. No separate onboarding and no accounts to create by hand.",
      "The decision that shaped the last month was building agreements and e-signatures myself instead of embedding a signing vendor. An embedded widget solves the screen, not the trust: you still ask the client to believe a third party did the right thing with the document. Built in, an agreement is just a document with a lifecycle (draft, sent, signed, with void and reopen for the admin), so it shares the editor, the folders and the access model with everything else. Every change of state runs through a database function, so the security check lives in the database, not in a button a modified request could skip.",
      "Storage follows the same idea. The bucket holding every client file was public when it first shipped, which is the default in most starter setups and a real hole once client work flows through it. I moved it to private, with signed links that expire. That meant changing how every image and file reference is stored, not just flipping a flag: documents now store the file's path, and a fresh signed link is made each time the page renders, so an expiring link can never get baked into a saved document.",
      "Anything with a lifecycle or an audit need goes through a dedicated function with an explicit identity check, instead of letting the browser write to tables directly: who can sign, who can void, who can see a report before it is sent. It is slower to build than opening a table to every signed-in user and trusting the interface to behave, but it means a client cannot forge a signature or change a sent contract, whatever they send the API.",
      'Files, docs and reports started as three separate menu items. As the portal grew I folded them into one Files hub with tabs, on real routes rather than local tab state, so deep links, notification links and the command palette all still land in the right place. The interface merged; the three data models underneath stayed separate.',
    ],
  },

  timeline: [
    { when: 'May 2026', title: 'Portal goes live', what: 'Automatic setup from the CRM, a project board, messaging, docs, notifications and an installable app. First client workspace live.' },
    { when: 'June 26, 2026', title: 'Shared design system and digests', what: 'A compact component set and command palette, plus a weekly progress email and an unread-message email, both guarded against duplicates.' },
    { when: 'July 9, 2026', title: 'Calendar and reports', what: 'A new visual system, a calendar with drag-to-schedule, and reports with read receipts and comments.' },
    { when: 'July 15, 2026', title: 'One file record with versions', what: 'Task attachments and the Files section merged into one file record with full version history.' },
    { when: 'July 16, 2026', title: 'Storage locked down', what: 'The file bucket moved from public to private with signed links, plus image compression on upload, live on real data.' },
    { when: 'July 16, 2026', title: 'Files hub and signable agreements', what: 'Docs and reports joined one Files hub. Agreements shipped with lifecycle states, four signing functions, a lock and a hash-based audit trail.' },
    { when: 'July 16, 2026', title: 'Fixes from a hostile review', what: 'A race between two signers and a way around the lock, both found in review and fixed on production data the same day.' },
  ],

  features: [
    {
      group: 'Files hub',
      items: [
        'Files, docs and reports as tabs in one hub, on real routes',
        'Grid and list views, folders, drag-and-drop upload and search',
        'Every file versioned from its first upload, with restore as a new version',
        'Archive, remove and delete as three separate, deliberate actions',
      ],
    },
    {
      group: 'Docs and reports',
      items: [
        'A rich-text editor with slash commands, callouts, embeds and tables',
        'Autosave with version history',
        'Reports in draft and sent states, so clients only see what was sent',
        'Read receipts on open, threaded comments and a notification when a report goes out',
      ],
    },
    {
      group: 'Agreements and signing',
      items: [
        'An agreement is a doc with a lifecycle: draft, sent, signed, void, reopen',
        'One signature row per signer, created only when the agreement is sent',
        'Type your name to sign, with a status for each signer',
        'The signed text is frozen by the database, not just the interface',
        'A hash of the document taken when it is sent and again when it is signed',
      ],
    },
    {
      group: 'Boards and access',
      items: [
        'A project board with drag and drop and live sync',
        'Task timelines, subtask checklists with owners, and a calendar view',
        'Magic-link login, with no passwords',
        'Each client sees only their own workspace; admin and team roles are kept apart by the database',
      ],
    },
  ],

  hardParts: [
    {
      title: 'Making a signed document tamper-evident',
      problem:
        'An existing rule let any workspace member edit any doc. That is right for a working draft and dangerous for a document two parties just signed. Locking it in the interface is not protection: a direct API call skips a disabled button.',
      solution:
        "A database trigger now freezes the title and body once an agreement is sent or signed, for every write path, including the signing functions themselves. A hash of the body is taken at send and again at signing, so any dispute over what was agreed has a server-computed answer. The audit trail leaves out the signer's IP on purpose: the database sees the connection pooler's address, and a false record is worse than none.",
    },
    {
      title: 'Making a public file bucket private without breaking anything live',
      problem:
        "The bucket holding every contract, deliverable and design was public from day one. Flipping its flag was not enough: an older storage rule still let the public role read it, so there were two doors, and closing one left the other open.",
      solution:
        'I shipped the signed-link layer first, while the bucket was still public, so reads kept working the whole time. Then I removed the open rule and made the bucket private in the same change, and checked it with the public key directly instead of trusting a 403 on one URL.',
    },
    {
      title: 'Moving to versioned files on live data',
      problem:
        'Task attachments and the Files section were two tables held together by a workaround, so the "same" file in two places had no shared comments and no shared history. Fixing it meant migrating a table that already held real client files, with no downtime.',
      solution:
        'One migration merged the two into a single files table, archived the old table instead of dropping it so the change could be undone, and added a trigger that creates version 1 on every insert, so no code path can make a file without history. I ran it twice inside a transaction that rolled back, to prove it was safe to repeat, then applied it and checked the row counts.',
    },
    {
      title: 'Client-scoped access without a maze of rules',
      problem:
        'A client should see their workspace and nothing else, the admin sees everything, and a small team sits in between. Security rules that look at other tables can fail outright when the caller cannot read those tables, and a stale rule from an old migration can quietly break a table for everyone.',
      solution:
        'Cross-table checks go through helper functions that run with fixed privileges, whoever the caller is. And every rule set gets audited against the live list of policies, not memory, because a duplicate or conflicting rule from three migrations ago is invisible until you query for it.',
    },
  ],

  outcome: {
    body: [
      "Clients log in once and see their board, their files with full version history, their docs, their sent reports with read receipts, and agreements they can review and sign in the same place. The lock and the audit trail hold up because the database enforces them, not because a button happens to be disabled.",
      'Contracts, deliverables and revision history live in one place, with private storage instead of a public bucket and a signing step instead of an email chain. No separate signing tool, no file-sharing service and no second login for the client.',
    ],
  },

  lessons: [
    'A public storage bucket usually has two doors, the bucket flag and the access rule. Closing one looks like a fix and is not.',
    'Anything with a lifecycle, especially a signature, should change through a database function with an explicit identity check.',
    'Store a reference, not a link, whenever the thing behind the link can expire.',
    'Dry-run a production migration inside a transaction that rolls back. It shows the exact rows you are about to change, with nothing written.',
    'An audit trail should record only what the server can vouch for. A field you cannot verify is worse than an empty one.',
  ],

  proof:
    'This is what taking client trust seriously looks like past "it works in the demo": storage that is private, signatures that are locked and changes that cannot be forged from the browser. Those are the parts that never show in a screenshot and the first things a careful client checks.',

  palette: 'paper',
};
