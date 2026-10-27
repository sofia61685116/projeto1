// ============================================================
// AVATAR: inicial em degradê + troca de foto de perfil
// ============================================================

function configurarTrocaDeFoto(){
  const avatar = document.getElementById('avatar');
  const initialEl = document.getElementById('avatar-initial');
  const photoInput = document.getElementById('photo-input');
  const chooseBtn = document.getElementById('choose-photo-btn');
  const removeBtn = document.getElementById('remove-photo-btn');
  if(!avatar || !photoInput || !chooseBtn || !removeBtn) return;

  const STORAGE_KEY = 'emanuelly-avatar-photo';

  function showPhoto(dataUrl){
    let img = avatar.querySelector('img.custom-photo');
    if(!img){
      img = document.createElement('img');
      img.className = 'custom-photo';
      avatar.insertBefore(img, avatar.firstChild);
    }
    img.src = dataUrl;
    if(initialEl) initialEl.style.display = 'none';
    removeBtn.style.display = 'inline-block';
    chooseBtn.textContent = 'Trocar foto de novo';
  }

  function showInitialAvatar(){
    const img = avatar.querySelector('img.custom-photo');
    if(img) img.remove();
    if(initialEl) initialEl.style.display = 'flex';
    removeBtn.style.display = 'none';
    chooseBtn.textContent = 'Trocar foto';
  }

  chooseBtn.addEventListener('click', () => photoInput.click());

  photoInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      showPhoto(dataUrl);
      try{ localStorage.setItem(STORAGE_KEY, dataUrl); }catch(err){ /* segue só na sessão */ }
    };
    reader.readAsDataURL(file);
  });

  removeBtn.addEventListener('click', () => {
    showInitialAvatar();
    try{ localStorage.removeItem(STORAGE_KEY); }catch(err){}
  });

  try{
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved) showPhoto(saved);
  }catch(err){ /* segue com o avatar padrão */ }
}

// ============================================================
// RESPONSIVIDADE
// ============================================================
// A maior parte fica no style.css (media queries). Aqui tratamos o
// que o CSS puro não resolve bem: altura real da tela no mobile
// (barra de endereço que aparece/some) e classes de tamanho de tela
// para ajustes finos via JS, se precisar.

function ajustarAlturaReal(){
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--real-vh', `${vh}px`);
}

function definirClasseDeTela(){
  const largura = window.innerWidth;
  const body = document.body;
  body.classList.remove('tela-pequena', 'tela-media', 'tela-grande');
  if (largura <= 520){
    body.classList.add('tela-pequena');
  } else if (largura <= 900){
    body.classList.add('tela-media');
  } else {
    body.classList.add('tela-grande');
  }
}

function comDebounce(fn, espera){
  let timer;
  return function(...args){
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), espera);
  };
}

function iniciarResponsividade(){
  ajustarAlturaReal();
  definirClasseDeTela();

  const aoRedimensionar = comDebounce(() => {
    ajustarAlturaReal();
    definirClasseDeTela();
  }, 150);

  window.addEventListener('resize', aoRedimensionar);
  window.addEventListener('orientationchange', aoRedimensionar);
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  configurarTrocaDeFoto();
  iniciarResponsividade();
});
