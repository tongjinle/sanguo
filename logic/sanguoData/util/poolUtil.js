var _ = require("underscore");

// depend on 'underscore'
var Pool = function() {
		this._dict = {};
};

// instance 
var handler = Pool.prototype;
handler.add = function(obj) {
		var s = _.find(this._dict, function(v, k) {
				return v === obj;
		});
		if (!s) {
				var id = _.uniqueId();
				obj.id = id;
				this._dict[id] = obj;
				return id;
		}
		return null;
};

handler.find = function(id){
		return this._dict[id] || null;
};

handler.remove = function(id){
		 this._dict[id] = null;
};

handler.getDict = function(){
	return this._dict;
};

module.exports = new Pool();

