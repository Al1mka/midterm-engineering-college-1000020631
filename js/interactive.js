// Interactive Features for Engineering College Website

class InteractiveFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.initializeProgramFilter();
        this.initializeFAQAccordion();
        this.initializeFormProgress();
    }

    // Program filter functionality
    initializeProgramFilter() {
        const filterButtons = document.querySelectorAll('.program-filter-btn');
        const programCards = document.querySelectorAll('[data-category]');
        
        if (filterButtons.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active filter button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                // Filter program cards
                programCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Enhanced FAQ accordion
    initializeFAQAccordion() {
        const faqItems = document.querySelectorAll('.accordion-item');
        
        faqItems.forEach(item => {
            const button = item.querySelector('.accordion-button');
            const content = item.querySelector('.accordion-collapse');
            
            if (button && content) {
                button.addEventListener('click', () => {
                    // Add animation class
                    content.classList.add('transitioning');
                    
                    setTimeout(() => {
                        content.classList.remove('transitioning');
                    }, 300);
                });
                
                // Keyboard navigation
                button.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        button.click();
                    }
                });
            }
        });
    }

    // Form progress indicator
    initializeFormProgress() {
        const form = document.getElementById('registrationForm');
        const progressBar = document.querySelector('.progress-bar');
        const formSections = document.querySelectorAll('.form-section');
        
        if (!form || !progressBar) return;
        
        const updateProgress = () => {
            let completedSections = 0;
            
            formSections.forEach(section => {
                const inputs = section.querySelectorAll('input, select, textarea');
                let sectionCompleted = true;
                
                inputs.forEach(input => {
                    if (input.hasAttribute('required') && !input.value) {
                        sectionCompleted = false;
                    }
                });
                
                if (sectionCompleted) {
                    completedSections++;
                }
            });
            
            const progress = (completedSections / formSections.length) * 100;
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress);
        };
        
        // Update progress on input
        form.addEventListener('input', updateProgress);
        form.addEventListener('change', updateProgress);
        
        // Initial progress update
        updateProgress();
    }
}

// Initialize interactive features
document.addEventListener('DOMContentLoaded', () => {
    new InteractiveFeatures();
});

// Fix all application buttons on programs page
document.addEventListener('DOMContentLoaded', function() {
    const applicationButtons = document.querySelectorAll('a[href="registration.html"]');
    applicationButtons.forEach(button => {
        button.style.pointerEvents = 'auto';
        button.style.cursor = 'pointer';
    });
});