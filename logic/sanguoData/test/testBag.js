var Proxy = require('EventProxy');
var poolUtil = require('../util/poolUtil');
var Chess = require('../model/chess');
var Bag = require('../model/bag');

describe('bag',function(){
	var ep;
	beforeEach(function(){
		eq = new Proxy();
	});

	it('',function(){
		var ch = new Chess();
		ch.set('id',10);
		var rawBag = {
			fireEvent:'nextRound',
			casterId:10
		};
		var ba = Bag.loadInfo(rawBag);
		var rst = -1;
		var rst2 = -1;
		ep.on('nextRound',function(){
			rst = 1;
		});
		ep.on('nextRound2',function(){
			rst2 = 1;
		});
		ba.fire();
		expect(rst).toBe(1);
		expect(rst2).toBe(-1);

	})
})