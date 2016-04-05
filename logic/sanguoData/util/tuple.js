var _ = require("underscore");

function Tuple(){
	this.keys = null;
	this.dict = null;
	this.exec = null;
}



Tuple.create = Tuple.read = function(arr){
	var tup = new Tuple();
	tup.read(arr);
	return tup;
};

var handler = Tuple.prototype;

// read raw tuple
handler.read = function(arr){
	var o = read(arr);
	this.exec = o.exec;
	this.keys = o.keys;
	return this;
};


// 向字典写入key/value 或者 写入一个dict
handler.explain = function(key,value){
	this.dict = this.dict || {};
	if(_.isObject(key)){
		_.each(key,function(v,k){this.explain(k,v);}.bind(this));
	}else{
		this.dict[key] = value;
	}
	return this;
};


// 执行
handler.run = function(){
	var values = _.map(this.keys,function(key){return this.dict[key];}.bind(this));
	return this.exec.apply(this,values);
};

// read raw tuple
function read(arr){
	return {
		keys:arr.slice(0,arr.length-1),
		exec:arr[arr.length-1]
	};
};


module.exports = Tuple;