class ge_ScreenInfo {

    constructor() {
        this.screenWidth = window.screen.width;
        this.screenHeight = window.screen.height;
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.pageHeight = document.body.scrollHeight;
        this.pageWidth = document.body.scrollWidth;
        this.pixelRatio = window.devicePixelRatio;
        this.colorDepth = window.screen.colorDepth;
        this.orientation = window.screen.orientation.type;
        this.scrollbarWidth = this.getScrollbarWidth();
    }

    getScrollbarWidth() {
        // Create a temporary element to measure the scrollbar width
        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        outer.style.msOverflowStyle = 'scrollbar';
        document.body.appendChild(outer);
        const inner = document.createElement('div');
        outer.appendChild(inner);
        const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
        document.body.removeChild(outer);
        return scrollbarWidth;
    }

    table() {
        const properties = Object.getOwnPropertyNames(this);
        const data = properties.map(property=>({
            Property: property,
            Value: this[property]
        }));

        console.table(data);
    }

    getElementInfo(query) {
        const element = document.querySelector(query);
        if (element) {
            const elementWidth = element.offsetWidth;
            const elementHeight = element.offsetHeight;
            this[`${query.replace(/[^a-zA-Z0-9]/g, '')}Width`] = elementWidth;
            this[`${query.replace(/[^a-zA-Z0-9]/g, '')}Height`] = elementHeight;
            return {
                width: elementWidth,
                height: elementHeight
            };
        } else {
            this[`${query.replace(/[^a-zA-Z0-9]/g, '')}Width`] = null;
            this[`${query.replace(/[^a-zA-Z0-9]/g, '')}Height`] = null;
            return {
                width: null,
                height: null
            };
        }
    }
}


document.addEventListener("DOMContentLoaded", (e)=>{

    var info = new ge_ScreenInfo();
    
    info.table();

}
);
