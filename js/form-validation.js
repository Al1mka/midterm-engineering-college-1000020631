// Form Validation for Engineering College Website

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = {};
        this.errors = {};
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.setupEventListeners();
        this.setupCustomValidation();
    }
    
    setupEventListeners() {
        // Real-time validation on input
        this.form.addEventListener('input', (e) => {
            this.validateField(e.target);
        });
        
        // Validate on blur for better UX
        this.form.addEventListener('focusout', (e) => {
            this.validateField(e.target);
        });
        
        // Final validation on submit
        this.form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission
            
            if (this.validateForm()) {
                this.handleSuccessfulSubmission();
            } else {
                this.showFormErrors();
            }
        });
    }
    
    setupCustomValidation() {
        // Custom validation for specific fields
        this.setupPasswordValidation();
        this.setupEmailValidation();
        this.setupPhoneValidation();
        this.setupAntiSpam();
    }
    
    setupPasswordValidation() {
        const password = this.form.querySelector('#password');
        const confirmPassword = this.form.querySelector('#confirmPassword');
        
        if (password && confirmPassword) {
            confirmPassword.addEventListener('input', () => {
                this.validatePasswordMatch(password, confirmPassword);
            });
        }
    }
    
    setupEmailValidation() {
        const emailField = this.form.querySelector('#email');
        if (emailField) {
            emailField.addEventListener('input', (e) => {
                this.validateEmail(e.target);
            });
        }
    }
    
    setupPhoneValidation() {
        const phoneField = this.form.querySelector('#phone');
        if (phoneField) {
            phoneField.addEventListener('input', (e) => {
                this.formatPhoneNumber(e.target);
                this.validatePhone(e.target);
            });
        }
    }
    
    setupAntiSpam() {
        // Simple honeypot technique
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'website';
        honeypot.style.display = 'none';
        honeypot.setAttribute('aria-hidden', 'true');
        honeypot.setAttribute('tabindex', '-1');
        this.form.appendChild(honeypot);
        
        // Timestamp for form submission speed detection
        const timestamp = document.createElement('input');
        timestamp.type = 'hidden';
        timestamp.name = 'timestamp';
        timestamp.value = Date.now();
        this.form.appendChild(timestamp);
    }
    
    validateField(field) {
        const fieldName = field.name;
        const value = this.getFieldValue(field);
        
        // Clear previous error
        this.clearFieldError(field);
        
        // Required field validation - check if field is empty after trimming
        if (field.hasAttribute('required') && this.isEmptyValue(value)) {
            this.addFieldError(field, 'This field is required');
            return false;
        }
        
        // If field is optional and empty/only spaces, consider it valid
        if (!field.hasAttribute('required') && this.isEmptyValue(value)) {
            this.markFieldAsValid(field);
            return true;
        }
        
        // Field-specific validation (only for non-empty values)
        switch (field.type) {
            case 'email':
                if (!this.isValidEmail(value)) {
                    this.addFieldError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
                
            case 'tel':
                if (!this.isValidPhone(value)) {
                    this.addFieldError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
                
            case 'password':
                if (!this.isValidPassword(value)) {
                    this.addFieldError(field, 'Password must be at least 8 characters with letters and numbers');
                    return false;
                }
                break;
        }
        
        // Custom validation based on field name (only for non-empty values)
        switch (fieldName) {
            case 'confirmPassword':
                const password = this.form.querySelector('#password');
                if (password && value !== this.getFieldValue(password)) {
                    this.addFieldError(field, 'Passwords do not match');
                    return false;
                }
                break;
                
            case 'website': // Honeypot field
                if (!this.isEmptyValue(value)) {
                    this.addFieldError(field, 'Spam detected');
                    return false;
                }
                break;
        }
        
        // If all validations pass
        this.markFieldAsValid(field);
        return true;
    }
    
    validateForm() {
        let isValid = true;
        const fields = this.form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Check terms agreement
        const termsCheckbox = this.form.querySelector('#terms');
        if (termsCheckbox && !termsCheckbox.checked) {
            this.addFieldError(termsCheckbox, 'You must agree to the terms and conditions');
            isValid = false;
        }
        
        // Anti-spam: Check if form was filled too quickly
        const timestamp = this.form.querySelector('input[name="timestamp"]');
        if (timestamp) {
            const submitTime = Date.now();
            const fillTime = submitTime - parseInt(timestamp.value);
            if (fillTime < 2000) { // Less than 2 seconds
                isValid = false;
                this.showGeneralError('Form submitted too quickly. Please try again.');
            }
        }
        
        return isValid;
    }
    
    // Helper method to get field value with proper handling
    getFieldValue(field) {
        if (field.type === 'checkbox' || field.type === 'radio') {
            return field.checked;
        }
        
        const value = field.value;
        
        // For text-based fields, trim the value
        if (typeof value === 'string') {
            return value.trim();
        }
        
        return value;
    }
    
    // Helper method to check if value is empty (including only spaces)
    isEmptyValue(value) {
        if (value === null || value === undefined) {
            return true;
        }
        
        if (typeof value === 'string') {
            return value.trim() === '';
        }
        
        if (typeof value === 'boolean') {
            return !value;
        }
        
        return false;
    }
    
    // Validation helper methods
    isValidEmail(email) {
        if (this.isEmptyValue(email)) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhone(phone) {
        if (this.isEmptyValue(phone)) return false;
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }
    
    isValidPassword(password) {
        if (this.isEmptyValue(password)) return false;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }
    
    formatPhoneNumber(field) {
        let value = field.value.replace(/\D/g, '');
        if (value.length > 0) {
            value = value.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            value = !value[2] ? value[1] : '(' + value[1] + ') ' + value[2] + (value[3] ? '-' + value[3] : '');
        }
        field.value = value;
    }
    
    validatePasswordMatch(password, confirmPassword) {
        const passwordValue = this.getFieldValue(password);
        const confirmValue = this.getFieldValue(confirmPassword);
        
        // Only validate if both fields have non-empty values
        if (!this.isEmptyValue(passwordValue) && !this.isEmptyValue(confirmValue) && 
            passwordValue !== confirmValue) {
            this.addFieldError(confirmPassword, 'Passwords do not match');
            return false;
        }
        return true;
    }
    
    // Error handling methods
    addFieldError(field, message) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        
        let errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        field.setAttribute('aria-describedby', errorElement.id || this.generateId());
        
        // Focus first invalid field
        if (!this.firstInvalidField) {
            this.firstInvalidField = field;
        }
    }
    
    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.remove();
        }
        field.removeAttribute('aria-describedby');
    }
    
    markFieldAsValid(field) {
        field.classList.add('is-valid');
        field.classList.remove('is-invalid');
        this.clearFieldError(field);
    }
    
    showFormErrors() {
        // Focus first invalid field
        if (this.firstInvalidField) {
            this.firstInvalidField.focus();
            this.firstInvalidField = null;
        }
        
        // Scroll to first error
        const firstError = this.form.querySelector('.is-invalid');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    showGeneralError(message) {
        // Remove existing general error
        const existingError = this.form.querySelector('.alert-danger');
        if (existingError) {
            existingError.remove();
        }
        
        // Create new error alert
        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger';
        errorAlert.textContent = message;
        errorAlert.setAttribute('role', 'alert');
        
        this.form.insertBefore(errorAlert, this.form.firstChild);
        
        // Scroll to error
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    handleSuccessfulSubmission() {
        // Prevent multiple submissions
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            submitButton.classList.add('submitting');
        }
        
        // Simulate form submission process
        console.log('Form submitted successfully!');
        console.log('Form data:', this.getFormData());
        
        // Show success message after a short delay to simulate processing
        setTimeout(() => {
            this.showSuccessMessage();
            this.resetForm(); // Optional: reset the form after success
        }, 1500);
    }
    
    getFormData() {
        const formData = {};
        const fields = this.form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            if (field.type !== 'submit' && field.name) {
                formData[field.name] = this.getFieldValue(field);
            }
        });
        
        return formData;
    }
    
    resetForm() {
        // Reset all form fields
        this.form.reset();
        
        // Clear all validation states
        const fields = this.form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
            this.clearFieldError(field);
        });
        
        // Re-enable submit button
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Application';
            submitButton.classList.remove('submitting');
        }
    }
    
    showSuccessMessage() {
        // Create success overlay
        const successOverlay = document.createElement('div');
        successOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        
        const successMessage = document.createElement('div');
        successMessage.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 0.5rem;
            text-align: center;
            max-width: 500px;
            margin: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;
        
        successMessage.innerHTML = `
            <div style="font-size: 4rem; color: #198754; margin-bottom: 1rem;">✓</div>
            <h3 style="color: #198754; margin-bottom: 1rem;">Application Sent Successfully!</h3>
            <p style="margin-bottom: 1.5rem; line-height: 1.6;">
                Thank you for your application to Engineering College!<br>
                We have received your information and will contact you soon.
            </p>
            <button onclick="this.closest('.success-overlay').remove();" 
                    style="margin-top: 1rem; padding: 0.75rem 2rem; background: #0056b3; color: white; 
                           border: none; border-radius: 0.25rem; cursor: pointer; font-size: 1rem;
                           transition: background-color 0.3s ease;">
                Close
            </button>
        `;
        
        successOverlay.className = 'success-overlay';
        successOverlay.appendChild(successMessage);
        document.body.appendChild(successOverlay);
        
        // Focus the close button for accessibility
        const closeButton = successOverlay.querySelector('button');
        if (closeButton) {
            closeButton.focus();
            
            // Add hover effect
            closeButton.addEventListener('mouseenter', () => {
                closeButton.style.backgroundColor = '#004494';
            });
            closeButton.addEventListener('mouseleave', () => {
                closeButton.style.backgroundColor = '#0056b3';
            });
        }
        
        // Add escape key to close
        successOverlay.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                successOverlay.remove();
            }
        });
    }
    
    generateId() {
        return 'error-' + Math.random().toString(36).substr(2, 9);
    }
}

// Initialize form validators when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Registration form validation
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        new FormValidator('registrationForm');
    }
    
    // Contact form validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        new FormValidator('contactForm');
    }
    
    // Application form validation
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        new FormValidator('applicationForm');
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
}