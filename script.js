const body = document.body;
const sealButton = document.getElementById('sealButton');
const siteContent = document.getElementById('siteContent');
const music = document.getElementById('music');
const memoryVideo = document.getElementById('memoryVideo');
const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');
const loveButton = document.getElementById('loveButton');
const replayLove = document.getElementById('replayLove');
const toast = document.getElementById('toast');
const toastText = document.getElementById('toastText');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const galleryImages = galleryItems.map((item) => {
  const image = item.querySelector('img');
  const label = item.querySelector('.gallery-overlay span');
  return {
    src: image.getAttribute('src'),
    alt: image.getAttribute('alt'),
    caption: label ? label.textContent : 'Зулфиянын көз ирмеми'
  };
});

let currentImage = 0;
let toastTimer;
let resumeMusicAfterVideo = false;

function showToast(message) {
  toastText.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3000);
}

function burstHearts() {
  const symbols = ['♡', '✦', '✧', '❀'];
  const count = 22;
  for (let index = 0; index < count; index += 1) {
    const spark = document.createElement('span');
    spark.className = 'burst-particle';
    spark.textContent = symbols[index % symbols.length];
    spark.style.left = (50 + (Math.random() * 34 - 17)) + '%';
    spark.style.top = (47 + (Math.random() * 14 - 7)) + '%';
    spark.style.setProperty('--x', (Math.random() * 260 - 130) + 'px');
    spark.style.setProperty('--y', (-(Math.random() * 220 + 80)) + 'px');
    spark.style.setProperty('--delay', Math.random() * .2 + 's');
    document.body.appendChild(spark);
    window.setTimeout(() => spark.remove(), 1500);
  }
}

function updateMusicUi(isPlaying) {
  musicToggle.setAttribute('aria-pressed', String(isPlaying));
  musicToggle.setAttribute('aria-label', isPlaying ? 'Музыканы токтотуу' : 'Музыканы күйгүзүү');
  musicLabel.textContent = isPlaying ? 'Неберем ♫' : 'Неберем';
}

async function playMusic() {
  try {
    await music.play();
    updateMusicUi(true);
    return true;
  } catch (error) {
    updateMusicUi(false);
    showToast('Музыка үчүн жогорку оң жактагы баскычты басыңыз');
    return false;
  }
}

function openEnvelope() {
  if (body.classList.contains('opened')) return;
  body.classList.add('opened');
  siteContent.classList.add('is-visible');
  siteContent.setAttribute('aria-hidden', 'false');
  sealButton.setAttribute('aria-label', 'Кат ачылды');
  sealButton.disabled = true;
  burstHearts();
  playMusic();
  window.setTimeout(() => {
    document.getElementById('story').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 650);
}

sealButton.addEventListener('click', openEnvelope);

musicToggle.addEventListener('click', async () => {
  if (music.paused) {
    if (!memoryVideo.paused) {
      resumeMusicAfterVideo = false;
      memoryVideo.pause();
    }
    const played = await playMusic();
    if (played) showToast('Музыка күйгүзүлдү ♫');
  } else {
    resumeMusicAfterVideo = false;
    music.pause();
    updateMusicUi(false);
    showToast('Музыка токтотулду');
  }
});

music.addEventListener('play', () => updateMusicUi(true));
music.addEventListener('pause', () => updateMusicUi(false));
music.addEventListener('error', () => {
  updateMusicUi(false);
});

memoryVideo.addEventListener('play', () => {
  resumeMusicAfterVideo = !music.paused;
  if (resumeMusicAfterVideo) music.pause();
});

memoryVideo.addEventListener('pause', () => {
  if (resumeMusicAfterVideo) {
    resumeMusicAfterVideo = false;
    playMusic();
  }
});

function sendLove(message) {
  burstHearts();
  showToast(message || 'Зулфияга жылуулук жөнөтүлдү');
}

loveButton.addEventListener('click', () => sendLove());
replayLove.addEventListener('click', () => sendLove('Чоң ата-чоң эненин мээрими дайыма сени менен'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element));

function renderLightbox() {
  const current = galleryImages[currentImage];
  lightboxImage.src = current.src;
  lightboxImage.alt = current.alt;
  lightboxCaption.textContent = current.caption;
}

function openLightbox(index) {
  currentImage = index;
  renderLightbox();
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  body.classList.add('modal-open');
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  body.classList.remove('modal-open');
}

function moveLightbox(direction) {
  currentImage = (currentImage + direction + galleryImages.length) % galleryImages.length;
  renderLightbox();
}

galleryItems.forEach((item) => {
  item.addEventListener('click', () => openLightbox(Number(item.dataset.index)));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxBackdrop.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => moveLightbox(-1));
lightboxNext.addEventListener('click', () => moveLightbox(1));

document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') moveLightbox(-1);
  if (event.key === 'ArrowRight') moveLightbox(1);
});

const burstStyles = document.createElement('style');
burstStyles.textContent =
  '.burst-particle {' +
  'position: fixed; z-index: 70; color: #f6b3cd; font-family: Georgia, serif; ' +
  'font-size: ' + (window.innerWidth < 600 ? '1.15rem' : '1.45rem') + '; pointer-events: none; ' +
  'animation: burstParticle 1.35s cubic-bezier(.2,.75,.2,1) var(--delay) forwards;' +
  '}' +
  '@keyframes burstParticle {' +
  '0% { opacity: 0; transform: translate(-50%, -50%) scale(.4) rotate(0); }' +
  '18% { opacity: 1; }' +
  '100% { opacity: 0; transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1.2) rotate(120deg); }' +
  '}';
document.head.appendChild(burstStyles);
