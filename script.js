

document.addEventListener('DOMContentLoaded', () => {


  const btnVerMais = document.querySelector('.btn-ver-mais');
  if (btnVerMais) {
    btnVerMais.addEventListener('click', () => {
      alert('Em breve: mais conteúdo do Portal GeoDuc!');
    });
  }

  const btnHelpText   = document.querySelector('.btn-help-text');
  const btnHelpAvatar = document.querySelector('.btn-help-avatar');

  function openHelp() {
    const badge = document.querySelector('.badge');
    if (badge) {
      badge.style.transform = 'scale(0)';
      badge.style.transition = 'transform 0.2s ease';
      setTimeout(() => badge.remove(), 200);
    }
    alert('Chat de suporte: em breve disponível!');
  }

  btnHelpText  ?.addEventListener('click', openHelp);
  btnHelpAvatar?.addEventListener('click', openHelp);

  const btnSearch = document.querySelector('.btn-search');
  if (btnSearch) {
    btnSearch.addEventListener('click', () => {
      const query = prompt('O que você deseja buscar?');
      if (query && query.trim()) {
        // Substituir futuramente pela rota de busca real
        console.log('Busca por:', query.trim());
        alert(`Buscando por: "${query.trim()}" — funcionalidade em desenvolvimento.`);
      }
    });
  }

  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });


  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = '0 2px 20px rgba(107,26,26,0.12)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }, { passive: true });

  document.querySelectorAll('.btn-auth').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const action = btn.textContent.trim();
      alert(`"${action}" — página em construção.`);
    });
  });

});