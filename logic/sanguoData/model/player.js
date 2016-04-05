var  _ = require("underscore");
var dictUtil = require("../dict/dictUtil");
var utils = require("../util/utils");
var define = require("../util/define");
var messageType = require("../enum/messageType");
var poolUtil = require("../util/poolUtil");

var Player = function(){
	poolUtil.add(this);
	this.insType = "player";
	
	this.color = null;
	this.area = null;
	this.chessList = [];
};

define(Player);

var handler = Player.prototype;

handler.enterArea = function(area,color){
	this.area = area;
	this.color = color;
};

handler.addChess = function(chess){
	this.chessList.push(chess);
	chess.set("color",this.color);

	this.emit(messageType.addChess,{chess:chess});
};

handler.removeChess = function(chess){
	this.chessList = _.without(this.chessList,chess);
};


handler.on = function(){
	this.area.on.apply(this,arguments);
};

handler.emit = function(){
	this.area.emit.apply(this,arguments);
};

module.exports = Player;