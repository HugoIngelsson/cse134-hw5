document.addEventListener('DOMContentLoaded', () => {
    const slideIn = document.querySelectorAll('.in-right, .in-left, .in-up');
    console.log(slideIn);

    // Options for the observer (threshold 0.5 means 50% of the item must be visible)
    const options = {
        root: null, // observe against the viewport
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    if (slideIn) {
        slideIn.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('visible');
                element.setAttribute('style', 'transition: none;');
            } else {
                observer.observe(element);
            }
        });
    }
});

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 && 
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
}