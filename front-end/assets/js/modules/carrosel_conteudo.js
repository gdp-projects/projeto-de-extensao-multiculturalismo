// === Carrosséis desktop 100% funcionais e sincronizados ===
document.querySelectorAll('.carrossel-desktop').forEach(carrossel => {
  const faixa = carrossel.querySelector('.faixa-eventos');
  const btnEsq = carrossel.querySelector('.seta-esquerda');
  const btnDir = carrossel.querySelector('.seta-direita');

  if (!faixa || !btnEsq || !btnDir) return;

  // Ativa rolagem interna; permite interações (cliques) nos elementos filhos.
  // Antes aqui era usado `pointerEvents = "none"` para bloquear arrastar manual,
  // porém isso também impedia cliques nos eventos. Para manter boa UX, permitimos
  // pointer events e evitamos seleção de texto durante arraste com userSelect.
  faixa.style.overflowX = "auto";
  faixa.style.scrollBehavior = "smooth";
  faixa.style.pointerEvents = "auto"; // permite clicks nos itens do carrossel
  faixa.style.userSelect = "none"; // evita seleção indesejada ao arrastar
  // Previne scroll por roda do mouse se quiser manter controle apenas pelas setas
  faixa.addEventListener("wheel", e => e.preventDefault(), { passive: false });

  const scrollStep = () => faixa.querySelector('.evento')?.offsetWidth + 18 || 260;

  const atualizarSetas = () => {
    const maxScroll = faixa.scrollWidth - faixa.clientWidth;
    const pos = faixa.scrollLeft;
    btnEsq.style.opacity = pos <= 10 ? '0.3' : '1';
    btnDir.style.opacity = pos >= maxScroll - 10 ? '0.3' : '1';
  };

  btnDir.addEventListener('click', () => {
    faixa.scrollBy({ left: scrollStep() * 2, behavior: 'smooth' });
  });

  btnEsq.addEventListener('click', () => {
    faixa.scrollBy({ left: -scrollStep() * 2, behavior: 'smooth' });
  });

  faixa.addEventListener('scroll', atualizarSetas);
  window.addEventListener('resize', atualizarSetas);
  atualizarSetas();
});
