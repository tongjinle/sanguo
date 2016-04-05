// combat 
var _ = require("underscore");
var Area = require("../model/area");
var Map = require("../model/map");
var Player = require("../model/player");
var Chess = require("../model/chess");
var boxType = require("../enum/boxType");
var areaElementType = require("../enum/areaElementType");


describe("== == COMBAT == ==",function(){
	return;
	it("combat one",function(){
		var area = new Area();
		area.loadMapByName("mapTest");
		// var map = Map.loadInfo("mapTest");



		// var p1 = area.loadPlayerByName("p1");
		// var p2 = area.loadPlayerByName("p2");

		var p1,p2;
		p1 = new Player();
		p2 = new Player();
		p1.set("name","p1");
		p2.set("name","p2");
		area.addPlayer(p1,"red");
		area.addPlayer(p2,"blue");

		expect(area.get("playerList").length).toBe(2);

		// 曹操	hp:2500	mp:800	power:4	speed:20 damage:175
		// 张飞	hp:4000	mp:320	power:3	speed:15 damage:250
		var caocao = Chess.loadInfo("caocao");
		caocao.set("position",{x:0,y:3});
		var zhangfei = Chess.loadInfo("zhangfei");
		zhangfei.set("position",{x:11,y:4});
		p1.addChess(caocao);
		p2.addChess(zhangfei);

		expect(caocao.get("hp")).toBe(2500);
		expect(zhangfei.get("damage")).toBe(250);
		expect(p1.get("chessList").length).toBe(1);
		expect(p2.get("chessList").length).toBe(1);

		// 显式的开始游戏,启动area
		area.start();


		// 检测speed
		var queue = area.get("currRecord").get("speedQueue");
		expect(queue[0]).toBe(caocao.id);
		expect(queue[1]).toBe(zhangfei.id);


		var caocaoId = caocao.get("id"),
			zhangfeiId = zhangfei.get("id");

		// 1 曹操移动到8,5
		area.chessMove(caocaoId,{x:8,y:5});
		area.chessEndRound(caocaoId);
		return;
		expect(caocao.get("position")).toEqual({x:8,y:5});

		// 2 张飞移动到2,2
		area.chessMove(zhangfeiId,{x:2,y:2});
		area.chessEndRound(zhangfeiId);

		// 3 曹操移动到4,5
		area.chessMove(caocaoId,{x:4,y:5});
		area.chessEndRound(caocaoId);

		// 4 张飞移动到3,4,施放战争践踏,曹操被击晕
		area.chessMove(zhangfeiId,{x:3,y:4});
		area.chessCast(zhangfeiId,{skillName:"zhanzhengjianta",targetPosition:{x:2,y:2}});
		expect(zhangfei.get("mp")).toBe(240);
		expect(zhangfei.get("skillList").get("zhanzhengjianta").get("cd")).toBe(4);
		expect(caocao.get("stun")).toBe(2);

		// 5 (本回合曹操无法移动)

		// 6 张飞移动到4,4,施放终极火炮,目标曹操,对其造成750点伤害,并击晕2个回合
		area.chessMove(zhangfeiId,{x:4,y:4});
		area.chessCast(zhangfeiId,{skillName:"zhongjihuopao",targetPosition:{x:4,y:5}});
		expect(caocao.get("hp")).toBe(1750);
		expect(zhangfei.get("mp")).toBe(40);
		expect(zhangfei.get("skillList").get("zhanzhengjianta").get("cd")).toBe(3);
		expect(zhangfei.get("skillList").get("zhongjihuopao").get("cd")).toBe(6);
		expect(caocao.get("stun")).toBe(2);

	});
});