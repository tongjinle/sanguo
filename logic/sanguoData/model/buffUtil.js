var _ = require("underscore");

var messageType = require("../enum/messageType");
var chessUtil = require("../model/chessUtil");
var injectUtil = require("../injectUtil");

// buff增益
var buffBenefit = {
	create: function(benefitOpts) {
		var effect = _.isFunction(benefitOpts) ?
					benefitOpts : 
					function(){
						return benefitOpts;
					};
		// 报告buff的benefit,"requestBuffBenefit"
		var onRequestBuffBenefit = {
			onEvent:messageType.requestBuffBenefit,
			effect:effect
		};
		return [onRequestBuffBenefit];
	}
};

// buff条件判断
var buffCondition = {
	check:function(condition){
		if(_.isObject(condition)){
			return [
				"buff","sender","owner","caster","target",
				function(buff,sender,owner,caster,target){
					var dict = {};
					dict[buffRelationType.buff] = function(actioner){
						return actioner == buff;
					};
					dict[buffRelationType.enemy] = function(actioner){
						chessUtil.getRelationBetweenChesses(owner,actioner) == chessRelationType.enemy; 
					};
					dict[buffRelationType.friend] = function(actioner){
						chessUtil.getRelationBetweenChesses(owner,actioner) == chessRelationType.friend; 
					};
					dict[buffRelationType.owner] = function(actioner){
						return actioner == owner;
					};

					return !_.find(condition,function(v,k){
						actioner = k=="target" ? target : k=="caster"?caster:null;
						return !dict[v](actioner);
					});
				}
			];
		}else if(_.isString(condition)){
			return injectUtil.parse(condition,"buffCondition");
		};
	}
	
};



exports.buffBenefit = buffBenefit;
exports.buffCondition = buffCondition;
