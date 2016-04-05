var  _ = require("underscore");
var dictUtil = require("../dict/dictUtil");
var utils = require("../util/utils");
var define = require("../util/define");
var poolUtil = require("../util/poolUtil");
var Tuple = require('../util/tuple');

var Buff = function(){
	poolUtil.add(this);
	this.insType = "buff";
	
	this.name = null;
	this.maxCd = null;
	this.effect = null;
	this.sender = null;
	this.owner = null;

	// 事件代理器
	this.proxy = null;
};

define(Buff);

Buff.loadInfo = function(buffName){
	var orgBuff = dictUtil.findBuffByName(buffName);
	var orgBuffEffect = dictUtil.findBuffEffectByName(buffName);

	var obj = new Buff();

	obj.name = orgBuff.name;
	obj.cd = obj.maxCd = orgBuff.maxCd;
	obj.effect = orgBuffEffect;

	return obj;

};

var handler = Buff.prototype;

// buff冷却
handler.cooldown = function(){
	this.set('cd',Math.max(0,this.get('cd')-1));
};

// 作用
handler.cast = function(){
	// return Tuple.read(this.effect).explain({caster:this.owner,target:})
};


module.exports = Buff;