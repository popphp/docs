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

function changeVersion() {
    let version = document.querySelector('#version-select').value;
    window.location.href = version;
}

function setActiveNav() {
    let href      = window.location.pathname;
    let hash      = window.location.hash;
    let activeNav = document.querySelector('ul.side-nav > li > ul > li > a[href="' + href + '"]');

    if (activeNav != null) {
        activeNav.parentNode.setAttribute('class', 'list-disc list-orange');
        let sibling = activeNav.nextElementSibling;
        if ((sibling != null) && (sibling.nodeName === 'UL')) {
            sibling.setAttribute('class', 'block');
        }
        if (hash !== '') {
            let activeSubNav    = document.querySelector('ul.side-nav > li > ul > li > ul > li > a[href="' + href + hash + '"]');
            let activeSubSubNav = document.querySelector('ul.side-nav > li > ul > li > ul > li > ul > li > a[href="' + href + hash + '"]');
            if (activeSubNav != null) {
                activeSubNav.setAttribute('class', 'bold');
            } else if (activeSubSubNav != null) {
                activeSubSubNav.setAttribute('class', 'bold');
            }
        }
    }

    let subNavs    = document.querySelectorAll('ul.side-nav > li > ul > li > ul > li > a');
    let subSubNavs = document.querySelectorAll('ul.side-nav > li > ul > li > ul > li > ul > li > a');
    if (subNavs !== undefined) {
        for (var i = 0; i < subNavs.length; i++) {
            subNavs[i].addEventListener('click', function(e){
                for (var j = 0; j < subNavs.length; j++) {
                    subNavs[j].removeAttribute('class');
                }
                for (var k = 0; k < subSubNavs.length; k++) {
                    subSubNavs[k].removeAttribute('class');
                }
                e.target.setAttribute('class', 'bold');
            });
        }
    }

    if (subSubNavs !== undefined) {
        for (var l = 0; l < subSubNavs.length; l++) {
            subSubNavs[l].addEventListener('click', function(e){
                for (var m = 0; m < subNavs.length; m++) {
                    subNavs[m].removeAttribute('class');
                }
                for (var n = 0; n < subSubNavs.length; n++) {
                    subSubNavs[n].removeAttribute('class');
                }
                e.target.setAttribute('class', 'bold');
            });
        }
    }
}

export {toggleSidebar, copyCode, changeVersion, setActiveNav};
