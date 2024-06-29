TaUIFunc.prototype.editor = function(what) {
    const editor = document.querySelector(what);
    this.applyHeading = function(level) {
      const selectedText = window.getSelection().toString();
      if (selectedText) {
        const newElement = document.createElement(level);
        newElement.textContent = selectedText;
        document.execCommand('insertHTML', false, newElement.outerHTML);
      }
    }    
}
TaUIFunc.prototype.RightClickMenu = function(targetElement, menuOptions) {
    const menu = document.createElement('ul');
    menu.id = 'right-click-menu';
    menu.classList.add('right-click-menu');
    menuOptions.forEach(option => {
        const li = document.createElement('li');
        const optionLink = document.createElement('a');
        optionLink.href = '#';
        optionLink.innerHTML = option.icon + "<span>" + option.label + "</span>";
        if (option.onClick) {
            optionLink.addEventListener('click', event => {
                event.preventDefault();
                option.onClick();
                hideMenu();
            });
        }
        li.appendChild(optionLink);
        menu.appendChild(li);
    });
    document.querySelectorAll(targetElement + ' >*').forEach(target => {
        target.addEventListener('contextmenu', event => {
            event.preventDefault();
            const element = target;//getNearestElement(event.pageX, event.pageY);
            const range = document.createRange();
            range.selectNodeContents(element);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            showMenu(event.pageX, event.pageY);
        });
        document.addEventListener('click', event => {
            if (!menu.contains(event.target)) {
                hideMenu();
                target.removeEventListener('contextmenu', dummy);
            }
        });
        menu.addEventListener('blur', () => {
            hideMenu();
            target.removeEventListener('contextmenu', dummy);
        }, true);
        function showMenu(x, y) {
            y = 10 + y - document.querySelector('[topnav]').offsetHeight;
            menu.style.display = 'flex';
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';
        }
        function removeMenu() {
            menu.classList.add('hide');
            target.removeEventListener('contextmenu', showMenu);
        }
        function hideMenu() {
            menu.style.display = 'none';
        }
        document.body.appendChild(menu);
        taicon.delay();
    });
};
TaUIFunc.prototype.getNearestElement= function(x, y) {
    const elements = document.elementsFromPoint(x, y);
    console.log('near',elements);
    return elements.length > 0 ? elements[0] : null;
}