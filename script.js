document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    // 1. Mobile Navigation Toggle (Hamburger Menu)
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active'); // Optional: Add animation to hamburger icon
        });
    }

    // Close menu when a link is clicked (for single page navigation)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });

    // 2. Smooth Scrolling for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) { // Only apply to internal anchor links
                e.preventDefault(); // Prevent default jump
                const targetId = href.substring(1); // Get the ID without '#'
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - (window.innerWidth < 768 ? 60 : 80), // Adjust for header height (mobile vs desktop)
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});