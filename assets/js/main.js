(() => {
  const guideV = document.getElementById('guideV');
  const guideH = document.getElementById('guideH');
  const dot = document.getElementById('dot');
  const readout = document.getElementById('readout');
  const btnPt = document.getElementById('btnPt');
  const btnEn = document.getElementById('btnEn');
  const heroPt = document.getElementById('heroPt');
  const heroEn = document.getElementById('heroEn');
  const labelProdutos = document.getElementById('labelProdutos');
  const labelProjetos = document.getElementById('labelProjetos');

  const pad4 = (n) => String(Math.round(n)).padStart(4, '0');

  // Crosshair guides + coordinate readout, throttled to one update per frame.
  let guideRaf = null;
  let idleTimer = null;

  function onGuideMove(e) {
    const x = e.clientX;
    const y = e.clientY;
    if (guideRaf) return;
    guideRaf = requestAnimationFrame(() => {
      guideRaf = null;
      guideV.style.transform = `translate3d(${x}px,0,0)`;
      guideH.style.transform = `translate3d(0,${y}px,0)`;
      readout.textContent = `${pad4(x)} · ${pad4(y)}`;
      [guideV, guideH, readout].forEach((el) => { el.style.opacity = '1'; });
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        [guideV, guideH, readout].forEach((el) => { el.style.opacity = '0'; });
      }, 1000);
    });
  }

  window.addEventListener('mousemove', onGuideMove, { passive: true });

  // Trailing dot: eases toward the cursor, flattens into a dash over links.
  let mx = 0;
  let my = 0;
  let dx = 0;
  let dy = 0;
  let trailRaf = null;

  function tick() {
    trailRaf = requestAnimationFrame(() => {
      trailRaf = null;
      dx += (mx - dx) * 0.07;
      dy += (my - dy) * 0.07;
      dot.style.transform = `translate3d(${dx}px,${dy}px,0)`;
      if (Math.abs(mx - dx) > 0.4 || Math.abs(my - dy) > 0.4) tick();
    });
  }

  function onTrailMove(e) {
    mx = e.clientX;
    my = e.clientY;
    const overLink = e.target.closest && e.target.closest('a');
    dot.style.opacity = '1';
    dot.classList.toggle('dot--link', Boolean(overLink));
    if (!trailRaf) tick();
  }

  window.addEventListener('mousemove', onTrailMove, { passive: true });

  // Language toggle
  function setLang(lang) {
    const isEn = lang === 'en';
    heroPt.hidden = isEn;
    heroEn.hidden = !isEn;
    btnPt.classList.toggle('lang__btn--active', !isEn);
    btnEn.classList.toggle('lang__btn--active', isEn);
    labelProdutos.textContent = isEn ? 'products' : 'produtos';
    labelProjetos.textContent = isEn ? 'projects' : 'projetos';
    document.documentElement.lang = isEn ? 'en' : 'pt';
  }

  btnPt.addEventListener('click', () => setLang('pt'));
  btnEn.addEventListener('click', () => setLang('en'));
})();
