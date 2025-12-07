/**
 * ZimSaaS Landing Page - JavaScript
 * Handles mobile navigation, smooth scrolling, and form submission
 */

document.addEventListener('DOMContentLoaded', () => {
    // ===== Initialize Galaxy Background =====
    // Wait for OGL and React to load
    let attempts = 0;
    const maxAttempts = 50;
    const checkDependencies = setInterval(() => {
        attempts++;
        if (window.React && window.ReactDOM && window.initGalaxyBackground) {
            clearInterval(checkDependencies);
            console.log('Initializing Galaxy...');
            window.initGalaxyBackground();
        } else if (attempts >= maxAttempts) {
            clearInterval(checkDependencies);
            console.error('Failed to load Galaxy dependencies', {
                React: !!window.React,
                ReactDOM: !!window.ReactDOM,
                initGalaxyBackground: !!window.initGalaxyBackground
            });
        }
    }, 100);
    
    // ===== Mobile Navigation Toggle =====
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

    // Toggle mobile menu
    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    };

    // Close menu when clicking hamburger
    hamburger.addEventListener('click', toggleMenu);

    // Close menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
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
                
                const navHeight = document.querySelector('.navbar').offsetHeight;
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
  contactForm.addEventListener('submit', (e) => {
    // Optional UX: disable button / change text
    const submitBtn = contactForm.querySelector('.btn-submit, button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }
    // IMPORTANT: no e.preventDefault() here
    // Browser will POST to /api/ghl-form
    // Form will submit naturally
  });
}



    // ===== Navbar Hide on Scroll Down =====
    const navbar = document.querySelector('.navbar');
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
    const solutionCards = document.querySelectorAll('.solution-card');
    solutionCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        animateOnScroll.observe(card);
    });

    // Observe feature cards for animation
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        animateOnScroll.observe(card);
    });

    // Observe industry cards for animation
    const industryCards = document.querySelectorAll('.industry-card');
    industryCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`;
        animateOnScroll.observe(card);
    });
    
    // Observe contact form for animation
    const contactFormContainer = document.querySelector('.contact-form');
    if (contactFormContainer) {
        contactFormContainer.style.opacity = '0';
        contactFormContainer.style.transform = 'translateY(30px)';
        contactFormContainer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animateOnScroll.observe(contactFormContainer);
    }
});

