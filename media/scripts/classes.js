import './class-card.js'

const url = "https://api.jsonbin.io/v3/b/692fa890d0ea881f400f17de";
let records = {}
window.addEventListener('DOMContentLoaded', () => {
    init();
});

async function init() {
    console.log("DOM Content loaded");

    document.querySelector('#load-remote').addEventListener('click', loadRemote);
    document.querySelector('#load-local').addEventListener('click', loadLocal);

    if (!localStorage.getItem('visited-before')) {
        const response = await fetch('./media/json/classes.json');
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const jsonData = await response.json();
        localStorage.setItem('classes', JSON.stringify(jsonData))
        localStorage.setItem('visited-before', 'true');
    }
}

function loadLocal() {
    try {
        if (localStorage.getItem('classes')) {
            parseJSON(JSON.parse(localStorage.getItem('classes')));
        } else {
            const disclaimer = document.createElement("p");
            disclaimer.innerHTML = 'Looks like there aren\'t any cards in local storage! Click <a href="./crud.html">here</a> to change that.'
            
            document.getElementById('classes').replaceChildren(disclaimer);
        }
    } catch (error) {
        console.error(error);
    }
}

async function loadRemote() {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Access-Key': '$2a$10$/xFCDl.ibpy8.iyRhTVdlukxr8D7AbY28ZKzDj/koXnvcaKVsmQ2O'
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const jsonData = await response.json();
        parseJSON(jsonData.record);
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

        document.getElementById("classes").appendChild(window.galleryItem);
    });
}