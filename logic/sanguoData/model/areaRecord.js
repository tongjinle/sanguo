var  _ = require("underscore");
var dictUtil = require("../dict/dictUtil");
var utils = require("../util/utils");
var define = require("../util/define");
var Map = require("../model/map");
var Player = require("../model/player");
var Chess = require("../model/chess");
var SpeedMgr = require("../model/speedmgr");
var AreaRecord = require("../model/arearecord");

var messageType = require("../enum/messageType");


var AreaRecord = function(){};
define(AreaRecord);

var handler = AreaRecord.prototype;

handler.push = function(category,data){
	this[category] = data;
};

// define
define(AreaRecord,"speedQueue",{
	get:function(){
		return this["speedQueue"];
	},
	set:null
});


module.exports = AreaRecord;