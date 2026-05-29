/* busqueneil.com funnel forms (/help, /build, /ria).
 * Submits any <form data-lead-form="..."> as JSON to the Orbit form-lead
 * endpoint (contact + New Lead deal), then redirects to the form's action
 * (the /thanks/ page). Replaces Netlify Forms after the move to Vercel. */
(function () {
  'use strict';
  // Branded same-origin path → Vercel rewrites to Orbit's `form-lead` edge fn.
  // Falls back to direct Supabase URL on localhost (no rewrite in dev).
  var ENDPOINT = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'https://cubglfkgnjvlwelkmnbh.supabase.co/functions/v1/form-lead'
    : '/api/form-lead';
  var ANON = 'sb_publishable_vxcbGxMEjdCxYm77sOwldg_hkWcIRbO';

  document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = { form: form.getAttribute('data-lead-form') };
      new FormData(form).forEach(function (value, key) {
        if (key === 'bot-field' || key === 'bot_field') { data.bot_field = value; return; }
        if (key === 'form-name') return;
        if (data[key] !== undefined) {
          if (!Array.isArray(data[key])) data[key] = [data[key]];
          data[key].push(value);
        } else {
          data[key] = value;
        }
      });

      var btn = form.querySelector('[type="submit"]');
      if (btn) { btn.dataset.old = btn.textContent; btn.disabled = true; btn.textContent = 'Sending...'; }
      clearError(form);

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: ANON, Authorization: 'Bearer ' + ANON },
        body: JSON.stringify(data),
      })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (jb) { return { ok: r.ok, body: jb }; }); })
        .then(function (res) {
          if (res.ok && res.body && res.body.ok) {
            window.location.href = form.getAttribute('action') || '/';
          } else {
            throw new Error((res.body && res.body.error) || 'submit failed');
          }
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = btn.dataset.old || 'Submit'; }
          showError(form);
        });
    });
  });

  function clearError(form) {
    var m = form.querySelector('.lead-form-error');
    if (m) m.remove();
  }
  function showError(form) {
    var m = document.createElement('p');
    m.className = 'lead-form-error';
    m.setAttribute('role', 'alert');
    m.style.cssText = 'color:#dc2626;margin-top:0.75rem;font-size:14px;';
    m.textContent = 'Something went wrong. Email busqueneil@gmail.com or try again.';
    form.appendChild(m);
  }
})();
