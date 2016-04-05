var EventProxy = require('EventProxy');
var Buff = require("../model/buff");
var messageType = require("../enum/messageType");
var buffRelationType = require("../enum/buffRelationType");
var Chess = require("../model/chess");

describe("== == TEST BUFF == ==",function(){
	it("findBuffByName",function(){
		var bu = Buff.loadInfo("dianran");
		expect(bu).not.toBeUndefined();
		expect(bu.effect).not.toBeUndefined();
	});

	it("cooldown",function(){
		var bu = new Buff();
		bu.set('cd',2);
		bu.cooldown();
		expect(bu.get('cd')).toBe(1);

		var bu2 = new Buff();
		bu2.set('cd',0);
		bu2.cooldown();
		expect(bu2.get('cd')).toBe(0);
	});
	return;


	it("cast-wuxiansiweiguanghuan",function(){
		// condition:{caster:buffRelationType.owner},
		// condition:{target:buffRelationType.owner},
		// condition:{target:buffRelationType.enemy}
		// condition:"##xiezhu.xiangling"
		var c = [];
		for (var i = 0; i < 10; i++) {
			c[i] = new Chess();
			c[i].set('id',(i+1)*100);
			c[i].set('mp',100);
			c[i].set('maxMp',1000);
		};
		c[0].set('position',{x:1,y:1});
		c[0].set('color','red');

		c[1].set('position',{x:1,y:2});
		c[1].set('color','red');
		
		c[2].set('position',{x:100,y:200});
		c[2].set('color','red');
		
		c[3].set('position',{x:2,y:1});
		c[3].set('color','blue');

		var ep = new EventProxy();
		var buff;
		buff = Buff.loadInfo("wuxiansiweiguanghuan");
		expect(buff).not.toBeUndefined();
		buff.set('owner',c[0]);
		buff.set('proxy',ep);
		ep.fire(buff.onEvent,{});

		expect(c[0].get('mp')).toBe(200);
		expect(c[1].get('mp')).toBe(200);
		expect(c[2].get('mp')).toBe(100);
		expect(c[3].get('mp')).toBe(100);
	});

	it("cast-wuxiansiweiguanghuan",function(){

	});


});