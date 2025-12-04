import './class-card.js'

let records = {}, dialog = undefined, curTarget
window.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    console.log("DOM Content loaded");

    document.querySelector('#load-json').addEventListener('click', loadFromJSON);
    document.querySelector('#clear-storage').addEventListener('click', () => {
        localStorage.removeItem('classes');
        document.getElementById('classes').replaceChildren();
    });
    document.getElementById("classes").addEventListener('click', galleryClick);

    if (localStorage.getItem('classes'))
        parseJSON(JSON.parse(localStorage.getItem('classes')));

    const addNew = document.querySelector('#add-new');
    dialog = document.querySelector('#card-menu');
    if (dialog) {
        addNew.addEventListener('click', () => {
            curTarget = null;
            openCardMenu({}, 'Create');
        })

        const backdrop = document.querySelector('#card-menu background-cover');
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog || e.target === backdrop) {
                dialog.close();
            }
        });

        dialog.querySelector('#class-submit').addEventListener('click', submitCardMenu);
    }
}

function openCardMenu(data, submitName) {
    dialog.showModal();

    dialog.querySelector('#class-id').value = data['id'] || '';
    dialog.querySelector('#class-name').value = data['name'] || '';
    dialog.querySelector('#class-link').value = data['link'] || '';
    dialog.querySelector('#class-img-url').value = data['image_url'] || '';
    dialog.querySelector('#class-img-alt').value = data['image_alt'] || '';
    dialog.querySelector('#class-grade').value = data['grade'] || '';
    dialog.querySelector('#class-quarter').value = data['quarter'] || '';
    dialog.querySelector('#class-description').value = data['description'] || '';

    dialog.querySelector('#class-submit').innerHTML = submitName || '';
}

function submitCardMenu() {
    if (!dialog) return;

    const data = new FormData(dialog.querySelector("form"));
    const dataDict = {
        'id': data.get('class-id'),
        'name': data.get('class-name'),
        'link': data.get('class-link'),
        'image_url': data.get('class-img-url'),
        'image_alt': data.get('class-img-alt'),
        'grade': data.get('class-grade'),
        'quarter': data.get('class-quarter'),
        'description': data.get('class-description'),
    }

    if (curTarget === null) {
        const item = document.createElement("class-card");

        setCardAttributes(item, dataDict);
        item.setAttribute("editable", '');

        document.getElementById("classes").appendChild(item);
    } else {
        setCardAttributes(curTarget, dataDict);
        curTarget.connectedCallback();
    }

    setLocalStorage();
    dialog.close();
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

function setCardAttributes(item, classData) {
    item.setAttribute("id", `${classData.id}`);
    item.setAttribute("name", `${classData.name}`);
    item.setAttribute("link", `${classData.link}`);
    item.setAttribute("image-url", `${classData.image_url}`);
    item.setAttribute("image-alt", `${classData.image_alt}`);
    item.setAttribute("grade", `${classData.grade}`);
    item.setAttribute("quarter", `${classData.quarter}`);
    item.setAttribute("description", `${classData.description}`);
}

function parseJSON(jsonData) {
    records = jsonData;
    document.getElementById('classes').replaceChildren();
    Object.keys(records).forEach(key => {
        const classData = records[key];
        const item = document.createElement("class-card");

        setCardAttributes(item, classData);
        item.setAttribute("editable", '');

        document.getElementById("classes").appendChild(item);
    });
}

function galleryClick(e) {
    const target = e.target.closest('class-card');

    if (target) {
        const edit = e.target.closest('.edit');
        const del = e.target.closest('.delete');

        if (edit) {
            curTarget = target;
            openCardMenu(target.toList(), 'Edit');
        } else if (del) {
            document.getElementById("classes").removeChild(target);
            setLocalStorage();
        }
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