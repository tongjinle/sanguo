var  _ = require("underscore");
var areaElementType = require("../enum/areaElementType");
var boxType = require("../enum/boxType");
var dictUtil = require("../dict/dictUtil");
var utils = require("../util/utils");
var define = require("../util/define");
var poolUtil = require("../util/poolUtil");

var Map = function(){
	poolUtil.add(this);

	this.setDefaultCode();
	this.chessDict = {};

	this.type = areaElementType.map;
	this.width = null;
	this.height = null;
	this.boxes = null;

};

define(Map);

Map.loadInfo = function(mapName){
	var obj = new Map();
	var mapInfo = dictUtil.findMapByName(mapName);
	
	obj.set("size",{width:mapInfo.width,height:mapInfo.height});
	obj.addDefaultBox(mapInfo.defaultBoxType);

	_.each(mapInfo.specBoxes,function(v,k){
		var arr = k.split("-");
		var posi = {x:arr[0],y:arr[1]};
		obj.addBox(v,posi);
	});

	return obj;
};


var handler = Map.prototype;

// 设定默认boxType
handler.addDefaultBox = function(type){
	for (var i = 0; i < this.get("width"); i++) {
		for (var j = 0; j < this.get("height"); j++) {
			this.boxes[i][j] = type;
		};
	};
};

handler.addBox = function(type,position){
	this.boxes[position.x][position.y] = type;
};

handler.addChess = function(chessId, posi) {
	this.chessDict[hashPosi(posi)] = chessId;
	return this;
};


handler.updateChess = function(chessId, posi) {
	this.removeChess(chessId);
	this.addChess(chessId, posi);
	return this;
};

handler.removeChess = function(chessId) {
	var chessDict = this.chessDict;
	var key = null;
	for (var k in chessDict) {
		if (chessDict[k] == chessId) {
			key = k;
			break;
		}
	}
	if (key && key !== 0) {
		delete chessDict[key];
	}
	return this;
};

/*计算可以行走的范围*/
handler.getRange = function(posi, power) {
	var self = this;
	if (!this.boxes)
		throw "boxes not init";

	var close = [],
		/*用以快速判断position是否已经被访问的辅助字典*/
		closeDict = {};

	visit([posi], power);

	// 去除本身的位置
	close = close.filter(function(n, i) {
		return n.x != posi.x || n.y != posi.y;
	});
	return close;

	function visit(posiAry, power) {
		if (power == 0)
			return;
		posiAry.forEach(function(posi, i) {
			/*获取可以行走的接壤的格子*/
			var nearbyPoints = self.getNearbyPoints(posi);
			/*添加到关闭列表,表示已经访问过*/
			nearbyPoints = addToClose(nearbyPoints, power - 1);

			visit(nearbyPoints, power - 1);
		});

		function addToClose(ary, power) {
			ary = ary.filter(function(n, i) {
				return closeDict[hashPosi(n)] === undefined || closeDict[hashPosi(n)] < power;
			});
			ary.forEach(function(n, i) {
				closeDict[hashPosi(n)] = power;
			});
			close = close.concat(ary);
			return ary;
		}
	}

};

/*Astar寻路算法*/
handler.getAstarPath = function(start, dest, power) {
	var open = [],
		/*用以快速判断position是否已经被访问的辅助字典*/
		closeDict = {};

	/*路径*/
	var path = null;

	start.father = null;
	start.power /*消耗的power*/ = 0;
	start.h /*估价*/ = h(start);

	open.push(start);
	while (open.length) {
		var point = open.shift();

		/*检测是不是到达目标点*/
		if (point.x == dest.x && point.y == dest.y) {
			path = [];
			while (point) {
				path.push(point);
				point = point.father;
			}
			path = path.map(function(n, i) {
				return {
					x: n.x,
					y: n.y
				};
			}).reverse();
			break;
		}

		/*标记已经访问*/
		closeDict[hashPosi(point)] = true;

		/*临近合法的格子*/
		var nearbyPoints = this.getNearbyPoints(point);

		/*过滤掉各种已经被访问的格子*/
		nearbyPoints = filterByClose(nearbyPoints);

		/*设置属性*/
		nearbyPoints.forEach(function(n, i) {
			n.father = point;
			n.power = point.power + 1;
			n.h = h(n);
		});

		/*加入到open中,并且优化替代*/
		nearbyPoints.forEach(function(n, i) {
			var samePoint = _.find(open, function(openPoint) {
				return openPoint.x == n.x && openPoint.y == n.y;
			});
			/*找到相同位置的格子,且新格子的消耗比前格子消耗低,则替代*/
			if (samePoint && samePoint.power + samePoint.h > n.power + n.h) {
				samePoint.power = n.power;
				samePoint.h = n.h;
			} else {
				open.push(n);
			}

		});

		open.sort(function(a, b) {
			return (a.power + a.h) - (b.power + b.h);
		});

	}

	return (path.length !=0 && path.length-1 <= power) ? path :null;

	/*估价函数*/
	function h(point) {
		/*1.2这个系数,让寻路优先沿着x轴的方向*/
		return Math.abs(dest.x - point.x) * 1.2 + Math.abs(dest.y - point.y);
	};

	/*过滤掉各种已经被访问的格子*/
	function filterByClose(ary) {
		ary = ary.filter(function(n, i) {
			return !closeDict[hashPosi(n)];
		});
		return ary;
	};
};



/* 获取上右下左4个临近的格子中合法可以行走的格子 */
handler.getNearbyPoints = function(point) {
	var self = this;
	// 上右下左4个临近的格子
	var arr = [{
		x: point.x - 1,
		y: point.y
	}, {
		x: point.x,
		y: point.y + 1
	}, {
		x: point.x + 1,
		y: point.y
	}, {
		x: point.x,
		y: point.y - 1
	}];

	// 边界检测
	var arr = arr.filter(function(n, i) {
		return n.x >= 0 && n.x < self.width && n.y >= 0 && n.y < self.height;
	});
	// 可行走检测
	var boxes = self.boxes;
	var chessDict = self.chessDict;

	var arr = arr.filter(function(n, i) {
		return self.codeDict[boxes[n.x][n.y]].walkable;
	});
	// 棋子检测
	var arr = arr.filter(function(n, i) {
		return !chessDict[hashPosi(n)];
	});
	return arr;
};

/*设置默认信息*/
/*
		1 	->	草地
		2		->	平地
		3		->	石墙
		4		->	水域
	*/
handler.setDefaultCode = function() {
	this.setCode(boxType.grass, true, false, true)
		.setCode(boxType.flat, true, false, true)
		.setCode(boxType.stone, false, true, false)
		.setCode(boxType.water, true, false, false);
	return this;
};

/*设置编号信息*/
handler.setCode = function(code, visual, highland, walkable) {
	this.codeDict = this.codeDict || {};
	this.codeDict[code] = {
		code: code,
		visual: visual,
		highland: highland,
		walkable: walkable
	};
	return this;
};


// define
define(Map, "size", {
	get: function() {
		return this.boxes === null ? 
		null : 
		{width:this.get("width"),height:this.get("height")};
	},
	set: function(size) {
			if(this.boxex){
				throw "dont set mapsize twice!!";
			}
			this.boxes = [];
			for (var i = 0; i < size.width; i++) {
				this.boxes.push(new Array(size.height));
			};
			this.width = size.width;
			this.height = size.height;
	}
});

define(Map,"width",{
	get:function(){return this.width;},
	set:null
});

define(Map,"height",{
	get:function(){return this.height;},
	set:null
});



/// HELP
// position进行哈希
function hashPosi(posi) {
	return posi.x * 10000 + posi.y;
};

module.exports = Map;