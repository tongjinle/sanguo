function Item(itemId, speed) {
	this.itemId = itemId;
	this.speed = speed;
	this.tabs = 0;
	this.isMoved = false;
	/*
		rnd result
		use for _sorting when chesses have same speed value
		*/
	this.rndRst = null;
};


module.exports = Item;