console.log('pb.js');
/* to ta */
function stripHTMLTags(str) {
    return str.replace(/<[^>]+>/g, '');
}
function expandHexColor(hexColor) {
  // Check if the input is a valid 3-character hex color
  if (hexColor.length !== 3 || !hexColor.match(/^[0-9A-F]{3}$/i)) {
    return hexColor;
  }

  // Expand the 3-character hex to a 6-character hex
  let expandedColor = '';
  for (let i = 0; i < hexColor.length; i++) {
    expandedColor += hexColor[i] + hexColor[i];
  }
  return expandedColor.toUpperCase();
}

function tcan() {
    console.log('tcan!!');
    const root = document.documentElement;
    const cssstyle = document.getElementById('tcanstyles');
    const saveThemeButton = document.getElementById('save-theme');
    const colorInputs = document.querySelectorAll('#setting input[type="color"]');

    if (!cssstyle) {
        console.error('The #tcan-style element was not found in the DOM.');
        return;
    }

    let cssRules = '';

    colorInputs.forEach(input => {
        const variableName = input.id.replace('-input', '');
        input.value = expandHexColor( getComputedStyle(root).getPropertyValue(`--${variableName}`));
        //console.log(variableName, input.value);

        input.addEventListener('input', () => {

            const variableName = input.id.replace('-input', '');
            const newValue = input.value;
            root.style.setProperty(`--${variableName}`, newValue);

            // Update the CSS rules
            updateCSSRules(colorInputs);
        });
    });

    // Update the CSS rules initially
    updateCSSRules(colorInputs);

    saveThemeButton.addEventListener('click', ()=>{
        saveThemeToStorage();
    }
    );
    
}

function updateCSSRules(colorInputs) {
    let cssRules = ':root {\n';
    const cssstyle = document.getElementById('tcanstyles');
    colorInputs.forEach(input => {
        const variableName = input.id.replace('-input', '');
        cssRules += `  --${variableName}: ${input.value};\n`;
    });

    cssRules += '}';
    cssstyle.textContent = cssRules;
}




function saveThemeToStorage() {
    const cssstyle = document.getElementById('tcanstyles');
    localStorage.setItem('theme', JSON.stringify(cssstyle.textContent));
}

function loadThemeFromStorage() {
    const themeData = JSON.parse(localStorage.getItem('theme'))||"";
    const cssstyle = document.getElementById('tcanstyles');
    cssstyle.textContent =  themeData 
}

function prompt_load(lsd) {
    var div = document.createElement('div');
    div.id = 'data'
    div.setAttribute('spellcheck', false);
    div.className = "pa pb2 thin-scrollable bgshade";
    const dl = document.createElement('dl');
    dl.className = 'accordion'
    const obj = lsd.prompts;
    for (const key in obj) {
        const dl = document.createElement('dl');
        dl.dataset.name = key;
        dl.className = 'accordion'
        const dt = document.createElement('dt');
        dt.innerHTML = '<b><i data-icon="caret-down"></i><i data-icon="caret-up"></i>' + key + '</b>';
        dt.appendChild(dt_bar());
        dt.dataset.prefix = obj[key]['prefix'];
        dt.dataset.suffix = obj[key]['suffix'];
        dl.appendChild(dt);
        const dd = document.createElement('dd');
        const nestedUl = document.createElement('ul');
        nestedUl.setAttribute('contenteditable', true);
        let items = obj[key].items;
        JSON.parse(JSON.stringify(items)).forEach((item)=>{
            var nestedLi = document.createElement('li');
            nestedLi.textContent = item;
            nestedUl.appendChild(nestedLi);
        }
        );
        dd.appendChild(nestedUl);
        dl.appendChild(dd);
        div.appendChild(dl);
    }
    return div;
}
function prompt_save(download=false) {
    var data = ta.lsd
    data['prompts'] = prompt_htmlObject(document.querySelector('#prompts').innerHTML)
    //console.log(data);
    localStorage.setItem(ta.host, JSON.stringify(data));
    if (download) {
        downloadJsonData(data['prompts'], 'prompt')
    }
}
function prompt_htmlObject(htmlString) {
    // Parse the HTML string into a DOM document
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    // Get the main container element
    const container = doc.getElementById('data');
    // Initialize the output object
    const output = {};
    // Iterate over the accordion elements
    const accordions = container.getElementsByTagName('dl');
    for (const accordion of accordions) {
        // Get the title from the <dt> element
        const title = accordion.getElementsByTagName('dt')[0].textContent.trim();
        const prefix = accordion.getElementsByTagName('dt')[0].dataset.prefix || "";
        const suffix = accordion.getElementsByTagName('dt')[0].dataset.suffix || "";
        // Get the list items from the <dd> element
        const listItems = accordion.getElementsByTagName('li');
        const values = Array.from(listItems).map(li=>li.textContent.trim());
        values.sort();
        // Add the title-values pair to the output object
        output[title] = {
            items: values,
            prefix: prefix,
            suffix: suffix
        };
    }
    // Sort the titles
    const sortedTitles = Object.keys(output).sort();
    const sortedOutput = {};
    for (const title of sortedTitles) {
        sortedOutput[title] = output[title];
    }
    return sortedOutput;
}
function workspace_save(download=false) {
    data = ta.lsd
    console.log(data);
    let workspace_data = data['workspace']
    console.log(workspace_data);
    if (download) {
        downloadJsonData(workspace_data, 'workspace')
    }
}
function workspace_load(project) {
    //console.log('t',project);
    //datalist
    datalist = document.getElementById('projects');
    var projects = Object.keys(lsd['workspace']).sort();
    datalist.innerHTML = '';
    //console.log(projects)
    projects.forEach((p)=>{
        var opt = document.createElement('option');
        opt.textContent = p;
        if ( p == project) { opt.setAttribute('selected',true); }
        datalist.appendChild(opt)
    }
    );
    var opt = document.createElement('option');
    opt.textContent = "New Project";
    datalist.prepend(opt);
    document.querySelector('select[name="project"]').value = project
    // reset entry item;
    document.querySelectorAll('#workspace .item.new').forEach( inew =>{
        inew.querySelector('span.name').innerText=ta.rndtext()+ta.rndnum();
        inew.querySelector('div.entry').textContent='';
    });
    let workspace_data = {}
    if (ta.notempty(ta.lsd['workspace'])) {
        workspace_data = ta.lsd['workspace'][project] || {}
        //maker
        var archive = workspace.querySelector('#maker .archive');
        archive.innerHTML = "";
        Object.keys(workspace_data['maker']).forEach((part)=>{
            //console.log(part);
            var name = workspace_data['maker'][part]['name'];
            var value = workspace_data['maker'][part]['prompt'];
            archive.prepend(newdiv(name, value, part));
        }
        );
        //negative
        var archive = workspace.querySelector('#negative .archive');
        archive.innerHTML = "";
        Object.keys(workspace_data['negative']).forEach((part)=>{
            //console.log(part);
            var name = workspace_data['negative'][part]['name'];
            var value = workspace_data['negative'][part]['prompt'];
            archive.prepend(newdiv(name, value, part));
        }
        );
        // notes
        document.querySelector('#notes .text').innerHTML = workspace_data['notes'] || "";
    }
}
async function uploadJsonToServer(data, filename='prompt') {
    try {
        const formData = new FormData();
        formData.append('json_data', JSON.stringify(data));
        formData.append('filename', filename);
        const response = await fetch('upload.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        console.log('JSON file uploaded successfully:', result);
        //downloadJsonData(data, filename);
    } catch (error) {
        console.error('Error uploading JSON file:', error);
    }
}
function downloadJsonData(data, filename='prompt') {
    let t = JSON.stringify(data)
      , r = document.createElement("a")
      , a = Date.now()
      , o = new Blob([t],{
        type: "text/plain"
    });
    uploadJsonToServer(data, filename);
    (r.href = URL.createObjectURL(o)),
    (r.download = a + "-" + filename + ".json"),
    r.click(),
    URL.revokeObjectURL(r.href);
}
// Assuming you have a DATA variable defined elsewhere in your code
function importJSON(dataType) {
    const jsonFileInput = document.createElement('input');
    jsonFileInput.type = 'file';
    jsonFileInput.accept = '.json';
    jsonFileInput.onchange = function() {
        if (this.files.length > 0) {
            const file = this.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    mergeData(dataType, jsonData);
                    console.log(`${dataType} JSON imported and merged with DATA.`);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            }
            ;
            reader.readAsText(file);
        } else {
            console.error('No file selected.');
        }
    }
    ;
    jsonFileInput.click();
}
function mergeData(dataType, jsonData) {
    let DATA = ta.lsd;
    DATA[dataType] = {
        ...DATA[dataType],
        ...jsonData
    };
    localStorage.setItem(ta.host, JSON.stringify(DATA))
}
/*
document.getElementById('promptsLink').addEventListener('click', () => importJSON('prompts'));
document.getElementById('workspaceLink').addEventListener('click', () => importJSON('workspace'));
*/
function dt_bar() {
    var div = document.createElement('div');
    var btn1 = document.createElement('button');
    var btn2 = document.createElement('button');
    btn1.className = 'naked randomize'
    btn2.className = 'naked edit'
    div.className = "flex end more"
    btn1.setAttribute('onclick', 'pb_randomize(this)');
    btn2.setAttribute('onclick', 'pb_editForm(this)');
    btn1.innerHTML = '<i data-icon="shuffle"></i>';
    btn2.innerHTML = '<i data-icon="opts-h"></i>';
    div.appendChild(btn2);
    div.appendChild(btn1);
    return div;
}
function add_li(obj) {
    var lis = obj.closest('dl').querySelector('dd ul');
    var dt = obj.closest('dt');
    var li = document.createElement('li');
    li.innerText = "New"
    lis.prepend(li);
    dt.classList.add('open');
}
function licanclick() {
    // Get the #prompts element
    const promptsElement = document.querySelector('#prompts');
    // Get all the li elements inside #prompts #data
    const liElements = document.querySelectorAll('#prompts #data li');
    // Remove any existing click event listeners from the li elements
    liElements.forEach((li)=>{
        li.removeEventListener('click', handleLiClick);
    }
    );
    // Check if the #prompts element has the .transfer class
    if (promptsElement.classList.contains('transfer')) {
        // Add click event listeners to the li elements
        liElements.forEach((li)=>{
            li.addEventListener('click', handleLiClick);
        }
        );
    }
}
function handleLiClick(obj=false, text=false) {
    if (!text) {
        // Get the text content of the clicked <li> element
        var liText = this.textContent;
        var obj = this;
    } else {
        var liText = text;
    }
    var prefix = obj.closest('dl').querySelector('dt').dataset.prefix || "";
    var suffix = obj.closest('dl').querySelector('dt').dataset.suffix || "";
    // Get the #maker div.entry element
    var where = document.querySelector('.tab-menu .active').dataset.tab;
    const entryElement = document.querySelector('#' + where + ' div.entry');
    // Get the current cursor position in the #maker div.entry element
    const currentPos = parseInt(entryElement.dataset.position, 10);
    // Update the text in the #maker div.entry element
    const currentText = entryElement.textContent;
    let newText = `${currentText.slice(0, currentPos)}, ${prefix} ${liText} ${suffix} , ${currentText.slice(currentPos)}, `;
    newText = newText.replace(/\s+/g, ' ');
    newText = newText.replace(/^,\s*/g, '');
    newText = newText.replace(/,\s*,|,,|\s*,/g, ',');
    newText = newText.replace(/,,/g, ',');
    entryElement.textContent = newText;
    entryElement.focus();
    entryElement.selectionStart = currentPos;
    entryElement.selectionEnd = currentPos + liText.length;
    entryElement.click();
}
// Function to get the current cursor position in the given element
function getCaretPosition(entryElement) {
    let position = 0;
    if (entryElement.isContentEditable) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(entryElement);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            position = preCaretRange.toString().length;
        }
    } else {
        if (document.getSelection) {
            const sel = document.getSelection();
            if (sel.rangeCount) {
                const range = sel.getRangeAt(0).cloneRange();
                range.selectNodeContents(entryElement);
                range.setEnd(sel.focusNode, sel.focusOffset);
                position = range.toString().length;
            }
        } else if (document.selection && document.selection.createRange) {
            const range = document.selection.createRange();
            const textRange = entryElement.createTextRange();
            textRange.setEndPoint("StartToStart", range);
            position = textRange.text.length;
        }
    }
    editableElement = entryElement;
    // Focus on the element
    editableElement.focus();
    return position;
}
function moveCursorToPosition(entryElement, position) {
    if (entryElement.isContentEditable) {
        const selection = window.getSelection();
        const range = document.createRange();
        // Ensure the position is within the text content length
        const textLength = entryElement.textContent.length;
        position = Math.min(position, textLength);
        // Move the cursor to the specified position
        const textNode = entryElement.firstChild || entryElement.appendChild(document.createTextNode(''));
        range.setStart(textNode, position);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        // Ensure the element is focused
        entryElement.focus();
    } else {// Handle non-contenteditable elements
    // (You may need to implement a different approach for these)
    }
}
function fallbackCopyToClipboard(text) {
    // Create a temporary text area to hold the text
    var tempTextArea = document.createElement("textarea");
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    // Select the text in the temporary text area
    tempTextArea.select();
    tempTextArea.setSelectionRange(0, 99999);
    // For mobile devices
    // Copy the selected text
    document.execCommand("copy");
    // Remove the temporary text area
    document.body.removeChild(tempTextArea);
}
function newdiv(name, textToCopy, id=false) {
    var div = document.createElement('div')
    div.className = "item keep";
    div.id = id || ta.rndtext() + ta.rndnum();
    div.innerHTML = ta.htmlpart('item');
    div.querySelector('.name').innerHTML = name;
    div.querySelector('.text').innerHTML = textToCopy;
    return div;
}
function collectdata(where) {
    let d = {}
    document.querySelectorAll('#' + where + ' div.item').forEach(div=>{
        var text = div.querySelector('.text').innerText || false;
        if (text) {
            d[div.id] = {};
            d[div.id]['name'] = div.querySelector('span.name').textContent;
            d[div.id]['prompt'] = div.querySelector('.text').textContent;
        }
    }
    );
    return d
}
function maincontent_selector() {
    document.querySelectorAll('button[data-content]').forEach( b => { 
      b.addEventListener('click', ()=>{
        document.querySelectorAll('button[data-content]').forEach( b => { 
          b.classList.remove('active');  });
        var t = b.dataset.content;
        var main = document.getElementsByTagName('main')[0];
        main.querySelectorAll('div.content').forEach( d => { d.classList.add('hide'); });
        var c = main.querySelector('#'+t+".content")
        //console.log(c);
        c.classList.toggle('hide');
        ta.class.toggle(b,'active');
    });  
});
}
/* Begin */
document.getElementById('prompts').appendChild(prompt_load(lsd));
document.getElementById('search-input').addEventListener('keydown', pb_search);
// init

loadThemeFromStorage();

let workspace = document.getElementById('workspace');
let nav = document.getElementById('pb');
var cur_id = ta.rndtext() + ta.rndnum();
var ncur_id = ta.rndtext() + ta.rndnum();
workspace.querySelector('#maker .new .name').textContent = cur_id
workspace.querySelector('#maker .new').id = cur_id
workspace.querySelector('#negative .new .name').textContent = ncur_id
workspace.querySelector('#negative .new').id = ncur_id
//console.log('project',nav.querySelector('select[name="project"]').value)
var project = nav.querySelector('select[name="project"]').value || 'default';
workspace_load(project);
document.addEventListener('DOMContentLoaded', ()=>{
    const entryElement = document.querySelector('#maker div.entry');
    entryElement.dataset.position = entryElement.innerHTML.length;
    entryElement.addEventListener('click', ()=>{
        const cursorPosition = getCaretPosition(entryElement);
        //console.log('click', cursorPosition)
        entryElement.dataset.position = cursorPosition;
    }
    );
    licanclick();
    taicon.delay();
    maincontent_selector();
}
);