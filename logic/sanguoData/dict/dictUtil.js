var _ = require("underscore");
// 
var skillUtil = require('./skillUtil');

// 数据
var chessJson = require("./chess.json");
var skillJson = require("./skill.json");
var skillEffectDict = require("./skillEffectDict");
var buffJson = require("./buff.json");
var buffEffectDict = require("./buffEffectDict");
var mapJson = require("./map.json");

// parse

var dictUtil = {};


// 通过name返回元数据
dictUtil.getMeta = function(name){
	return name == 'chess' ? chessJson :
		name == 'skill' ? skillJson :
		name == 'skillEffect' ? skillEffectDict :
		name == 'buff' ? buffJson :
		name == 'buffEffect' ? buffEffectDict :
		name == 'map' ? mapJson : 
		null;
};

// effect中部分数据是需要再次parse的
dictUtil.parse = function(dict){
	_.each(dict,function(v,k){
		// 需要再次parse的部分
		if(_.isObject(v) && v.type){
			if(v.type == 'passive'){
				dictUtil.getMeta('skillEffect')[k]=skillUtil.skillPassive.create(v.name);
			}else if(v.type == 'halo'){
				dictUtil.getMeta('skillEffect')[k]=skillUtil.skillPassive.create(v.name);
				dictUtil.getMeta('buffEffect')[k]=skillUtil.skillHalo.create(v.name,v.opts);
			}
		}
	});
};

dictUtil.init = function(){
	this.parse(skillEffectDict);

	// 通过name来在相对应的数据中查找
	this.findMapByName		=	findInDictByName.bind(null,mapJson);
	this.findChessByName	=	findInDictByName.bind(null,chessJson);
	this.findSkillByName		=	findInDictByName.bind(null,skillJson);
	this.findSkillEffectByName	=	function(name){return dictUtil.getMeta('skillEffect')[name]||null;};
	this.findBuffByName		=	findInDictByName.bind(null,buffJson);
	this.findBuffEffectByName	=	function(name){return dictUtil.getMeta('buffEffect')[name]||null;};
};



// HELP
function findInDictByName(dict,name){
	return _.find(dict,function(n){return n.name == name;});
}

dictUtil.init();

module.exports = dictUtil;