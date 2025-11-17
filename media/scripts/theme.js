window.addEventListener('load', init)

let palette = [], theme, font;
function init() {
    theme = localStorage.getItem('theme')
    if (!theme) {
        font = 'Ubuntu';
        theme = 'Cyber';
        palette = themeEnum(theme);
        
        saveStorage(theme, palette);
    }

    loadStorage();
    createSettingsButtons();
    initListeners();
}

function initListeners() {
    const themeItem = document.querySelector('#theme-name');
    if (themeItem) themeItem.addEventListener('change', () => {
        theme = themeItem.value;
        if (theme !== 'Custom') palette = themeEnum(theme);

        saveStorage(theme, palette);
        loadStorage();
    });

    const fontItem = document.querySelector('#font');
    if (fontItem) fontItem.addEventListener('change', () => {
        font = fontItem.value;

        saveStorage(theme, palette);
        loadStorage();
    })

    for (let i = 0; i < 6; i++) {
        const palleteItem = document.querySelector(`#color${i+1}`);
        if (palleteItem) palleteItem.addEventListener('input', () => {
            theme = 'Custom';
            palette[i] = palleteItem.value;

            saveStorage(theme, palette);
            loadStorage();
        })
    }
}

function themeEnum(theme) {
    switch (theme) {
        case 'Cyber': return ['#163235', '#106967', '#4fbc9c', '#32bfda', '#efca7c', '#e8b953'];
        case 'Sunshine': return ['#4d1c00', '#e2a522', '#ca5e0d', '#ffbf66', '#ffd175', '#ffd74f'];
        case 'Night': return ['#0b1c23', '#1c244c', '#32588f', '#5c94cb', '#8ca4c7', '#9cb4d7'];
        case 'Monochrome': return ['#000000', '#333333', '#777777', '#aaaaaa', '#ffffff', '#ffffff'];
        default: return ['#000000', '#333333', '#777777', '#aaaaaa', '#ffffff', '#ffffff']
    }
}

function createSettingsButtons() {
    const navList = document.querySelector('header nav ul');
    if (navList) {
        const li = document.createElement('li');
        li.id = 'top-nav';
        li.style = 'float: right;';

        const a = document.createElement('a');
        const img = document.createElement('img');
        img.src = './media/img/svg/settings.svg';
        img.classList.add('svg-white');
        img.alt = 'An icon of a cog wheel, indicating a settings menu';

        a.appendChild(img);
        li.appendChild(a);
        navList.appendChild(li);

        const li2 = document.createElement('li');
        li2.id = 'list-nav';

        const a2 = document.createElement('a');
        a2.innerHTML = 'Settings';

        li2.appendChild(a2);
        navList.appendChild(li2);

        const dialog = document.querySelector('#settings-menu');
        if (dialog) {
            const backdrop = document.querySelector('#settings-menu background-cover');
            li.addEventListener('click', () => {
                dialog.showModal();
            })

            li2.addEventListener('click', () => {
                dialog.showModal();
            })

            dialog.addEventListener('click', (e) => {
                // If the click target is the dialog element itself, it means it's an outside click
                if (e.target === dialog || e.target === backdrop) {
                    dialog.close();
                }
            });
        }
    }
}

function saveStorage(theme, palette) {
    localStorage.setItem('theme', theme);
    localStorage.setItem('font', font);
    for (let i = 0; i < 6; i++)
        localStorage.setItem(`color${i+1}`, palette[i]);
}

function loadStorage() {
    palette.length = 0;
    for (let i = 0; i < 6; i++) {
        palette.push(localStorage.getItem(`color${i+1}`));
        document.documentElement.style.setProperty(`--palette-color${i+1}`, palette[i]);

        const palleteItem = document.querySelector(`#color${i+1}`);
        if (palleteItem) palleteItem.value = palette[i];
    }

    document.documentElement.style.setProperty(`--palette-color1-alph`, palette[0] + '99');

    theme = localStorage.getItem('theme');
    const themeItem = document.querySelector('#theme-name');
    if (themeItem) themeItem.value = theme;

    font = localStorage.getItem('font');
    console.log(font);
    const fontItem = document.querySelector('#font');
    if (fontItem) fontItem.value = font;
    document.documentElement.style.setProperty('font-family', `${font}, sans-serif`);
}