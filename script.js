// Set current year
const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal on scroll
const revealEls = document.querySelectorAll('[data-reveal]');
if (!prefersReduced && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('revealed'));
}

// Navigation highlighting
const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
const navSections = navLinks
  .map((link, index) => {
    const id = link.getAttribute('href').slice(1);
    const section = document.getElementById(id);
    if (section) {
      section.dataset.navIndex = String(index);
      return { id, section };
    }
    return null;
  })
  .filter(Boolean);

const updateActiveLink = (id) => {
  navLinks.forEach((link) => {
    if (link.getAttribute('href').slice(1) === id) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

if (navSections.length && 'IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => Number(a.target.dataset.navIndex) - Number(b.target.dataset.navIndex));

    if (visible.length) {
      updateActiveLink(visible[0].target.id);
    }
  }, { rootMargin: '-50% 0px -45% 0px', threshold: 0.15 });

  navSections.forEach(({ section }) => navObserver.observe(section));
  updateActiveLink(navSections[0].id);
}

// Pointer-reactive orbs in the hero
const hero = document.querySelector('.cosmic');
if (hero && !prefersReduced) {
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  const orbs = hero.querySelectorAll('.orb');

  const move = (event) => {
    const { innerWidth, innerHeight } = window;
    const relativeX = (event.clientX / innerWidth - 0.5) * 60;
    const relativeY = (event.clientY / innerHeight - 0.5) * 60;
    targetX = relativeX;
    targetY = relativeY;
  };

  window.addEventListener('pointermove', move);

  const frame = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    orbs.forEach((orb) => {
      const depth = Number(orb.dataset.depth || 0.25);
      orb.style.setProperty('--shift-x', `${currentX * depth}px`);
      orb.style.setProperty('--shift-y', `${currentY * depth}px`);
    });
    requestAnimationFrame(frame);
  };

  frame();
}
