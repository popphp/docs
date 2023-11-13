function toggleSidebar (id) {
  const sidebar = document.querySelector(id)

  sidebar.style.left = (sidebar.style.left !== '0px') ? '0px' : '-280px'
}

function copyCode (a) {
  const siblings = a.parentNode.childNodes

  for (let i = 0; i < siblings.length; i++) {
    if (siblings[i].nodeName === 'CODE') {
      navigator.clipboard.writeText(siblings[i].innerText)

      return
    }
  }
}

function setActiveNav () {
  const activeNav = document.querySelector(
    'ul.side-nav > li > ul > li > a[href="' +
        window.location.pathname +
        '"]'
  )

  if (activeNav) {
    activeNav.parentNode.setAttribute('class', 'list-disc list-orange')
  }
}

export { toggleSidebar, copyCode, setActiveNav }
