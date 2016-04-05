var  _ = require("underscore");
var dictUtil = require("../dict/dictUtil");
var utils = require("../util/utils");
var define = require("../util/define");
var poolUtil = require("../util/poolUtil");

var Chess = function(){
	poolUtil.add(this);
	this.insType = "chess";

	this.name = null;
	this.color = null;
	this.x = null;
	this.y = null;
	this.hp = null;
	this.maxHp = null;
	this.mp = null;
	this.maxMp = null;
	this.damage = null;
	this.speed = null;
	this.buffs = null;
	this.skills = null;
	this.canMove = null;
	this.canCast = null;

};


// 静态方法 == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == 
Chess.loadInfo = function(chessName){
	var orgChess = dictUtil.findChessByName(chessName);	
	if (!orgChess) {
		utils.error('cannot find chess in dict');
		return null;
	};

	var obj = new Chess();

	obj.hp = obj.maxHp = orgChess.hp;
	obj.mp = obj.maxMp = orgChess.mp;
	obj.damage = orgChess.damage; 
	obj.speed =orgChess.speed;

	obj.buffs = [];
	obj.skills = orgChess.skills;

	// initialized to invalid position
	obj.x = -1;
	obj.y = -1;

	obj.canMove = 0;
	obj.canCast = 0;

	return obj;
};

// 实例方法 == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == ==
var handler = Chess.prototype;

handler.enterArea = function(area) {
	this.area = area;
	this.initSkills();
};

handler.initSkills = function() {
	// todo;
};

// 获得行动回合
handler.getTurnRound = function(){
	this.hasDrinkPotion = this.preDrinkPotion();
};


handler.preDrinkPotion = function(){};
handler.drinkPotion = function(){};

// 返回可以move的目标:Position[]
handler.preMove = function(){
	var posi = {x: this.x, y: this.y};
	return this.area.mapEntity.getRange(posi, this.get("power"));
};

// move
handler.move = function(posi){
	this.x = posi.x;
	this.y = posi.y;
};

// 返回可以被cast的目标:Position[]
handler.preCast = function(skillName){};

// cast
handler.cast = function(skillName,position){};

handler.beginRound = function(){
	this.setRights();
};

handler.endRound  = function(){
	this.setRights(false);
};

handler.setRights = function(flag){
	if(flag!=undefined){
		this.canDrinkPotion = this.canMove = this.canCast = flag;
	}else{
		// check abilit
		// to do 
		this.setRights(true);
	}
}


// define
define(Chess,"buffBenefit",{
	get:function(){
		return this.area.getBenefitByChessId(this.id);
	}
});

define(Chess,"maxHp",{
	get:function(){
		return this.maxHp + this.get("buffBenefit").get("maxHp");
	},
	set:null
});

define(Chess,"position",{
	get:function(){
		return {x:this.x,y:this.y};
	},
	set:function(posi){
		this.x = posi.x;
		this.y = posi.y;
	}
})



module.exports = Chess;