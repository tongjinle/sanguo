var _ = require("underscore");
// 0.null 直接返回null
// 1.数字 1 -> {type:"line",val:1}
// 2.带type属性的对象 {type:"line",val:1}等等,type可以多样,在typeDict字典中增加针对各种type的parse方法
// 3.参数(数组类型)+函数 调用函数得到其返回结果
// 4.参数(数组类型) 依次遍历数组元素,最后合并出一个不重复的集合
var parse = function(args,fn) {
	if(args===null){return null;}
	if(_.isNumber(args)){return parse({type:"line",val:args});};
	if(_.isObject(args) && !!args.type){return typeDict[args.type](args.val);};
	if(_.isArray(args) && _.isFunction(fn)){return fn.apply(null,args);};
	if(_.isArray(args) && !fn){
		var arr = [];
		_.each(args,function(n){
			arr = arr.concat(parse(n));
		});
		arr = _.uniq(arr,function(n){return n.x*10000+n.y;});
	};
};
var typeDict = {};
// line
typeDict.line = function(val){
	var 
	arr = [],
	x = 0,
 	y = 0;
	for (var i = 0; i < val; i++){
		arr.push({x:x,y:y+i+1});
		arr.push({x:x,y:y-i-1});
		arr.push({x:x+i+1,y:y});
		arr.push({x:x-i-1,y:y});
	};
	return arr;
};
// circle
typeDict.circle = function(val){
	var 
	arr = [];
	for(var i = -val; i <=  val; i++){
		for(var j = -val; j < val; j++){
			if(i != val || j != val){
				arr.push({x:i,y:j});
			};
		};	
	};
	return arr;
};
// rangeLine 
// 区域线段,参数是个[min,max]数组
typeDict.rangeLine = function(val){
	var
	arr = []; 
	min = val[0],
	max = val[1];

	var 
	minArr = parse(min), 
	maxArr = parse(max);
	arr = _.filter(maxArr,function(n){ return !_.find(minArr,function(nn){ return n.x == nn.x && n.y == nn.y; });})

	return arr;
};

var exp = {
	parse:parse
};
module.exports = exp;
