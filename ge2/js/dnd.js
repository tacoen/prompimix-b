TaUIFunc.prototype.dnd = function() {
	
	console.log('ta.dnd() init');
	
	this.allowDrop = function(ev) {
		ev.preventDefault();
	}
	this.drag = function(ev,someOtherFunction,someParam) {
		if (!ta.notempty(ev.target.id)) {
			ev.target.id = ev.target.tagName + "_" + ev.target.innerText.substring(0, 3) + "_" + ta.rndnum();
		}
		ev.dataTransfer.setData("text", ev.target.id);
		if (typeof someOtherFunction === 'function') {
		      someOtherFunction(ev,someParam);
	    }
		return this;
	}
	this.drop = function(ev, w = 'move' ,someOtherFunction,someParam) {
		var dt = ev.dataTransfer;
		dt.dropEffect = w;
		ev.preventDefault();
		//var obj = document.getElementById(ev.dataTransfer.getData("text"))
		// console.log(ev.dataTransfer.dropEffect);
		if (w == 'copy') {
			var obj = document.getElementById(ev.dataTransfer.getData("text")).cloneNode(true);
		} else {
			var obj = document.getElementById(ev.dataTransfer.getData("text"))
		}
		if (ev.target.classList.contains('dropable')) {
			ev.target.append(obj);
		} else {
			var dropable = ev.target.closest('.dropable');
			var nexto = ev.target.closest(obj.tagName);
			dropable.insertBefore(obj, nexto)
		}
		
		if (typeof someOtherFunction === 'function') {

		      someOtherFunction(ev,someParam);
	    }
		return this;
	}
}	
