var  _ = require("underscore");
var dictUtil = require("../dict/dictUtil");
var utils = require("../util/utils");
var define = require("../util/define");
var poolUtil = require("../util/poolUtil");
var rangeUtil = require('../util/rangeUtil');
var Tuple = require("../util/tuple");

var Skill = function(){
	poolUtil.add(this);
	this.insType = "skill";
	
	this.name = null;
	this.cd = null;
	this.maxCd = null;
	this.mp = null;
	this.targetType = null;
	this.range = null;
	// 效果raw tuple
	this.effect = null;
	// 拥有者
	this.owner = null;
};

define(Skill);


// 静态方法
Skill.loadInfo = function(skillName){
	var orgSkill = dictUtil.findSkillByName(skillName);

	var obj = new Skill();

	obj.name = orgSkill.name;
	obj.cd = 0;
	obj.maxCd = orgSkill.cd;
	obj.mp = orgSkill.mp;
	obj.targetType = orgSkill.targetType;
	obj.range = orgSkill.range;
	obj.isPassive = orgSkill.isPassive;
	obj.effect = dictUtil.findSkillEffectByName(skillName);


	return obj;
};


var handler = Skill.prototype;

// 冷却
handler.cooldown = function(){
	this.set("cd",Math.max(this.get("cd")-1,0));
};

// 获取skill的可能的预选目标
// 以(0,0)为基准cast原点
// 返回position数组
// 备注:targetType的过滤需要交给更高级的过滤器来处理(比如map实例)
handler.getCastablePosiList = function(){
	var range = this.get('range');
	return rangeUtil.parse(this.range);
};

// 施放技能
// 返回一个tuple实例(未经explain)
handler.cast = function(target){
	this.set('cd',this.maxCd);
	// todo
	return this.effect 
		? 
		Tuple
		.read(this.effect)
		.explain({"target":target,"caster":this.owner})
		:
		null
		;
};







module.exports = Skill;