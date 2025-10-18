// Portfolio Generator JavaScript Functions

function generateHTML(data) {
    const skillTags = data.skills ? data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('\n                        ') : '';
    
    const socialLinks = [];
    if (data.linkedin) socialLinks.push(`<a href="${data.linkedin}" class="social-icon"><i class="fab fa-linkedin"></i></a>`);
    if (data.github) socialLinks.push(`<a href="${data.github}" class="social-icon"><i class="fab fa-github"></i></a>`);
    if (data.twitter) socialLinks.push(`<a href="${data.twitter}" class="social-icon"><i class="fab fa-twitter"></i></a>`);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName} - Portfolio</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <h1 class="nav-logo">${data.fullName}</h1>
            <ul class="nav-menu">
                <li class="nav-item"><a href="#home" class="nav-link">Home</a></li>
                <li class="nav-item"><a href="#about" class="nav-link">About</a></li>
                <li class="nav-item"><a href="#portfolio" class="nav-link">Portfolio</a></li>
                <li class="nav-item"><a href="#resume" class="nav-link">Resume</a></li>
                <li class="nav-item"><a href="#contact" class="nav-link">Contact</a></li>
            </ul>
            <div class="hamburger">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="hero-content">
            <img src="images/profile-photo.jpg" alt="Profile Photo" class="profile-photo">
            <h1 class="hero-title">Hello, I'm <span class="highlight">${data.fullName}</span></h1>
            <p class="hero-subtitle">${data.jobTitle}</p>
            <p class="hero-description">${data.aboutMe}</p>
            <div class="hero-buttons">
                <a href="#contact" class="btn btn-primary">Get In Touch</a>
                <a href="#resume" class="btn btn-secondary">View Resume</a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <div class="about-text">
                    <p>${data.aboutMe}</p>
                    <p>I'm passionate about creating exceptional digital experiences and bringing ideas to life through technology. With a focus on quality and innovation, I strive to deliver solutions that make a real impact.</p>
                </div>
                ${data.skills && data.skills.length > 0 ? `<div class="skills">
                    <h3>Skills & Expertise</h3>
                    <div class="skill-tags">
                        ${skillTags}
                    </div>
                </div>` : ''}
            </div>
        </div>
    </section>

    <!-- Portfolio Section -->
    <section id="portfolio" class="portfolio">
        <div class="container">
            <h2 class="section-title">Portfolio</h2>
            <div class="portfolio-grid">
                <div class="portfolio-item">
                    <img src="images/project1.jpg" alt="Project 1">
                    <div class="portfolio-overlay">
                        <h3>Project Title 1</h3>
                        <p>Brief description of your first project</p>
                    </div>
                </div>
                <div class="portfolio-item">
                    <img src="images/project2.jpg" alt="Project 2">
                    <div class="portfolio-overlay">
                        <h3>Project Title 2</h3>
                        <p>Brief description of your second project</p>
                    </div>
                </div>
                <div class="portfolio-item">
                    <img src="images/project3.jpg" alt="Project 3">
                    <div class="portfolio-overlay">
                        <h3>Project Title 3</h3>
                        <p>Brief description of your third project</p>
                    </div>
                </div>
                <div class="portfolio-item">
                    <img src="images/project4.jpg" alt="Project 4">
                    <div class="portfolio-overlay">
                        <h3>Project Title 4</h3>
                        <p>Brief description of your fourth project</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Resume Section -->
    <section id="resume" class="resume">
        <div class="container">
            <h2 class="section-title">Resume</h2>
            <div class="resume-container">
                <div class="resume-header">
                    <p>Download or view my complete resume below:</p>
                    <div class="resume-buttons">
                        <a href="files/resume.pdf" class="btn btn-primary" target="_blank">
                            <i class="fas fa-download"></i> Download PDF
                        </a>
                        <button onclick="toggleResumeView()" class="btn btn-secondary">
                            <i class="fas fa-eye"></i> <span id="resume-toggle-text">View Online</span>
                        </button>
                    </div>
                </div>
                <div id="resume-viewer" class="resume-viewer" style="display: none;">
                    <iframe src="files/resume.pdf" width="100%" height="800px"></iframe>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <div class="contact-content">
                <div class="contact-info">
                    ${data.email ? `<div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <div>
                            <h3>Email</h3>
                            <p>${data.email}</p>
                        </div>
                    </div>` : ''}
                    ${data.phone ? `<div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <div>
                            <h3>Phone</h3>
                            <p>${data.phone}</p>
                        </div>
                    </div>` : ''}
                    ${data.location ? `<div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <h3>Location</h3>
                            <p>${data.location}</p>
                        </div>
                    </div>` : ''}
                </div>
                ${socialLinks.length > 0 ? `<div class="social-links">
                    <h3>Connect With Me</h3>
                    <div class="social-icons">
                        ${socialLinks.join('\n                        ')}
                    </div>
                </div>` : ''}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 ${data.fullName}. All rights reserved.</p>
            <p>Built with ❤️ using GitHub Pages</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
}

function generateCSS(theme = 'blue') {
    const themes = {
        blue: {
            primary: '#3498db',
            primaryDark: '#2980b9',
            secondary: '#2c3e50',
            accent: '#f39c12',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        green: {
            primary: '#27ae60',
            primaryDark: '#229954',
            secondary: '#2c3e50',
            accent: '#f39c12',
            gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
        },
        purple: {
            primary: '#8e44ad',
            primaryDark: '#732d91',
            secondary: '#2c3e50',
            accent: '#f39c12',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        orange: {
            primary: '#e67e22',
            primaryDark: '#d35400',
            secondary: '#2c3e50',
            accent: '#3498db',
            gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)'
        },
        teal: {
            primary: '#16a085',
            primaryDark: '#138d75',
            secondary: '#2c3e50',
            accent: '#f39c12',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        red: {
            primary: '#e74c3c',
            primaryDark: '#c0392b',
            secondary: '#2c3e50',
            accent: '#f39c12',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }
    };
    
    const selectedTheme = themes[theme] || themes.blue;
    
    return `/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    scroll-behavior: smooth;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Navigation */
.navbar {
    background: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    transition: all 0.3s ease;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
}

.nav-logo {
    font-size: 1.8rem;
    font-weight: bold;
    color: ${selectedTheme.secondary};
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-link {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-link:hover {
    color: ${selectedTheme.primary};
}

.hamburger {
    display: none;
    flex-direction: column;
    cursor: pointer;
}

.bar {
    width: 25px;
    height: 3px;
    background: #333;
    margin: 3px 0;
    transition: 0.3s;
}

/* Hero Section */
.hero {
    background: ${selectedTheme.gradient};
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    padding: 100px 20px 50px;
}

.hero-content {
    max-width: 800px;
}

.profile-photo {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    border: 5px solid rgba(255,255,255,0.2);
    margin-bottom: 2rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.hero-title {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.highlight {
    color: ${selectedTheme.accent};
}

.hero-subtitle {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    opacity: 0.9;
}

.hero-description {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.8;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

/* Buttons */
.btn {
    padding: 12px 30px;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-block;
    border: none;
    cursor: pointer;
    font-size: 1rem;
}

.btn-primary {
    background: ${selectedTheme.primary};
    color: white;
}

.btn-primary:hover {
    background: ${selectedTheme.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background: white;
    color: #333;
    transform: translateY(-2px);
}

/* Section Styles */
section {
    padding: 80px 0;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: ${selectedTheme.secondary};
    position: relative;
}

.section-title::after {
    content: '';
    width: 60px;
    height: 4px;
    background: ${selectedTheme.primary};
    display: block;
    margin: 1rem auto;
}

/* About Section */
.about {
    background: #f8f9fa;
}

.about-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: start;
}

.about-text {
    font-size: 1.1rem;
    line-height: 1.8;
}

.about-text p {
    margin-bottom: 1.5rem;
}

.skills h3 {
    margin-bottom: 1.5rem;
    color: ${selectedTheme.secondary};
    font-size: 1.5rem;
}

.skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
}

.skill-tag {
    background: ${selectedTheme.primary};
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 25px;
    font-size: 0.9rem;
    font-weight: 500;
}

/* Portfolio Section */
.portfolio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.portfolio-item {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.portfolio-item:hover {
    transform: translateY(-10px);
}

.portfolio-item img {
    width: 100%;
    height: 250px;
    object-fit: cover;
}

.portfolio-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    color: white;
    padding: 2rem;
    transform: translateY(100%);
    transition: transform 0.3s ease;
}

.portfolio-item:hover .portfolio-overlay {
    transform: translateY(0);
}

.portfolio-overlay h3 {
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
}

/* Resume Section */
.resume {
    background: #f8f9fa;
}

.resume-container {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

.resume-header p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #666;
}

.resume-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 2rem;
}

.resume-viewer {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    margin-top: 2rem;
}

.resume-viewer iframe {
    border: none;
    border-radius: 10px;
}

/* Contact Section */
.contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    max-width: 800px;
    margin: 0 auto;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
}

.contact-item i {
    background: ${selectedTheme.primary};
    color: white;
    padding: 1rem;
    border-radius: 50%;
    font-size: 1.2rem;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.contact-item h3 {
    margin-bottom: 0.5rem;
    color: ${selectedTheme.secondary};
}

.social-links {
    text-align: center;
}

.social-links h3 {
    margin-bottom: 1.5rem;
    color: ${selectedTheme.secondary};
}

.social-icons {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.social-icon {
    background: ${selectedTheme.primary};
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-size: 1.5rem;
    transition: all 0.3s ease;
}

.social-icon:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

/* Footer */
.footer {
    background: ${selectedTheme.secondary};
    color: white;
    text-align: center;
    padding: 2rem 0;
}

.footer p {
    margin: 0.5rem 0;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hamburger {
        display: flex;
    }

    .nav-menu {
        position: fixed;
        left: -100%;
        top: 70px;
        flex-direction: column;
        background-color: white;
        width: 100%;
        text-align: center;
        transition: 0.3s;
        box-shadow: 0 10px 27px rgba(0,0,0,0.05);
        padding: 2rem 0;
    }

    .nav-menu.active {
        left: 0;
    }

    .nav-menu li {
        margin: 1rem 0;
    }

    .hero-title {
        font-size: 2.5rem;
    }

    .about-content,
    .contact-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }

    .btn {
        width: 200px;
    }

    .profile-photo {
        width: 150px;
        height: 150px;
    }

    .section-title {
        font-size: 2rem;
    }

    .resume-buttons {
        flex-direction: column;
        align-items: center;
    }

    .social-icons {
        flex-wrap: wrap;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 0 15px;
    }

    .hero {
        padding: 120px 15px 50px;
    }

    .hero-title {
        font-size: 2rem;
    }

    .hero-subtitle {
        font-size: 1.2rem;
    }

    .portfolio-grid {
        grid-template-columns: 1fr;
    }

    section {
        padding: 60px 0;
    }
}

/* Animation for smooth loading */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.hero-content > * {
    animation: fadeInUp 0.8s ease-out;
}

.hero-content > *:nth-child(2) { animation-delay: 0.2s; }
.hero-content > *:nth-child(3) { animation-delay: 0.4s; }
.hero-content > *:nth-child(4) { animation-delay: 0.6s; }
.hero-content > *:nth-child(5) { animation-delay: 0.8s; }`;
}

function generateJS() {
    return `// Mobile Navigation Toggle
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
    item.style.animationDelay = \`\${index * 0.1}s\`;
});

// Handle image loading errors gracefully
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        // Create a placeholder div when image fails to load
        const placeholder = document.createElement('div');
        placeholder.style.cssText = \`
            width: 100%;
            height: \${this.offsetHeight || 250}px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
            border-radius: 10px;
        \`;
        
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

// Add smooth reveal animation to skill tags
document.querySelectorAll('.skill-tag').forEach((tag, index) => {
    tag.style.animationDelay = \`\${index * 0.1}s\`;
    tag.style.animation = 'fadeInUp 0.6s ease-out forwards';
});

// Add parallax effect to hero section (subtle)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = \`translate3d(0, \${rate}px, 0)\`;
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
});`;
}
