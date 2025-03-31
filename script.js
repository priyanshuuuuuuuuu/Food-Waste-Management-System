// Profile dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    // Profile dropdown toggling
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (profileDropdown) {
        profileDropdown.addEventListener('click', function() {
            this.querySelector('.dropdown-menu')?.classList.toggle('active');
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.profile-dropdown') && document.querySelector('.dropdown-menu.active')) {
            document.querySelector('.dropdown-menu.active').classList.remove('active');
        }
    });
    
    // For demo - simulate login/signup redirects
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('Email').value;
            
            if (email.includes('company')) {
                window.location.href = 'companyDashboard.html';
            } else if (email.includes('transport')) {
                window.location.href = 'transporterDashboard.html';
            } else if (email.includes('admin')) {
                // Special case for admin login
                const password = document.getElementById('Password').value;
                if (password === 'adminSecure123') { // This should be checked server-side in production
                    localStorage.setItem('adminAuth', 'true');
                    window.location.href = 'adminDashboard.html';
                } else {
                    alert('Invalid admin credentials');
                }
            } else {
                window.location.href = 'providerDashboard.html';
            }
        });
    }
    
    // Animation on scroll for all dashboards
    const animatedElements = document.querySelectorAll('.grid-item, .stat-card, .provider-card');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Admin access protection - check if authenticated
    if (window.location.pathname.includes('adminDashboard.html')) {
        if (!localStorage.getItem('adminAuth')) {
            window.location.href = 'LoginPage.html';
        }
    }
});

// Google Sign-in handling
function handleGoogleSignIn() {
    // This would normally connect to Google OAuth
    // For demo, redirect to provider dashboard
    window.location.href = 'providerDashboard.html';
}
