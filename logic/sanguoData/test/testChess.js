var Chess = require("../model/chess");
describe("test chess",function(){
	var 
	caocao,
	zhangfei
	;
	
	beforeEach(function(){

	});

	// 棋子能正确找到元数据
	it("chess.loadInfo",function(){
		var caocao = Chess.loadInfo('caocao');
		expect(caocao).not.toBeUndefined();

		var none = Chess.loadInfo('none');
		expect(none).toBeFalsy();
	});

	// 
	it("nextRound event",function(){

	});
});