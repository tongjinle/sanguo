var  _ = require("underscore");
var utils = require("../util/utils");
var define = require("../util/define");
var poolUtil = require("../util/poolUtil");
var Proxy = require('EventProxy');

var Bag = function(){
	poolUtil.add(this);
	this.insType  = "bag";

	this.casterId = null;
	this.targetId = null;
	this.fireEvent = null;
	this.effect = null;

};

Bag.loadInfo = function(rawBag){
	var obj = new Bag();

	this.casterId = rawBag.casterId;
	this.targetId = rawBag.targetId;
	this.fireEvent = rawBag.fireEvent;
	this.effect = rawBag.effect;

	return obj;
};

// 触发一个Bag
Bag.fire = function(bag){
	Bag.proxy = Bag.proxy || new EventProxy();
	Bag.proxy.fire(bag.fireEvent,bag);
};

define(Bag);

var handler = Bag.prototype;

// fire
handler.fire = function(){
	Bag.fire(this);
};

// run
handler.run = function(){
	var caster = poolUtil.find(this.casterId);
	var target = poolUtil.find(this.targetId);
	var effect = this.effect;
	_.each(effect,function(v,k){
		if(['hp'].indexOf(k)>=0){
			target.set(targe.get(k)+v);
		}
	})
};



module.exports = Bag;