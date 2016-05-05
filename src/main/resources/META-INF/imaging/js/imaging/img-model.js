/**********************************************************
 ****************** MODEL **********************************
 **********************************************************/
Imaging.model = {
	Inbox : function (name) {
	  this.name = name;
	}
};

Imaging.model.Inbox.prototype.click = function() {
	console.log("Hello, I'm " + this.name);
};