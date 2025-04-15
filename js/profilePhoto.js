/**
 * Utility functions for handling user profile photos across the application
 */

/**
 * Get the profile photo URL for a user based on user ID and role
 * @param {string|number} userId - The user ID
 * @param {string} role - The user role (FoodProvider, Company, Transporter)
 * @returns {string} - URL to the profile image
 */
function getUserProfilePhoto(userId, role) {
    // Try to get profile photo from localStorage with user-specific key
    if (userId) {
        const userPhoto = localStorage.getItem(`profilePhoto_${userId}`);
        if (userPhoto) {
            return userPhoto;
        }
    }
    
    // Return default photo based on role
    if (role === 'Transporter') {
        return 'Assets/Images/transport-profile.jpg';
    } else if (role === 'Company') {
        return 'Assets/Images/company-profile.jpg';
    } else {
        return 'Assets/Images/provider-profile.jpg';
    }
}

/**
 * Apply the current user's profile photo to elements with profile-img class
 */
function applyUserProfilePhoto() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.user_id) return;
        
        // Try to get the stored profile photo
        const photo = localStorage.getItem(`profilePhoto_${user.user_id}`);
        if (!photo) return;
        
        // Apply to profile images
        const profileImages = document.querySelectorAll('.profile-img img, #profileImage, #profilePreview');
        profileImages.forEach(img => {
            img.src = photo;
        });
    } catch (error) {
        console.error('Error applying profile photo:', error);
    }
}

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', applyUserProfilePhoto);
