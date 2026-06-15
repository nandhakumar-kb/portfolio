// Portfolio Interactions & Storytelling
(function() {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if(toggle && navMenu) {
    toggle.addEventListener('click', () => navMenu.classList.toggle('active'));
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('active'));
    });
  }

  // Web Audio API for UI Sounds (Procedural)
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;
  let soundEnabled = false;

  // Interaction Sounds
  const hoverables = document.querySelectorAll('a, button, .flipper, .nav-logo, .project-card, .arsenal-card, .project-image img');
  hoverables.forEach(el => {
    // Only attach hover sound on desktop
    if (window.matchMedia("(hover: hover)").matches) {
      el.addEventListener('mouseenter', () => playHoverSound());
    }
    el.addEventListener('click', () => playClickSound());
  });

  const playPauseBtn = document.getElementById('video-play-pause');
  const muteBtn = document.getElementById('video-mute');
  const introVideo = document.getElementById('main-intro-video');

  if (introVideo && playPauseBtn && muteBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (introVideo.paused || introVideo.ended) {
        introVideo.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      } else {
        introVideo.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      }
      playClickSound();
    });

    muteBtn.addEventListener('click', () => {
      introVideo.muted = !introVideo.muted;
      soundEnabled = !introVideo.muted;
      
      if (soundEnabled && !audioCtx) {
        try {
          audioCtx = new AudioContext();
          if (audioCtx.state === 'suspended') {
            audioCtx.resume();
          }
        } catch(e) {
          console.error("Web Audio API not supported", e);
        }
      }

      if (introVideo.muted) {
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
      } else {
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        playClickSound();
      }
    });

    introVideo.addEventListener('play', () => playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>');
    introVideo.addEventListener('pause', () => playPauseBtn.innerHTML = '<i class="fas fa-play"></i>');
    introVideo.addEventListener('ended', () => playPauseBtn.innerHTML = '<i class="fas fa-redo"></i>');
  }

  function playHoverSound() {
    if (!soundEnabled || !audioCtx || audioCtx.state !== 'running') return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime); // High pitch tick
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime); // very quiet
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  }

  function playClickSound() {
    if (!soundEnabled || !audioCtx || audioCtx.state !== 'running') return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  }

  // GSAP Animations & Storytelling ScrollTriggers
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Animations (The Awakening)
    const tlHero = gsap.timeline();
    tlHero.from('.hero-badge', {y: 20, opacity: 0, duration: 0.6, ease: 'back.out(1.7)'})
          .from('.hero-title', {y: 30, opacity: 0, duration: 0.8, ease: 'power4.out'}, "-=0.4")
          .from('.hero-description', {y: 20, opacity: 0, duration: 0.8}, "-=0.6")
          .from('.hero-actions .btn', {y: 20, opacity: 0, duration: 0.5, stagger: 0.1}, "-=0.6")
          .from('.hero-social a', {scale: 0, opacity: 0, duration: 0.4, stagger: 0.1, ease: 'back.out(2)'}, "-=0.4")
          .from('.hero-image-wrapper', {scale: 0.8, opacity: 0, rotationY: 90, duration: 1.2, ease: 'power3.out'}, "-=1");

    // 2. Parallax Video Background (Removed)

  }

  // 3. Storytelling Chapter Reveals (Vanilla Observer for safety)
  const revealElements = document.querySelectorAll('.section-title, .arsenal-card, .project-card, .timeline-item, .cert-card');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    // Add a slight stagger delay based on index for siblings
    const delay = (index % 4) * 0.1;
    el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`;
    observer.observe(el);
  });

  // Active nav link on scroll
  const scrollSections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  function updateActiveNav() {
    let current = '';
    scrollSections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.clientHeight;
      if(window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if(link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // Smooth scroll logic
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      // Immediate active state update for nav links
      if (this.classList.contains('nav-link')) {
        navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
      }

      const href = this.getAttribute('href');
      if(href && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if(target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Project Image Lightbox Logic
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxContent = document.querySelector('.lightbox-content');
  const lightboxClose = document.querySelector('.lightbox-close');
  const projectImages = document.querySelectorAll('.project-image img');

  if (lightboxModal && lightboxContent && lightboxClose) {
    projectImages.forEach(img => {
      img.addEventListener('click', (e) => {
        lightboxContent.src = e.target.src;
        lightboxModal.classList.add('visible');
      });
    });

    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('visible');
      setTimeout(() => { lightboxContent.src = ''; }, 300);
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('visible');
        setTimeout(() => { lightboxContent.src = ''; }, 300);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('visible')) {
        lightboxModal.classList.remove('visible');
        setTimeout(() => { lightboxContent.src = ''; }, 300);
      }
    });
  }

  // Video Restart Logic
  const mainVideo = document.getElementById('main-intro-video');
  const videoOverlay = document.getElementById('video-restart-overlay');
  const restartBtn = document.getElementById('restart-video-btn');

  if (mainVideo && videoOverlay && restartBtn) {
    mainVideo.addEventListener('ended', () => {
      videoOverlay.style.display = 'flex';
    });

    restartBtn.addEventListener('click', () => {
      videoOverlay.style.display = 'none';
      mainVideo.currentTime = 0;
      mainVideo.play();
    });
  }

  // Skills Video Controls Logic
  const skillsVideo = document.getElementById('skills-video');
  const skillsPlayPauseBtn = document.getElementById('skills-play-pause');
  const skillsMuteBtn = document.getElementById('skills-mute');

  if (skillsVideo && skillsPlayPauseBtn && skillsMuteBtn) {
    skillsPlayPauseBtn.addEventListener('click', () => {
      if (skillsVideo.paused || skillsVideo.ended) {
        skillsVideo.play();
        skillsPlayPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      } else {
        skillsVideo.pause();
        skillsPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      }
      playClickSound();
    });

    skillsMuteBtn.addEventListener('click', () => {
      skillsVideo.muted = !skillsVideo.muted;
      
      if (skillsVideo.muted) {
        skillsMuteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
      } else {
        skillsMuteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        playClickSound();
      }
    });
  }

  // Floating EXP Gamification
  document.addEventListener('click', (e) => {
    // Check if clicked element is interactive
    if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.project-card') || e.target.closest('.arsenal-card') || e.target.closest('.contact-card') || e.target.closest('img')) {
      const expText = document.createElement('div');
      expText.classList.add('floating-exp');
      expText.innerText = '+10 EXP';
      expText.style.left = `${e.clientX}px`;
      expText.style.top = `${e.clientY}px`;
      document.body.appendChild(expText);

      // Remove after animation (1s)
      setTimeout(() => {
        if(expText.parentNode) expText.remove();
      }, 1000);
    }
  });

})();
