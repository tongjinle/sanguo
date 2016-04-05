var EventEmitter = require("events").EventEmitter;

var  _ = require("underscore");

var dictUtil = require("../dict/dictUtil");
var utils = require("../util/utils");
var poolUtil = require("../util/poolUtil");
var define = require("../util/define");

var injectUtil = require("../model/injectUtil");
var Map = require("../model/map");
var Player = require("../model/player");
var Chess = require("../model/chess");
var Bag = require("../model/bag");
var SpeedMgr = require("../model/speedmgr");
var AreaRecord = require("../model/arearecord");

var messageType = require("../enum/messageType");


var Area = function(){
	poolUtil.add(this);
	this.insType = "area";

	this.playerList = [];
	this.chessList = [];
	this.skillList = [];
	this.buffList = [];

	// 事件管理器
	this.eventMgr = new EventEmitter();
	this.on = this.eventMgr.on.bind(this.eventMgr);
	this.emit = this.eventMgr.emit.bind(this.eventMgr);


	// 速度管理器
	this.speedMgr = new SpeedMgr();

	// 记录表
	this.recordList = [];

	// 绑定事件
	this.bindEvent();
};



define(Area);

var handler = Area.prototype;

handler.addPlayer = function(player,color){
	this.playerList.push(player);
	player.enterArea(this,color);

	this.emit(messageType.addPlayer,{player:player});
};

handler.loadChess = function(chessName){
	var chess = new Chess(chessName);
	this.chessList.push(chess);
};

// 加载地图
handler.loadMapByName = function(mapName){
	this.map = Map.loadInfo(mapName);
};

// =============================================================
handler.start = function(){
	this.nextRound();
};

// 开启一个回合
handler.nextRound = function(){
	this.writeRecord();
	var nextRoundTuple = ["caster",function(caster){
		return {
			fireEvent:messageType.nextRound,
			casterId:caster.id,
			targetId:caster.id,
			effect:null
		};
	}];

	injectUtil.enterStage({
		caster:this.get("currChess")
	});

	this.explainTuple(nextRoundTuple);
};

handler.writeRecord = function(reco,type){
	if(!reco){
		var reco = new AreaRecord();
		this.recordList.push(reco);
		this.writeRecord(reco,"speedQueue");
		return;
	}
	if(type == "speedQueue"){
		var list = this.speedMgr.preview();
		reco.speedQueue = _.map(list,function(li){return li.itemId; });
	};
};


// =============================================================
handler.getBenefitByChessId = function(id){
	this.fireEvent(messageType.reportBuffBenefit,{chessId:id});
};

// =============================================================

handler.chessDrinkPotion = function(){
	var drinkPotionTuple = [];
	this.explainTuple(drinkPotionTuple);
};

handler.chessMove = function(chessId,position){
	var moveTuple = ["caster","position",function(caster,posi){
		return {
			fireEvent:messageType.move,
			casterId:caster.id,
			targetId:caster.id,
			effect:{
				x:{$set:posi.x},
				y:{$set:posi.y}
			}
		};
	}];

	injectUtil.enterStage({
		caster:chessId,
		position:position
	});

	var prebag = this.explainTuple(moveTuple);
	var bag = new Bag(prebag);
	console.log("bag",bag);
	this.emit(messageType.beforeMove,bag);
	this.emit(messageType.move,bag);
	this.emit(messageType.afterMove,bag);
};

handler.chessCast = function(){
	var castTuple = skillEffectDict[this.get("currSkillName")];
	var prebag = this.explainTuple(castTuple);
	var bag = new Bag(prebag);
	this.fireEvent(messageType.beforeCast,bag);
	this.fireEvent(messageType.cast,bag);
	this.fireEvent(messageType.afterCast,bag);
};

handler.chessEndRound = function(chessId){
	var chess = this.getInsById(chessId);
	chess.endRound();

	// 
	this.nextRound();
};

// 解释Tuple
handler.explainTuple = function(tuple){
	var fn = tuple[tuple.length-1];
	var injectStrList = [].slice.call(tuple,0,tuple.length-1);
	var injectList = _.map(injectStrList,function(n){
		return injectUtil.read(n);
	}.bind(this));
	// console.log("injectList");
	// console.log(injectList);
	return fn.apply(null,injectList);
};

// 通过id获取
handler.getInsById  = function(id){
	return poolUtil.find(id);
};


// 绑定事件
handler.bindEvent = function(){
	var self = this;
	// addChess
	self.on(messageType.addChess,function(msg){
		var ch = msg.chess;
		// console.log("**",ch);
		self.map.addChess(ch.id,ch.get("position"));

		self.speedMgr.addItem(ch.id,ch.get("speed"));
	});

	// afterMove 
	self.on(messageType.afterMove,function(bag){
		
	});
};



// == == == define == == ==
define(Area,"chessList",{
	get:function(){
		return _.filter(poolUtil.getDict(),function(v,k){return v.insType == "chess";});
		var playerList = this.get("playerList");
		var chessList = []
		_.each(playerList,function(pl){
			chessList = chessList.concat( pl.get("chessList"));
		});
		return chessList;
	},
	set:null
});

define(Area,"currRecord",{
	get:function(){
		return _.last(this.recordList);
	},
	set:null
});

define(Area,"currSpeedQueue",{
	get:function(){
		return this.get("currRecord").get("speedQueue");
	},
	set:null
});

define(Area,"currChess",{
	get:function(){
		// console.log("currSpeedQueue",this.get("currSpeedQueue"));
		var first = _.first(this.get("currSpeedQueue"));
		// console.log("first",first);
		return first ? this.getInsById(first) : null;
	},
	set:null
});



module.exports = Area;