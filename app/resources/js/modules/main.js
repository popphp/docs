function copyCode (a) {
  return {
    copy: a => {
      const siblings = a.parentNode.childNodes

      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i].nodeName === 'CODE') {
          navigator.clipboard.writeText(siblings[i].innerText)
          return
        }
      }
    }
  }
}

function manageVersion() {
  return {
    changeVersion: () => {
      window.location.href = document.querySelector('#version-select').value
    }
  }
}

function manageNav () {
  return {
    setActiveNav: () => {
      const href = window.location.pathname
      const hash = window.location.hash
      const activeNav = document.querySelector('ul.side-nav > li > ul > li > a[href="' + href + '"]')

      if (activeNav != null) {
        activeNav.parentNode.setAttribute('class', 'list-disc list-orange')
        const sibling = activeNav.nextElementSibling
        if ((sibling != null) && (sibling.nodeName === 'UL')) {
          sibling.setAttribute('class', 'block')
        }
        if (hash !== '') {
          const activeSubNav = document.querySelector('ul.side-nav > li > ul > li > ul > li > a[href="' + href + hash + '"]')
          const activeSubSubNav = document.querySelector('ul.side-nav > li > ul > li > ul > li > ul > li > a[href="' + href + hash + '"]')
          if (activeSubNav != null) {
            activeSubNav.setAttribute('class', 'bold')
          } else if (activeSubSubNav != null) {
            activeSubSubNav.setAttribute('class', 'bold')
          }
        }
      }

      const subNavs = document.querySelectorAll('ul.side-nav > li > ul > li > ul > li > a')
      const subSubNavs = document.querySelectorAll('ul.side-nav > li > ul > li > ul > li > ul > li > a')
      if (subNavs !== undefined) {
        for (let i = 0; i < subNavs.length; i++) {
          subNavs[i].addEventListener('click', function (e) {
            for (let j = 0; j < subNavs.length; j++) {
              subNavs[j].removeAttribute('class')
            }
            for (let k = 0; k < subSubNavs.length; k++) {
              subSubNavs[k].removeAttribute('class')
            }
            e.target.setAttribute('class', 'bold')
          })
        }
      }

      if (subSubNavs !== undefined) {
        for (let l = 0; l < subSubNavs.length; l++) {
          subSubNavs[l].addEventListener('click', function (e) {
            for (let m = 0; m < subNavs.length; m++) {
              subNavs[m].removeAttribute('class')
            }
            for (let n = 0; n < subSubNavs.length; n++) {
              subSubNavs[n].removeAttribute('class')
            }
            e.target.setAttribute('class', 'bold')
          })
        }
      }
    }
  }
}

export { copyCode, manageVersion, manageNav }
