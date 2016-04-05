var _ = require('underscore');
var Chess = require("../model/chess");
var Skill = require("../model/skill");
var dictUtil = require('../dict/dictUtil');
var messageType = require('../enum/messageType');

describe("skill test",function(){
	it("findSkillByName",function(){
		var sk = Skill.loadInfo("wuxiansiweiguanghuan");
		expect(sk).not.toBeUndefined();
		expect(sk.isPassive).toBe(true);
	});


	it("get/set ownerId",function(){
		var sk = Skill.loadInfo("lengqiang");
		sk.set("ownerId",100);
		expect(sk.get("ownerId")).toBe(100);
	});

	it('getCastablePosiList',function(){
		var sk = new Skill();
		sk.set('range',2);
		var range2 = [
			{x:-2,y:0},
			{x:-1,y:0},
			{x:2,y:0},
			{x:1,y:0},
			{x:0,y:1},
			{x:0,y:2},
			{x:0,y:-1},
			{x:0,y:-2}
		];
		expect(map(range2)).toBe(map(sk.getCastablePosiList()));

		function map(posiList){
			return _.map(posiList,function(po){
				return po.x*10000+po.y;
			}).sort().join("*");
		};
	});


	it('cooldown',function(){
		var sk = new Skill();
		sk.set('cd',1);
		sk.set('maxCd',4);
		expect(sk.get('cd')).toBe(1);
		expect(sk.get('maxCd')).toBe(4);

		// 施放技能
		sk.cooldown();
		expect(sk.get('cd')).toBe(0);
		sk.cooldown();
		expect(sk.get('cd')).toBe(0);
		sk.cast();
		expect(sk.get('cd')).toBe(sk.get('maxCd'));
	});

	/*
	{
		casterId:caster.id,
		targetId:target.id,
		fireEvent:messageType.attack,
		effect:{
			hp:-1.5*caster.get("damage"),
			stun:1
		}
	}
	*/
	it('cast-active-lengqiang',function(){
		// lengqiang
		var caster = new Chess();
		caster.set('id',200);
		caster.set('damage',1000);
		var target = new Chess();
		target.set('id',100);

		var sk = Skill.loadInfo('lengqiang');
		sk.set('owner',caster);
		
		var rst = sk.cast(target).run();
		var exp = {
			casterId:200,
			targetId:100,
			effect:{
				hp:-1500,
				stun:1
			}
		};
		expect(rst.casterId).toBe(exp.casterId);
		expect(rst.targetId).toBe(exp.targetId);
		expect(rst.effect).toEqual(exp.effect);
	});

	/*
	{
		fireEvent:messageType.addBuff,
		casterId:caster.id,
		targetId:caster.id,
		effect:{
			buff:{$add:skillName}
		}
	};
	*/
	it('cast-passive-wuxiansiweiguanghuan',function(){
		var ch = new Chess();
		ch.id = 1000;
		var skillName = 'wuxiansiweiguanghuan'
		var skill = Skill.loadInfo(skillName);
		skill.set('owner',ch);
		var rst = skill.cast().run();
		var exp = {
			fireEvent:messageType.addBuff,
			casterId:1000,
			targetId:1000,
			effect:{
				buff:{$add:skillName}
			}
		};
		expect(rst).toEqual(exp);
	});
});