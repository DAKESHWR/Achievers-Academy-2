document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle ---
  const themeBtn = document.getElementById('theme-toggle');
  const iconSun = document.getElementById('theme-sun');
  const iconMoon = document.getElementById('theme-moon');
  const root = document.documentElement;

  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    root.classList.add('dark');
    iconMoon.style.display = 'none';
    iconSun.style.display = 'block';
  }

  themeBtn.addEventListener('click', () => {
    root.classList.toggle('dark');
    const isDark = root.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      iconMoon.style.display = 'none';
      iconSun.style.display = 'block';
    } else {
      iconSun.style.display = 'none';
      iconMoon.style.display = 'block';
    }
  });

  // --- Mobile Menu Toggle ---
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav__menu');
  const navLinks = document.querySelectorAll('.nav__link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 70; // Nav height
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Hero Carousel Auto & Manual with Swipe ---
  const slides = document.querySelectorAll('.carousel__slide');
  const dotsContainer = document.querySelector('.carousel__dots');
  const btnPrev = document.querySelector('.carousel__btn--prev');
  const btnNext = document.querySelector('.carousel__btn--next');
  let currentSlide = 0;
  let slideInterval;

  if (slides.length > 0) {
    // Generate Dots
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('carousel__dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel__dot');

    const goToSlide = (index) => {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
      resetInterval();
    };

    btnNext.addEventListener('click', () => goToSlide(currentSlide + 1));
    btnPrev.addEventListener('click', () => goToSlide(currentSlide - 1));

    const nextSlide = () => goToSlide(currentSlide + 1);

    // Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const carouselInner = document.querySelector('.carousel__inner');

    carouselInner.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselInner.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      if (touchEndX < touchStartX - 50) goToSlide(currentSlide + 1);
      if (touchEndX > touchStartX + 50) goToSlide(currentSlide - 1);
    }

    const startInterval = () => { slideInterval = setInterval(nextSlide, 5000); };
    const resetInterval = () => { clearInterval(slideInterval); startInterval(); };
    startInterval();
  }

  // --- Scroll Animations & Counters ---
  const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Check for counters within the intersecting target
        const counters = entry.target.querySelectorAll('.counter');
        if (counters.length > 0) {
          counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            const updateCounter = () => {
              current += step;
              if (current < target) {
                counter.innerText = Math.ceil(current);
                requestAnimationFrame(updateCounter);
              } else {
                counter.innerText = target;
              }
            };
            if (counter.innerText === "0") updateCounter();
          });
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll, .animate-stagger').forEach(el => {
    observer.observe(el);
  });

  document.querySelectorAll('.stats__grid').forEach(el => {
    observer.observe(el);
  });

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq__question');
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // --- Login Modal ---
  const loginBtns = document.querySelectorAll('.btn-login');
  const modal = document.getElementById('login-modal');
  const closeModal = document.querySelector('.modal__close');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');

  const openModal = () => modal.classList.add('active');
  const closeMod = () => {
    modal.classList.remove('active');
    loginForm.reset();
    loginError.style.display = 'none';
  }

  loginBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  closeModal.addEventListener('click', closeMod);

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal__overlay')) {
      closeMod();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeMod();
    }
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
      loginError.style.display = 'block';
    } else {
      loginError.style.display = 'none';
      alert('Login successful! Welcome to EduSpark.');
      closeMod();
    }
  });
});
