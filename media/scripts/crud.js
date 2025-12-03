import './class-card.js'

let records = {}
window.addEventListener('DOMContentLoaded', () => {
    init();
});

async function init() {
    console.log("DOM Content loaded");

    document.querySelector('#load-json').addEventListener('click', loadFromJSON);
    document.querySelector('#clear-storage').addEventListener('click', () => {
        localStorage.removeItem('classes');
        document.getElementById('classes').replaceChildren();
    });
    document.getElementById("classes").addEventListener('click', galleryClick);

    parseJSON(JSON.parse(localStorage.getItem('classes')));
}

async function loadFromJSON() {
    try {
        const response = await fetch('./media/json/classes.json');
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const jsonData = await response.json();
        localStorage.setItem('classes', JSON.stringify(jsonData))
        parseJSON(jsonData);
    } catch (error) {
        console.error(error);
    }
}

async function parseJSON(jsonData) {
    records = jsonData;
    document.getElementById('classes').replaceChildren();
    Object.keys(records).forEach(key => {
        const classData = records[key];

        window.galleryItem = document.createElement("class-card");

        window.galleryItem.setAttribute("id", `${classData.id}`);
        window.galleryItem.setAttribute("name", `${classData.name}`);
        window.galleryItem.setAttribute("link", `${classData.link}`);
        window.galleryItem.setAttribute("image-url", `${classData.image_url}`);
        window.galleryItem.setAttribute("image-alt", `${classData.image_alt}`);
        window.galleryItem.setAttribute("grade", `${classData.grade}`);
        window.galleryItem.setAttribute("quarter", `${classData.quarter}`);
        window.galleryItem.setAttribute("description", `${classData.description}`);
        window.galleryItem.setAttribute("editable", '');

        document.getElementById("classes").appendChild(window.galleryItem);
    });
}

function galleryClick(e) {
    const target = e.target.closest('class-card');

    if (target) {
        const edit = e.target.closest('.edit');
        const del = e.target.closest('.delete');

        if (edit) {
            console.log('edit action');
        } else if (del) {
            document.getElementById("classes").removeChild(target);
            setLocalStorage();
        }

        // const deetsP = target.querySelector('.deets');

        // // make sure we don't overwrite the HTML if a form is already present. Note i haven't implemented anything to "cancel" the form.
        // if (target.querySelector('form')) return;

        // // Note the functionality below only allows for changing the details of each vehicle. You need to do a bit more than this.
        // const oldText = deetsP.textContent;
        // console.log(oldText);

        // deetsP.outerHTML = `
        //     <form class="edit-deets-form">
        //         <textarea rows='5'>${oldText}</textarea>
        //         <button type="submit">Save</button>
        //     </form>
        // `;
        // const form = target.querySelector('.edit-deets-form');
        // form.addEventListener('submit', async (e) => {

        //     // don't redirect to whatever the form would normally redirect to.
        //     e.preventDefault();

        //     const newDeets = form.querySelector('textarea').value;
        //     const myKey = `${target.querySelector('.model').innerText}-${target.querySelector('.year').innerText}`.toLowerCase().replaceAll(' ', '-');
        //     records[myKey]['deets'] = newDeets;
        //     // If you are doing a local storage apporach for CRUD this would be all you need.
        //     // localStorage.setItem("my-rides", JSON.stringify(records));

        //     // Yes, in this case you do need to submit your entire records array as the value.

        //     // If you are doing a remote storage approach the below code will work for JSONBIN.
        //     // But note that pasting your API key directly could lead to it being exposed in your repo.
        //     // Now client-side code cannot inject env vars for you (typically a backend/build system process) so trying to hide the API key can end up being a complicated process depending on your choice of framework or deployment.
        //     // Never mind that anyone can then access the source code on your deployed site and pull in the key directly from there anyway.
        //     // Which is to say I can only advise CRUD on remote at this point if you do not care about your JSONBIN API Key.
        //     await fetch(url, {
        //         method: 'PUT', headers: {
        //             'Content-Type': 'application/json',
        //             'X-Master-Key': '$$2a$10$kVe4YMjasUMh33PVFF.EsOcSvtZQVZSu9hIJA9uOFIGjLYbxIS3R2',
        //         }, body: JSON.stringify(records)
        //     });
        //     form.outerHTML = `<p class="deets">${newDeets}</p>`;
        // });
    }
}

function setLocalStorage() {
    const items = Array.prototype.map.call(document.getElementById("classes").children, item => {
        if (item.toList)
            return item.toList();
    }).filter(item => {
        return item !== undefined;
    })

    localStorage.setItem('classes', JSON.stringify(items));
}