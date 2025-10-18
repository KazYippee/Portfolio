// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
    }
});

// Resume viewer toggle
function toggleResumeView() {
    const viewer = document.getElementById('resume-viewer');
    const toggleText = document.getElementById('resume-toggle-text');
    
    if (viewer.style.display === 'none' || viewer.style.display === '') {
        viewer.style.display = 'block';
        toggleText.textContent = 'Hide Resume';
        // Smooth scroll to resume viewer
        setTimeout(() => {
            viewer.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        viewer.style.display = 'none';
        toggleText.textContent = 'View Online';
    }
}

// Add animation to elements when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Add loading animation to portfolio items
document.querySelectorAll('.portfolio-item').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
});

// Handle image loading errors gracefully
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        // Create a placeholder div when image fails to load
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100%;
            height: ${this.offsetHeight || 250}px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
            border-radius: 10px;
        `;
        
        // Different messages based on image type
        if (this.classList.contains('profile-photo')) {
            placeholder.innerHTML = '<i class="fas fa-user" style="font-size: 3rem;"></i>';
            placeholder.style.borderRadius = '50%';
        } else {
            placeholder.textContent = 'Image Coming Soon';
        }
        
        this.parentNode.replaceChild(placeholder, this);
    });
});

// Add typing effect to hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads (uncomment to enable)
// window.addEventListener('load', () => {
//     const heroTitle = document.querySelector('.hero-title');
//     const originalText = heroTitle.textContent;
//     typeWriter(heroTitle, originalText, 100);
// });

// Add smooth reveal animation to skill tags
document.querySelectorAll('.skill-tag').forEach((tag, index) => {
    tag.style.animationDelay = `${index * 0.1}s`;
    tag.style.animation = 'fadeInUp 0.6s ease-out forwards';
});

// Contact form handling (if you add a contact form later)
function handleContactForm(event) {
    event.preventDefault();
    // Add your form handling logic here
    // This could integrate with services like Formspree, Netlify Forms, etc.
    alert('Thank you for your message! I\'ll get back to you soon.');
}

// Add parallax effect to hero section (subtle)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translate3d(0, ${rate}px, 0)`;
    }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio website loaded successfully!');
    
    // Add any initialization code here
    
    // Example: Auto-hide mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});
