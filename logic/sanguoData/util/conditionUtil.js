var _ = require('underscore');
var buffRelationType = require("../enum/buffRelationType");

var conditionUtil = {};

conditionUtil.check = function(rawCondiArr,env){
	rawCondiArr = _.isArray(rawCondiArr) ? rawCondiArr : [rawCondiArr];
	/*
		[
			{caster:buffRelationType.owner} -> 施法者,
			'##abc' -> 注入	
		]
	*/
	_.find(rawCondiArr,function(rc,i){
		_check(rc);
	});
};

// 加载场景
conditionUtil.loadScene = function(scene){
	this.scene = scene;
};

// 加载当前的buff
conditionUtil.loadBuff = function(buff){
	this.buff = buff;
};

var _check = function(rawCondi){
	var se = this.scene;
	if(!se){
		throw 'invalid scene';
	};

	if(_.isString(rawCondi) && rawCondi.startsWith("##")){

	}else if(_.isObject(rawCondi)){
		// eg {'caster':'owner'}
		// caster是buff
		// owner是buff拥有者
		// 综上,等式关系是caster的owner是'owner'
		var actorRole,buffRelation;
		for(var i in rawCondi) {
			actorRole = i;
			buffRelation = rawCondi[i];
		};
		var actor = this.scene.getActorByRole(actorRole);
		var checkDict = {};
		checkDict[buffRelationType.owner] = function(){};

		return checkDict[buffRelation]();

	}else{
		throw 'invalid raw condition';
	}
}.bind(conditionUtil);


module.exports = conditionUtil;
