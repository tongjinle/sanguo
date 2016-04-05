var fs = require("fs");
var  _ = require("underscore");


count("messageType","../dict/","../enum/messageType.js");
count("chessRelationType","../dict/","../enum/chessRelationType.js");
count("buffRelationType","../dict/","../enum/buffRelationType.js");
count("sceneRelationType","../dict/","../enum/sceneRelationType.js");
count("areaElementType","../dict/","../enum/areaElementType.js");
count("boxType","../test/","../enum/boxType.js");

function count(type,from,to){
	var str = type+"\\.\\w+\\b";
	console.log(str);
	var rege = new RegExp(str,"g");

	files = fs.readdirSync(from);
	console.log("==="+type+"===");
	console.log(files);
	// return;

	var arr = [];
	_.each(files,function(fr){
		if(!fs.statSync(from+fr).isFile()) return;
		var content = fs.readFileSync(from+fr)+'';
		arr = arr.concat(content.match(rege));
	});
	arr = arr.sort();
	arr = filter(arr);
	console.log(arr);

	destContent = [];
	destContent.push("var exp = module.exports;");
	_.each(arr,function(n){
		var subType = n.replace(type+".","");
		destContent.push("exp."+subType+" = \""+[type,subType].join("_").toUpperCase()+"\";");
	});


	fs.writeFileSync(to,destContent.join("\n"));
}

function filter(arr){
	var dict ={};
	return _.filter(arr,function(n){
		if(n==null) return false;
		if(!dict[n]){
			dict[n] = n;
			return true;
		}
	});
}