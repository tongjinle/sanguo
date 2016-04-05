var  _  =  require("underscore");


var injectUtil = {};

var  dict = {};
// 添加读取"注入字符串"的方法
injectUtil.append = function(injectStr,fn){
	fn  = fn || function(){
		return injectUtil.getCurrStage()[injectStr];
	};
	dict[injectStr] = fn;
};

// 解释"注入字符串",来得到一个返回值
injectUtil.read = function(injectStr){
	return dict[injectStr]();
};

var area = null;
// 设置场景
injectUtil.setArea = function(currArea){
	area = currArea;
};

var stages = [];
// 设置舞台角色
// 比如在move的时候,info里要加入caster和posi的信息
injectUtil.enterStage = function(info){
	stages.push(info);
};

// 获取当前场景
injectUtil.getCurrStage = function(){
	return _.last(stages);
};


// caster
injectUtil.append("caster",function(){
	return injectUtil.getCurrStage().caster;
});

injectUtil.append("position");




module.exports = injectUtil;