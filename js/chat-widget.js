/* NeilOS — floating AI assistant for busqueneil.com.
 * Self-injecting: drop one <script src="/js/chat-widget.js" defer> on a page and
 * it builds its own DOM. Talks to the Orbit `chat` edge function, which runs the
 * conversation and pushes captured leads into Neil's CRM. Vanilla, no deps. */
(function () {
  'use strict';

  var CONFIG = {
    // Orbit (Supabase) chat function. ANON_KEY is the public publishable key.
    ENDPOINT: 'https://cubglfkgnjvlwelkmnbh.supabase.co/functions/v1/chat',
    ANON_KEY: 'sb_publishable_vxcbGxMEjdCxYm77sOwldg_hkWcIRbO',
    WHATSAPP: 'https://wa.me/19083164140',
    STORE_KEY: 'neilos_chat_v1',
    GREETING:
      "Hey, I'm NeilOS, Neil's AI assistant. Ask me anything about Neil, what he builds, or how he can help. What brings you here?",
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
    '<div class="nc-panel" role="dialog" aria-label="Chat with NeilOS" aria-hidden="true">' +
      '<header class="nc-head">' +
        '<div class="nc-id">' +
          '<span class="nc-dot" aria-hidden="true"></span>' +
          '<div><strong>NeilOS</strong><span class="nc-sub">Neil\'s AI assistant</span></div>' +
        '</div>' +
        '<div class="nc-head-actions">' +
          '<a class="nc-wa" href="' + CONFIG.WHATSAPP + '" target="_blank" rel="noopener" title="Message Neil on WhatsApp" aria-label="Message Neil on WhatsApp">' +
            waSvg() +
          '</a>' +
          '<button class="nc-x" type="button" aria-label="Close chat">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          '</button>' +
        '</div>' +
      '</header>' +
      '<div class="nc-log" aria-live="polite"></div>' +
      '<form class="nc-form">' +
        '<input class="nc-input" type="text" autocomplete="off" placeholder="Type your message..." aria-label="Your message" maxlength="1000" />' +
        '<button class="nc-send" type="submit" aria-label="Send">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
        '</button>' +
      '</form>' +
    '</div>' +
    '<button class="nc-launch" type="button" aria-expanded="false" aria-label="Chat with NeilOS, Neil\'s AI assistant">' +
      '<span class="nc-launch-pulse" aria-hidden="true"></span>' +
      '<span class="nc-launch-icon nc-launch-open" aria-hidden="true">' +
        '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' +
      '</span>' +
      '<span class="nc-launch-icon nc-launch-close" aria-hidden="true">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</span>' +
    '</button>' +
    '<span class="nc-teaser" aria-hidden="true">Ask NeilOS anything</span>';
  document.body.appendChild(root);

  var panel = root.querySelector('.nc-panel');
  var launch = root.querySelector('.nc-launch');
  var log = root.querySelector('.nc-log');
  var form = root.querySelector('.nc-form');
  var input = root.querySelector('.nc-input');
  var teaser = root.querySelector('.nc-teaser');

  /* ── render ──────────────────────────────────────────────────────── */
  function bubble(role, text) {
    var el = document.createElement('div');
    el.className = 'nc-msg nc-' + (role === 'user' ? 'me' : 'bot');
    el.textContent = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
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
        typing(false);
        if (data && data.reply) {
          state.messages.push({ role: 'assistant', content: data.reply });
          bubble('assistant', data.reply);
        }
        if (data && data.saved) {
          state.saved = true;
          state.contact_id = data.contact_id || state.contact_id;
        }
        if (data && data.lead) state.lead = data.lead;
        saveState();
      })
      .catch(function () {
        typing(false);
        bubble('assistant',
          "Sorry, I hit a snag. You can reach Neil directly on WhatsApp or at neil@busqueneil.com.");
      })
      .finally(function () {
        busy = false;
        input.disabled = false;
        if (opened) input.focus();
      });
  }

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
  function waSvg() {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488"/></svg>';
  }
})();
