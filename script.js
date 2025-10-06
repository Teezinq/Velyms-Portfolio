// Current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal on scroll
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.fade').forEach(el => el.classList.add('revealed'));
}
