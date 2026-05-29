/* Neil AI — floating AI assistant for busqueneil.com.
 * Self-injecting: drop one <script src="/js/chat-widget.js" defer> on a page and
 * it builds its own DOM. Talks to the Orbit `chat` edge function, which runs the
 * conversation and pushes captured leads into Neil's CRM. Vanilla, no deps. */
(function () {
  'use strict';

  var CONFIG = {
    // Branded same-origin path → Vercel rewrites to Orbit's `chat` edge fn.
    // Falls back to direct Supabase URL on localhost (no rewrite in dev).
    ENDPOINT: (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
      ? 'https://cubglfkgnjvlwelkmnbh.supabase.co/functions/v1/chat'
      : '/api/chat',
    ANON_KEY: 'sb_publishable_vxcbGxMEjdCxYm77sOwldg_hkWcIRbO',
    WHATSAPP: 'https://wa.me/19083164140',
    SMS: 'sms:+19083164140',
    STORE_KEY: 'neilos_chat_v1',
    GREETING:
      "Hey, I'm Neil AI, Neil's assistant. Ask me anything about Neil, what he builds, or how he can help. What brings you here?",
  };

  if (document.getElementById('neilos-chat')) return; // guard against double-load

  /* ── persisted session state ─────────────────────────────────────── */
  var state = loadState();

  function loadState() {
    try {
      var s = JSON.parse(localStorage.getItem(CONFIG.STORE_KEY) || 'null');
      if (s && s.session_id && Array.isArray(s.messages)) return s;
    } catch (e) {}
    return { session_id: uuid(), messages: [], saved: false, contact_id: null, lead: null };
  }
  function saveState() {
    try { localStorage.setItem(CONFIG.STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function uuid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /* ── DOM ─────────────────────────────────────────────────────────── */
  var root = document.createElement('div');
  root.id = 'neilos-chat';
  root.innerHTML =
    '<div class="nc-panel" role="dialog" aria-label="Chat with Neil AI" aria-hidden="true">' +
      '<header class="nc-head">' +
        '<div class="nc-id">' +
          '<span class="nc-dot" aria-hidden="true"></span>' +
          '<div><strong>Neil AI</strong><span class="nc-sub">Neil\'s assistant</span></div>' +
        '</div>' +
        '<div class="nc-head-actions">' +
          '<a class="nc-act nc-sms" href="' + CONFIG.SMS + '" title="Text Neil at 908-316-4140" aria-label="Text Neil at 908-316-4140">' +
            smsSvg() +
          '</a>' +
          '<a class="nc-act nc-wa" href="' + CONFIG.WHATSAPP + '" target="_blank" rel="noopener" title="Message Neil on WhatsApp" aria-label="Message Neil on WhatsApp">' +
            waSvg() +
          '</a>' +
          '<button class="nc-x" type="button" aria-label="Close chat">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          '</button>' +
        '</div>' +
      '</header>' +
      '<div class="nc-log" aria-live="polite"></div>' +
      '<div class="nc-tip" role="status" aria-live="polite"></div>' +
      '<form class="nc-form">' +
        '<button class="nc-mic" type="button" aria-label="Speak your message" title="Speak your message" hidden>' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>' +
        '</button>' +
        '<input class="nc-input" type="text" name="message" autocomplete="off" autocorrect="on" autocapitalize="sentences" spellcheck="true" inputmode="text" enterkeyhint="send" data-1p-ignore="true" data-lpignore="true" data-form-type="other" placeholder="Type your message..." aria-label="Your message" maxlength="1000" />' +
        '<button class="nc-send" type="submit" aria-label="Send">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
        '</button>' +
      '</form>' +
    '</div>' +
    '<button class="nc-launch" type="button" aria-expanded="false" aria-label="Chat with Neil AI">' +
      '<span class="nc-launch-pulse" aria-hidden="true"></span>' +
      '<span class="nc-launch-icon nc-launch-open" aria-hidden="true">' +
        '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' +
      '</span>' +
      '<span class="nc-launch-icon nc-launch-close" aria-hidden="true">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</span>' +
    '</button>' +
    '<span class="nc-teaser" aria-hidden="true">Ask Neil AI anything</span>';
  document.body.appendChild(root);

  var panel = root.querySelector('.nc-panel');
  var launch = root.querySelector('.nc-launch');
  var log = root.querySelector('.nc-log');
  var form = root.querySelector('.nc-form');
  var input = root.querySelector('.nc-input');
  var teaser = root.querySelector('.nc-teaser');
  var micBtn = root.querySelector('.nc-mic');
  var tip = root.querySelector('.nc-tip');

  // Loud, unmissable feedback for status/errors (replaces the easy-to-miss
  // placeholder text). Auto-hides after `ms`.
  var tipTimer;
  function showTip(msg, ms) {
    clearTimeout(tipTimer);
    tip.textContent = msg;
    tip.classList.add('is-show');
    tipTimer = setTimeout(function () { tip.classList.remove('is-show'); }, ms || 3200);
  }

  /* ── render ──────────────────────────────────────────────────────── */
  function bubble(role, text) {
    var el = document.createElement('div');
    el.className = 'nc-msg nc-' + (role === 'user' ? 'me' : 'bot');
    if (role === 'user') {
      el.textContent = text;          // user text never rendered as HTML
    } else {
      el.innerHTML = linkify(text);   // make links/phones/emails clickable
    }
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  // Escape HTML, then turn URLs, wa.me links, emails, and US phone numbers into
  // clickable anchors. Operates on already-escaped text so it is injection-safe.
  function linkify(raw) {
    var s = String(raw)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    // URLs (http/https)
    s = s.replace(/\bhttps?:\/\/[^\s<]+[^\s<.,!?)]/g, function (u) {
      var href = u, label = u.replace(/^https?:\/\//, '');
      var tgt = /wa\.me|whatsapp/i.test(u) ? ' target="_blank" rel="noopener"' : ' target="_blank" rel="noopener"';
      return '<a href="' + href + '"' + tgt + '>' + label + '</a>';
    });
    // Emails
    s = s.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, function (e) {
      return '<a href="mailto:' + e + '">' + e + '</a>';
    });
    // US phone numbers like 908-316-4140 / (908) 316-4140 / +1 908 316 4140
    s = s.replace(/(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g, function (p) {
      var digits = p.replace(/[^\d]/g, '');
      var tel = digits.length === 10 ? '1' + digits : digits;
      return '<a href="sms:+' + tel + '">' + p + '</a>';
    });
    return s;
  }
  function typing(on) {
    var t = log.querySelector('.nc-typing');
    if (on && !t) {
      t = document.createElement('div');
      t.className = 'nc-msg nc-bot nc-typing';
      t.innerHTML = '<span></span><span></span><span></span>';
      log.appendChild(t);
      log.scrollTop = log.scrollHeight;
    } else if (!on && t) {
      t.remove();
    }
  }
  function renderHistory() {
    log.innerHTML = '';
    if (!state.messages.length) {
      bubble('assistant', CONFIG.GREETING);
    } else {
      state.messages.forEach(function (m) { bubble(m.role, m.content); });
    }
  }

  /* ── open / close ────────────────────────────────────────────────── */
  var opened = false;
  function open() {
    opened = true;
    root.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    launch.setAttribute('aria-expanded', 'true');
    if (teaser) teaser.remove();
    renderHistory();
    setTimeout(function () { input.focus(); }, 80);
  }
  function close() {
    root.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    launch.setAttribute('aria-expanded', 'false');
  }
  launch.addEventListener('click', function () {
    root.classList.contains('is-open') ? close() : open();
  });
  root.querySelector('.nc-x').addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('is-open')) close();
  });

  /* ── send ────────────────────────────────────────────────────────── */
  var busy = false;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text || busy) return;
    input.value = '';
    state.messages.push({ role: 'user', content: text });
    saveState();
    bubble('user', text);
    sendTurn();
  });

  function sendTurn(opts) {
    opts = opts || {};
    busy = true;
    input.disabled = true;
    typing(true);
    return fetch(CONFIG.ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: CONFIG.ANON_KEY,
        Authorization: 'Bearer ' + CONFIG.ANON_KEY,
      },
      body: JSON.stringify({
        session_id: state.session_id,
        messages: state.messages,
        already_saved: !!state.saved,
        final: !!opts.final,
      }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.saved) {
          state.saved = true;
          state.contact_id = data.contact_id || state.contact_id;
        }
        if (data && data.lead) state.lead = data.lead;
        var list = (data && data.replies && data.replies.length)
          ? data.replies
          : (data && data.reply ? [data.reply] : []);
        return renderReplies(list);
      })
      .catch(function () {
        typing(false);
        bubble('assistant',
          "Sorry, I hit a snag. You can text Neil at 908-316-4140 or email neil@busqueneil.com.");
      })
      .finally(function () {
        busy = false;
        input.disabled = false;
        if (opened) input.focus();
      });
  }

  // Render assistant messages one after another with a short, human-feeling
  // pause. Kept snappy so the chat does not feel sluggish.
  function renderReplies(list) {
    return new Promise(function (resolve) {
      var i = 0;
      function next() {
        if (i >= list.length) { typing(false); resolve(); return; }
        var msg = String(list[i++]).trim();
        if (!msg) { next(); return; }
        typing(true);
        var delay = i === 1 ? 80 : Math.min(550, 160 + msg.length * 7);
        setTimeout(function () {
          typing(false);
          state.messages.push({ role: 'assistant', content: msg });
          bubble('assistant', msg);
          saveState();
          setTimeout(next, i < list.length ? 120 : 0);
        }, delay);
      }
      next();
    });
  }

  /* ── voice input (Web Speech API) ────────────────────────────────── */
  // The mic button is always visible so the affordance is consistent. If
  // speech recognition isn't usable on this browser (Firefox / any non-Safari
  // browser on iOS / Brave with shields) we show a clear in-panel tip on tap.
  (function initVoice() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    micBtn.hidden = false;
    var ua = navigator.userAgent || '';
    var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    // On iOS, only real Safari exposes webkitSpeechRecognition. Chrome (CriOS),
    // Edge (EdgiOS), Firefox (FxiOS), and any in-app browser do not.
    var isIOSNonSafari = isIOS && /CriOS|FxiOS|EdgiOS|YaBrowser|OPiOS|GSA/i.test(ua);

    if (!SR || isIOSNonSafari) {
      micBtn.classList.add('is-disabled');
      var msg = isIOSNonSafari
        ? 'Voice only works in Safari on iPhone. Open this page in Safari to speak.'
        : "Voice isn't supported in this browser. Try Chrome or Safari.";
      micBtn.addEventListener('click', function () { showTip(msg); });
      return;
    }

    var rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.continuous = false;
    var listening = false;
    var baseText = '';

    micBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (listening) { try { rec.stop(); } catch (err) {} return; }
      baseText = input.value ? input.value.trim() + ' ' : '';
      // Drop keyboard focus so the on-screen keyboard does not fight the mic.
      try { input.blur(); } catch (err) {}
      try { rec.start(); }
      catch (err) { showTip("Couldn't start the mic. Try again."); }
    });
    rec.onstart = function () {
      listening = true; micBtn.classList.add('is-listening');
      input.placeholder = 'Listening... speak now';
      showTip('🎙 Listening... speak now', 1800);
    };
    rec.onend = function () {
      listening = false; micBtn.classList.remove('is-listening');
      input.placeholder = 'Type your message...';
      if (opened) input.focus();
    };
    rec.onerror = function (e) {
      listening = false; micBtn.classList.remove('is-listening');
      input.placeholder = 'Type your message...';
      var msg = '';
      if (e && e.error === 'not-allowed') msg = 'Mic permission denied. Allow it in iPhone Settings > Safari > Microphone.';
      else if (e && e.error === 'no-speech') msg = "Didn't catch that. Tap the mic and try again.";
      else if (e && e.error === 'audio-capture') msg = 'No microphone found.';
      else if (e && e.error === 'service-not-allowed') msg = 'Voice service blocked by this browser.';
      else if (e && e.error) msg = 'Mic error: ' + e.error;
      if (msg) showTip(msg);
    };
    rec.onresult = function (e) {
      var txt = '';
      for (var i = e.resultIndex; i < e.results.length; i++) txt += e.results[i][0].transcript;
      input.value = (baseText + txt).slice(0, 1000);
    };
  })();

  /* ── leave / abandon capture ─────────────────────────────────────── */
  // If the visitor leaves with a real but unsaved conversation, flush it so the
  // lead still lands in Orbit. keepalive lets the request outlive the page.
  var flushed = false;
  function flushOnLeave() {
    if (flushed || state.saved) return;
    if (!state.messages.some(function (m) { return m.role === 'user'; })) return;
    flushed = true;
    try {
      fetch(CONFIG.ENDPOINT, {
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
          apikey: CONFIG.ANON_KEY,
          Authorization: 'Bearer ' + CONFIG.ANON_KEY,
        },
        body: JSON.stringify({
          session_id: state.session_id,
          messages: state.messages,
          already_saved: !!state.saved,
          final: true,
        }),
      });
    } catch (e) {}
  }
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') flushOnLeave();
  });
  window.addEventListener('pagehide', flushOnLeave);

  /* ── inline svg ──────────────────────────────────────────────────── */
  function smsSvg() {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
  }
  function waSvg() {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488"/></svg>';
  }
})();
