function dummy() {}

class TaJSFunc {
    constructor() {
        this.version = "0.1a";
        this.ltm = Date.now();
        this.host = window.location.pathname.toLowerCase().replace(/\W/g, "");
        this.lsd = JSON.parse(localStorage.getItem(this.host)) || {};
        this.kukis_store = JSON.parse(localStorage.getItem("kukis")) || {};
    }

    ;rndtext() {
        const rc = ['0123456789', 'aeiou', 'bcdfghjklmnpqrstvwxyz'];
        return (rc[2][Math.floor(Math.random() * rc[2].length)] + rc[1][Math.floor(Math.random() * rc[1].length)] + rc[2][Math.floor(Math.random() * rc[2].length)] + rc[1][Math.floor(Math.random() * rc[1].length)] + rc[0][Math.floor(Math.random() * rc[0].length)] + rc[0][Math.floor(Math.random() * rc[0].length)]);
    }
    rndnum(minVal=1000, maxVal=9999) {
        var randVal = minVal + (Math.random() * (maxVal - minVal));
        return Math.round(randVal);
    }
    ;/* unique sort */
    uniq(value, index, self) {
        return self.indexOf(value) === index;
    }
    ;uniqsort = {
        string: (retArray,way=true)=>{
            if (way) {
                retArray.sort((b,a)=>b.localeCompare(b));
            } else {
                retArray.sort((b,a)=>a.localeCompare(a));
            }
            return retArray.filter(this.uniq);
        }
        ,
        number: (retArray,way=true)=>{
            if (way) {
                retArray.sort((b,a)=>a - b);
            } else {
                retArray.sort((b,a)=>b - a);
            }
            return retArray.filter(this.uniq);
        }
    };
    notempty(w) {
        if (typeof w !== 'undefined') {
            if (!w) {
                return false;
            }
            if (w === null) {
                return false;
            }
			if ((typeof w === 'object') && ( w !== {} )) {
				return w;
			}
			if ((typeof w === 'array') && ( w !== [] )) {
				return w;
			}
            if ((typeof w === 'string') && (w.trim() !== '')) {
                return w.trim()
            }
            return false;
        } else {
            return false;
        }
    }
    ;
    getrel(url) {
        var str = window.location.protocol + "\/\/" + window.location.hostname;
        return url.replace(str, "");
    }
    ;
    elementof(e) {
        if (typeof e == 'string') {
            e = document.querySelector(e)
        }
        return e
    }
    ;/* xhr.fetch */
    fetch(e, url=null, chains, cvar={}) {
        e = this.elementof(e)
        if (url == null) {
            url = e.getAttribute("data-fetch");
        }
        fetch(url + "?nocache=" + this.ltm).then((response)=>response.text()).then((html)=>{
            e.classList.add("fetched");
            e.innerHTML = html.trim();
            if (typeof chains !== "undefined") {
                window[chains](e, cvar);
            }
        }
        ).catch((error)=>{
            console.warn(error);
        }
        );
    }
    ;async load_json(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.warn(error);
            return null;
            // or throw the error
        }
    }
    ;
    json_submit(data, url='json.php') {
        //console.log(data);
        return (async()=>{
            const rawResponse = await fetch(url + '?' + ta.ltm, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const res = await rawResponse.json();
            //console.log( res);
            return res;
        }
        )();
    }

    contentedit_json(id, chain=false) {
        var sre = ta.elementof(id);
        let data = {}
        sre.querySelectorAll('[contenteditable]').forEach((s)=>{
            var el_name = s.getAttribute('name');
            if (!this.notempty(el_name)) {
                el_name = sre.id + "_" + s.tagName.toLowerCase() + "_" + this.rndnum();
                console.log('contentedit_json require name, so random: ' + el_name)
                s.setAttribute('name', el_name);
            }
            data[el_name] = s.innerHTML;
        }
        );

        this.json_submit(data, sre.dataset.post);

    }

    attr_array(e) {
        const aa = [...this.elementof(e).attributes];
        const attrs = aa.reduce((attrs,attribute)=>{
            attrs[attribute.name] = attribute.value;
            return attrs;
        }
        , {})
        return attrs;
    }
    ;/* localstorage */
    kukis = {
        set: (w,v)=> {
            if (this.kukis_store == null) {
                this.kukis_store = {};
            }            
            this.kukis_store[w] = JSON.stringify(v);
            localStorage.setItem('kukis', JSON.stringify(this.kukis_store));
        },
        remove: (w)=>{
            let data = this.kukis_store;
            delete data[w];
            localStorage.setItem('kukis', JSON.stringify(data));
        },
        get: (w)=>{
            let tres = ta.notempty(this.kukis_store[w]);
            return JSON.parse(tres);
        }
    }
    ls = { 
        save: (w,v)=>{
            if (this.lsd == null) {
                this.lsd = {};
            }
            this.lsd[w] = JSON.stringify(v);
            localStorage.setItem(this.host, JSON.stringify(this.lsd));
        },
        remove: (w)=>{
            data = this.lsd;
            delete data[w];
            localStorage.setItem(this.host, JSON.stringify(data));
        },
        get: (w)=>{
            let tres = ta.notempty(this.lsd[w]);
            return JSON.parse(tres);
        }
    };
    is_elementExists(obj) {
        return document.querySelector(obj) !== null;
    };
	sortElements(parentSelector, childSelector, sortBy, isAttribute) {
		// Get all the child elements within the parent
		const childElements = document.querySelectorAll(parentSelector + " " + childSelector);
		
		// Convert the NodeList to an array for sorting
		const childElementsArray = Array.from(childElements);
		
		// Sort the array based on the dataset or attribute values
		childElementsArray.sort((a, b) => {
			let aValue, bValue;
			if (isAttribute) {
				aValue = parseFloat(a.getAttribute(sortBy));
				bValue = parseFloat(b.getAttribute(sortBy));
			} else {
				aValue = parseFloat(a.dataset[sortBy]);
				bValue = parseFloat(b.dataset[sortBy]);
			}
			return aValue - bValue;
		});
    }
}
/* eof tajsfunc */
class TaUIFunc extends TaJSFunc {
    getQueryString(qs) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(qs) || null;
    }
    updateTitle(obj) {
        if (this.is_elementExists(obj)) {
            var title = document.querySelector(obj).innerText;
            document.title = title;
        }
    }
    class = {
        value: (e)=>{
            return this.elementof(e).classList.value;
        }
        ,
        add: (e,c)=>{
            this.elementof(e).classList.add(c);
        }
        ,
        remove: (e,c)=>{
            this.elementof(e).classList.remove(c);
        }
        ,
        has: (e,c)=>{
            return this.elementof(e).classList.contains(c) || false;
        }
        ,
        rewrite: (e,c)=>{
            this.elementof(e).className = c;
        }
        ,
        toggle: (e,c)=>{
            this.elementof(e).classList.toggle(c);
        }
        ,
        chained: (e,c,m='remove')=>{
            e.parentNode.querySelectorAll(e.tagName).forEach((el)=>{
                if (m == 'remove') {
                    this.class.remove(el, c);
                } else {
                    this.class.add(el, c);
                }
            }
            );
        }
    };
    
    theme_switch(usecookies=false) {
        
		var h = document.getElementsByTagName('html')[0];
		
        if (usecookies === true) {
            
			var t = ta.notempty( ta.kukis.get('theme') )
            h.setAttribute('theme', t)
            
		} else {
            
			var t = h.getAttribute('theme') || false

            if (t == 'dark') {
                h.setAttribute('theme', 'light')
    			ta.kukis.remove('theme')
                //this.class.remove(obj,'dark')
            } else {
                h.setAttribute('theme', 'dark')
    			ta.kukis.set('theme','dark')
            }
            
		}
		
    }
    ;htmlpart(w) {
        return document.querySelector('#htmlpart [index="' + w + '"').innerHTML || "<!-- hp: " + w + "-->";
    }
    mediaWidth() {
        const body = document.querySelector('body');
        const mediaWidth = window.innerWidth;
        if (mediaWidth < 600) {
            body.classList.add('small-screen');
        } else if (mediaWidth >= 600 && mediaWidth < 1200) {
            body.classList.add('medium-screen');
        } else {
            body.classList.add('large-screen');
        }
    }

    generateTOC(from='.tocindex', ele='#toc .toc', query='h2,h3') {
        const maine = document.querySelector(from);
        const headings = maine.querySelectorAll(query);
        const tocContainer = document.querySelector(ele);
        const tocList = document.createElement('ul');
        headings.forEach((heading)=>{
            // console.log(heading);
            // Check if the heading is not under an element with the '.no-toc' class
            if (!heading.closest('.no-toc')) {
                const tocItem = document.createElement('li');
                tocItem.classList.add('toc_' + heading.tagName.toLowerCase());
                const tocLink = document.createElement('a');
                const headingId = this.generateHeadingId(heading);
                tocLink.href = "#"+ headingId.replace(/\W/g, '');
                tocLink.textContent = heading.textContent;
                tocItem.appendChild(tocLink);
                tocList.appendChild(tocItem);
            }
        }
        );
        tocContainer.appendChild(tocList);
        ena.scrollfix();
    }
    generateHeadingId(heading) {
        var nid = heading.id
        if ((nid === null) || (nid == "")) {
            var nid = `heading-${Array.from(heading.parentElement.children).indexOf(heading) + 1}`;
           console.log(nid);
			heading.id = nid.replace(/\W/g, '');
        }
        return nid;
    }
}
;
let ta = new TaUIFunc();

class taLoad extends TaUIFunc {

	tabmenu() {

		document.querySelectorAll('.tab-menu .tab').forEach ( 
			(tab) => {
			tab.addEventListener('click',(e) => {
				var target = tab.dataset.tab;
				var te = document.querySelector('#'+target);
				document.querySelectorAll('.tab-menu .tab').forEach( (d) => {
					ta.class.remove(d,'active');
				});				
				document.querySelectorAll('.tab-content div.tab').forEach( (d) => {
					ta.class.remove(d,'show');
				});				
				//console.log(te);
				ta.class.add(te,'show');
				ta.class.add(tab,'active');
			})

			}
		);

	
	};
	
    modal() {
        document.querySelectorAll('[data-modal]').forEach((el)=>{
            el.addEventListener('click', async(e)=>{
                var part = el.dataset.modal;
                var overlay = document.getElementById('overlay');
                ta.class.toggle(overlay, 'active');
				console.log(part);
                var htmlpart = document.querySelector('#htmlpart [modal="' + part + '"').cloneNode(true);
                var closebtn = htmlpart.querySelector('button.closer');
				htmlpart.removeAttribute('modal');
                closebtn.addEventListener('click', ()=>{
                    htmlpart.remove();
                    ta.class.toggle(overlay, 'active');
                }
                );
                ta.class.toggle(htmlpart, 'show');
                overlay.appendChild(htmlpart);
            }
            );
        }
        );
    };
    toggle() {
        document.querySelectorAll('[data-toggle]').forEach((el)=>{
            el.addEventListener('click', async(e)=>{
                var obj = el.dataset.toggle;
                ta.class.toggle(obj, 'hide');
                ta.class.toggle(el, 'active');
            }
            );
        }
        );
        document.querySelectorAll('.msg').forEach(msg=>{
            msg.addEventListener('click', (e)=>{
                msg.remove()
            }
            );
        }
        );
    };
    scrollfix() {
        if (ta.is_elementExists('nav[topnav]')) {
            document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
                anchor.addEventListener('click', event=>{
                    event.preventDefault();
                    const targetElement = document.querySelector(event.target.getAttribute('href'));
                    if (targetElement) {
                        const navHeight = document.querySelector('nav[topnav]').offsetHeight + 1;
                        const scrollPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                        window.scrollTo({
                            top: scrollPosition,
                            behavior: 'smooth'
                        });
                    }
                }
                );
            }
            );
        }
    };
    accordion2() {
        document.querySelectorAll('dl.accordion > dt').forEach((el)=>{
            el.addEventListener('click', async(e)=>{
                ta.class.toggle(el, 'open')
            }
            )
        }
        )
    };
    accordion(et=false) {
		if (et) {
			var tq = 'dl.accordion > dt '+et;
		} else {
			var tq = 'dl.accordion > dt';
		}
		// console.log(tq);
        document.querySelectorAll(tq).forEach((el)=>{
            el.addEventListener('click', async(e)=>{
				const dt = el.closest('dt');
                ta.class.toggle(dt, 'open')
            }
            )
        }
        )
    };
    markdown() {
        // ../js/marked.min.js
        document.querySelectorAll('[markdown]').forEach((el)=>{
            var mdtext = el.innerHTML;
            el.innerHTML = marked.parse(mdtext)
        }
        );
    };
    drawer() {

        document.querySelectorAll('html .drawer').forEach((bel)=>{

            bel.addEventListener('dblclick', function(e) {
                ta.class.toggle(bel, 'active');

            })
        }
        );
    };

}
;let ena = new taLoad();

document.addEventListener("DOMContentLoaded", function() {

    ena.modal();
    ena.toggle();
    ena.scrollfix();

    ena.drawer();
	ena.accordion('b')
	ena.tabmenu();

	ta.mediaWidth();
	
});
