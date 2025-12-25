/**
 * ZimSaaS Landing Page - JavaScript
 * Handles mobile navigation, smooth scrolling, and form submission
 */

console.log('🚀 script.js loaded - version Dec 7 2025 18:00');

document.addEventListener('DOMContentLoaded', () => {
    // ===== Mobile Navigation Toggle =====
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    // Toggle mobile menu
    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        // Toggle Tailwind classes for mobile menu
        navMenu.classList.toggle('translate-y-0');
        navMenu.classList.toggle('-translate-y-full');
        navMenu.classList.toggle('opacity-100');
        navMenu.classList.toggle('opacity-0');
        navMenu.classList.toggle('visible');
        navMenu.classList.toggle('invisible');
        
        // Prevent body scroll when menu is open
        const isOpen = navMenu.classList.contains('translate-y-0');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    // Close menu when clicking hamburger
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('translate-y-0')) {
                toggleMenu();
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('translate-y-0')) {
            toggleMenu();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('translate-y-0') && 
            !navMenu.contains(e.target) && 
            hamburger && !hamburger.contains(e.target)) {
            toggleMenu();
        }
    });


    // ===== Smooth Scrolling for Internal Links =====
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if it's just "#" (placeholder)
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                const navbar = document.querySelector('nav');
                const navHeight = navbar ? navbar.offsetHeight : 72;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

// ===== Contact Form Handling =====
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable button and show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn.innerHTML;
    if (submitBtn) {
      submitBtn.disabled = true;
      const span = submitBtn.querySelector('span');
      if (span) {
        span.textContent = 'Sending...';
      } else {
        submitBtn.textContent = 'Sending...';
      }
    }

    try {
      // Get form data
      const formData = new FormData(contactForm);
      const body = new URLSearchParams(formData).toString();

      // Submit to API
      const response = await fetch('/api/ghl-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        throw new Error('Failed to parse response');
      }

      if (response.ok && result.success) {
        // Show thank you modal
        showThankYouModal();
        // Reset form and restore button
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
      } else {
        alert('Something went wrong submitting your form. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong submitting your form. Please try again.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    }
  });
}

// ===== Thank You Modal =====
function showThankYouModal() {
  // Create modal overlay
  const modal = document.createElement('div');
  modal.id = 'thank-you-modal';
  modal.className = 'thank-you-modal-overlay';
  modal.innerHTML = `
    <div class="thank-you-modal-content">
      <div class="thank-you-icon-wrapper">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>
      <h2 class="thank-you-title">Thank you!</h2>
      <p class="thank-you-message">Your request has been received. We'll get back to you shortly with your customized automation plan.</p>
      <button class="thank-you-close-btn" onclick="closeThankYouModal()">
        <span>Close</span>
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close when clicking overlay background
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeThankYouModal();
    }
  });
  
  // Trigger animation
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Close on escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeThankYouModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

function closeThankYouModal() {
  const modal = document.getElementById('thank-you-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

// Make function available globally
window.closeThankYouModal = closeThankYouModal;



    // ===== Navbar Hide on Scroll Down =====
    const navbar = document.querySelector('nav');
    let lastScroll = 0;
    let scrollThreshold = 100; // Only hide after scrolling 100px
    
    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class for enhanced styling
        if (currentScroll > 50) {
            navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
        } else {
            navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
        }
        
        // Hide navbar when scrolling down, show when scrolling up
        if (currentScroll > scrollThreshold) {
            if (currentScroll > lastScroll) {
                // Scrolling down - hide navbar
                navbar.style.transform = 'translateY(-100%)';
                navbar.style.transition = 'transform 0.3s ease-in-out';
            } else {
                // Scrolling up - show navbar
                navbar.style.transform = 'translateY(0)';
                navbar.style.transition = 'transform 0.3s ease-in-out';
            }
        } else {
            // Near top of page - always show navbar
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });


    // ===== Intersection Observer for Animations =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe solution cards for animation
    const solutionCards = document.querySelectorAll('#solutions > div > div > div > div');
    solutionCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        animateOnScroll.observe(card);
    });

    // Observe feature cards for animation
    const featureCards = document.querySelectorAll('#about > div > div:last-child > div');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        animateOnScroll.observe(card);
    });

    // Observe industry cards for animation
    const industryCards = document.querySelectorAll('#industries > div > div:last-child > div');
    industryCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`;
        animateOnScroll.observe(card);
    });
    
    // Observe contact form for animation
    const contactFormContainer = document.querySelector('#contact-form');
    if (contactFormContainer) {
        contactFormContainer.style.opacity = '0';
        contactFormContainer.style.transform = 'translateY(30px)';
        contactFormContainer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animateOnScroll.observe(contactFormContainer);
    }
});

