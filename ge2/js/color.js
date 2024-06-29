TaUIFunc.prototype.csscolor = function() {

    const rootStyle = getComputedStyle(document.documentElement);
    const colors = ['orange', 'red', 'blue', 'green', 'magenta', 'cyan', 'bg', 'fg', 'nbg'];
    let colorInputsContainer = document.createElement('div');
    colors.forEach(color=>colorInputsContainer.appendChild(this.createColorInput(`${color}-input`, color.charAt(0).toUpperCase() + color.slice(1), rootStyle.getPropertyValue(`--${color}`))));
    document.querySelector('div.color-inputs').innerHTML = '';
    document.querySelector('div.color-inputs').appendChild(colorInputsContainer);

    const colorInputs = document.querySelectorAll('.color-inputs input[type="color"]');
    const cssOutput = document.getElementById('live-css-styles');
    const csscodePre = document.getElementById('css-styles');
    const generateCSSStyles = ()=>{
        let cssStyles = (document.documentElement.getAttribute('theme') === 'dark') ? '[theme="dark"]:root {\n' : ':root,[theme="light"]:root {\n';
        colorInputs.forEach(input=>{
            const id = input.id.replace('-input', '');
            const value = this.formatHexColor(input.value);
            cssStyles += `  --${id}: #${value};\n`;
        }
        );
        cssStyles += '}';
        cssOutput.textContent = csscodePre.innerHTML = cssStyles;
    }
    ;
    colorInputs.forEach(input=>input.addEventListener('input', generateCSSStyles.bind(this)));
    colorInputs.forEach(input=>input.value = `#${this.formatHexColor(input.value)}`);
    generateCSSStyles.call(this);

}
;

TaUIFunc.prototype.createColorInput = function(id, label, value) {
    const inputContainer = document.createElement('p');
    const input = document.createElement('input');
    input.type = 'color',
    input.id = id,
    input.value = value;
    const inputLabel = document.createElement('label');
    //inputLabel.setAttribute('for', id); 
    inputLabel.textContent = label;
    inputContainer.appendChild(input),
    inputContainer.appendChild(inputLabel);
    return inputContainer;
}
;

TaUIFunc.prototype.formatHexColor = function(hexColor) {
    return hexColor.replace('#', '').padStart(6, hexColor[1] || '0');
}
;
