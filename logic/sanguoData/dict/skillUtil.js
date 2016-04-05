var messageType = require("../enum/messageType");
var chessRelationType = require("../enum/chessRelationType");
var dictUtil = require("../dict/dictUtil");

// 创建被动技能
var skillPassive = {};
// 被动技能对应着一个"永久"的同名buff
skillPassive.create = function(skillName){
	return ["caster",function(caster){
		return {
			fireEvent:messageType.addBuff,
			casterId:caster.id,
			targetId:caster.id,
			effect:{
				buff:{$add:skillName}
			}
		};
	}];
};


var skillHalo = {};
// 创建光环
// 本质上是创建光环的被动技能
// haloOpts
/*
	range 光环作用范围
	type 光环类型
	buffName 光环能带来的buff的名字
*/
skillHalo.create = function(haloName,haloOpts){
	var range = haloOpts.range,
		type  = haloOpts.type,
		buffName = haloOpts.buffName;

	// 注入会被解释,从而返回一个被"作用"到的chess列表
	var injectStr = ["$$halo",type,range].join(".");

	// 一个光环名字(haloName)对应着一个同名的buff
	// 这个buffEffect不存在于dict文件夹下,而是在这里生成
	return  {
		onEvent:messageType.afterMove,
		effect:["buff",injectStr,function(buff,chessDict){
			var chessesInRange = chessDict.chessesInRange,
				chessOutRange = chessDict.chessOutRange;

			var buffBag = [];
			// 在光环里面的棋子得到光环带来的buff
			buffBag = buffBag.concat(_.map(chessesInRange,function(ch){
				return {
					fireEvent:messageType.addBuff,
					casterId:buff.id,
					targetId:ch.id,
					effect:{
						buff:{$add:buffName}
					}
				};
			}));

			// 在光环外面的棋子失去光环带来的buff
			buffBag = buffBag.concat(_.map(chessOutRange,function(ch){
				return {
					fireEvent:messageType.removeBuff,
					casterId:buff.id,
					targetId:ch.id,
					effect:{
						buff:{$remove:buffName}
					}
				};
			}));
			
		}]
	};

};


exports.skillPassive = skillPassive;
exports.skillHalo = skillHalo;

