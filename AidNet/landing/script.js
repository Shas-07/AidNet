// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

navToggle?.addEventListener('click', () => {
  nav?.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  const scrollTop = window.pageYOffset;
  
  if (scrollTop > 50) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
  
  lastScroll = scrollTop;
});

// GSAP animations
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Hero entrance animation
gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } })
  .to('.hero-title', { y: 0, opacity: 1, duration: 1.2 })
  .to('.hero-sub', { y: 0, opacity: 1, duration: 1 }, '-=0.6')
  .to('.hero-cta', { y: 0, opacity: 1, duration: 1 }, '-=0.6')
  .to('.hero-illustration', { opacity: 0.7, scale: 1, duration: 1.2 }, '-=1');

// Staggered mission cards with advanced animations
gsap.utils.toArray('.fade-item').forEach((el, i) => {
  gsap.fromTo(el, 
    { opacity: 0, y: 40, scale: 0.9 },
    {
      scrollTrigger: { 
        trigger: el, 
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'back.out(1.7)'
    }
  );
});

// Projects rising cards with parallax
gsap.utils.toArray('.rise-item').forEach((el, i) => {
  gsap.fromTo(el,
    { opacity: 0, y: 60, rotationX: -15 },
    {
      scrollTrigger: { 
        trigger: el, 
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 1,
      delay: i * 0.12,
      ease: 'power3.out'
    }
  );
  
  // Parallax effect on scroll
  gsap.to(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    },
    y: -30,
    opacity: 0.8
  });
});

// Floating stats animation
gsap.to('.stat-card', {
  y: -8,
  yoyo: true,
  repeat: -1,
  duration: 2.5,
  ease: 'sine.inOut',
  stagger: 0.3
});

// Magnetic button effect
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(btn, {
      x: x * 0.2,
      y: y * 0.2,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
  
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    });
  });
});

// Card hover 3D effect
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
  
  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    });
  });
});

// Section header animations
gsap.utils.toArray('.section-head').forEach(head => {
  gsap.fromTo(head.children,
    { opacity: 0, y: 30 },
    {
      scrollTrigger: {
        trigger: head,
        start: 'top 80%'
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    }
  );
});

// Volunteer form handling
const form = document.getElementById('volunteerForm');
const msg = document.getElementById('formMsg');

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Animate form submission
  gsap.to(form, {
    scale: 0.98,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    ease: 'power2.inOut',
    onComplete: () => {
      msg.textContent = 'Thank you for stepping up! We will contact you soon.';
      msg.style.color = '#059669';
      msg.style.background = 'rgba(16, 185, 129, 0.1)';
      
      gsap.fromTo(msg, 
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
      
      form.reset();
      
      setTimeout(() => {
        gsap.to(msg, {
          opacity: 0,
          y: -10,
          duration: 0.5,
          onComplete: () => {
            msg.textContent = '';
          }
        });
      }, 4000);
    }
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: target, offsetY: 80 },
        ease: 'power2.inOut'
      });
      // Close mobile nav if open
      nav?.classList.remove('open');
      navToggle?.classList.remove('active');
    }
  });
});

// Page transition system
class PageTransition {
  constructor() {
    this.transitionEl = document.createElement('div');
    this.transitionEl.className = 'page-transition';
    document.body.appendChild(this.transitionEl);
    
    this.initLinks();
  }
  
  initLinks() {
    // Handle internal links (excluding anchor links)
    document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]').forEach(link => {
      const href = link.getAttribute('href');
      // Only add transition for page navigation, not anchor links or same-page links
      if (href && !href.includes('#') && !href.includes('mailto:') && !href.includes('tel:')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.transition(link.href);
        });
      }
    });
  }
  
  transition(url) {
    // Animate out
    this.transitionEl.classList.add('active');
    
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  }
  
  onLoad() {
    // Animate in on page load
    gsap.fromTo(this.transitionEl,
      { clipPath: 'circle(100% at 50% 50%)' },
      {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          this.transitionEl.classList.remove('active');
        }
      }
    );
  }
}

// Initialize page transition
const pageTransition = new PageTransition();
pageTransition.onLoad();

// Cursor effect (optional enhancement)
let cursor = document.createElement('div');
cursor.className = 'custom-cursor';
cursor.style.cssText = `
  width: 20px;
  height: 20px;
  border: 2px solid #2563eb;
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.1s ease;
  display: none;
`;
document.body.appendChild(cursor);

// Only show custom cursor on desktop
if (window.innerWidth > 768) {
  cursor.style.display = 'block';
  let cursorFollower = document.createElement('div');
  cursorFollower.className = 'cursor-follower';
  cursorFollower.style.cssText = `
    width: 8px;
    height: 8px;
    background: #2563eb;
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9998;
    transition: transform 0.15s ease;
  `;
  document.body.appendChild(cursorFollower);
  
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX - 10,
      y: e.clientY - 10,
      duration: 0.3
    });
    gsap.to(cursorFollower, {
      x: e.clientX - 4,
      y: e.clientY - 4,
      duration: 0.2
    });
  });
  
  // Scale cursor on hover
  document.querySelectorAll('a, button, .card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { scale: 1.5, borderColor: '#06b6d4' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { scale: 1, borderColor: '#2563eb' });
    });
  });
}

// Parallax scroll for hero
gsap.to('.hero-gradient', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1
  },
  y: 100,
  opacity: 0.5
});

// Counter animation for stats
function animateCounter(el, target) {
  const duration = 2000;
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
    }
  }, 16);
}

// Animate counters when in view
document.querySelectorAll('.stat-num').forEach(stat => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const text = stat.textContent;
        const num = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/\d/g, '');
        stat.dataset.suffix = suffix;
        stat.textContent = '0' + suffix;
        animateCounter(stat, num);
        observer.unobserve(stat);
      }
    });
  }, { threshold: 0.5 });
  
  observer.observe(stat);
});
