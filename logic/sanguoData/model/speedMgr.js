/////////////////////////////////////////////////////////////////////////////////////////
//															SpeedMgr																						
/////////////////////////////////////////////////////////////////////////////////////////

/*棋子行动顺序控制器*/
var _ = require("underscore");
var Random = require("../util/random");
var SpeedItem = require("./SpeedItem");

// the len of queue to cal
var QUEUELEN = 10;
// the random seed of speedMgr
var SEED = 100;

var SpeedMgr = function(opts) {
	this.seed = SEED;
	this._rnd = new Random(this.seed);
	this.init(opts);
};

SpeedMgr.loadInfo = function(SpeedMgrInfo) {
	var obj = new SpeedMgr(SpeedMgrInfo);
	return obj;
};


var handler = SpeedMgr.prototype;

handler.init = function(opts) {
	opts = opts || {};
	this._round = opts.round || 0;
	this.items = opts.items || [];
	this.queue = [];
	this._len = opts.queueLen || QUEUELEN;

	this._sort();
	return this;
};



// add item
handler.addItem = function(item,speed) {
	if(arguments.length == 2){
		item = new SpeedItem(item,speed);
	};
	this.items.push(item);
	item.isMoved = false;
	item.tabs = this._getTabsStep(item) + this._round;
	item.rndRst = ~~ (this._rnd.get() * 100);
	this._sort();
	return this;
};

// remove item by itemId, 
handler.removeItem = function(itemId) {
	var items = this.items;
	for (var i = 0; i < items.length; i++) {
		if (items[i].itemId == itemId) {
			items.splice(i, 1);
			this._sort();
			break;
		}
	};
	return this;
};

handler.updateItem = function(itemId, opts) {
	var items = this.items;
	for (var i = 0; i < items.length; i++) {
		if (items[i].itemId == itemId) {
			for (var key in opts) {
				items[i][key] && (items[i][key] = opts[key]);
				if (key == "speed") {
					items[i].tabs = this._getTabsStep(items[i]) + this._round;
				}
			}
			this._sort();
			break;
		}
	};
	return this;
};

// mock next round
handler.run = function(times) {
	var firstItem = this.items[0];
	this._round = firstItem.tabs;
	firstItem.tabs += this._getTabsStep(firstItem);
	firstItem.isMoved = true;
	// refresh prop isMoved
	this._refresh();
	this._sort();

	return firstItem;
};

/*preview*/
handler.preview = function() {
	var count = this._len;
	var copy_items = this.items.slice(0);
	var copy_round = this._round;
	this.queue.length = 0;
	while (count) {
		this.queue.push(this.run());
		count--;
	}
	this.items = copy_items;
	this._round = copy_round;
	return this.queue;
};



handler._refresh = function() {
	var count = 0;
	for (var i = 0; i < this.items.length; i++) {
		this.items[i].isMoved && (count++);
	};
	if (count == this.items.length) {
		this.items.forEach(function(n, i) {
			n.isMoved = false;
		});
	}
};

// sort the seq of items
handler._sort = function() {
	this.items.sort(function(a, b) {
		var arr = [];
		arr.push(a.tabs - b.tabs);
		arr.push((!b.isMoved && a.isMoved) ? 1 : 0);
		arr.push(b.speed - a.speed);
		arr.push(b.rndRst - a.rndRst);
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == 0) {
				continue;
			} else {
				return arr[i];
			}
		};
	});
};

// speed to tabs step
// 保留2位小数
handler._getTabsStep = function(speedItem) {
	return parseInt(10 / speedItem.speed * 100) / 100;
}
module.exports = SpeedMgr;