let toggleDarkMode = function() {
    let html = document.querySelector('html');
    if (html.getAttribute('class') == 'dark') {
        html.setAttribute('class', 'light');
        document.querySelector('a.dark-icon > svg:first-child').style.display = 'block';
        document.querySelector('a.dark-icon > svg:last-child').style.display = 'none';
    } else {
        html.setAttribute('class', 'dark');
        document.querySelector('a.dark-icon > svg:first-child').style.display = 'none';
        document.querySelector('a.dark-icon > svg:last-child').style.display = 'block';
    }
}

let toggleSidebar = function(id) {
    let sidebar = document.querySelector(id);
    sidebar.style.left = (sidebar.style.left != '0px') ? '0px' : '-280px';
}

let copyCode = function(a) {
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

hljs.highlightAll();