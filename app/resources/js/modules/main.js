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

function setActiveNav() {
    let href = window.location.pathname;
    let activeNav = document.querySelector('ul.side-nav > li > ul > li > a[href="' + href + '"]');
    if (activeNav != null) {
        //activeNav.parentNode.setAttribute('class', 'list-disc text-orange-700');
    }
}

export {toggleSidebar, copyCode, setActiveNav};
