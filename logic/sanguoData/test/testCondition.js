var EventProxy = require('EventProxy');
var Buff = require("../model/buff");
var messageType = require("../enum/messageType");
var buffRelationType = require("../enum/buffRelationType");
var sceneRelationType = require("../enum/sceneRelationType");
var Chess = require("../model/chess");
var Scene = require('../model/scene');
var conditionUtil = require('../util/conditionUtil');

describe('condition',function(){
	it('{caster:buffRelationType.owner}',function(){
		var co = {'caster':buffRelationType.owner};
		var ch = new Chess();
		ch.set('id',10);
		var bu = new Buff();
		bu.set('id',100);
		bu.set('owner',ch);
		var se = new Scene();
		se.enter(bu,sceneRelationType.caster);
		// conditionUtil.loadSence(se);
		// conditionUtil.loadBuff(bu);
		// expect(conditionUtil.check(co)).toBe(true);
	});
});
