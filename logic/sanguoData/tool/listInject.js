var fs = require("fs");
var _ = require("underscore");


var rege = /\"[\$\#]{2}\w+\.\w+\"/g;
var files = ["../skillDict.js","../buffDict.js"];

var list = [];
_.each(files,function(fi){
	var content = fs.readFileSync(fi)+'';
	var arr = content.match(rege);
	// console.log(arr);
	arr = arr.map(function(n){return n.replace(/\"/g,"");});
	list = list.concat(arr);
});

list = _.uniq(list).sort();


fs.writeFileSync("../list/inject.txt",list.join("\n"));
console.log(list);