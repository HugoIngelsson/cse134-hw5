window.addEventListener('DOMContentLoaded', init)

function init() {
    const sliders = document.querySelectorAll('sliding-container');
    sliders.forEach((elem) => {
        document.startViewTransition(() => updateTheDOMSomehow(elem));
    })
}