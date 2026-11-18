const sections = [...document.querySelectorAll('.section')];
const navLinks = [...document.querySelectorAll('.main-nav a')];
const progressBar = document.getElementById('readingProgress');
const backToTopButton = document.getElementById('backToTop');
const nextSectionButton = document.querySelector('.next-section');
const prevSectionButton = document.querySelector('.prev-section');
const openInvitationBtn = document.getElementById('openInvitationBtn');
const music = document.getElementById('backgroundMusic');
const audioToggle = document.getElementById('audioToggle');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0 }
);

sections.forEach((section) => revealObserver.observe(section));

function setActiveNav() {
  const scrollPosition = window.scrollY + 180;
  let activeId = sections[0]?.id || '';

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const targetId = link.getAttribute('href');
    const shouldBeActive = targetId === `#${activeId}`;
    link.classList.toggle('active', shouldBeActive);
  });
}

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  const value = Math.min(Math.max(ratio * 100, 0), 100);
  progressBar.style.width = `${value}%`;
  backToTopButton.classList.toggle('visible', window.scrollY > 420);
}

function getSectionIndex() {
  const visibleIndex = sections.findIndex((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top >= -120 && rect.top <= 180;
  });

  return visibleIndex >= 0 ? visibleIndex : 0;
}

function scrollToSectionByStep(step) {
  const targetIndex = Math.min(sections.length - 1, Math.max(0, getSectionIndex() + step));
  sections[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setMusicControl(isPlaying) {
  if (audioToggle) {
    audioToggle.querySelector('.audio-text').textContent = isPlaying ? 'Pausar' : 'Música';
    audioToggle.setAttribute('aria-label', isPlaying ? 'Pausar música' : 'Reproducir música');
  }
}

function tryPlayMusic() {
  if (!music) return;

  music.volume = 0.28;
  music.play().then(() => {
    setMusicControl(true);
  }).catch((error) => {
    setMusicControl(false);
    if (error.name !== 'NotAllowedError') {
      console.error('No se pudo iniciar la música:', error);
    }
  });
}

if (music) {
  music.addEventListener('error', () => {
    setMusicControl(false);
    console.error('No se pudo cargar assets/audio/piano.mp3');
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    const targetSection = targetId ? document.querySelector(targetId) : null;

    if (!targetSection) return;
    event.preventDefault();
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

if (nextSectionButton) {
  nextSectionButton.addEventListener('click', () => scrollToSectionByStep(1));
}

if (prevSectionButton) {
  prevSectionButton.addEventListener('click', () => scrollToSectionByStep(-1));
}

if (openInvitationBtn) {
  openInvitationBtn.addEventListener('click', () => {
    const target = document.getElementById('presentacion');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    tryPlayMusic();
  });
}

if (backToTopButton) {
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

if (audioToggle) {
  audioToggle.addEventListener('click', () => {
    if (!music) return;

    if (music.paused) {
      tryPlayMusic();
    } else {
      music.pause();
      setMusicControl(false);
    }
  });
}

window.addEventListener('scroll', () => {
  setActiveNav();
  updateProgress();
});

window.addEventListener('load', () => {
  setActiveNav();
  updateProgress();
  const hero = document.querySelector('.cover-section');
  if (hero) hero.classList.add('visible');
});
