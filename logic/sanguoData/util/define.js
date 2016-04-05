var _ = require("underscore");

var define  = function(cls,propName,fns){
	var handler = cls.prototype;

	var acce ;
	if(!handler.__access){
		acce = handler.__access = {};
		handler.get = function(propName){
			var acceProp = acce[propName];
			return acceProp && acceProp.get ? acceProp.get.call(this) : this[propName];
		};

		handler.set = function(propName,value){
			var acceProp = acce[propName];
			return acceProp ? acceProp.set.call(this,value) : this[propName] = value;
		};
	};

	acce = handler.__access;
	acce[propName] = acce[propName] || {};
	_.each(fns,function(v,k){
			acce[propName][k] = v === null ? 
				function(){throw "dont set "+propName} :
				v;
	});

};

/*
define(skill,
			"damage",
			{
				get: function() {
					return this.damage + 100;
				}
			}
);*/

module.exports = define;