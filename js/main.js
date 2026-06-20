'use strict';

/* ═══════════════════════════════════════════
   DevFolio — Main JS
   Vanilla JS, no dependencies (except Typed.js)
═══════════════════════════════════════════ */

/* ── Project Data ── */
const PROJECTS = {
  monitoring: {
    title:    'Pompe Solaire — Monitoring IoT',
    category: 'Industriel / IoT',
    desc:     'Système de surveillance en temps réel pour pompes solaires agricoles. Capteurs de tension, courant et débit reliés à un Arduino qui envoie les données via MQTT. Tableau de bord web avec alertes SMS automatiques en cas d\'anomalie ou de panne détectée.',
    tags:     ['Arduino', 'Node.js', 'MQTT', 'React', 'MongoDB', 'SMS API'],
    images:   ['img/monitoring1.png', 'img/monitoring2.png'],
    live:     null,
    github:   null,
  },
  ivoirebooking: {
    title:    'IvoireBooking — Réservation Événementielle',
    category: 'Web App',
    desc:     'Plateforme en ligne de réservation de salles événementielles en Côte d\'Ivoire. Gestion des disponibilités en temps réel, paiement en ligne sécurisé (Stripe + Mobile Money), notifications email/SMS et espace propriétaire de salle.',
    tags:     ['React', 'Node.js', 'Firebase', 'Stripe', 'Tailwind CSS'],
    images:   ['img/portfolio-2.jpg'],
    live:     null,
    github:   null,
  },
  erp: {
    title:    'Système ERP — Gestion de Département',
    category: 'Web App',
    desc:     'Application ERP complète couvrant la gestion RH, des stocks, de la comptabilité simplifiée et du suivi de projets. Rapports analytiques exportables, tableau de bord interactif et gestion multi-utilisateurs avec rôles.',
    tags:     ['React', 'Node.js', 'MySQL', 'Express', 'Chart.js'],
    images:   ['img/erp1.png', 'img/erp2.png', 'img/erp3.png'],
    live:     null,
    github:   null,
  },
  agrimarket: {
    title:    'AgriMarket — E-commerce Agricole',
    category: 'Mobile App',
    desc:     'Application mobile e-commerce dédiée aux produits agricoles ivoiriens. Géolocalisation des vendeurs, paiement via Orange Money et MTN MoMo, système de notation des vendeurs et suivi des commandes en temps réel.',
    tags:     ['Flutter', 'Dart', 'Firebase', 'Node.js', 'Google Maps API'],
    images:   ['img/portfolio-4.jpg'],
    live:     null,
    github:   null,
  },
  deadline: {
    title:    'DeadlineTracker — Suivi de Projets',
    category: 'Web App',
    desc:     'Application de gestion de tâches et suivi de délais avec vue Kanban, calendrier interactif et notifications automatiques avant chaque échéance. Rapports de performance par projet et par membre d\'équipe.',
    tags:     ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Nodemailer'],
    images:   ['img/suiviEcheance1.png', 'img/suiviEcheance2.png'],
    live:     null,
    github:   null,
  },
  automission: {
    title:    'AutoMission — Génération de Lettres',
    category: 'Automatisation',
    desc:     'Système automatisé de génération de lettres de mission officielles avec signature électronique intégrée. Archivage cloud sécurisé, export PDF, workflow de validation hiérarchique et historique complet des documents.',
    tags:     ['Python', 'React', 'PDF-lib', 'Node.js', 'AWS S3'],
    images:   ['img/lettreMission1.jpg', 'img/lettreMission2.png'],
    live:     null,
    github:   null,
  },
};

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

/* ── Portfolio Modal ── */
(function initProjectModal() {
  const overlay  = document.getElementById('projectModal');
  const closeBtn = document.getElementById('pmClose');
  const imgEl    = document.getElementById('pmCurrentImg');
  const prevBtn  = document.getElementById('pmPrev');
  const nextBtn  = document.getElementById('pmNext');
  const counter  = document.getElementById('pmCounter');
  const thumbs   = document.getElementById('pmThumbs');
  const catEl    = document.getElementById('pmCat');
  const titleEl  = document.getElementById('pmTitle');
  const descEl   = document.getElementById('pmDesc');
  const tagsEl   = document.getElementById('pmTags');
  const actionsEl= document.getElementById('pmActions');

  if (!overlay) return;

  let currentImages = [];
  let currentIndex  = 0;

  function setImage(index) {
    currentIndex = index;
    imgEl.src    = currentImages[index];
    imgEl.alt    = titleEl.textContent;
    counter.textContent = `${index + 1} / ${currentImages.length}`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === currentImages.length - 1;
    // Update active thumbnail
    thumbs.querySelectorAll('.pm-thumb').forEach((t, i) => {
      t.classList.toggle('active', i === index);
    });
  }

  function openModal(projectId) {
    const data = PROJECTS[projectId];
    if (!data) return;

    currentImages = data.images;
    currentIndex  = 0;

    // Populate info
    catEl.textContent   = data.category;
    titleEl.textContent = data.title;
    descEl.textContent  = data.desc;

    tagsEl.innerHTML = data.tags.map(t => `<span>${t}</span>`).join('');

    actionsEl.innerHTML = '';
    if (data.live) {
      actionsEl.innerHTML += `<a href="${data.live}" target="_blank" class="btn btn-primary btn-sm">
        <i class="fas fa-external-link-alt"></i> Voir le projet</a>`;
    }
    if (data.github) {
      actionsEl.innerHTML += `<a href="${data.github}" target="_blank" class="btn btn-ghost btn-sm">
        <i class="fab fa-github"></i> Code source</a>`;
    }
    if (!data.live && !data.github) {
      actionsEl.innerHTML = `<span style="font-size:0.82rem;color:var(--text-dim)">
        <i class="fas fa-lock"></i> Projet confidentiel</span>`;
    }

    // Build thumbnails
    thumbs.innerHTML = currentImages.map((src, i) =>
      `<div class="pm-thumb${i === 0 ? ' active' : ''}" data-index="${i}">
        <img src="${src}" alt="Vue ${i+1}">
      </div>`
    ).join('');

    thumbs.querySelectorAll('.pm-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => setImage(+thumb.dataset.index));
    });

    prevBtn.style.display = currentImages.length > 1 ? '' : 'none';
    nextBtn.style.display = currentImages.length > 1 ? '' : 'none';
    counter.style.display = currentImages.length > 1 ? '' : 'none';

    setImage(0);

    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('active'));
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('active');
    overlay.addEventListener('transitionend', () => {
      overlay.hidden = true;
      document.body.style.overflow = '';
    }, { once: true });
  }

  // Open on card click / button click
  document.querySelectorAll('.p-item').forEach(item => {
    const card = item.querySelector('.p-card');
    const btn  = item.querySelector('.open-project-modal');
    const projectId = item.dataset.project;

    // Click on card opens modal
    card?.addEventListener('click', () => openModal(projectId));
    card?.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(projectId); }
    });
    // Stop propagation on overlay button (same action)
    btn?.addEventListener('click', e => { e.stopPropagation(); openModal(projectId); });
  });

  closeBtn?.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  prevBtn?.addEventListener('click', () => { if (currentIndex > 0) setImage(currentIndex - 1); });
  nextBtn?.addEventListener('click', () => { if (currentIndex < currentImages.length - 1) setImage(currentIndex + 1); });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (overlay.hidden) return;
    if (e.key === 'Escape')      closeModal();
    if (e.key === 'ArrowLeft')   prevBtn?.click();
    if (e.key === 'ArrowRight')  nextBtn?.click();
  });

  // Touch swipe
  let touchStartX = 0;
  overlay.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  overlay.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextBtn?.click() : prevBtn?.click();
  });
})();

/* ── Video Modal ── */
(function initVideoModal() {
  const overlay  = document.getElementById('videoModal');
  const closeBtn = document.getElementById('vmClose');
  const frame    = document.getElementById('vmFrame');
  const titleEl  = document.getElementById('vmTitle');

  if (!overlay) return;

  function openVideo(videoId, title) {
    titleEl.textContent = title || '';
    frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('active'));
    document.body.style.overflow = 'hidden';
  }

  function closeVideo() {
    overlay.classList.remove('active');
    frame.src = '';
    overlay.addEventListener('transitionend', () => {
      overlay.hidden = true;
      document.body.style.overflow = '';
    }, { once: true });
  }

  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      openVideo(card.dataset.videoId, card.dataset.videoTitle);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVideo(card.dataset.videoId, card.dataset.videoTitle); }
    });
  });

  closeBtn?.addEventListener('click', closeVideo);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeVideo(); });
  document.addEventListener('keydown', e => {
    if (!overlay.hidden && e.key === 'Escape') closeVideo();
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
