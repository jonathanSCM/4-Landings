/* Landing ProShop · Software para fábricas (estática, sin backend).
   El formulario valida y entrega la solicitud por WhatsApp con el mensaje armado. */
(function () {
  'use strict';

  /* ===== Configuración (confirmar antes de publicar) ===== */
  var CONFIG = {
    whatsapp: '51900534161', // PENDIENTE: confirmar operativamente +51 900 534 161
    waText: 'Hola, llego desde la landing de software para fábricas. Quiero un diagnóstico gratuito para mejorar el control de producción.',
    landing: 'software-fabricas',
    gtmId: '' // PENDIENTE: GTM-XXXXXXX. Vacío = no se carga GTM
  };

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  /* ===== Medición ===== */
  window.dataLayer = window.dataLayer || [];
  function track(event, extra) {
    var e = { event: event, landing: CONFIG.landing };
    for (var k in extra || {}) e[k] = extra[k];
    window.dataLayer.push(e);
  }

  /* Atribución: primera llegada de la sesión */
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid'];
  var attr = {};
  try { attr = JSON.parse(sessionStorage.getItem('attr') || '{}'); } catch (e) {}
  var q = new URLSearchParams(location.search);
  KEYS.forEach(function (k) { if (q.get(k)) attr[k] = q.get(k).slice(0, 200); });
  if (!attr.landing_url) { attr.landing_url = location.href; attr.referrer = document.referrer || ''; }
  try { sessionStorage.setItem('attr', JSON.stringify(attr)); } catch (e) {}

  /* ===== Consentimiento (Consent Mode v2) + GTM ===== */
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });
  var gtmLoaded = false;
  function loadGTM() {
    if (gtmLoaded || !CONFIG.gtmId) return;
    gtmLoaded = true;
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(CONFIG.gtmId);
    document.head.appendChild(s);
  }
  function applyConsent(v) {
    var g = v === 'granted' ? 'granted' : 'denied';
    gtag('consent', 'update', { ad_storage: g, analytics_storage: g, ad_user_data: g, ad_personalization: g });
    if (v === 'granted') loadGTM();
  }
  var ck = $('#cookie');
  function answer(v) {
    try { localStorage.setItem('cookie_consent', v); } catch (e) {}
    ck.hidden = true;
    applyConsent(v);
    track('cookie_consent', { choice: v });
  }
  if (ck) {
    $('#ck-yes').addEventListener('click', function () { answer('granted'); });
    $('#ck-no').addEventListener('click', function () { answer('denied'); });
    var abrir = $('#ck-open');
    if (abrir) abrir.addEventListener('click', function () { ck.hidden = false; });
    var saved = null;
    try { saved = localStorage.getItem('cookie_consent'); } catch (e) {}
    if (saved) applyConsent(saved); else ck.hidden = false;
  }

  track('landing_view');

  /* ===== Tema ===== */
  $$('[data-boton-tema]').forEach(function (b) {
    b.addEventListener('click', function () {
      var root = document.documentElement;
      var oscuro = root.dataset.tema ? root.dataset.tema === 'oscuro' : matchMedia('(prefers-color-scheme: dark)').matches;
      root.dataset.tema = oscuro ? 'claro' : 'oscuro';
      try { localStorage.setItem('tema', root.dataset.tema); } catch (e) {}
    });
  });

  /* ===== CTA y WhatsApp (clic WhatsApp = intención, no conversión) ===== */
  var waBase = 'https://wa.me/' + CONFIG.whatsapp + '?text=';
  $$('a.btn-wa').forEach(function (a) { if (!a.hasAttribute('data-wa-lead')) a.href = waBase + encodeURIComponent(CONFIG.waText); });
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest('[data-evento]');
    if (a) track(a.dataset.evento, { ubicacion: a.dataset.ubicacion || '' });
  });

  /* CTA fijo móvil: se oculta con el formulario en pantalla */
  var sticky = $('#sxSticky'), conv = $('#diagnostico');
  if (sticky && conv && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { sticky.classList.toggle('oculto', en[0].isIntersecting); }, { threshold: 0.15 }).observe(conv);
  }

  /* ===== Formulario → WhatsApp ===== */
  var form = $('#leadForm');
  if (!form) return;
  var err = $('#leadErr'), ok = $('#leadOk'), iniciado = false;

  form.addEventListener('focusin', function () { if (!iniciado) { iniciado = true; track('lead_form_start'); } });

  function limpiar(v, max) { return String(v || '').replace(/[<>]/g, '').trim().slice(0, max); }
  function fallo(msg, campo) {
    err.textContent = msg; err.hidden = false;
    if (campo) { campo.setAttribute('aria-invalid', 'true'); campo.focus(); }
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    err.hidden = true;
    $$('#leadForm [aria-invalid]').forEach(function (c) { c.removeAttribute('aria-invalid'); });
    var f = form.elements;

    if (f.sitio_web.value) return; // honeypot: bot
    var req = ['nombre', 'empresa', 'actividad'];
    for (var i = 0; i < req.length; i++) {
      if (!f[req[i]].value.trim()) return fallo('Completa los campos obligatorios.', f[req[i]]);
    }
    var tel = '+' + f.telefono.value.replace(/\D/g, '');
    if (!/^\+\d{8,15}$/.test(tel)) return fallo('Ingresa tu WhatsApp con código de país, por ejemplo +51 987 654 321.', f.telefono);
    if (!f.consentimiento.checked) return fallo('Necesitamos tu consentimiento para contactarte.', f.consentimiento);

    var ref = Math.random().toString(36).slice(2, 10);
    var necesidad = limpiar(f.necesidad.value, 800);
    var lineas = [
      CONFIG.waText, '',
      'Nombre: ' + limpiar(f.nombre.value, 120),
      'Empresa: ' + limpiar(f.empresa.value, 160),
      'Actividad: ' + limpiar(f.actividad.value, 120),
      'WhatsApp: ' + tel
    ];
    if (necesidad) lineas.push('Necesito mejorar: ' + necesidad);
    var origen = attr.utm_campaign || attr.utm_source || (attr.gclid ? 'google-ads' : '');
    if (origen) lineas.push('Origen: ' + origen);
    lineas.push('Ref: ' + ref);
    var url = waBase + encodeURIComponent(lineas.join('\n'));

    // Sin backend no hay confirmación de servidor: generate_lead marca el envío
    // válido del formulario; la conversación real ocurre en WhatsApp.
    track('generate_lead', { lead_ref: ref, canal_entrega: 'whatsapp' });

    form.hidden = true;
    ok.hidden = false;
    ok.focus();
    var btn = ok.querySelector('[data-wa-lead]');
    if (btn) btn.href = url;
    setTimeout(function () { location.href = url; }, 1500);
  });
})();
