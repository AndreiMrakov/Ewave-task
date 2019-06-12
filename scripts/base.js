const gId = (child, parent = document) => parent.getElementById(child);
const qSel = (child, parent = document) => parent.querySelector(child);
const qSelAll = (child, parent = document) => parent.querySelectorAll(child);
const createEl = (tag, classname) => {
    let new_elem = document.createElement(tag);
    classname ? new_elem.classList.add(classname) : null;
    return new_elem;
};

const getVal = (node) => node.value !== undefined ? node.value.trim() : null;