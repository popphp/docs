function toggleSidebar(id) {
    let sidebar = document.querySelector(id);
    sidebar.style.left = (sidebar.style.left != '0px') ? '0px' : '-280px';
}

function copyCode(a) {
    let code     = null;
    let siblings = a.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        if (siblings[i].nodeName == 'CODE') {
            code = siblings[i].innerText;
            break;
        }
    }
    navigator.clipboard.writeText(code);
}

export {toggleSidebar, copyCode};
