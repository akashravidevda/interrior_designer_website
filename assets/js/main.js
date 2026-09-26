/**
 * SARTHI ASSOCIATES & INTERIOR
 * Flagship Spatial Experience (v3.0.0-production-master)
 * High-End GSAP Motion, Split-Screen Sticky Switching, Timeline & Modal Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initServicesSplitStage();
  initProcessTimeline();
  initEditorialGalleryLightbox();
  initContactBriefForm();
  initGSAPMotion();
});

/* ==========================================================================
   1. HEADER SCROLL & GLASS STATE
   ========================================================================== */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   2. MOBILE FULLSCREEN EDITORIAL NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navOverlay = document.getElementById('mobileNavOverlay');
  const navLinks = document.querySelectorAll('.mobile-link, .mobile-menu-cta');

  if (!toggleBtn || !navOverlay) return;

  const toggle = () => {
    const isActive = navOverlay.classList.contains('active');
    if (isActive) {
      navOverlay.classList.remove('active');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      navOverlay.classList.add('active');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  };

  toggleBtn.addEventListener('click', toggle);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navOverlay.classList.remove('active');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   3. SERVICES SPLIT-STAGE INTERACTION (Left Stage Sticky Image Switch)
   ========================================================================== */
function initServicesSplitStage() {
  const rows = document.querySelectorAll('.service-row');
  const stageImages = document.querySelectorAll('.service-stage-img');
  const watermark = document.getElementById('stageNumberWatermark');
  const captionTitle = document.getElementById('stageCaptionTitle');

  if (!rows.length || !stageImages.length) return;

  const serviceData = [
    { num: "01", title: "Interior Designing & Execution" },
    { num: "02", title: "Project Consultancy" },
    { num: "03", title: "Space Planning & Renovation" },
    { num: "04", title: "Customized Designs" }
  ];

  const setActiveService = (idx) => {
    rows.forEach((row, i) => {
      if (i === idx) {
        row.classList.add('active');
        row.setAttribute('aria-selected', 'true');
      } else {
        row.classList.remove('active');
        row.setAttribute('aria-selected', 'false');
      }
    });

    stageImages.forEach((img, i) => {
      if (i === idx) {
        img.classList.add('active');
      } else {
        img.classList.remove('active');
      }
    });

    if (watermark && serviceData[idx]) {
      watermark.textContent = serviceData[idx].num;
    }
    if (captionTitle && serviceData[idx]) {
      captionTitle.textContent = serviceData[idx].title;
    }
  };

  rows.forEach((row, idx) => {
    row.addEventListener('mouseenter', () => setActiveService(idx));
    row.addEventListener('click', () => setActiveService(idx));
    row.addEventListener('focus', () => setActiveService(idx));
  });
}

/* ==========================================================================
   4. SCROLL-LINKED PROCESS TIMELINE
   ========================================================================== */
function initProcessTimeline() {
  const steps = document.querySelectorAll('.process-step-item');
  const stickyNum = document.getElementById('processStickyNum');
  const lineFill = document.getElementById('processLineFill');

  if (!steps.length) return;

  function updateStep(idx) {
    steps.forEach((s, i) => {
      if (i === idx) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    const numStr = String(idx + 1).padStart(2, '0');
    if (stickyNum && stickyNum.textContent !== numStr) {
      if (typeof gsap !== 'undefined') {
        gsap.to(stickyNum, {
          opacity: 0,
          y: -8,
          duration: 0.15,
          ease: "power2.in",
          onComplete: () => {
            stickyNum.textContent = numStr;
            gsap.fromTo(stickyNum, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });
          }
        });
      } else {
        stickyNum.textContent = numStr;
      }
    }
    
    if (lineFill) {
      const percentage = ((idx + 1) / steps.length) * 100;
      lineFill.style.height = `${percentage}%`;
    }
  }

  // Click & hover interaction on each stage card
  steps.forEach((step, idx) => {
    step.addEventListener('click', () => updateStep(idx));
    step.addEventListener('focus', () => updateStep(idx));
  });

  // ScrollTrigger integration
  if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
    steps.forEach((step, idx) => {
      ScrollTrigger.create({
        trigger: step,
        start: "top 65%",
        end: "bottom 65%",
        onEnter: () => updateStep(idx),
        onEnterBack: () => updateStep(idx)
      });
    });
    // Ensure accurate metrics after asset load
    window.addEventListener('load', () => ScrollTrigger.refresh());
  } else {
    // Robust IntersectionObserver fallback
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Array.from(steps).indexOf(entry.target);
          if (idx !== -1) updateStep(idx);
        }
      });
    }, { threshold: 0.4 });

    steps.forEach(step => observer.observe(step));
  }
}

/* ==========================================================================
   5. EDITORIAL GALLERY LIGHTBOX MODAL
   ========================================================================== */
function initEditorialGalleryLightbox() {
  const cards = document.querySelectorAll('.gallery-card');
  const modal = document.getElementById('portfolioLightbox');
  const mainImg = document.getElementById('lightboxMainImg');
  const tagEl = document.getElementById('lightboxTag');
  const titleEl = document.getElementById('lightboxTitle');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');
  const backdrop = document.querySelector('.lightbox-backdrop');

  if (!cards.length || !modal) return;

  const projects = [
    {
      img: "assets/images/gallery-residential.jpg",
      tag: "Residential Study",
      title: "Master Suite & Private Living Area"
    },
    {
      img: "assets/images/gallery-living.jpg",
      tag: "Living Space Study",
      title: "Panoramic Open Concept Living Lounge"
    },
    {
      img: "assets/images/visual-break-sanctuary.jpg",
      tag: "Architectural Volume Study",
      title: "Double Height Illumination & Natural Limestone"
    },
    {
      img: "assets/images/gallery-office.jpg",
      tag: "Workplace Study",
      title: "Executive Workspace with Walnut Millwork"
    },
    {
      img: "assets/images/gallery-commercial.jpg",
      tag: "Commercial Space Study",
      title: "Boutique Reception & Client Lounge"
    },
    {
      img: "assets/images/gallery-renovation.jpg",
      tag: "Renovation Study",
      title: "Kitchen & Dining Renewal Transformation"
    }
  ];

  let currentIndex = 0;

  const showProject = (idx) => {
    currentIndex = (idx + projects.length) % projects.length;
    const p = projects[currentIndex];
    if (mainImg) {
      mainImg.src = p.img;
      mainImg.alt = p.title;
    }
    if (tagEl) tagEl.textContent = p.tag;
    if (titleEl) titleEl.textContent = p.title;
  };

  const openModal = (idx) => {
    showProject(idx);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.focus();
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  cards.forEach((card, idx) => {
    card.addEventListener('click', () => openModal(idx));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(idx);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showProject(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showProject(currentIndex + 1);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') showProject(currentIndex - 1);
    if (e.key === 'ArrowRight') showProject(currentIndex + 1);
  });
}

/* ==========================================================================
   6. CONTACT BRIEF FORM (Validation & Interaction)
   ========================================================================== */
function initContactBriefForm() {
  const form = document.getElementById('projectBriefForm');
  const feedback = document.getElementById('formFeedback');

  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();

    if (!name || !phone) {
      feedback.className = 'form-feedback-msg error';
      feedback.style.display = 'block';
      feedback.textContent = 'Please provide your name and contact phone number.';
      return;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      feedback.className = 'form-feedback-msg error';
      feedback.style.display = 'block';
      feedback.textContent = 'Please enter a valid 10-digit contact number.';
      return;
    }

    const submitBtn = form.querySelector('.form-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Submitting Brief...</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
      feedback.className = 'form-feedback-msg success';
      feedback.style.display = 'block';
      feedback.innerHTML = `<strong>Thank you, ${name}.</strong> Your project enquiry has been received. Sudhirr Tamhane will connect with you directly for an initial consultation.`;
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 850);
  });
}

/* ==========================================================================
   7. GSAP MOTION & ENTRANCE REVEALS
   ========================================================================== */
function initGSAPMotion() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Check prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set('.reveal-block', { opacity: 1, y: 0 });
    return;
  }

  // Hero Staggered Reveal
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.1 } });
  
  heroTL.from('.title-inner', {
    y: 100,
    stagger: 0.18,
    duration: 1.2
  })
  .from('.hero-meta-badge', { opacity: 0, y: 15, duration: 0.8 }, "-=0.8")
  .from('.hero-narrative', { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
  .from('.hero-action-group', { opacity: 0, y: 15, duration: 0.8 }, "-=0.6")
  .from('.hero-footer-meta', { opacity: 0, duration: 0.8 }, "-=0.4")
  .from('.hero-media-wrapper', { scale: 1.035, duration: 1.5, ease: 'power2.out' }, "-=1.3");

  // Scroll Triggered Staggered Blocks
  const revealElements = document.querySelectorAll('.reveal-block');
  revealElements.forEach((el) => {
    gsap.fromTo(el, 
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}
