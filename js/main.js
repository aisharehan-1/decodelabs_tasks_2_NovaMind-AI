/* ==========================================================================
   NovaMind AI Landing Page JS Operations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. Loading Screen Animation --- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    // Add small delay to ensure loading experience is observed cleanly
    setTimeout(() => {
      loader.classList.add('fade-out');
    }, 600);
  });

  // Fallback for cases where load event fired already
  if (document.readyState === 'complete') {
    setTimeout(() => {
      loader.classList.add('fade-out');
    }, 600);
  }

  /* --- 2. Sticky Navbar Update --- */
  const navbar = document.getElementById('navbar');
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* --- 3. Mobile Menu & Drawer Operations --- */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function toggleMobileMenu() {
    mobileToggle.classList.toggle('active');
    mobileDrawer.classList.toggle('open');
    // Toggle body scroll locking
    document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
  }

  mobileToggle.addEventListener('click', toggleMobileMenu);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Close drawer upon selection
      toggleMobileMenu();
    });
  });

  /* --- 4. Smooth Anchor Scrolling & Offset Calculations --- */
  const allLinks = document.querySelectorAll('a[href^="#"]');
  allLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Skip actions on general social dummy targets
      if (targetId === '#social' || targetId === '#portfolio-detail' || targetId === '#login') {
        e.preventDefault();
        return;
      }
      
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = targetPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* --- 5. Active Link Highlighting in Navigation --- */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    let currentSection = '';
    const scrollPosition = window.scrollY + 200; // Offset check point

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink(); // Initial run

  /* --- 6. Scroll Reveal Operations --- */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once visible, stop tracking
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* --- 7. Timeline Progress Tracking Animation --- */
  const timelineProgress = document.getElementById('timeline-progress');
  const timelineItems = document.querySelectorAll('.timeline-item');

  function animateTimelineOnScroll() {
    const timelineContainer = document.querySelector('.timeline-container');
    if (!timelineContainer) return;

    const containerRect = timelineContainer.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.7;

    // Calculate how much of the timeline has scrolled past triggerPoint
    if (containerRect.top < triggerPoint) {
      const scrolledHeight = triggerPoint - containerRect.top;
      const totalHeight = containerRect.height;
      const progressPercent = Math.min(Math.max((scrolledHeight / totalHeight) * 100, 0), 100);
      
      timelineProgress.style.height = `${progressPercent}%`;

      // Highlight nodes as progress reaches them
      timelineItems.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top < triggerPoint) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', animateTimelineOnScroll);
  animateTimelineOnScroll();

  /* --- 8. Animated Counter Statistics --- */
  const counterElements = document.querySelectorAll('.counter');
  
  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const speed = 100; // Lower is faster speed
    const increment = Math.ceil(target / speed);
    
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = current + suffix;
      }
    }, 15);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  counterElements.forEach(counter => counterObserver.observe(counter));

  /* --- 9. FAQ Accordion Mechanism --- */
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const item = this.parentElement;
      const body = this.nextElementSibling;
      const isCurrentlyExpanded = item.classList.contains('active');

      // Close all other active items
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.accordion-body').style.maxHeight = null;
          otherItem.querySelector('.accordion-body').style.opacity = '0';
        }
      });

      // Toggle current item
      if (isCurrentlyExpanded) {
        item.classList.remove('active');
        this.setAttribute('aria-expanded', 'false');
        body.style.maxHeight = null;
        body.style.opacity = '0';
      } else {
        item.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
        body.style.opacity = '1';
      }
    });
  });

  /* --- 10. Contact Form Validation & Submission --- */
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }

  function validatePhone(phone) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
  }

  function showFieldValidation(field, isValid) {
    const formGroup = field.parentElement;
    if (isValid) {
      formGroup.classList.remove('invalid');
    } else {
      formGroup.classList.add('invalid');
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('user-name');
      const emailInput = document.getElementById('user-email');
      const phoneInput = document.getElementById('user-phone');
      const messageInput = document.getElementById('user-message');
      
      let isFormValid = true;

      // Validate Name
      if (nameInput.value.trim() === '') {
        showFieldValidation(nameInput, false);
        isFormValid = false;
      } else {
        showFieldValidation(nameInput, true);
      }

      // Validate Email
      if (!validateEmail(emailInput.value.trim())) {
        showFieldValidation(emailInput, false);
        isFormValid = false;
      } else {
        showFieldValidation(emailInput, true);
      }

      // Validate Phone
      if (!validatePhone(phoneInput.value.trim())) {
        showFieldValidation(phoneInput, false);
        isFormValid = false;
      } else {
        showFieldValidation(phoneInput, true);
      }

      // Validate Message
      if (messageInput.value.trim() === '') {
        showFieldValidation(messageInput, false);
        isFormValid = false;
      } else {
        showFieldValidation(messageInput, true);
      }

      if (isFormValid) {
        // Change submit button to loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        // Simulate API network latency
        setTimeout(() => {
          formFeedback.className = 'form-feedback success';
          formFeedback.textContent = 'Thank you! Your message was delivered successfully. A NovaMind AI architect will call you shortly.';
          formFeedback.style.display = 'block';
          
          // Reset form
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;

          // Clear validation states
          document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('invalid');
          });

          // Scroll feedback into view
          formFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 1500);
      }
    });

    // Realtime correction on input focus/blur/keyup
    ['keyup', 'blur'].forEach(evt => {
      document.getElementById('user-name').addEventListener(evt, function() {
        showFieldValidation(this, this.value.trim() !== '');
      });

      document.getElementById('user-email').addEventListener(evt, function() {
        showFieldValidation(this, validateEmail(this.value.trim()));
      });

      document.getElementById('user-phone').addEventListener(evt, function() {
        showFieldValidation(this, validatePhone(this.value.trim()));
      });

      document.getElementById('user-message').addEventListener(evt, function() {
        showFieldValidation(this, this.value.trim() !== '');
      });
    });
  }

  /* --- 11. Newsletter Form Actions --- */
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailVal = newsletterEmail.value.trim();

      if (!validateEmail(emailVal)) {
        newsletterForm.classList.add('invalid');
      } else {
        newsletterForm.classList.remove('invalid');
        const originalPlaceholder = newsletterEmail.placeholder;
        
        newsletterEmail.value = '';
        newsletterEmail.placeholder = 'Subscribed Successfully!';
        newsletterEmail.disabled = true;

        setTimeout(() => {
          newsletterEmail.placeholder = originalPlaceholder;
          newsletterEmail.disabled = false;
        }, 3000);
      }
    });

    newsletterEmail.addEventListener('keyup', function() {
      if (validateEmail(this.value.trim())) {
        newsletterForm.classList.remove('invalid');
      }
    });
  }

  /* --- 12. Back to Top Button Actions --- */
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /* --- 13. Dynamic Demo Video Modal --- */
  const demoBtn = document.getElementById('demo-btn');

  if (demoBtn) {
    demoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Build Modal Container
      const modal = document.createElement('div');
      modal.className = 'demo-modal-overlay';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100vw';
      modal.style.height = '100vh';
      modal.style.backgroundColor = 'rgba(15, 23, 42, 0.9)';
      modal.style.backdropFilter = 'blur(12px)';
      modal.style.zIndex = '99999';
      modal.style.display = 'flex';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      modal.style.opacity = '0';
      modal.style.transition = 'opacity 0.4s ease';

      // Build Modal Inner
      const modalInner = document.createElement('div');
      modalInner.className = 'demo-modal-inner';
      modalInner.style.width = '90%';
      modalInner.style.maxWidth = '800px';
      modalInner.style.aspectRatio = '16/9';
      modalInner.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
      modalInner.style.border = '1px solid rgba(255, 255, 255, 0.1)';
      modalInner.style.borderRadius = '20px';
      modalInner.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.5)';
      modalInner.style.position = 'relative';
      modalInner.style.overflow = 'hidden';
      modalInner.style.transform = 'scale(0.9)';
      modalInner.style.transition = 'transform 0.4s ease';

      // Build Close Button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '15px';
      closeBtn.style.right = '20px';
      closeBtn.style.background = 'transparent';
      closeBtn.style.border = 'none';
      closeBtn.style.color = '#fff';
      closeBtn.style.fontSize = '2rem';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.zIndex = '10';
      closeBtn.style.transition = 'transform 0.2s';
      closeBtn.addEventListener('mouseenter', () => closeBtn.style.transform = 'scale(1.2)');
      closeBtn.addEventListener('mouseleave', () => closeBtn.style.transform = 'scale(1)');

      // Custom animated futuristic player content
      const playerContent = document.createElement('div');
      playerContent.style.width = '100%';
      playerContent.style.height = '100%';
      playerContent.style.display = 'flex';
      playerContent.style.flexDirection = 'column';
      playerContent.style.justifyContent = 'center';
      playerContent.style.alignItems = 'center';
      playerContent.style.background = 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 80%)';
      playerContent.style.color = '#fff';
      playerContent.style.padding = '2rem';
      playerContent.style.textAlign = 'center';

      playerContent.innerHTML = `
        <div style="margin-bottom: 1.5rem; position: relative;">
          <svg viewBox="0 0 100 100" width="80" height="80" style="animation: spin 8s linear infinite; display: block; margin: 0 auto;">
            <circle cx="50" cy="50" r="45" stroke="rgba(6, 182, 212, 0.2)" stroke-width="2" fill="none" />
            <circle cx="50" cy="50" r="40" stroke="var(--color-accent)" stroke-width="3" stroke-dasharray="180 50" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="var(--color-secondary)" stroke-width="2" stroke-dasharray="60 30" fill="none" />
          </svg>
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 24px; height: 24px; border-radius: 50%; background-color: var(--color-primary); box-shadow: 0 0 15px var(--color-primary);"></div>
        </div>
        <h4 style="font-size: 1.5rem; margin-bottom: 0.8rem; background: linear-gradient(135deg, #fff 60%, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">NovaMind AI Platform Demonstration</h4>
        <p style="color: #94a3b8; font-size: 0.95rem; max-width: 480px; margin-bottom: 1.5rem;">Streaming simulation data from global model pipelines. System diagnostics are fully calibrated.</p>
        <div style="display: flex; gap: 1rem;">
          <div style="padding: 0.6rem 1.2rem; background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 50px; font-size: 0.8rem; font-weight: 600;"><span style="color:#10B981; display:inline-block; width:8px; height:8px; border-radius:50%; background-color:#10B981; margin-right:6px; box-shadow:0 0 8px #10B981;"></span>Telemetry Active</div>
          <div style="padding: 0.6rem 1.2rem; background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 50px; font-size: 0.8rem; font-weight: 600; color:var(--color-accent);">FP32 Prec.</div>
        </div>
      `;

      // Inject Spin style keyframe programmatically
      if (!document.getElementById('modal-spin-css')) {
        const style = document.createElement('style');
        style.id = 'modal-spin-css';
        style.textContent = `
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }

      modalInner.appendChild(closeBtn);
      modalInner.appendChild(playerContent);
      modal.appendChild(modalInner);
      document.body.appendChild(modal);

      // Trigger transition animation
      setTimeout(() => {
        modal.style.opacity = '1';
        modalInner.style.transform = 'scale(1)';
      }, 10);

      // Close actions
      const closeModal = () => {
        modal.style.opacity = '0';
        modalInner.style.transform = 'scale(0.9)';
        setTimeout(() => {
          modal.remove();
        }, 400);
      };

      closeBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', (ev) => {
        if (ev.target === modal) {
          closeModal();
        }
      });
    });
  }

});
