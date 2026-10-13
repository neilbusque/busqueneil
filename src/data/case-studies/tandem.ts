import type { CaseStudy } from './types';

export const tandem: CaseStudy = {
  slug: 'tandem',
  title: 'A real-time couples app with video, games and letters',
  category: 'Software',
  year: '2026',
  seoTitle: 'Case study: a real-time couples app',
  seoDescription:
    'A couples web app with live video rooms, six real-time games and letters that arrive on a delay. More than 800 registered users and 40+ releases in six weeks.',
  summary:
    'A web app for couples with live video rooms, six real-time games and letters that arrive on a delay, grown to more than 800 registered users.',
  lede:
    "Most couples apps cover the easy part: a shared calendar, a streak, a 'thinking of you' button. The hard part is doing things together live when you are not in the same room. This app does that, with video rooms that carry a movie's sound, games played in real time and letters that take a while to arrive.",

  facts: {
    whoFor: 'Couples who spend time apart, often in different time zones',
    built: 'A live app with video rooms, six multiplayer games, letters, chat and a paid tier',
    timeline: 'June 2026 onward, with 40+ releases in the first six weeks',
    stack: 'React, Vite, Supabase, WebRTC, Vercel',
  },

  stack: [
    'React 18 and TypeScript',
    'Vite 5 with vite-plugin-pwa',
    'Supabase (Postgres, Auth, Realtime, Storage, Edge Functions, pg_cron)',
    'WebRTC (native RTCPeerConnection, signaling over Supabase Realtime)',
    'Cloudflare TURN',
    'Tailwind CSS and Framer Motion',
    'chess.js, MediaPipe Tasks Vision, dnd-kit',
    'Mailgun (transactional and lifecycle email)',
    'Vercel (edge functions and static hosting)',
  ],

  metrics: [
    { value: '800+', label: 'Registered users' },
    { value: '40+', label: 'Releases in the first six weeks' },
    { value: '6', label: 'Real-time multiplayer games' },
    { value: '440', label: 'Automated tests' },
  ],

  problem: {
    body: [
      "Video calls between two countries drop audio. Sharing a screen on the usual call tools mutes the movie you are trying to watch together. Turn-based games make you wait a day for a notification. And most 'connection' features read like they were designed by someone who has never had to plan a week around another person's clock.",
      "The real need was narrower than 'a couples app'. Watch a movie together and hear it. Play a game against each other without waiting a day. Send letters that feel like letters, not chat bubbles that scroll away. And have all of it work the same at 9am in one city and 9pm in another.",
      'It started as an app for two real users, built around their real evenings, and every feature had to survive a two-device test across a real time difference before it shipped. That constraint turned out to be the strongest thing about the product.',
    ],
  },

  approach: {
    body: [
      "Video came first because it was the hardest. I had already solved part of it in a side project: a peer-to-peer video app that sends a shared tab's audio as its own track, so movie night actually has sound. I brought that architecture in as the Room, with three doors: watch together, a shared focus session with microphones muted, and a two-seat photo booth with live face tracking. Signaling runs over Supabase Realtime channels instead of a media server, so the video stack costs close to nothing to run, and a Cloudflare TURN relay handles the networks that peer-to-peer alone cannot get through.",
      'The games needed two different sync models, and I built both. Turn-based games (word game, chess, connect four, checkers and battleship) share one generic games table with the state in a JSON column, so a new turn-based game needs no migration. Battleship is the exception: ship positions never touch the shared row. They live in a separate table with no insert rule at all, reached only through two database functions that recheck every permission inside, because a function that runs with raised privileges skips the usual rules. The sixth game, a quiz, is simultaneous rather than turn-based, which forced a lockstep design, covered under the hard parts.',
      "Retention came from reading real data. The app already showed a 'your turn' badge and sent a push, but the push fired once and never again. Miss it and the game vanished from view. I rebuilt it as a pull loop: an hourly job checks every pending turn against the other player's own local hours (never waking anyone at 4am), avoids repeats per turn and caps at one push and one email per person per day. The first run on production found about 140 abandoned games, which said the badge alone was never enough.",
      'Everything ships as a web app, not through an app store, so a feature asked for during a call could reach both phones a few hours later. That set the pace: more than 40 versioned releases in about six weeks, most of them the same day as the request.',
    ],
  },

  timeline: [
    { when: 'June 12, 2026', title: 'First live version', what: 'Shared habits, lists, letters and a clock showing the other person\'s local time, live for two users.' },
    { when: 'June 17, 2026', title: 'First multiplayer game', what: 'A full two-player word game with official scoring and a tested game engine.' },
    { when: 'June 20, 2026', title: 'The Room', what: 'Video calling with screen share that carries tab audio, and movable picture-in-picture faces.' },
    { when: 'July 4, 2026', title: 'Public launch', what: 'Any couple can sign up. The landing page joined the app repo, with magic-link login and one deploy.' },
    { when: 'July 7, 2026', title: 'Own domain and brand', what: 'A custom domain, a new mark and a free plan on the landing page.' },
    { when: 'July 10, 2026', title: 'Paid features begin', what: 'Scheduled letters, custom backgrounds with matching colors, and slideshow letters.' },
    { when: 'July 16, 2026', title: 'Paid tier and more games', what: 'Manual orders with admin approval, plan management, and three new games: connect four, checkers and battleship.' },
    { when: 'July 17, 2026', title: 'A family version', what: 'A fork for families on its own domain, with chores, group chat and six-person video.' },
    { when: 'July 18, 2026', title: 'Lockstep quiz and a new Room', what: 'The sixth game ships as a synchronized duel, and the Room is redesigned after live testing.' },
  ],

  features: [
    {
      group: 'The Room (live video)',
      items: [
        'Watch together with the shared tab\'s sound, which the usual call tools drop',
        'Synced video watch parties with search built in',
        'Shared focus sessions with microphones muted while you work',
        'A two-seat photo booth with live face tracking, props and frames',
        'A karaoke mode with a studio vocal chain on the outgoing microphone',
        'Doors that show which room the other person is already in',
      ],
    },
    {
      group: 'Games (six, all in real time)',
      items: [
        'A word game with official rules, a full tile bag and premium squares',
        'Chess with drag-to-move and a board that flips for black',
        'Connect four, checkers with flying kings, and battleship with hidden ships enforced on the server',
        'A quiz: a simultaneous ten-question duel with three difficulties and a 600-question bank that never repeats',
      ],
    },
    {
      group: 'Staying close',
      items: [
        'Typed and voice letters that arrive one to three hours later, like mail',
        'Scheduled letters up to 30 days out, and slideshow letters with photos and a song',
        'Habits that earn points, spent on gifts you can send',
        'Real-time chat with read receipts and photo messages',
        'A shared calendar with RSVPs and anniversaries, plus private lists for planning surprises',
      ],
    },
    {
      group: 'Account and trust',
      items: [
        'Google and email sign-in with bot protection',
        'An install guide with steps for each platform',
        'Six theme presets plus custom backgrounds that recolor the app',
        'Lifecycle emails (pairing nudges and win-backs) with one-click unsubscribe',
        'One plan covers both partners',
      ],
    },
  ],

  hardParts: [
    {
      title: 'Screen share that played frozen or silent on phones',
      problem:
        "The shared-screen video has to stay unmuted, because it carries the tab's sound as well as the picture. Mobile browsers block unmuted autoplay, so playback failed silently on phones. The viewer saw a frozen or black tile and assumed screen share was broken.",
      solution:
        'When the browser refuses unmuted playback, the tile now retries muted so the picture always shows, and the existing "tap to enable sound" control unmutes inside the tap that follows. The same fix repaired the remote camera tile, which had the same root cause nobody had connected yet.',
    },
    {
      title: 'iOS cannot make a call full screen',
      problem:
        "The full-screen button did nothing on an iPhone. iOS Safari only allows native full screen on a single video element, which also brings its own controls and hides both faces on the call. The standard approach on the call container does nothing on iOS.",
      solution:
        'An immersive mode in plain CSS: one class on the room hides the header, controls, chat and hints, leaving the shared video, the two face tiles and one exit button. Desktop still gets native full screen on top, and a guard stops a stray iOS event from tearing the layout down mid-call.',
    },
    {
      title: 'Keeping a live quiz in sync on two phones in different countries',
      problem:
        'The first five games are turn-based, so a slow connection just means a slow turn. The quiz is not: both players should see the same question at the same moment and race the clock. A "start when you open it" design breaks as soon as one player opens it five minutes early, and two independent phone clocks cannot share a countdown on their own.',
      solution:
        'Three parts. A lobby handshake: opening the game pings a ready state every 8 seconds, and the match starts only when both players have pinged within 15 seconds. A shared clock: the server stamps one start time, and both phones work out every question\'s time slot from that single stamp, corrected against the server and ignoring any stale value more than 30 seconds off. And disconnect safety: the timeline never pauses, and if a player never comes back, the other phone settles the match after a grace period instead of leaving it stuck.',
    },
    {
      title: 'Getting video through two carrier networks in different countries',
      problem:
        'Peer-to-peer video without a relay works on the same network or similar ones. It does not reliably get through two different mobile carriers in different countries, which is exactly the setup this app exists for. Early calls connected on paper and never saw or heard each other.',
      solution:
        'A Cloudflare TURN relay as the fallback, with short-lived credentials minted by an endpoint so the secret never reaches the browser. The relay is the difference between a demo that works on one network and a product that works for its real use. It was later shared so the family version could use the same relay.',
    },
    {
      title: 'Live presence without one update erasing another',
      problem:
        'The Room shows which door the other person is behind, live, and clears it the moment they leave. The presence service replaces the whole payload on every update instead of merging, so two parts of the app each sending their own field would quietly overwrite each other.',
      solution:
        'One helper now sends the full payload every time, and the room field exists only while someone is inside a room, so it clears itself on leave. Any presence field added later goes through the same single writer.',
    },
  ],

  outcome: {
    body: [
      'The app is live with public signup, more than 800 registered users and a working paid tier, with a manual payment flow I built and approve myself. It shipped more than 40 versioned releases in about six weeks, most of them same-day fixes or features asked for during a real call.',
      'The architecture held up well enough to fork. A family version, with chores, a shared calendar, group chat and six-person video, launched on its own domain and its own database, reusing the same core: the generic games table, the presence system, the video relay and the pull loop that brings people back.',
      'It still runs on the test that started it: does this work for two people in different time zones. Every feature that touches live video or synced state gets a real two-device pass across that gap before it ships.',
    ],
  },

  lessons: [
    'Build for one real user with a real constraint before building for a market. The constraint does the product design for you.',
    'An error inside a database function rolls back every write in that call, including counters. Measure security counters after the fact.',
    'Never send per-frame animation, like face tracking, through a UI framework\'s state. It loses the race with the render loop every time.',
    'A reminder that fires once and never again is not a retention feature. Build the recheck loop before calling it done.',
    'Ship as a web app when the goal is fast changes for real users who test them that same night. App store reviews are the wrong trade for that loop.',
  ],

  proof:
    'This app shows live video, real-time multiplayer sync, a working payment and admin flow and a second production fork, built and shipped by one person. If you need something real-time, multi-user or video-based built and in front of real users, this is the proof.',

  palette: 'mist',
};
