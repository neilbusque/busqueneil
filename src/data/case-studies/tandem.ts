import type { CaseStudy } from './types';

export const tandem: CaseStudy = {
  slug: 'tandem',
  name: 'Tandem',
  tagline: 'A couples app I built for my own long-distance marriage',
  category: 'Consumer PWA · Realtime multiplayer',
  year: '2026',
  status: 'Live in production',
  liveUrl: 'https://tandem.my',
  summary:
    'A long-distance-couples PWA with WebRTC video rooms, six real-time multiplayer games, and letters that arrive on a delay, built for my own marriage across 8,000 miles and shipped to hundreds of households.',
  lede:
    'My wife is in Manila. I am in New Jersey. Every couples app I tried treated distance as a feature request instead of the whole problem, so I built the one we actually needed. Tandem is now a live product with real signups, a Pro tier, and a family fork running on its own domain.',

  facts: [
    { k: 'Role', v: 'Solo builder, product + engineering' },
    { k: 'Timeline', v: 'June 2026 – ongoing, 40+ shipped releases' },
    { k: 'Users', v: '800+ signups, Pro tier live with real paid sales' },
    { k: 'Stack', v: 'React, Vite, Supabase, WebRTC, Vercel' },
  ],

  stack: [
    'React 18 + TypeScript',
    'Vite 5 + vite-plugin-pwa',
    'Supabase (Postgres, Auth, Realtime, Storage, Edge Functions, pg_cron)',
    'WebRTC (native RTCPeerConnection, mesh signaling over Supabase Realtime)',
    'Cloudflare TURN',
    'Tailwind CSS + Framer Motion',
    'chess.js, @mediapipe/tasks-vision, @dnd-kit',
    'Mailgun (transactional + lifecycle email)',
    'Vercel (edge functions + static hosting)',
  ],

  metrics: [
    { value: '800+', label: 'signups since public launch' },
    { value: '40+', label: 'shipped releases in 6 weeks' },
    { value: '6', label: 'real-time multiplayer games' },
    { value: '440', label: 'automated tests in the suite' },
  ],

  problem: {
    title: 'The problem',
    body: [
      'My wife and I have been long-distance since we got married. New Jersey to Manila is a 12-hour time difference and a 8,000-mile gap that no amount of Zoom calls closes. We tried the couples apps. They handle the easy 20%: a shared calendar, a "thinking of you" button, a streak counter. None of them handle the actual hard part, which is that video calling from two different continents drops audio, screen-share on Zoom mutes the movie you are trying to watch together, and every "connection" feature reads like it was designed by someone who has never spent a year apart from the person they love.',
      'The real problem was narrower and more specific than "we need a couples app." We needed to watch a movie together and hear the sound. We needed to play a game against each other without waiting a day for a turn notification. We needed letters, actual letters, not chat bubbles that vanish. And we needed all of it to work identically whether it was 9am in Elizabeth or 9pm in Manila.',
      'So I built it for us first. No market research, no landing page test, just my own marriage as the spec. That constraint turned out to be the strongest thing about the product: every feature had to survive a real two-device test across a real 12-hour time difference before I trusted it, and every UX decision got graded against "would my wife actually use this tonight."',
    ],
  },

  approach: {
    title: 'The approach',
    body: [
      'The video layer came first because it was the hardest and the most personal. I had already solved a piece of this in a side project called Watch Together, a WebRTC mesh app that transmits shared-tab audio as its own track so movie night audio actually comes through, which Zoom and Meet both drop. I ported that mesh architecture into Tandem as the "Room": one door for watching together, one for a shared focus/Pomodoro session with forced mic mute, one for a two-seat photo booth with live face tracking. Signaling rides Supabase Realtime channels, not a dedicated media server, so the whole video stack costs close to nothing to run. TURN relay through Cloudflare handles NAT traversal, which matters a lot more than STUN alone across two different carrier networks on two different continents.',
      'The games needed two different sync models and I built both. Turn-based games (Scrabble, Chess, Connect 4, Checkers, Battleship) use one generic `couple_games` table with a kind-discriminated jsonb state column, so adding a new turn-based game costs zero migrations. Battleship is the one exception: ship positions never touch the shared row. They live in a separate `battleship_secrets` table with no INSERT policy at all, and two SECURITY DEFINER RPCs (`battleship_place`, `battleship_fire`) that re-check every authorization inside the function body, because a definer function bypasses RLS, which means the function body is the only gate that exists. Quiz, the sixth game, is fundamentally different: it is simultaneous, not turn-based, and a simultaneous general-knowledge duel cannot use a turn pointer. That forced a lockstep design, covered in the hard parts below.',
      'The retention mechanic came from actually reading my own data. Tandem already had a "your turn" badge and a push notification, but the notification fired exactly once, from the mover\'s browser, and never again. Miss it and the game vanished from view forever. I rebuilt this as a pull loop: an hourly cron job checks every pending turn against the recipient\'s own local hours (never waking anyone at 4am), dedupes per turn number so a 40-move chess game does not spam, and caps at one push and one email per person per day. The first real run on production data found roughly 140 stale, abandoned games sitting untouched, which told me the badge alone was not enough. It never is.',
      'Everything ships as a PWA, not an app-store app, because the whole point was to move fast without an App Store review cycle standing between "Neil wants this feature" and "Neil\'s wife has this feature" a few hours later. That decision shaped the release cadence: over 40 versioned releases in about six weeks, most same-day from a live feature request during an actual video call, several with an "on-device test pending Neil and Yeng" note attached because WebRTC media paths cannot be verified headlessly.',
    ],
  },

  timeline: [
    { when: 'June 12, 2026', title: 'First live version', what: 'Core app live at a private domain for two users: shared habits, lists, letters, timezone-aware partner clock.' },
    { when: 'June 17, 2026', title: 'First multiplayer game', what: 'Full official two-player async Scrabble shipped, pure tested engine, 100-tile bag, official scoring.' },
    { when: 'June 20, 2026', title: 'The Room', what: 'WebRTC video calling ported in, full parity with the Watch Together mesh: video, screen-share with tab audio, drag/PiP faces.' },
    { when: 'July 4, 2026', title: 'Public multi-tenant launch', what: 'Any couple can sign up. Landing page merged into the app repo, magic-link auth, unified single deploy.' },
    { when: 'July 7, 2026', title: 'tandem.my registered', what: 'Custom domain, rebrand to "leaning hearts" mark, free-forever pricing on the landing page.' },
    { when: 'July 10, 2026', title: 'Pro tier suite begins', what: 'Letter scheduling, custom backgrounds with adaptive theming, and premium slideshow letters ship as the first paid-tier features.' },
    { when: 'July 16, 2026', title: 'Pro billing goes live', what: 'Manual GCash orders, admin plan management, and the first real Pro sale close the same day the games platform (Connect 4, Checkers, Battleship) ships.' },
    { when: 'July 17, 2026', title: 'Tandem Family launches', what: 'Full family fork ships to its own domain, family.tandem.my, with chores, group chat, and a six-person WebRTC mesh.' },
    { when: 'July 18, 2026', title: 'Quiz goes lockstep + Room redesign', what: 'Sixth game ships as a synchronized lockstep duel; the Room UI is rebuilt around a "mirror and three doors" layout after live QA.' },
  ],

  features: [
    {
      group: 'The Room (live video)',
      items: [
        'Watch together with shared-tab audio (fixes the Zoom/Meet screen-share audio gap)',
        'Synced YouTube watch parties with search built in',
        'Shared Focus sessions (25/5 or 55/5 Pomodoro) with forced mic mute during focus',
        'Two-seat Photo Booth with live face tracking, props, frames, and shared scene backgrounds',
        'Karaoke mode with a studio vocal chain (EQ, compression, reverb, doubler) on outgoing mic audio',
        'Presence-aware doors that show which room your partner is already in',
      ],
    },
    {
      group: 'Games (six, all real-time synced)',
      items: [
        'Scrabble: full official rules, 100-tile bag, blanks, premium squares, one lifeline per game',
        'Chess: chess.js engine, drag-to-move, board flips for the black player',
        'Connect 4: animated disc drops, winning-line highlight',
        'Checkers: flying kings, forced captures, maximal multi-jumps',
        'Battleship: hidden-information ship placement enforced server-side, manual drag placement',
        'Quiz: simultaneous lockstep general-knowledge duel, 10 questions, three difficulties, 600-question no-repeat bank',
      ],
    },
    {
      group: 'Connection',
      items: [
        'Typewritten and voice letters with a 1-3 hour randomized snail-mail delay',
        'Scheduled letters up to 30 days out (Pro)',
        'Slideshow letters with a curated photo set and a chosen song (Pro)',
        'Habit-point gift economy: completed habits earn points, spend them on sendable gifts',
        'Real-time chat with read receipts, photo messages (Pro), and presence-aware push',
        'Nudge hearts with a full-screen animation on the partner\'s live screen',
      ],
    },
    {
      group: 'Shared life',
      items: [
        'Heart-shaped habit tracker (half-heart per partner, full heart when both complete it)',
        'Per-habit analytics: streaks, completion rate, together-percentage',
        'Shared calendar with RSVP and milestone/anniversary tracking',
        'Private lists (RLS-enforced, partner-invisible, for surprise planning)',
        'Timezone-aware partner clock ("It\'s 2:57 PM for Yeng · already tomorrow there")',
        'Home/away status, opt-in',
      ],
    },
    {
      group: 'Settings and trust',
      items: [
        'Google OAuth and email/password sign-in with Turnstile bot protection',
        'PWA install guide with platform-specific steps',
        'Six visual theme presets plus custom background upload with adaptive recoloring',
        'In-app bug report / feature request form',
        'Lifecycle email sequence (pairing nudges, dormancy winbacks) with one-click unsubscribe',
      ],
    },
    {
      group: 'Tandem Pro',
      items: [
        'One price covers both partners: monthly, yearly, or lifetime',
        'Unlocks all six games, chat photo messages, custom themes, letter scheduling and slideshow letters',
        'Manual GCash ordering flow with admin verification and auto-granted access',
        'Founding-couple pricing during the launch window',
      ],
    },
  ],

  hardParts: [
    {
      title: 'Mobile screen-share played back frozen or silent',
      problem:
        'The shared-screen video element is deliberately unmuted, because it has to carry the shared tab\'s audio, not just the picture. Mobile browsers block unmuted-autoplay by policy, so `play()` on that element rejected silently on phones. The viewer just saw a frozen or black tile and read it as "screen share is broken," when the video was actually playing, muted, with nothing telling anyone what happened.',
      solution:
        'Added a forced-mute fallback: when the browser rejects unmuted autoplay, the video tile retries as muted so the picture always renders, and the existing "tap to enable sound" control unmutes inside the user gesture that follows. The same fallback fixed the remote camera tile too, which had the identical failure mode nobody had connected to this root cause yet.',
    },
    {
      title: 'iOS cannot fullscreen a div',
      problem:
        'The fullscreen button in the Room did nothing on an iPhone. iOS Safari only allows native fullscreen on a `<video>` element via `webkitEnterFullscreen`, which also drops in the browser\'s own playback controls and hides the two people on the call. Calling `Element.requestFullscreen()` on the call container, the standard desktop approach, is a silent no-op on iOS.',
      solution:
        'Replaced the native fullscreen call with a CSS-only "immersive" mode: one class toggled on the room container that hides the header, controls, chat, and hints, leaving only the shared video and the two face tiles plus a single floating exit button. Desktop still gets a bonus native fullscreen request layered on top. A mount guard prevents an iOS phantom `fullscreenchange` event from tearing the immersive layout down mid-call.',
    },
    {
      title: 'Synchronizing a simultaneous quiz across two phones on opposite sides of the planet',
      problem:
        'The first five games are turn-based, so a stale connection just means a slow turn. Quiz is not: both partners are supposed to see the same question at the same moment and race the clock. A naive "start when you open it" design breaks immediately if one partner opens the game five minutes before the other, and there is no way to enforce a shared countdown across two independent client clocks with no shared server tick.',
      solution:
        'Built a three-part lockstep protocol. First, a presence-based lobby handshake: opening the game pings a `quiz_ready` state every 8 seconds, and the server only starts the match once both partners have pinged within a 15-second window, so nobody starts solo and nobody is left waiting indefinitely without knowing why. Second, a shared clock: on a fresh double-ping the server stamps one `start_at` timestamp, and both clients derive every question\'s time slot as pure math from that single timestamp rather than trusting their own local clock. Client clocks are corrected against the server\'s `updated_at` deltas, filtering out any stale value more than 30 seconds off so an old cached row cannot drag the countdown backward. Third, disconnect-safety: the timeline never pauses for a dropped connection, and if a partner never returns, the other client finalizes the match after a fixed grace period, padding the absentee\'s unanswered questions as timeouts and settling a winner instead of leaving the game stuck.',
    },
    {
      title: 'NAT traversal across two different carrier networks, two continents apart',
      problem:
        'STUN-only WebRTC (the free, serverless default) works fine on the same network or across similar ISPs. It does not reliably punch through two different carrier-grade NATs on opposite sides of the world, which is exactly the setup a New Jersey to Manila video call runs on. Early testing produced calls that connected on paper but never actually saw or heard each other.',
      solution:
        'Added Cloudflare TURN as a relay fallback, minted through a short-lived credential endpoint so the TURN secret never ships to the client. TURN is not optional here; it is the difference between a demo that works on a local network and a product that works for the actual use case it exists for. The relay endpoint was later generalized so a second product, Tandem Family, could proxy the same TURN service instead of needing its own credentials.',
    },
    {
      title: 'Real-time presence without one setter clobbering another',
      problem:
        'The Room shows which of the three doors (watch, focus, photo booth) a partner is currently behind, and that status has to update live and clear itself the instant they leave. Supabase presence tracking replaces the entire payload on every `track()` call rather than merging it, so two independent pieces of code each calling `track()` with only their own field would silently overwrite each other\'s data.',
      solution:
        'Centralized presence writes behind one `trackPresence()` helper that always sends the full payload (`{at, area, room}`) together, and mounted the room-specific field only for the duration of being inside a room so it self-clears on leave or on minimizing away. The fix generalized past this one feature: any presence field added later has to go through the same single writer, or it will silently lose data the next time something else calls `track()`.',
    },
  ],

  outcome: {
    title: 'Where it landed',
    body: [
      'Tandem is live at tandem.my with public signup, over 800 registered users, and a working Pro tier with real paying households on a manual GCash order flow I built and verify myself. The app has shipped more than 40 versioned releases in about six weeks, most of them same-day fixes or features pulled straight from a real conversation with my wife during an actual call.',
      'The architecture proved itself well enough to fork. Tandem Family, a family version with chores, a shared calendar, group chat, and a six-person WebRTC mesh, launched on its own domain, family.tandem.my, running on a separately provisioned Supabase project, reusing the same core patterns: the generic games table, the presence system, the TURN relay, the pull-loop retention design.',
      'The product still runs on the same test that started it: does this actually work for a couple who is 8,000 miles and 12 hours apart. Every feature that touches live video or synced state gets a real two-device pass across that exact gap before I call it done.',
    ],
  },

  lessons: [
    'Build for one real user with a real constraint before building for a market; the constraint does the product design for you.',
    'Optimistic UI and monotonic state guards are not free: a guard that protects your own state also protects your own bugs, so failure paths need an explicit bypass.',
    'A raise inside a database function rolls back every write in that same call, including counters incremented earlier in the function; security counters have to be measured after the fact, not trusted from the code.',
    'Never route per-frame animation (face tracking, live overlays) through a UI framework\'s state layer; it will lose the race against the render loop every time.',
    'A retention feature that fires once and never again is not a retention feature. Build the recheck loop before calling the notification done.',
    'Ship as a PWA when the goal is speed of iteration on a live relationship with a real user testing it that same night; app-store review cycles are the wrong trade for that loop.',
  ],

  proof:
    'Tandem is proof I can take a product from a real, specific personal problem through live WebRTC infrastructure, real-time multiplayer sync, a working payment and admin flow, and a second production fork, without a team. If you need real-time, multi-user, or video-call product built and actually shipped to real users, this is the receipt.',
};
