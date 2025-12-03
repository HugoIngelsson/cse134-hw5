class ClassCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const id = this.getAttribute('id') !== "undefined" ? this.getAttribute('id') : 'Unknown ID';
        const name = this.getAttribute('name') !== "undefined" ? this.getAttribute('name') : 'Unknown Name';
        const link = (this.getAttribute('link') !== "undefined" ? this.getAttribute('link') : '') || '';
        const imageUrl = this.getAttribute('image-url') || '';
        const imageAlt = this.getAttribute('image-alt') || '';
        const grade = this.getAttribute('grade') !== "undefined" ? this.getAttribute('grade') : '?';
        const quarter = this.getAttribute('quarter') !== "undefined" ? this.getAttribute('quarter') : 'Sometime 20XX';
        const description = this.getAttribute('description') !== "undefined" ? this.getAttribute('description') : 'Description Empty';

        const editable = this.hasAttribute('editable') ? true : false;
        let editableButtons = ""
        if (editable) {
            editableButtons = `
                <button class="edit"><img src="./media/img/svg/edit-svgrepo-com.svg" /></button>
                <button class="delete"><img src="./media/img/svg/big-trash-can-svgrepo-com.svg" /></button>
            `
        }

        this.innerHTML = '';
        this.setCSS();
        this.innerHTML += `
            <div class="cont">
            <a href="${link}" target="_blank">
                <h2>${id}</h2>
                <h3>${name}</h3>
            </a>
            ${this.getPictureTag(imageUrl, imageAlt, id)}
            <hgroup>
                <p><b>Grade Received: </b>${grade}</p>
                <p><b>Taken: </b>${quarter}</p>
                <p>${description}</p>
            </hgroup>
            ${editableButtons}
            </div>
        `;
    }

    getPictureTag(imageUrl, alt, id) {
        let backup = './media/img/class_display/defaults/', defaultAlt;
        if (id.toLowerCase().startsWith('cse')) {
            backup += 'cse-bg.jpg';
            defaultAlt = 'A generic image for CSE classes.'
        } else if (id.toLowerCase().startsWith('math')) {
            backup += 'math-bg.jpg';
            defaultAlt = 'A generic image for math classes.'
        } else {
            backup += 'default-bg.jpg';
            defaultAlt = 'A generic image for general subjects.'
        }

        return `
        <picture>
            <img src="${imageUrl}" onError="this.onerror=null;this.src='${backup}';this.alt='${defaultAlt}';" alt="${alt}">
        </picture>
        `
    }

    setCSS() {
        this.style.margin = "1rem 0.2rem";
        this.style.padding = "0.3rem 0.8rem";
        this.style.backgroundColor = "var(--palette-color3)";
        this.style.display = "block";
        this.style.position = "relative";

        this.style.width = "40%";
        this.style.minWidth = "200px";
        this.style.maxWidth = "300px";

        this.style.borderRadius = "5px";

        const style = document.createElement('style');
        style.textContent = `
        div {
            height: 100%;
            display: flex;
            flex-direction: column;

            img {
                height: min(30vw, 200px);
                max-width: 100%;
            }

            h2 {
                font-size: 1.8em;
                margin: 0.3rem;
            }

            h3 {
                font-size: 1em;
                margin: 0.3rem;
            }

            p {
                margin: 0.3rem 0;
                padding: 0 0.1rem;
            }

            b {
                font-style: oblique;
            }

            hgroup {
                display: block;
                margin: 0;
                text-align: left;
            }

            .edit, .delete {
                cursor: grab;
                opacity: 0;
                transition: opacity 0.2s ease-in-out;

                position: absolute;
                display: flex;
                height: 50px;
                width: 50px;
                border-radius: 25px;
                border-width: 3px;
                border-style: solid;

                img {
                    height: 60%;
                    margin: auto;
                }
            }

            .edit {
                top: 0.5rem;
                right: 0.5rem;
            }

            .delete {
                top: 0.5rem;
                left: 0.5rem;
            }

            .edit:hover {
                background-color: green;
            }

            .delete:hover {
                background-color: red;
            }
        }

        div:hover .edit, div:hover .delete {
            opacity: 1;
        }
        `;

        this.appendChild(style);
    }

    toList() {
        return {
            "id": this.getAttribute('id'),
            "name": this.getAttribute('name'),
            "link": this.getAttribute('link'),
            "image_url": this.getAttribute('image-url'),
            "image_alt": this.getAttribute('image-alt'),
            "grade": this.getAttribute('grade'),
            "quarter": this.getAttribute('quarter'),
            "description": this.getAttribute('description')
        };
    }
}

customElements.define('class-card', ClassCard);