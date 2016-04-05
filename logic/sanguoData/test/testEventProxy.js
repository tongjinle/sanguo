var Proxy = require('eventProxy');


describe('eventProxy',function(){
	var ep;
	var arr;
	beforeEach(function (){
		arr=[];
		ep = Proxy.create();
	});

	afterEach(function(){
		ep = null;
		arr = null;
	});

	it('bind,on,addListener,subscribe',function(){
		ep.on('go',function(e){
			arr.push(50);
		});
		ep.trigger('go',50);
		ep.trigger('go',50);
		expect(arr).toEqual([50,50]);
	});

	it('once',function(){
		ep.once('go',function(e){
			arr.push(e);
		});
		ep.trigger('go',50);
		ep.trigger('go',50);
		expect(arr).toEqual([50]);
	});

	it('unbind,removeListener',function(){
		ep.on('go',function(e){
			arr.push(50);
		});
		ep.trigger('go',50);
		ep.trigger('go',50);
		ep.unbind('go');
		ep.trigger('go',50);
		expect(arr).toEqual([50,50]);
	});

	it('all',function(){
		var arr2 = [];
		var arr3 = [];

		ep.on('go',function(e){
			arr.push(e);
		});
		
		ep.on('go2',function(e){
			arr.push(e);
		});

		// 分析all的源码,all已经默认的认为是once
		ep.all('go',function(e){
			arr2.push(e);
		});

		ep.all('go','go2',function(e1,e2){
			arr3.push(e1);
			arr3.push(e2);
		});

		ep.fire('go',50);
		ep.fire('go2',100);
		ep.fire('go2',100);
		ep.fire('go',50);
		ep.fire('go2',100);

		expect(arr).toEqual([50,100,100,50,100]);
		expect(arr2).toEqual([50]);
		expect(arr3).toEqual([50,100]);

	});

	it('tail',function(){
		var arr2 = [];
		var arr3 = [];

		ep.on('go',function(e){
			arr.push(e);
		});
		
		ep.on('go2',function(e){
			arr.push(e);
		});

		// 分析tail的源码,all已经默认的最后的参数once是false
		// tail会在第一次'事件'都触发的时候,执行一次
		// 后面会在每个'子事件'触发的时候,用最新数据执行一次
		ep.tail('go',function(e){
			arr2.push(e);
		});

		ep.tail('go','go2',function(e1,e2){
			arr3.push(e1);
			arr3.push(e2);
		});

		ep.fire('go',50);
		ep.fire('go2',100);
		ep.fire('go2',200);
		ep.fire('go',80);
		ep.fire('go2',300);

		expect(arr).toEqual([50,100,200,80,300]);
		expect(arr2).toEqual([50,80]);
		expect(arr3).toEqual([50,100,50,200,80,200,80,300]);

	});


});