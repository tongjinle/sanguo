var _ = require("underscore");
var Area = require("../model/area");
var Map = require("../model/map");
var boxType = require("../enum/boxType");
var areaElementType = require("../enum/areaElementType");

describe("=== TEST MAP ===".blue,function(){
	var map;
	beforeEach(function(){
		map = createMap();
	});


	it("init Map",function(){
		expect(map.get("type")).toBe(areaElementType.map);
		expect(map.get("width")).toBe(12);
		expect(map.get("height")).toBe(8);

	});

	it("getAstarPath",function(){
		var path;
		path = map.getAstarPath({x:2,y:5},{x:3,y:4},6);

		// 定义一个函数用来方便判断路径
		var pathToString = function(path){
			if(!path) return null;
			return _.map(path,function(posi){return 10000*posi.x + posi.y;}).join(" ");
		};

		expect(pathToString(path,100)).toBe("20005 10005 10004 10003 20003 30003 30004");
		path = map.getAstarPath({x:2,y:5},{x:3,y:4},5);
		expect(path).toBeNull();
	});

	it("getRange",function(){
		var range = map.getRange({x:2,y:5},2);
		var rangeToString = function(range){
			if(!range) return null;
			return _.map(range,function(posi){return 10000*posi.x + posi.y;}).join(" ");
		};
		expect(rangeToString(range).split(" ").sort().join(" ")).toBe("20006 10006 10005 5 10004".split(" ").sort().join(" "));
	});


	it("loadMapByName",function(){
		var map = Map.loadInfo("mapTest");
		expect(map).not.toBeNull();
	});

	it("getRange2",function(){
		var map = Map.loadInfo("mapTest");
		var range = map.getRange({x:5,y:6},7);
		var rangeToString = function(range){
			if(!range) return null;
			return _.map(range,function(posi){return 10000*posi.x + posi.y;}).join(" ");
		};
		expect(rangeToString(range).split(" ").sort().join(" ")).toBe("40007 50007");
	});

	function createMap(){
		map = new Map();
		map.set("size",{width:12,height:8});
		map.addDefaultBox(boxType.grass);
		map.addBox(boxType.stone,{x:2,y:4});
		map.addBox(boxType.stone,{x:2,y:7});
		//
		map.addBox(boxType.stone,{x:3,y:0});
		map.addBox(boxType.stone,{x:3,y:1});
		map.addBox(boxType.water,{x:3,y:5});
		map.addBox(boxType.water,{x:3,y:6});
		map.addBox(boxType.water,{x:3,y:7});
		//
		map.addBox(boxType.stone,{x:4,y:5});
		map.addBox(boxType.stone,{x:4,y:6});
		//
		map.addBox(boxType.stone,{x:5,y:3});
		map.addBox(boxType.stone,{x:5,y:5});
		// 
		map.addBox(boxType.water,{x:6,y:0});
		map.addBox(boxType.water,{x:6,y:1});
		map.addBox(boxType.stone,{x:6,y:3});
		map.addBox(boxType.water,{x:6,y:6});
		map.addBox(boxType.water,{x:6,y:7});
		//
		map.addBox(boxType.water,{x:7,y:1});
		map.addBox(boxType.water,{x:7,y:6});
		map.addBox(boxType.water,{x:7,y:7});
		// 
		map.addBox(boxType.water,{x:8,y:1});
		map.addBox(boxType.stone,{x:8,y:6});
		// 
		map.addBox(boxType.stone,{x:9,y:4});
		//
		map.addBox(boxType.water,{x:10,y:1});
		map.addBox(boxType.stone,{x:10,y:2});
		//
		map.addBox(boxType.water,{x:11,y:1});
		map.addBox(boxType.water,{x:11,y:2});

		return map;
	};
});