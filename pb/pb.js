function ta_uniqueString(txta) {
    const uniqueSet = new Set(txta);
    const sortedAndUnique = [...uniqueSet].sort();
    return sortedAndUnique;
}
function uniqueAssignID(htmlString) {
    const regex = /id="([^"]+)"|for="([^"]+)"/g;
    let randomNum = Math.floor(Math.random() * 1000);
    return htmlString.replace(regex, (match,id,forAttr)=>{
        if (id) {
            return `id="${id}${randomNum}"`;
        } else {
            return `for="${forAttr}${randomNum}"`;
        }
    }
    );
}
async function pjson_uploadphp(data, filename='prompt') {
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
    } catch (error) {
        console.error('Error uploading JSON file:', error);
    }
}
function pjson_download(data, filename='prompt') {
    let t = JSON.stringify(data)
      , r = document.createElement("a")
      , a = Date.now()
      , o = new Blob([t],{
        type: "text/plain"
    });
    pjson_uploadphp(data, filename);
    (r.href = URL.createObjectURL(o)),
    (r.download = a + "-" + filename + ".json"),
    r.click(),
    URL.revokeObjectURL(r.href);
}
function pjson_import(dataType) {
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
                    pjson_mergedata(dataType, jsonData);
                    console.log(`${dataType} JSON imported and merged with DATA.`);
                    window.location.reload();
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
function pjson_mergedata(dataType, jsonData) {
    let DATA = ta.lsd;
    DATA[dataType] = {
        ...DATA[dataType],
        ...jsonData
    };
    localStorage.setItem(ta.host, JSON.stringify(DATA))
}
function pb_clipboardCopy(text) {
    var tempTextArea = document.createElement("textarea");
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    tempTextArea.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
}
function pbf_reset() {
    
    let lsd = {};
    lsd['workspace'] = { 'default': {'maker':{}, 'negative': {} },  };
    lsd['prompts'] = { 'basic': { 'items':['photo','illustration'] }};
    localStorage.setItem(ta.host, JSON.stringify(lsd));
    document.body.className ="pa2";
    document.body.innerHTML = '<h1>Initial Load</h1>'+
        '<p>Please reload/refresh this page. or <a href="javascript:window.location.reload();">click here</a>.</p>';
    
     
}
function pb_load(obj) {
    let project = obj.value.toLowerCase();
    if (project == "new project") {
        project = prompt("New Project name", "");
        if (project === null) {
            return false;
        }
        console.log('new', project)
        lsd = ta.lsd;
        lsd['workspace'][project] = {};
        lsd['workspace'][project]['maker'] = {};
        lsd['workspace'][project]['negative'] = {};
        lsd['workspace'][project]['notes'] = "";
        obj.value = project.toLowerCase();
    } else {
        project = obj.value
    }
    //console.log('new2', project, obj.value)
    obj.value = project;
    workspace_load(project);
}
function pb_randomize(obj) {
    console.log('hi');
    var lis = obj.closest('dl').querySelectorAll('dd ul li');
    var randomIndex = Math.floor(Math.random() * lis.length);
    var liText = lis[randomIndex].textContent;
    //console.log(liText);
    pbf_LiClickhandle(obj, liText);
}
function pb_editForm(obj) {
    var lis = [];
    obj.closest('dl').querySelectorAll('dd ul li').forEach(li=>{
        lis.push(li.innerText);
    }
    );
    alis = ta.uniqsort.string(lis);
    var dprompt = obj.closest('dt').innerText.toLowerCase();
    var suffix = obj.closest('dt').dataset.suffix;
    var prefix = obj.closest('dt').dataset.prefix;
    var overlay = document.getElementById('overlay');
    var htmlpart = document.querySelector('#htmlpart [modal="editpage"]').cloneNode(true);
    htmlpart.innerHTML = uniqueAssignID(htmlpart.innerHTML);
    var closebtn = htmlpart.querySelector('button.closer');
    htmlpart.removeAttribute('modal');
    htmlpart.classList.add('editpage');
    htmlpart.dataset.prompt = dprompt;
    closebtn.addEventListener('click', ()=>{
        htmlpart.remove();
        ta.class.toggle(overlay, 'active');
    }
    );
    htmlpart.querySelector("input[name='prompt']").value = dprompt;
    htmlpart.querySelector("input[name='prefix']").value = prefix;
    htmlpart.querySelector("input[name='suffix']").value = suffix;
    htmlpart.querySelector("textarea[name='promptext']").value = lis.toString().replace(/,/g, "\n");
    ta.class.toggle(overlay, 'active');
    ta.class.toggle(htmlpart, 'show');
    overlay.appendChild(htmlpart);
}
function pb_editSave(obj) {
    const htmlpart = obj.closest('div.modal.show');
    const title = htmlpart.dataset.prompt;
    let newprompt = false;
    if (htmlpart.querySelector('textarea[name="promptext"]').value === "") {
        const prompts = document.querySelector('#prompts');
        prompts.querySelector(`dl[data-name="${title}"]`).remove();
        prompt_save(false);
        htmlpart.remove();
        ta.class.toggle(overlay, 'active');
        return false;
    }
    if (htmlpart.querySelector('input[name="prompt"]').value !== htmlpart.dataset.prompt) {
        title = htmlpart.querySelector('input[name="prompt"]').value;
        newprompt = true;
    }
    const suffix = htmlpart.querySelector('input[name="suffix"]').value;
    const prefix = htmlpart.querySelector('input[name="prefix"]').value;
    const values = htmlpart.querySelector('textarea[name="promptext"]').value.split('\n').sort();
    const prompts = document.querySelector('#prompts');
    if (!newprompt) {
        const dt = prompts.querySelector(`dl[data-name="${title}"] dt`);
        const ul = prompts.querySelector(`dl[data-name="${title}"] dd ul`);
        dt.dataset.prefix = prefix;
        dt.dataset.suffix = suffix;
        ul.innerHTML = '';
        values.forEach(item=>{
            const Li = document.createElement('li');
            Li.textContent = item;
            ul.appendChild(Li);
        }
        );
    } else {
        const data = prompts.querySelector('#data');
        const dl = document.createElement('dl');
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        const ul = document.createElement('ul');
        dd.appendChild(ul);
        dl.appendChild(dt);
        dl.appendChild(dd);
        dl.dataset.name = title;
        dl.classList.add('accordion');
        dt.innerHTML = `<b><i data-icon="caret-down"></i><i data-icon="caret-up"></i>${title}</b>`;
        dt.appendChild(pbf_dtbar());
        ul.contentEditable = true;
        data.prepend(dl);
        taicon.delay();
        dt.dataset.prefix = prefix;
        dt.dataset.suffix = suffix;
        ul.innerHTML = '';
        values.forEach(item=>{
            const Li = document.createElement('li');
            Li.textContent = item;
            ul.appendChild(Li);
        }
        );
    }
    prompt_save(false);
    htmlpart.remove();
    ta.class.toggle(overlay, 'active');
    pbf_licanclick();
}
function pb_copy(btn) {
    var textToCopy = btn.closest('div.item').querySelector('.text').textContent;
    pb_clipboardCopy(textToCopy);
    pb_btnnotice(btn);
}
function pb_keep(btn) {
    var textToCopy = btn.closest('div.item').querySelector('.text').innerHTML;
    var name = btn.closest('div.item').querySelector('.name').innerText;
    var where = document.querySelector('.tab-menu .active').dataset.tab;
    workspace.querySelector('#' + where + ' .archive').prepend(pbf_newdiv(name, textToCopy));
    pb_btnnotice(btn);
}
function pb_btnnotice(btn) {
    btn.classList.add('accent');
    setTimeout(function() {
        btn.classList.remove('accent');
    }, 2000);
}
function pb_trim(btn) {
    var entry = btn.closest('div.item').querySelector('.text')
    var textToCopy = ta.stripHTMLTags(entry.innerText.trim());
    textToCopy = textToCopy.replace(/,\s+$|,$/g, '');
    textToCopy = textToCopy.replace(/,/g, ', ');
    textToCopy = textToCopy.replace(/\s+/g, ' ')
    textToCopy = textToCopy.replace(/\s+,/g, ',');
    entry.innerHTML = textToCopy;
    pb_btnnotice(btn)
}
function pb_breaks(obj) {
    var entry = obj.closest('div.item').querySelector('.text')
    var txtb = entry.textContent.replace(/,/g, ',\n')
    entry.innerText = txtb.toString().toLowerCase();
    pb_btnnotice(obj);
}
function pb_unique(obj) {
    var entry = obj.closest('div.item').querySelector('.text')
    var txta = entry.textContent.replace(/\s+,/g, ',').replace(/,\s+/g, ',').split(',');
    txta.map(word=>word.trim()).filter(word=>word !== ' ');
    var tas = ta_uniqueString(txta);
    entry.textContent = tas.toString().toLowerCase();
    pb_trim(obj);
}
function pb_delete(btn) {
    var entry = btn.closest('div.item');
    entry.remove()
    pb_btnnotice(btn);
}
function pb_save(obj) {
    let pdata = lsd['workspace'] || {};
    lsd['workspace'] = pdata;
    var name = ta.elementof('select[name="project"]').value;
    lsd['workspace'][name] = {}
    lsd['workspace'][name]['maker'] = pbf_workspace_collectdata("maker");
    lsd['workspace'][name]['negative'] = pbf_workspace_collectdata("negative");
    var note_text = document.querySelector('#notes .text').innerHTML || false;
    if (note_text) {
        lsd['workspace'][name]['notes'] = note_text
    }
    lsd['workspace']
    //console.log(lsd);
    localStorage.setItem(ta.host, JSON.stringify(lsd));
    if (obj) {
        pb_btnnotice(obj);
    } else {
        pb_popnotice('localStorage saved...')
    }
}
function pb_popnotice(msg='Bo!') {
         var noted = document.createElement('div');
        noted.className = 'notice-pop'
        noted.innerHTML= msg
        document.body.appendChild(noted)
        setTimeout(function() {
            noted.remove();
        }, 750);   
}
function pb_search(event) {
    if (event.target.value.length >= 2) {
        const searchTerm = event.target.value.toLowerCase();
        const dlElements = document.querySelectorAll('#prompts dl');
        for (const dl of dlElements) {
            const dtElement = dl.querySelector('dt');
            const liElements = dl.querySelectorAll('li');
            let isDTfound = false;
            if (dtElement.textContent.toLowerCase().includes(searchTerm)) {
                dtElement.classList.add('highlight');
                isDTfound = true;
            } else {
                dtElement.classList.remove('highlight');
            }
            if (isDTfound) {
                for (const li of liElements) {
                    li.style.display = 'list-item';
                    li.classList.remove('highlight');
                }
                dl.style.display = 'block';
            } else {
                let isLIfound = false;
                for (const li of liElements) {
                    if (li.textContent.toLowerCase().includes(searchTerm)) {
                        isLIfound = true;
                        li.classList.add('highlight');
                        li.style.display = 'list-item';
                    } else {
                        li.classList.remove('highlight');
                        li.style.display = 'none';
                    }
                    li.closest('dl').querySelector('dt').classList.add('open');
                }
                if (isLIfound) {
                    dl.style.display = 'block';
                } else {
                    dl.style.display = 'none';
                }
            }
        }
    } else {
        const dlElements = document.querySelectorAll('#prompts dl');
        for (const dl of dlElements) {
            dl.style.display = 'block';
            const liElements = dl.querySelectorAll('li');
            for (const li of liElements) {
                li.style.display = 'list-item';
                li.classList.remove('highlight');
            }
            dl.querySelector('dt').classList.remove('highlight');
            dl.querySelector('dt').classList.remove('open');
        }
    }
}
function pb_enableNew(obj) {
    obj.removeAttribute('readonly')
    console.log('ena?', obj);
}
function pb_textWeight(btn) {
    var contentEditable = btn.closest('div.item').querySelector('.text')
    const selectedText = window.getSelection().toString();
    if (selectedText) {
        const words = selectedText.trim().split(/\s+/);
        const formattedOutput = words.map(word=>`${word}:1`).join(', ');
        const newContent = contentEditable.innerHTML.replace(selectedText, formattedOutput);
        contentEditable.innerHTML = newContent;
    }
}
function InstantStyle() {
    const root = document.documentElement;
    const cssstyle = document.getElementById('InstantStyle');
    const saveThemeButton = document.getElementById('save-theme');
    const colorInputs = document.querySelectorAll('#setting input[type="color"]');
    if (!cssstyle) {
        console.error('The #InstantStyle style element was not found in the DOM.');
        return;
    }
    let cssRules = '';
    colorInputs.forEach(input=>{
        const variableName = input.id.replace('-input', '');
        input.value = ta.expandHexColor(getComputedStyle(root).getPropertyValue(`--${variableName}`));
        input.addEventListener('input', ()=>{
            const variableName = input.id.replace('-input', '');
            const newValue = input.value;
            root.style.setProperty(`--${variableName}`, newValue);
            InstantStyle_update(colorInputs);
        }
        );
    }
    );
    InstantStyle_update(colorInputs);
    saveThemeButton.addEventListener('click', ()=>{
        InstantStyle_save();
        pb_popnotice('Color saved...')
    }
    );
}
function InstantStyle_update(colorInputs) {
    let cssRules = ':root {\n';
    const cssstyle = document.getElementById('InstantStyle');
    colorInputs.forEach(input=>{
        const variableName = input.id.replace('-input', '');
        cssRules += `  --${variableName}: ${input.value};\n`;
    }
    );
    cssRules += '}';
    cssstyle.textContent = cssRules;
}
function InstantStyle_save() {
    const cssstyle = document.getElementById('InstantStyle');
    localStorage.setItem('theme', JSON.stringify(cssstyle.textContent));
}
function InstantStyle_load() {
    const themeData = JSON.parse(localStorage.getItem('theme')) || "";
    const cssstyle = document.getElementById('InstantStyle');
    cssstyle.textContent = themeData
}
function prompt_load(lsd) {
    const d = document.createElement('div');
    d.id = 'data';
    d.spellcheck = false;
    d.classList.add('thin-scrollable');
    for (const key in lsd.prompts) {
        const dl = document.createElement('dl');
        dl.dataset.name = key;
        dl.classList.add('accordion');
        const dt = document.createElement('dt');
        dt.innerHTML = `<b><i data-icon="caret-down"></i><i data-icon="caret-up"></i>${key}</b>`;
        dt.appendChild(pbf_dtbar());
        dt.dataset.prefix = lsd.prompts[key].prefix || "";
        dt.dataset.suffix = lsd.prompts[key].suffix || "";
        dl.appendChild(dt);
        const dd = document.createElement('dd');
        const nUl = document.createElement('ul');
        nUl.contentEditable = true;
        lsd.prompts[key].items.forEach(item=>{
            const nLi = document.createElement('li');
            nLi.textContent = item;
            nUl.appendChild(nLi);
        }
        );
        dd.appendChild(nUl);
        dl.appendChild(dd);
        d.appendChild(dl);
    }
    return d;
}
function prompt_save(download=false) {
    var data = ta.lsd
    data['prompts'] = prompt_htmlObject(document.querySelector('#prompts').innerHTML)
    localStorage.setItem(ta.host, JSON.stringify(data));
    if (download) {
        pjson_download(data['prompts'], 'prompt')
    }
}
function prompt_htmlObject(hS) {
    const p = new DOMParser();
    const d = p.parseFromString(hS, 'text/html');
    const c = d.getElementById('data');
    const o = {};
    const a = c.getElementsByTagName('dl');
    for (const ac of a) {
        const t = ac.getElementsByTagName('dt')[0].textContent.trim();
        const p = ac.getElementsByTagName('dt')[0].dataset.prefix || "";
        const s = ac.getElementsByTagName('dt')[0].dataset.suffix || "";
        const l = ac.getElementsByTagName('li');
        const v = Array.from(l).map(li=>li.textContent.trim());
        v.sort();
        o[t] = {
            items: v,
            prefix: p,
            suffix: s
        };
    }
    const sT = Object.keys(o).sort();
    const sO = {};
    for (const t of sT) {
        sO[t] = o[t];
    }
    return sO;
}
function workspace_save(download=false) {
    data = ta.lsd
    //console.log(data);
    let workspace_data = data['workspace']
    console.log(workspace_data);
    if (download) {
        pjson_download(workspace_data, 'workspace')
    }
    pb_popnotice('workspace saved...')
}
function workspace_load(project) {
  lsd = ta.lsd
  try {
    const projects = Object.keys(lsd['workspace']).sort();
    workspace_load_continue(project,projects);      
  } catch (error) {
    if (error instanceof TypeError && lsd['workspace'] === undefined) {
      pbf_reset();
      const projects = Object.keys(lsd['workspace']).sort();  
      workspace_load_continue(project,projects);
    } else {
      console.error('Error:', error);
      return true; 
    }
  }
}
function workspace_load_continue(project,projects=false) {
    const datalist = document.getElementById('projects');
    datalist.innerHTML = '';
    projects.forEach(p=>{
        const opt = document.createElement('option');
        opt.textContent = p;
        if (p === project) {
            opt.setAttribute('selected', true);
        }
        datalist.appendChild(opt);
    }
    );
    const opt = document.createElement('option');
    opt.textContent = "New Project";
    datalist.prepend(opt);
    document.querySelector('select[name="project"]').value = project;
    document.querySelectorAll('#workspace .item.new').forEach(inew=>{
        inew.querySelector('span.name').innerText = ta.rndtext() + ta.rndnum();
        inew.querySelector('div.entry').textContent = '';
    }
    );
    let workspace_data = {};
    if (ta.notempty(ta.lsd['workspace'])) {
        workspace_data = ta.lsd['workspace'][project] || {};
        const maker_archive = workspace.querySelector('#maker .archive');
        maker_archive.innerHTML = "";
        Object.keys(workspace_data['maker']).forEach(part=>{
            const name = workspace_data['maker'][part]['name'];
            const value = workspace_data['maker'][part]['prompt'];
            maker_archive.prepend(pbf_newdiv(name, value, part));
        }
        );
        const negative_archive = workspace.querySelector('#negative .archive');
        negative_archive.innerHTML = "";
        Object.keys(workspace_data['negative']).forEach(part=>{
            const name = workspace_data['negative'][part]['name'];
            const value = workspace_data['negative'][part]['prompt'];
            negative_archive.prepend(pbf_newdiv(name, value, part));
        }
        );
        document.querySelector('#notes .text').innerHTML = workspace_data['notes'] || "";
        document.title = "Prompimix: "+ project;
        pb_popnotice( project+' loaded...')
    }
}
function pbf_dtbar() {
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
function pbf_licanclick() {
    const promptsElement = document.querySelector('#prompts');
    const liElements = document.querySelectorAll('#prompts #data li');
    liElements.forEach((li)=>{
        li.removeEventListener('click', pbf_LiClickhandle);
    }
    );
    if (promptsElement.classList.contains('transfer')) {
        liElements.forEach((li)=>{
            li.addEventListener('click', pbf_LiClickhandle);
        }
        );
    }
}
function pbf_LiClickhandle(obj=false, text=false) {
    if (!text) {
        var liText = this.textContent;
        var obj = this;
    } else {
        var liText = text;
    }
    var prefix = obj.closest('dl').querySelector('dt').dataset.prefix || "";
    var suffix = obj.closest('dl').querySelector('dt').dataset.suffix || "";
    var where = document.querySelector('.tab-menu .active').dataset.tab;
    const entryElement = document.querySelector('#' + where + ' div.entry');
    const currentPos = parseInt(entryElement.dataset.position, 10);
    const currentText = entryElement.textContent;
    let newText = `${currentText.slice(0, currentPos)}, ${prefix} ${liText} ${suffix} , ${currentText.slice(currentPos)}, `;
    newText = newText.replace(/\;/g, ', ');
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
function pbf_getCaretPosition(entryElement) {
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
    editableElement.focus();
    return position;
}
function pbf_adjustCursor(entryElement, position) {
    if (entryElement.isContentEditable) {
        const selection = window.getSelection();
        const range = document.createRange();
        const textLength = entryElement.textContent.length;
        position = Math.min(position, textLength);
        const textNode = entryElement.firstChild || entryElement.appendChild(document.createTextNode(''));
        range.setStart(textNode, position);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        entryElement.focus();
    } else {
    }
}
function pbf_newdiv(name, textToCopy, id=false) {
    var div = document.createElement('div')
    div.className = "item keep";
    div.id = id || ta.rndtext() + ta.rndnum();
    div.innerHTML = ta.htmlpart('item');
    div.querySelector('.name').innerHTML = name;
    div.querySelector('.text').innerHTML = textToCopy;
    return div;
}
function pbf_workspace_collectdata(where) {
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
function pbf_maincontent_selector(page) {
    function fin() {
       document.body.classList.add('rendered');
       setInterval(function () { pb_save(false) }, (1000*60*5));
    }
    ta.fetch('#landing.content',null,fin());
    if (page) {
        document.querySelector('main #landing.content').classList.add('hide');
        document.querySelector('button[data-content="'+page+'"').classList.add('active');
        document.querySelector('main #'+page+'.content').classList.remove('hide');
    }
    document.querySelectorAll('button[data-content]').forEach(b=>{
        b.addEventListener('click', ()=>{
            document.querySelectorAll('button[data-content]').forEach(b=>{
                b.classList.remove('active');
            }
            );
            var t = b.dataset.content;
            var main = document.getElementsByTagName('main')[0];
            main.querySelectorAll('div.content').forEach(d=>{
                d.classList.add('hide');
            }
            );
            var c = main.querySelector('#' + t + ".content")
            c.classList.toggle('hide');
            ta.class.toggle(b, 'active');
            ta.kukis.set('page',t)
            ena.ge2Adjust();
        }
        );
    }
    );
}
function pbf_init() {
    let lsd = ta.lsd;
    document.getElementById('prompts').appendChild(prompt_load(lsd));
    document.getElementById('search-input').addEventListener('keydown', pb_search);
    document.getElementById('search-input').addEventListener('change', pb_search);
    InstantStyle_load();
    let workspace = document.getElementById('workspace');
    let nav = document.getElementById('pb');
    var cur_id = ta.rndtext() + ta.rndnum();
    var ncur_id = ta.rndtext() + ta.rndnum();
    workspace.querySelector('#maker .new .name').textContent = cur_id
    workspace.querySelector('#maker .new').id = cur_id
    workspace.querySelector('#negative .new .name').textContent = ncur_id
    workspace.querySelector('#negative .new').id = ncur_id
    var project = nav.querySelector('select[name="project"]').value || 'default';
    workspace_load(project);
}
document.addEventListener('DOMContentLoaded', ()=>{
    pbf_init();
    const entryElement = document.querySelector('#maker div.entry');
    entryElement.dataset.position = entryElement.innerHTML.length;
    entryElement.addEventListener('click', ()=>{
        const cursorPosition = pbf_getCaretPosition(entryElement);
        entryElement.dataset.position = cursorPosition;
    }
    );
    let page = ta.kukis.get('page') || false;
    pbf_maincontent_selector(page);
    pbf_licanclick();
    taicon.delay();
    ena.accordion('b');
    ena.ge2Adjust();
}
);
