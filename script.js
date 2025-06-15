document.addEventListener('DOMContentLoaded', function() {
    // --- SELECTORS ---
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

    // --- 1. MOBILE NAVIGATION TOGGLE (HAMBURGER MENU) ---
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // --- 2. SMOOTH SCROLLING & CLOSING MOBILE MENU ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default jump

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Get the height of the sticky header to offset the scroll
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close the mobile menu if it's open after clicking a link
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // --- 3. DYNAMICALLY CREATE AND MANAGE A "BACK TO TOP" BUTTON ---
    const backToTopButton = document.createElement('button');
    backToTopButton.textContent = '↑';
    backToTopButton.setAttribute('id', 'back-to-top');
    document.body.appendChild(backToTopButton);
    
    // Style the button with JavaScript for encapsulation
    Object.assign(backToTopButton.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        backgroundColor: '#16a34a',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        fontSize: '24px',
        cursor: 'pointer',
        opacity: '0',
        visibility: 'hidden',
        transition: 'opacity 0.3s, visibility 0.3s, transform 0.3s',
        zIndex: '1000',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
    });

    backToTopButton.addEventListener('mouseenter', () => backToTopButton.style.backgroundColor = '#15803d');
    backToTopButton.addEventListener('mouseleave', () => backToTopButton.style.backgroundColor = '#16a34a');


    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 4. SCROLL EVENT LISTENER (for Back-to-Top and Active Nav Link) ---
    window.addEventListener('scroll', () => {
        // Show/Hide Back-to-Top button
        if (window.scrollY > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
            backToTopButton.style.transform = 'scale(1)';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
            backToTopButton.style.transform = 'scale(0.5)';
        }

        // Active Nav Link Highlighting
        let currentSectionId = '';
        const sections = document.querySelectorAll('main section');
        const headerHeight = header.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; // Add a 50px buffer
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link'); // Custom class for highlighting
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active-link');
            }
        });
    });

    // --- 5. ADD CSS FOR THE ACTIVE LINK HIGHLIGHT ---
    const style = document.createElement('style');
    style.innerHTML = `
        .main-nav a.active-link {
            color: #a5b4fc; /* A lighter color for active link */
            font-weight: bold;
        }
        @media (max-width: 767px) {
            .main-nav a.active-link {
                background-color: #004085;
            }
        }
    `;
    document.head.appendChild(style);

    // --- 6. EMI CALCULATOR LOGIC ---
    const calculatorForm = document.getElementById('emi-calculator-form');
    const resultDiv = document.getElementById('emi-result');

    if (calculatorForm) {
        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const principal = parseFloat(document.getElementById('loanAmount').value);
            const annualRate = parseFloat(document.getElementById('interestRate').value);
            const tenureInYears = parseFloat(document.getElementById('loanTenure').value);

            if (isNaN(principal) || isNaN(annualRate) || isNaN(tenureInYears) || principal <= 0 || annualRate <= 0 || tenureInYears <= 0) {
                resultDiv.innerHTML = 'Please enter valid numbers in all fields.';
                resultDiv.style.color = 'red';
                return;
            }

            const monthlyRate = annualRate / 12 / 100;
            const numberOfMonths = tenureInYears * 12;

            const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) / (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
            
            const totalAmountPayable = emi * numberOfMonths;
            const totalInterest = totalAmountPayable - principal;

            resultDiv.style.color = '#1e3a8a'; // Reset color
            resultDiv.innerHTML = `
                Your Monthly EMI is
                <span class="amount">₹ ${emi.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <hr style="border: 0; border-top: 1px solid #9ca3af; margin: 1rem 0;">
                Total Interest Payable: ₹ ${totalInterest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br>
                Total Amount Payable: ₹ ${totalAmountPayable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            `;
        });
    }
});
