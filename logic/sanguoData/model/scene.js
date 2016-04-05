var _ = require('underscore');

var Scene = function(){
	this.actorDict = {};
};

var handler = Scene.prototype;

// 进入场景
/*
	场景中只有两种角色
	caster -> 主动方
	target -> 被动方
*/
handler.enter = function(actor,role){
	this.actorDict[role] = actor;
};

// 获取actor,通过role
handler.getActorByRole = function(role){
	return this.actorDict[role] || null;
};

// 离开场景
handler.leave = function(actor){
	_.find(this.actorDict,function(ac,ro){
		if(ac === actor){
			delete this.actorDict[role];
			return true;
		}
	}.bind(this));
};

// 离开场景(根据角色判断)
handler.leaveByRole = function(role){
	delete this.actorDict[role];
};

// 全部离场
handler.leaveAll = function(){
	_.each(this.actorDict,function(ac,ro){
		delete this.actorDict[ro];
	}.bind(this));
};

// 检测是不是角色都到场
handler.isReady = function(){
	return this.actorDict['caster'] && this.actorDict['target'];
};

module.exports = Scene;
