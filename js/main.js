'use strict';

/* ═══════════════════════════════════════════
   DevFolio — Main JS
   Vanilla JS, no dependencies (except Typed.js)
═══════════════════════════════════════════ */

/* ── Preloader ── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  setTimeout(() => preloader.classList.add('done'), 1600);
});

/* ── Custom Cursor ── */
(function initCursor() {
  const dot     = document.getElementById('cursorDot');
  const outline = document.getElementById('cursorOutline');
  if (!dot || !outline) return;

  let mx = 0, my = 0, ox = 0, oy = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animateOutline() {
    ox += (mx - ox) * 0.14;
    oy += (my - oy) * 0.14;
    outline.style.left = ox + 'px';
    outline.style.top  = oy + 'px';
    rafId = requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Scale cursor on interactive elements
  const interactives = 'a, button, .service-card, .p-card, .skill-pill, .pricing-card';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform     = 'translate(-50%,-50%) scale(2.5)';
      outline.style.transform = 'translate(-50%,-50%) scale(1.8)';
      outline.style.opacity   = '0.5';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform     = '';
      outline.style.transform = '';
      outline.style.opacity   = '';
    });
  });
})();

/* ── Navbar ── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  const navLinks  = document.querySelectorAll('.nav-link');

  if (!navbar) return;

  // Scroll effect
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const updateActive = () => {
    const scrollY = window.scrollY + 80;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) link.classList.toggle('active', scrollY >= top && scrollY < bottom);
    });
  };
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 10;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });
})();

/* ── Typed.js ── */
(function initTyped() {
  const el = document.getElementById('typed');
  if (!el || typeof Typed === 'undefined') return;

  new Typed('#typed', {
    strings: [
      'Ingénieur en Automatisme Industriel',
      'Développeur Full Stack',
      'Développeur Web & Mobile',
      'Développeur Front-end React',
      'Concepteur d\'Applications',
      'Développeur Flutter & React Native',
    ],
    typeSpeed:    55,
    backSpeed:    30,
    backDelay:    2200,
    startDelay:   800,
    loop:         true,
    smartBackspace: true,
  });
})();

/* ── Reveal Animations (Intersection Observer) ── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ── Counter Animation ── */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const animate = el => {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const step     = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();

/* ── Experience Tabs ── */
(function initExpTabs() {
  const tabs = document.querySelectorAll('.exp-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Deactivate all tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show/hide timeline containers
      const target = tab.getAttribute('data-tab');
      document.getElementById('tab-pro')?.classList.toggle('hidden', target !== 'pro');
      document.getElementById('tab-asso')?.classList.toggle('hidden', target !== 'asso');

      // Re-trigger reveal animations for newly visible items
      const visibleTimeline = document.getElementById(`tab-${target}`);
      if (visibleTimeline) {
        const items = visibleTimeline.querySelectorAll('.reveal');
        items.forEach((item, i) => {
          item.classList.remove('visible');
          setTimeout(() => item.classList.add('visible'), i * 120);
        });
      }
    });
  });
})();

/* ── Portfolio Filter ── */
(function initPortfolioFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const items   = document.querySelectorAll('.p-item');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      items.forEach(item => {
        const cat     = item.getAttribute('data-cat');
        const visible = filter === 'all' || cat === filter;
        item.classList.toggle('hidden-by-filter', !visible);
      });
    });
  });
})();

/* ── Back to Top ── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── Contact Form ── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const msg  = document.getElementById('formMsg');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

    try {
      const data = new FormData(form);
      const res  = await fetch(form.action, { method: 'POST', body: data });
      if (res.ok) {
        showMsg('Message envoyé avec succès ! Je vous répondrai bientôt.', 'success');
        form.reset();
      } else {
        showMsg('Une erreur est survenue. Veuillez réessayer.', 'error');
      }
    } catch {
      showMsg('Impossible d\'envoyer le message. Contactez-moi via WhatsApp.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Envoyer le message <i class="fas fa-paper-plane"></i>';
    }
  });

  function showMsg(text, type) {
    if (!msg) return;
    msg.textContent = text;
    msg.className   = `form-msg ${type}`;
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 6000);
  }
})();
