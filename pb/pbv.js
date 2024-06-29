/* -------------- */
let lsd = ta.lsd || JSON.parse(localStorage.getItem('prompimixweb'));


function addRandomNumbers(htmlString) {
  // Define a regular expression to match the id and for attributes
  const regex = /id="([^"]+)"|for="([^"]+)"/g;
	console.log('masuk');
  // Replace the matched attributes with a random number appended
 let randomNum = Math.floor(Math.random() * 1000);
  return htmlString.replace(regex, (match, id, forAttr) => {
    if (id) {
      return `id="${id}${randomNum}"`;
    } else {
      return `for="${forAttr}${randomNum}"`;
    }
  });
}

function pb_load(obj) {
    
    let project = obj.value.toLowerCase();
    
    if (project == "new project") {
        project = prompt("New Project name", "");
        if (project === null)  { return false; }
        console.log('new', project)
        lsd = ta.lsd;
        lsd['workspace'][project]={};
        lsd['workspace'][project]['maker']={};
        lsd['workspace'][project]['negative']={};
        lsd['workspace'][project]['notes']="";

        obj.value = project.toLowerCase();
        
    } else {
        project = obj.value
    }
    
    console.log('new2', project, obj.value)
    obj.value = project;
    
    workspace_load(project);    
}

function pb_randomize(obj) {
    console.log('hi');
    var lis = obj.closest('dl').querySelectorAll('dd ul li');
    var randomIndex = Math.floor(Math.random() * lis.length);
    var liText = lis[randomIndex].textContent;
    console.log(liText);
    handleLiClick(obj, liText);
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
    htmlpart.innerHTML = addRandomNumbers(htmlpart.innerHTML);
    var closebtn = htmlpart.querySelector('button.closer');
    htmlpart.removeAttribute('modal');
    htmlpart.classList.add('editpage');
    htmlpart.dataset.prompt = dprompt;

    closebtn.addEventListener('click', ()=>{
        htmlpart.remove();
        ta.class.toggle(overlay, 'active');
    }
    );
    htmlpart.querySelector("input[name='prefix']").value = prefix;
    htmlpart.querySelector("input[name='suffix']").value = suffix;
    htmlpart.querySelector("textarea[name='promptext']").value = lis.toString().replace(/,/g, "\n");
    ta.class.toggle(overlay, 'active');
    ta.class.toggle(htmlpart, 'show');
    overlay.appendChild(htmlpart);
}
function pb_editSave(obj) {
    var htmlpart = obj.closest('div.modal.show')
    var title = htmlpart.dataset.prompt;
    var suffix = htmlpart.querySelector('input[name="suffix"]').value;
    var prefix = htmlpart.querySelector('input[name="prefix"]').value;
    var values = htmlpart.querySelector('textarea[name="promptext"]').value.split('\n');
    values.sort();
    let prompts = document.querySelector('#prompts');
    let dt = prompts.querySelector('dl[data-name="' + title + '"] dt');
    let ul = prompts.querySelector('dl[data-name="' + title + '"] dd ul');
    dt.dataset.prefix = prefix;
    dt.dataset.suffix = suffix;
    ul.innerHTML = '';
    values.forEach((item)=>{
        var Li = document.createElement('li');
        Li.textContent = item;
        ul.appendChild(Li);
    }
    )
    prompt_save(false);
    htmlpart.remove();
    ta.class.toggle(overlay, 'active');
    licanclick()
}
function pb_copy(btn) {
    var textToCopy = btn.closest('div.item').querySelector('.text').textContent;
    fallbackCopyToClipboard(textToCopy);
    btn_notice(btn);
}
function pb_keep(btn) {
    var textToCopy = btn.closest('div.item').querySelector('.text').innerHTML;
    var name = btn.closest('div.item').querySelector('.name').innerText;
    var where = document.querySelector('.tab-menu .active').dataset.tab;
    workspace.querySelector('#' + where + ' .archive').prepend(newdiv(name, textToCopy));
    btn_notice(btn);
    // balik bersih, pastikan project
}

function btn_notice(btn) {
    btn.classList.add('accent');
    setTimeout(function() {
        btn.classList.remove('accent');
    }, 2000);
}

function pb_trim(btn) {
    var entry = btn.closest('div.item').querySelector('.text')
    var textToCopy = stripHTMLTags(entry.innerText.trim());
    textToCopy = textToCopy.replace(/,\s+$|,$/g, '');
    textToCopy = textToCopy.replace(/,/g, ', ');
    textToCopy = textToCopy.replace(/\s+/g, ' ')
    textToCopy = textToCopy.replace(/\s+,/g, ',');
    entry.innerHTML = textToCopy;
    btn_notice(btn)
}

function sortAndRemoveDuplicates(txta) {
    // Convert the array to a Set to remove duplicates
    const uniqueSet = new Set(txta);

    // Convert the Set back to an array and sort it
    const sortedAndUnique = [...uniqueSet].sort();

    return sortedAndUnique;
}

function pb_breaks(obj) {
    var entry = obj.closest('div.item').querySelector('.text')
    var txtb = entry.textContent.replace(/,/g, ',\n')  
    entry.innerText = txtb.toString().toLowerCase();  
    btn_notice(obj);
}

function pb_unique(obj) {
    var entry = obj.closest('div.item').querySelector('.text')
    var txta = entry.textContent.replace(/\s+,/g, ',').replace(/,\s+/g, ',').split(',');
    txta.map(word=>word.trim()).filter(word=>word !== ' ');
    var tas = sortAndRemoveDuplicates(txta);
    //console.log(txta);
    // var tas = ta.uniqsort.string(txta,false);
    //console.log('sort', tas);
    entry.textContent = tas.toString().toLowerCase();
    pb_trim(obj);

}

function pb_delete(btn) {
    var entry = btn.closest('div.item');
    // rpompt
    entry.remove()
    btn_notice(btn);
}
function pb_save(obj) {
    let pdata = lsd['workspace'] || {};
    lsd['workspace'] = pdata;
    var name = ta.elementof('select[name="project"]').value;
    lsd['workspace'][name] = {}
    lsd['workspace'][name]['maker'] = collectdata("maker");
    lsd['workspace'][name]['negative'] = collectdata("negative");
    var note_text = document.querySelector('#notes .text').innerHTML || false;
    if (note_text) {
        lsd['workspace'][name]['notes'] = note_text
    }
    lsd['workspace']
    console.log(lsd);
    console.log(lsd);
    localStorage.setItem(ta.host, JSON.stringify(lsd));
    btn_notice(obj);
}
function pb_search(event) {
    // Check if the minimum search length is met (2 characters)
    if (event.target.value.length >= 2) {
        // Get the search term in lowercase
        const searchTerm = event.target.value.toLowerCase();
        // Get all the <dl> elements
        const dlElements = document.querySelectorAll('#prompts dl');
        // Iterate through each <dl> element
        for (const dl of dlElements) {
            const dtElement = dl.querySelector('dt');
            const liElements = dl.querySelectorAll('li');
            let isDTfound = false;
            // Check if the search term is found in the <dt> element
            if (dtElement.textContent.toLowerCase().includes(searchTerm)) {
                dtElement.classList.add('highlight');
                isDTfound = true;
            } else {
                dtElement.classList.remove('highlight');
            }
            // If the search term is found in the <dt> element, don't search the <li> elements
            if (isDTfound) {
                // Show all <li> elements
                for (const li of liElements) {
                    li.style.display = 'list-item';
                    li.classList.remove('highlight');
                }
                // Show the <dl> element
                dl.style.display = 'block';
            } else {
                // Check if the search term is found in any of the <li> elements
                let isLIfound = false;
                for (const li of liElements) {
                    if (li.textContent.toLowerCase().includes(searchTerm)) {
                        isLIfound = true;
                        li.classList.add('highlight');
                        li.style.display = 'list-item';
                        // Show the matching <li> element
                    } else {
                        li.classList.remove('highlight');
                        li.style.display = 'none';
                        // Hide the non-matching <li> element
                    }
                    li.closest('dl').querySelector('dt').classList.add('open');
                }
                // Show or hide the <dl> element based on the search result
                if (isLIfound) {
                    dl.style.display = 'block';
                } else {
                    dl.style.display = 'none';
                }
            }
        }
    } else {
        // Reset the search
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
/* eoc */
console.log('pbv.js -- should be no error above this');
