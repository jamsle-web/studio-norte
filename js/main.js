// 1. FALLBACK DE SEGURIDAD
document.body.classList.add('js-loaded');
setTimeout(() => {
  document.querySelectorAll('.reveal, .stagger').forEach(el => el.classList.add('visible'));
}, 800);

// 2. CAMBIO DE TEMA (Dark/Light Mode)
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
  html.setAttribute('data-theme', savedTheme);
} else if (systemPrefersDark) {
  html.setAttribute('data-theme', 'dark');
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute('content', next === 'dark' ? '#0a0a0b' : '#fafaf8');
});

// 3. HEADER SCROLL STATE
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// 4. SCROLL PROGRESS BAR
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / h) * 100 + '%';
}, { passive: true });

// 5. BACK TO TOP
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 6. MENÚ MÓVIL
const mobileMenu = document.getElementById('mobileMenu');
const menuOpen = document.getElementById('menuOpen');
const menuClose = document.getElementById('menuClose');

function toggleMenu(open) {
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
menuOpen.addEventListener('click', () => toggleMenu(true));
menuClose.addEventListener('click', () => toggleMenu(false));

// 7. LÓGICA DE NAVEGACIÓN CON SCROLL SUAVE
function scrollToTarget(targetId) {
  if (targetId === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const target = document.getElementById(targetId);
  if (target) {
    const offset = header.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

document.querySelectorAll('[data-scroll-to]').forEach(element => {
  element.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = element.getAttribute('data-scroll-to');
    scrollToTarget(targetId);
    
    // Si es el menú móvil, cerrarlo
    if (element.hasAttribute('data-menu-link')) {
      toggleMenu(false);
    }
  });
});

// 8. ANIMACIONES DE SCROLL (Intersection Observer)
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal, .stagger').forEach(el => io.observe(el));

// 9. FORMULARIO CON VALIDACIÓN Y ESTADOS
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let isValid = true;
  
  form.querySelectorAll('.input-field').forEach(f => f.classList.remove('has-error'));
  form.querySelectorAll('input').forEach(i => i.classList.remove('error'));
  
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const budget = document.getElementById('budget');
  
  if (!name.value.trim() || name.value.trim().length < 2) {
    name.parentElement.classList.add('has-error');
    name.classList.add('error');
    isValid = false;
  }
  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    email.parentElement.classList.add('has-error');
    email.classList.add('error');
    isValid = false;
  }
  if (!budget.value.trim()) {
    budget.parentElement.classList.add('has-error');
    budget.classList.add('error');
    isValid = false;
  }
  
  if (!isValid) return;
  
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  
  setTimeout(() => {
    submitBtn.classList.remove('loading');
    submitBtn.classList.add('success');
    submitBtn.querySelector('.btn-text').textContent = '¡Mensaje enviado!';
    form.querySelectorAll('input').forEach(i => i.value = '');
    
    setTimeout(() => {
      submitBtn.classList.remove('success');
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Agendar llamada de 30 min';
    }, 4000);
  }, 1500);
});
