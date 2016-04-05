var Tuple = require('../util/tuple');

describe('tuple test',function(){
	it('basic tuple',function(){
		var rawTup = ['a','b',function(a,b){
			return a+b;
		}];
		var tup = new Tuple();
		var rst = tup.read(rawTup).explain({a:1,b:100}).run()
		expect(rst).toBe(101);
	});

	it('dict memory',function(){
		var rawTup = ['a','b',function(a,b){
			return a+b;
		}];
		var tup = Tuple.read(rawTup).explain('a',1000);
		expect(tup.dict.a).toBe(1000);
	});

});