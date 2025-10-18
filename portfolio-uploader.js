// Portfolio Upload and ZIP Generation Handler
class PortfolioUploader {
    constructor() {
        this.uploadedFiles = {
            profilePhoto: null,
            resume: null,
            experienceImages: []
        };
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Profile photo upload
        this.setupFileUpload('profilePhotoUpload', 'profilePhotoInput', 'profilePhoto', 'profilePhotoPreview');
        
        // Resume upload
        this.setupFileUpload('resumeUpload', 'resumeInput', 'resume', 'resumePreview');
        
        // Experience image uploads
        this.setupExperienceImageUploads();
        
        // Color theme selection
        this.setupColorThemeSelection();
        
        // Form submission
        document.getElementById('portfolioForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generatePortfolioZip();
        });
    }

    setupFileUpload(uploadAreaId, inputId, fileType, previewId) {
        const uploadArea = document.getElementById(uploadAreaId);
        const fileInput = document.getElementById(inputId);
        const preview = document.getElementById(previewId);

        // Click to upload
        uploadArea.addEventListener('click', () => fileInput.click());

        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelection(files[0], fileType, preview);
            }
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelection(e.target.files[0], fileType, preview);
            }
        });
    }

    setupExperienceImageUploads() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.experience-image-upload')) {
                const uploadArea = e.target.closest('.experience-image-upload');
                const index = uploadArea.dataset.index;
                const fileInput = uploadArea.querySelector('input[type="file"]');
                fileInput.click();
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.type === 'file' && e.target.closest('.experience-image-upload')) {
                const uploadArea = e.target.closest('.experience-image-upload');
                const index = parseInt(uploadArea.dataset.index);
                const preview = document.querySelector(`.experience-image-preview[data-index="${index}"]`);
                
                if (e.target.files.length > 0) {
                    this.handleExperienceImageSelection(e.target.files[0], index, preview);
                }
            }
        });
    }

    setupColorThemeSelection() {
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                document.getElementById('selectedTheme').value = option.dataset.theme;
            });
        });
    }

    handleFileSelection(file, fileType, preview) {
        // Validate file
        if (!this.validateFile(file, fileType)) {
            return;
        }

        // Store file
        this.uploadedFiles[fileType] = file;

        // Show preview
        this.showFilePreview(file, preview, fileType);
    }

    handleExperienceImageSelection(file, index, preview) {
        // Validate image file
        if (!this.validateFile(file, 'image')) {
            return;
        }

        // Ensure array exists and has enough slots
        while (this.uploadedFiles.experienceImages.length <= index) {
            this.uploadedFiles.experienceImages.push(null);
        }

        // Store file
        this.uploadedFiles.experienceImages[index] = file;

        // Show preview
        this.showFilePreview(file, preview, 'image');
    }

    validateFile(file, fileType) {
        const maxSizes = {
            profilePhoto: 5 * 1024 * 1024, // 5MB
            image: 5 * 1024 * 1024, // 5MB
            resume: 10 * 1024 * 1024 // 10MB
        };

        const allowedTypes = {
            profilePhoto: ['image/jpeg', 'image/png', 'image/webp'],
            image: ['image/jpeg', 'image/png', 'image/webp'],
            resume: ['application/pdf']
        };

        // Check file size
        const maxSize = maxSizes[fileType] || maxSizes.image;
        if (file.size > maxSize) {
            alert(`File size too large. Maximum allowed: ${maxSize / (1024 * 1024)}MB`);
            return false;
        }

        // Check file type
        const allowed = allowedTypes[fileType] || allowedTypes.image;
        if (!allowed.includes(file.type)) {
            alert(`Invalid file type. Allowed: ${allowed.map(type => type.split('/')[1]).join(', ')}`);
            return false;
        }

        return true;
    }

    showFilePreview(file, preview, fileType) {
        preview.innerHTML = '';

        const fileInfo = document.createElement('div');
        fileInfo.className = 'uploaded-file';

        if (fileType === 'image' || fileType === 'profilePhoto') {
            const reader = new FileReader();
            reader.onload = (e) => {
                fileInfo.innerHTML = `
                    <div class="uploaded-file-info">
                        <img src="${e.target.result}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                        <div>
                            <div style="font-weight: 600;">${file.name}</div>
                            <div style="font-size: 0.8em; color: #666;">${(file.size / 1024).toFixed(1)} KB</div>
                        </div>
                    </div>
                    <button type="button" class="remove-file" onclick="portfolioUploader.removeFile('${fileType}', this)">Remove</button>
                `;
            };
            reader.readAsDataURL(file);
        } else {
            fileInfo.innerHTML = `
                <div class="uploaded-file-info">
                    <span class="uploaded-file-icon">📄</span>
                    <div>
                        <div style="font-weight: 600;">${file.name}</div>
                        <div style="font-size: 0.8em; color: #666;">${(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                </div>
                <button type="button" class="remove-file" onclick="portfolioUploader.removeFile('${fileType}', this)">Remove</button>
            `;
        }

        preview.appendChild(fileInfo);
    }

    removeFile(fileType, buttonElement) {
        if (fileType === 'profilePhoto' || fileType === 'resume') {
            this.uploadedFiles[fileType] = null;
        }
        
        buttonElement.closest('.uploaded-file').remove();
    }

    async generatePortfolioZip() {
        const formData = new FormData(document.getElementById('portfolioForm'));
        const data = Object.fromEntries(formData.entries());

        // Validate required fields
        if (!this.validateFormData(data)) {
            return;
        }

        // Show progress
        this.showProgress(0);

        try {
            // Create ZIP file
            const zip = new JSZip();
            
            // Add main website files
            await this.addWebsiteFiles(zip, data);
            this.showProgress(25);

            // Add uploaded images
            await this.addUploadedImages(zip);
            this.showProgress(50);

            // Add resume
            await this.addResume(zip);
            this.showProgress(75);

            // Add README and setup instructions
            this.addSetupFiles(zip, data);
            this.showProgress(90);

            // Generate and download ZIP
            const content = await zip.generateAsync({type: "blob"});
            this.downloadZip(content, data.fullName);
            this.showProgress(100);

            // Show success
            document.getElementById('outputContainer').style.display = 'block';
            document.getElementById('downloadZip').href = URL.createObjectURL(content);
            document.getElementById('downloadZip').download = `${data.fullName.replace(/\s+/g, '-').toLowerCase()}-portfolio.zip`;

        } catch (error) {
            console.error('Error generating portfolio:', error);
            alert('Error generating portfolio. Please try again.');
        }
    }

    validateFormData(data) {
        // Check required fields
        const requiredFields = ['fullName', 'jobTitle', 'aboutMe', 'email'];
        for (const field of requiredFields) {
            if (!data[field]?.trim()) {
                alert(`Please fill in the required field: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return false;
            }
        }

        // Check if profile photo is uploaded
        if (!this.uploadedFiles.profilePhoto) {
            alert('Please upload a profile photo');
            return false;
        }

        // Check if resume is uploaded
        if (!this.uploadedFiles.resume) {
            alert('Please upload your resume');
            return false;
        }

        return true;
    }

    async addWebsiteFiles(zip, data) {
        // Generate HTML content
        const htmlContent = this.generateHTML(data);
        zip.file("index.html", htmlContent);

        // Generate CSS content
        const cssContent = this.generateCSS(data.theme);
        zip.file("style.css", cssContent);

        // Generate JavaScript content
        const jsContent = this.generateJS();
        zip.file("script.js", jsContent);
    }

    async addUploadedImages(zip) {
        const imagesFolder = zip.folder("images");

        // Add profile photo
        if (this.uploadedFiles.profilePhoto) {
            const profileExtension = this.uploadedFiles.profilePhoto.name.split('.').pop();
            imagesFolder.file(`profile.${profileExtension}`, this.uploadedFiles.profilePhoto);
        }

        // Add experience images
        for (let i = 0; i < this.uploadedFiles.experienceImages.length; i++) {
            const image = this.uploadedFiles.experienceImages[i];
            if (image) {
                const extension = image.name.split('.').pop();
                imagesFolder.file(`experience-${i + 1}.${extension}`, image);
            }
        }
    }

    async addResume(zip) {
        if (this.uploadedFiles.resume) {
            const filesFolder = zip.folder("files");
            filesFolder.file("resume.pdf", this.uploadedFiles.resume);
        }
    }

    addSetupFiles(zip, data) {
        const readmeContent = this.generateREADME(data);
        zip.file("README.md", readmeContent);

        // Add GitHub Pages setup instructions
        const setupContent = this.generateSetupInstructions(data);
        zip.file("SETUP.md", setupContent);
    }

    generateHTML(data) {
        // Get form data
        const formData = new FormData(document.getElementById('portfolioForm'));
        
        // Process skills
        const skills = Array.from(formData.getAll('skills[]')).filter(skill => skill.trim());
        
        // Process experiences
        const experienceTitles = Array.from(formData.getAll('experienceTitle[]')).filter(title => title.trim());
        const experienceDescriptions = Array.from(formData.getAll('experienceDescription[]')).filter(desc => desc.trim());
        
        // Get profile photo extension
        const profileExtension = this.uploadedFiles.profilePhoto?.name.split('.').pop() || 'jpg';

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName} - Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav id="navbar">
        <div class="nav-container">
            <a href="#" class="nav-logo">${data.fullName}</a>
            <ul class="nav-menu">
                <li class="nav-item"><a href="#hero" class="nav-link">Home</a></li>
                <li class="nav-item"><a href="#about" class="nav-link">About</a></li>
                <li class="nav-item"><a href="#experience" class="nav-link">Experience</a></li>
                <li class="nav-item"><a href="#resume" class="nav-link">Resume</a></li>
                <li class="nav-item"><a href="#contact" class="nav-link">Contact</a></li>
            </ul>
        </div>
    </nav>

    <section id="hero" class="hero">
        <div class="hero-content">
            <div class="profile-image">
                <img src="images/profile.${profileExtension}" alt="${data.fullName}">
            </div>
            <h1>${data.fullName}</h1>
            <h2>${data.jobTitle}</h2>
            <p class="hero-description">${data.aboutMe}</p>
            <div class="hero-buttons">
                <a href="#resume" class="btn-primary">📄 View Resume</a>
                <a href="files/resume.pdf" class="btn-secondary" target="_blank" rel="noopener">� Download Resume</a>
                <a href="#contact" class="btn-secondary">📞 Get In Touch</a>
            </div>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <div class="about-text">
                    <p>${data.aboutMe}</p>
                </div>
                <div class="skills">
                    <h3>Skills & Expertise</h3>
                    <div class="skills-grid">
                        ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="experience" class="experience">
        <div class="container">
            <h2 class="section-title">Experience & Projects</h2>
            <div class="experience-grid">
                ${experienceTitles.map((title, index) => {
                    const description = experienceDescriptions[index] || '';
                    const imageExtension = this.uploadedFiles.experienceImages[index]?.name.split('.').pop() || 'jpg';
                    const isEven = index % 2 === 0;
                    
                    return `
                        <div class="experience-item ${isEven ? 'reverse' : ''}">
                            <div class="experience-image">
                                <img src="images/experience-${index + 1}.${imageExtension}" alt="${title}">
                            </div>
                            <div class="experience-content">
                                <h3>${title}</h3>
                                <p>${description}</p>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    </section>

    <section id="resume" class="resume">
        <div class="container">
            <h2 class="section-title">Resume</h2>
            <div class="resume-content">
                <div class="resume-actions">
                    <a href="files/resume.pdf" class="btn-download" target="_blank" rel="noopener">📄 Download PDF</a>
                    <a href="files/resume.pdf" class="btn-print" onclick="printResume()" rel="noopener">🖨️ Print Resume</a>
                </div>
                <div class="resume-viewer">
                    <iframe src="files/resume.pdf" class="resume-iframe" title="Resume"></iframe>
                    <div class="resume-fallback">
                        <p>📄 <strong>Resume Preview</strong></p>
                        <p>Your browser doesn't support PDF viewing. <a href="files/resume.pdf" target="_blank" rel="noopener">Click here to download and view the resume</a></p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <div class="contact-content">
                <div class="contact-info">
                    <div class="contact-item">
                        <span class="contact-icon">📧</span>
                        <a href="mailto:${data.email}">${data.email}</a>
                    </div>
                    ${data.phone ? `
                    <div class="contact-item">
                        <span class="contact-icon">📞</span>
                        <span>${data.phone}</span>
                    </div>
                    ` : ''}
                    ${data.location ? `
                    <div class="contact-item">
                        <span class="contact-icon">📍</span>
                        <span>${data.location}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="social-links">
                    ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" rel="noopener" class="social-link">LinkedIn</a>` : ''}
                    ${data.github ? `<a href="${data.github}" target="_blank" rel="noopener" class="social-link">GitHub</a>` : ''}
                    ${data.twitter ? `<a href="${data.twitter}" target="_blank" rel="noopener" class="social-link">Twitter</a>` : ''}
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${data.fullName}. All rights reserved.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
    }

    generateCSS(theme) {
        const themes = {
            blue: { primary: '#3498db', secondary: '#2980b9', accent: '#e3f2fd' },
            green: { primary: '#27ae60', secondary: '#229954', accent: '#e8f5e8' },
            purple: { primary: '#8e44ad', secondary: '#732d91', accent: '#f3e5f5' },
            orange: { primary: '#e67e22', secondary: '#d35400', accent: '#fef7e6' },
            teal: { primary: '#16a085', secondary: '#138d75', accent: '#e6fffa' },
            red: { primary: '#e74c3c', secondary: '#c0392b', accent: '#fdf2f2' }
        };

        const colors = themes[theme] || themes.blue;

        return `/* Portfolio CSS - Generated with ${theme} theme */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: ${colors.primary};
    --secondary-color: ${colors.secondary};
    --accent-color: ${colors.accent};
    --text-color: #333;
    --text-light: #666;
    --bg-color: #ffffff;
    --bg-light: #f8f9fa;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Navigation */
#navbar {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
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
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
    text-decoration: none;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-link {
    color: var(--text-color);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-link:hover {
    color: var(--primary-color);
}

/* Hero Section */
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    text-align: center;
    padding: 100px 20px 50px;
}

.hero-content h1 {
    font-size: 3.5rem;
    margin-bottom: 0.5rem;
    animation: fadeInUp 1s ease;
}

.hero-content h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    opacity: 0.9;
    animation: fadeInUp 1s ease 0.2s both;
}

.hero-description {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    opacity: 0.9;
    animation: fadeInUp 1s ease 0.4s both;
}

.profile-image {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin: 0 auto 2rem;
    overflow: hidden;
    border: 5px solid rgba(255, 255, 255, 0.3);
    animation: fadeIn 1s ease 0.6s both;
}

.profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    animation: fadeInUp 1s ease 0.8s both;
}

.btn-primary, .btn-secondary {
    padding: 12px 30px;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-block;
}

.btn-primary {
    background: white;
    color: var(--primary-color);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background: white;
    color: var(--primary-color);
}

/* Sections */
section {
    padding: 80px 0;
}

.section-title {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 3rem;
    color: var(--text-color);
    position: relative;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: var(--primary-color);
}

/* About Section */
.about {
    background: var(--bg-light);
}

.about-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    max-width: 800px;
    margin: 0 auto;
}

.about-text p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--text-light);
    text-align: center;
}

.skills h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-align: center;
    color: var(--text-color);
}

.skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
}

.skill-tag {
    background: var(--primary-color);
    color: white;
    padding: 8px 16px;
    border-radius: 25px;
    font-size: 0.9rem;
    font-weight: 500;
}

/* Experience Section */
.experience-grid {
    display: flex;
    flex-direction: column;
    gap: 4rem;
}

.experience-item {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
    animation: fadeInUp 1s ease;
}

.experience-item.reverse {
    grid-template-columns: 1fr 1fr;
}

.experience-item.reverse .experience-image {
    order: 2;
}

.experience-item.reverse .experience-content {
    order: 1;
}

.experience-image img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 10px;
    transition: transform 0.3s ease;
}

.experience-image img:hover {
    transform: scale(1.05);
}

.experience-content h3 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: var(--primary-color);
}

.experience-content p {
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--text-light);
}

/* Resume Section */
.resume {
    background: var(--bg-light);
}

.resume-content {
    max-width: 900px;
    margin: 0 auto;
}

.resume-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.btn-download, .btn-print {
    background: var(--primary-color);
    color: white;
    padding: 12px 24px;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn-download:hover, .btn-print:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.resume-viewer {
    position: relative;
    width: 100%;
    height: 800px;
    border: 2px solid #e1e1e1;
    border-radius: 10px;
    overflow: hidden;
    background: white;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.resume-iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
}

.resume-fallback {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    padding: 2rem;
    background: var(--bg-color);
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    display: none;
}

.resume-fallback p {
    margin-bottom: 1rem;
    color: var(--text-light);
}

.resume-fallback a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
}

.resume-fallback a:hover {
    text-decoration: underline;
}

/* Contact Section */
.contact {
    background: var(--bg-light);
}

.contact-content {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
}

.contact-info {
    margin-bottom: 2rem;
}

.contact-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

.contact-icon {
    font-size: 1.5rem;
}

.contact-item a {
    color: var(--primary-color);
    text-decoration: none;
}

.social-links {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.social-link {
    background: var(--primary-color);
    color: white;
    padding: 10px 20px;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
}

.social-link:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
}

/* Footer */
.footer {
    background: var(--text-color);
    color: white;
    text-align: center;
    padding: 2rem 0;
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

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

/* Responsive Design */
@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }
    
    .hero-content h1 {
        font-size: 2.5rem;
    }
    
    .hero-content h2 {
        font-size: 1.2rem;
    }
    
    .hero-description {
        font-size: 1rem;
    }
    
    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .experience-item,
    .experience-item.reverse {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .experience-item.reverse .experience-image,
    .experience-item.reverse .experience-content {
        order: unset;
    }
    
    .profile-image {
        width: 150px;
        height: 150px;
    }
    
    .section-title {
        font-size: 2rem;
    }
    
    .contact-item {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .social-links {
        flex-direction: column;
        align-items: center;
    }
    
    .resume-viewer {
        height: 600px;
    }
    
    .resume-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .btn-download, .btn-print {
        width: 100%;
        max-width: 250px;
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .hero-content h1 {
        font-size: 2rem;
    }
    
    .container {
        padding: 0 15px;
    }
    
    section {
        padding: 60px 0;
    }
}`;
    }

    generateJS() {
        return `// Portfolio Interactive Features
document.addEventListener('DOMContentLoaded', function() {
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

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe experience items
    document.querySelectorAll('.experience-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // Add loading animation to images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });

    // Resume iframe fallback handling
    const resumeIframe = document.querySelector('.resume-iframe');
    const resumeFallback = document.querySelector('.resume-fallback');
    
    if (resumeIframe && resumeFallback) {
        resumeIframe.addEventListener('error', function() {
            resumeIframe.style.display = 'none';
            resumeFallback.style.display = 'block';
        });
        
        // Check if iframe loads properly
        setTimeout(function() {
            try {
                if (!resumeIframe.contentDocument && !resumeIframe.contentWindow) {
                    resumeIframe.style.display = 'none';
                    resumeFallback.style.display = 'block';
                }
            } catch(e) {
                // Cross-origin error means PDF loaded successfully
            }
        }, 3000);
    }
});

// Print resume function
function printResume() {
    const resumeIframe = document.querySelector('.resume-iframe');
    if (resumeIframe) {
        try {
            resumeIframe.contentWindow.print();
        } catch(e) {
            // Fallback: open PDF in new window for printing
            window.open('files/resume.pdf', '_blank');
        }
    } else {
        window.open('files/resume.pdf', '_blank');
    }
}

// Resume section visibility check
function checkResumeVisibility() {
    const resumeSection = document.getElementById('resume');
    if (resumeSection) {
        const rect = resumeSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            // Resume section is visible, ensure iframe is loaded
            const iframe = resumeSection.querySelector('.resume-iframe');
            if (iframe && !iframe.src.includes('files/resume.pdf')) {
                iframe.src = 'files/resume.pdf';
            }
        }
    }
}

// Check resume visibility on scroll
window.addEventListener('scroll', checkResumeVisibility);`;
    }

    generateREADME(data) {
        return `# ${data.fullName} - Portfolio Website

This is a professional portfolio website generated using the Portfolio Generator tool.

## 🚀 Quick Setup

1. **Upload to GitHub:**
   - Create a new repository named \`${data.githubUsername}.github.io\`
   - Upload all files from this ZIP to your repository
   - Your website will be live at: https://${data.githubUsername}.github.io

2. **File Structure:**
   - \`index.html\` - Main website file
   - \`style.css\` - Styling with your chosen ${data.theme} theme
   - \`script.js\` - Interactive features
   - \`images/\` - All your uploaded images
   - \`files/\` - Your resume and documents

## 📁 What's Included

- ✅ Responsive design that works on all devices
- ✅ Professional ${data.theme} color theme
- ✅ Your uploaded profile photo
- ✅ Experience section with your custom images
- ✅ Your resume (downloadable PDF)
- ✅ Contact information and social media links
- ✅ Smooth animations and modern design

## 🛠️ Customization

To make changes to your portfolio:

1. Edit \`index.html\` to update content
2. Modify \`style.css\` to change styling
3. Replace images in the \`images/\` folder
4. Update your resume in the \`files/\` folder

## 📞 Support

If you need help setting up your portfolio, refer to the SETUP.md file or contact your organization's admin.

---

*Generated on ${new Date().toLocaleDateString()} using Portfolio Generator*`;
    }

    generateSetupInstructions(data) {
        return `# GitHub Pages Setup Instructions

Follow these steps to get your portfolio live on the internet:

## Step 1: Create GitHub Account
1. Go to [github.com](https://github.com)
2. Sign up for a free account if you don't have one
3. Choose the username: **${data.githubUsername}**

## Step 2: Create Repository
1. Click the "+" icon in the top right corner
2. Select "New repository"
3. Name it exactly: **${data.githubUsername}.github.io**
4. Make sure it's set to "Public"
5. Click "Create repository"

## Step 3: Upload Your Files
1. Click "uploading an existing file"
2. Drag and drop ALL files from your ZIP folder
3. Write a commit message like "Initial portfolio upload"
4. Click "Commit changes"

## Step 4: Enable GitHub Pages
1. Go to your repository settings
2. Scroll down to "Pages" section
3. Under "Source", select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click "Save"

## Step 5: View Your Website
Your website will be live at:
**https://${data.githubUsername}.github.io**

*Note: It may take a few minutes for your site to go live.*

## 🎉 Congratulations!
Your professional portfolio is now live on the internet and ready to share with employers, clients, and colleagues.

## 🔄 Making Updates
To update your portfolio:
1. Edit files directly on GitHub using the pencil icon
2. Or upload new files to replace existing ones
3. Changes will automatically update your live website

## 📱 Sharing Your Portfolio
Your portfolio URL: https://${data.githubUsername}.github.io
- Add this to your resume
- Share on LinkedIn and social media
- Include in job applications
- Add to your email signature

---

*If you need help, ask your organization's admin or refer to [GitHub Pages documentation](https://pages.github.com/)*`;
    }

    showProgress(percentage) {
        const progressBar = document.getElementById('progressBar');
        const progressFill = document.getElementById('progressFill');
        
        progressBar.style.display = 'block';
        progressFill.style.width = percentage + '%';
        progressFill.textContent = percentage + '%';
        
        if (percentage === 100) {
            setTimeout(() => {
                progressBar.style.display = 'none';
            }, 2000);
        }
    }

    downloadZip(content, fullName) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `${fullName.replace(/\s+/g, '-').toLowerCase()}-portfolio.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Utility functions for dynamic form elements
function addSkillInput() {
    const container = document.getElementById('skillsContainer');
    const newInput = document.createElement('div');
    newInput.className = 'form-group skill-input';
    newInput.innerHTML = `
        <input type="text" name="skills[]" placeholder="Enter a skill">
        <button type="button" onclick="removeSkillInput(this)" style="margin-left: 10px; padding: 5px 10px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;">Remove</button>
    `;
    container.appendChild(newInput);
}

function removeSkillInput(button) {
    button.parentElement.remove();
}

function addExperienceInput() {
    const container = document.getElementById('experienceContainer');
    const index = container.children.length;
    
    const newExperience = document.createElement('div');
    newExperience.className = 'experience-container';
    newExperience.dataset.index = index;
    newExperience.innerHTML = `
        <div class="experience-header">
            <span class="experience-title">Experience ${index + 1}</span>
            <button type="button" class="remove-experience" onclick="removeExperience(this)">Remove</button>
        </div>
        <div class="form-group">
            <label>Experience Title *</label>
            <input type="text" name="experienceTitle[]" placeholder="Project or Job Title" required>
        </div>
        
        <div class="file-requirements">
            <h4>📋 Image Requirements:</h4>
            <ul>
                <li>Landscape format (600x400 pixels recommended)</li>
                <li>Project screenshot, photo, or relevant image</li>
                <li>JPG, PNG, or WEBP format</li>
                <li>Maximum file size: 5MB</li>
            </ul>
        </div>
        
        <div class="file-upload-area experience-image-upload" data-index="${index}">
            <div class="file-upload-icon">🖼️</div>
            <div class="file-upload-text">Upload image for this experience</div>
            <div class="file-upload-hint">JPG, PNG, WEBP up to 5MB</div>
            <input type="file" accept="image/*" style="display: none;">
        </div>
        <div class="experience-image-preview" data-index="${index}"></div>
        
        <div class="form-group">
            <label>Description *</label>
            <textarea name="experienceDescription[]" placeholder="Describe your experience, project, or achievement in detail..." required></textarea>
        </div>
    `;
    
    container.appendChild(newExperience);
    
    // Ensure the uploader handles the new experience image upload
    portfolioUploader.setupExperienceImageUploads();
}

function removeExperience(button) {
    const experienceContainer = button.closest('.experience-container');
    const index = parseInt(experienceContainer.dataset.index);
    
    // Remove the file from uploaded files if it exists
    if (portfolioUploader.uploadedFiles.experienceImages[index]) {
        portfolioUploader.uploadedFiles.experienceImages[index] = null;
    }
    
    experienceContainer.remove();
    
    // Update indices of remaining experience containers
    const remainingContainers = document.querySelectorAll('.experience-container');
    remainingContainers.forEach((container, newIndex) => {
        container.dataset.index = newIndex;
        container.querySelector('.experience-title').textContent = `Experience ${newIndex + 1}`;
        
        const uploadArea = container.querySelector('.experience-image-upload');
        const preview = container.querySelector('.experience-image-preview');
        if (uploadArea) uploadArea.dataset.index = newIndex;
        if (preview) preview.dataset.index = newIndex;
    });
}

function previewPortfolio() {
    // This could open a preview window or show a modal with the generated portfolio
    alert('Preview functionality would show your generated portfolio in a new window.');
}

// Initialize the uploader when the page loads
let portfolioUploader;
document.addEventListener('DOMContentLoaded', function() {
    portfolioUploader = new PortfolioUploader();
});
