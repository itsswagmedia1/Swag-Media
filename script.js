// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initMobileMenu(); 
    initTestimonialsCarousel();
    initContactForm();
    initScrollAnimations();
    initVideoBackground();
    initPortfolioModal(); // <-- This function is now fixed
});

// Navigation Functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Show navbar on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Mobile Menu Functionality
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = navMenu.querySelectorAll('.nav-link');
    const toggleIcon = navToggle.querySelector('i');

    if (navToggle && navMenu) {
        // Show/hide menu
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
            // Change toggle icon
            toggleIcon.classList.toggle('fa-bars');
            toggleIcon.classList.toggle('fa-times');
        });

        // Hide menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show-menu');
                // Reset toggle icon
                toggleIcon.classList.add('fa-bars');
                toggleIcon.classList.remove('fa-times');
            });
        });
    }
}


// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 150;
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Testimonials Carousel Functionality
function initTestimonialsCarousel() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentIndex = 0;
    let autoRotateInterval;
    
    if (testimonialCards.length === 0) return; // Exit if no testimonials

    function showTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        
        // Ensure index is within bounds
        if (index >= testimonialCards.length) {
            index = 0;
        } else if (index < 0) {
            index = testimonialCards.length - 1;
        }
        
        testimonialCards[index].classList.add('active');
        currentIndex = index;
    }
    
    function nextTestimonial() {
        showTestimonial(currentIndex + 1);
    }
    
    function prevTestimonial() {
        showTestimonial(currentIndex - 1);
    }
    
    function startAutoRotate() {
        // Clear existing interval to prevent duplicates
        clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(nextTestimonial, 6000);
    }
    
    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }
    
    // Event listeners
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', function() {
            nextTestimonial();
            stopAutoRotate();
            startAutoRotate();
        });
        
        prevBtn.addEventListener('click', function() {
            prevTestimonial();
            stopAutoRotate();
            startAutoRotate();
        });
  _   }
    
    // Initialize
    showTestimonial(0);
    startAutoRotate();
    
    // Pause on hover
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoRotate);
        carousel.addEventListener('mouseleave', startAutoRotate);
    }
}

// Contact Form Functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        console.log('Form submitted:', { name, email, message });
        
        // Show success message
        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        
        // Reset form
        this.reset();
        
        // Reset all labels
        const labels = this.querySelectorAll('label');
        labels.forEach(label => {
            // Resetting inline styles just in case
            label.style.top = '';
            label.style.fontSize = '';
            label.style.color = '';
        });
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification helper
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${type === 'success' ? 'rgba(76, 175, 80, 0.95)' : 'rgba(244, 67, 54, 0.95)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 2px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards'; // Use 'forwards' to keep end state
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Scroll Animations - Reduced delays for faster loading
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries, obs) { // Renamed to 'obs'
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target); // Use 'obs'
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.service-card, .portfolio-item, .testimonial-card, .contact-form, .contact-info, .about-content, .team-member'
    );
    
    animateElements.forEach((el) => { // Removed 'index' as it's not used
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        // Removed staggered delay for a cleaner, faster load
        el.style.transition = `opacity 0.6s ease, transform 0.6s ease`; 
        observer.observe(el);
    });
}

// Video Background Optimization
function initVideoBackground() {
    const video = document.querySelector('.video-background');
    
    if (!video) return;
    
    // Pause video when not in viewport to save resources
    const videoObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        });
    });
    
    videoObserver.observe(video);
    
    // Reduce video quality on mobile for better performance
    if (window.innerWidth < 768) {
        video.style.filter = 'blur(2px)';
    }
}

// =========================================== //
// === NEW HELPER FUNCTIONS TO EXTRACT IDs === //
// =========================================== //

/**
 * Extracts the YouTube video ID from various URL formats.
 * @param {string} url - The full YouTube URL.
 * @returns {string|null} The video ID or null if not found.
 */
function extractYouTubeId(url) {
    let videoId = null;
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;
        
        if (hostname === 'youtu.be') {
            // For youtu.be/ID
            videoId = urlObj.pathname.substring(1); 
        } else if (hostname.includes('youtube.com')) {
            // For youtube.com/watch?v=ID
            videoId = urlObj.searchParams.get('v');
        }
        
        // Clean up any extra query params (like ?si=...)
        if (videoId) {
            videoId = videoId.split('?')[0];
        }
    } catch (e) {
        console.error('Error parsing YouTube URL:', e);
        return null;
    }
    return videoId;
}

/**
 * Extracts the Instagram post ID from various URL formats.
 * @param {string} url - The full Instagram URL.
 * @returns {string|null} The post ID or null if not found.
 */
function extractInstagramId(url) {
    try {
        const urlObj = new URL(url);
        // Matches /p/POST_ID/ or /reel/POST_ID/
        const match = urlObj.pathname.match(/\/(p|reel)\/([a-zA-Z0-9_-]+)/);
        if (match && match[2]) {
            return match[2]; // Return the captured group (the ID)
        }
    } catch (e) {
        console.error('Error parsing Instagram URL:', e);
        return null; 
    }
    return null;
}


// ========================================== //
// === FIXED PORTFOLIO MODAL (Request 3) === //
// ========================================== //
function initPortfolioModal() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('video-modal');
    const closeModalBtn = document.getElementById('modal-close');
    const videoContainer = document.getElementById('modal-video-container');
    
    if (!modal || !closeModalBtn || !videoContainer) {
        console.error('Modal elements not found!');
        return;
    }

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const videoType = item.dataset.videoType;
            const videoUrl = item.dataset.videoId; // Get the FULL URL from the attribute

            // Clear previous video
            videoContainer.innerHTML = ''; 
            
            if (videoType === 'youtube') {
                // === FIX ===
                // Extract the ID from the URL
                const videoId = extractYouTubeId(videoUrl);
                
                // Check for placeholder or invalid ID
                if (!videoId || videoId === 'VIDEO_ID_HERE') {
                    videoContainer.innerHTML = '<p style="color:white;text-align:center;">Sorry, this video is not available.</p>';
                    modal.style.display = 'flex'; // Show modal with error
                    return;
                }
                // === END FIX ===

                const iframe = document.createElement('iframe');
                // Use the extracted ID
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
                iframe.setAttribute('allowfullscreen', '');
                videoContainer.appendChild(iframe);
                
            } else if (videoType === 'instagram') {
                // === FIX ===
                // Extract the Post ID from the URL
                const postId = extractInstagramId(videoUrl);

                // Check for placeholder or invalid ID
                if (!postId || postId === 'POST_ID_HERE') {
                    videoContainer.innerHTML = '<p style="color:white;text-align:center;">Sorry, this post is not available.</p>';
                    modal.style.display = 'flex'; // Show modal with error
                    return;
                }
                // === END FIX ===

                const blockquote = document.createElement('blockquote');
                blockquote.className = 'instagram-media';
                // Use the extracted Post ID
                blockquote.setAttribute('data-instgrm-permalink', `https://www.instagram.com/p/${postId}/?utm_source=ig_embed&utm_campaign=loading`);
                blockquote.setAttribute('data-instgrm-version', '14');
                
                // Add styling to fit our modal
                blockquote.style.margin = '0 auto'; 
                
                videoContainer.appendChild(blockquote);
                
                // We must tell Instagram's script to find the new post and render it
                if (window.instgrm) {
            	     window.instgrm.Embeds.process();
                }
            }
            
            // Show the modal
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Function to close the modal
    function closeModal() {
        modal.style.display = 'none';
        videoContainer.innerHTML = ''; // Stop video from playing
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
    
    // Close modal when 'x' is clicked
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking on the background overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}
// =================================== //
// === END OF NEW PORTFOLIO MODAL  === //
// =================================== //


// Smooth scroll polyfill for older browsers
(function() { // Wrapped in IIFE to avoid polluting global scope
    if (!('scrollBehavior' in document.documentElement.style)) {
        const smoothScroll = function(target, duration) {
            const targetPosition = target.offsetTop;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            let startTime = null;
            
            const animation = function(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            };
            
            const ease = function(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            };
            
            requestAnimationFrame(animation);
        };
        
        // Re-bind click listeners for nav-links to use polyfill
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
            	const targetId = this.getAttribute('href').substring(1);
            	const targetSection = document.getElementById(targetId);
            	if (targetSection) {
            		smoothScroll(targetSection, 1000); // 1000ms duration
            	}
            });
        });
    }
})();