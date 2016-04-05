var buffBenefit = require("../model/buffUtil").buffBenefit;
var messageType = require("../enum/messageType");
var buffRelationType = require("../enum/buffRelationType");
var buffDict = {};

// 无限思维buff效果
buffDict["wuxiansiweiguanghuan"] = {
	onEvent:messageType.nextRound,
	condition:{caster:buffRelationType.owner},
	effect:["buff","##wuxiansiweiguanghuan.friends",function(buff,friends){
		return _.map(friends,function(ch){
			return {
				casterId:buff.id,
				targetId:ch.id,
				fireEvent:messageType.heal,
				effect:{
					mp:100
				}
			};
		});
	}]
};

// 冬眠监听了2个事件
// 进入冬眠的无敌状态，徐晃不能移动和施放技能，徐晃每个回合回复20%的最大生命值，一旦hp回满，则徐晃解除冬眠状态
buffDict["dongmian"] = [
	{	
		onEvent:messageType.nextRound,
		condition:{caster:buffRelationType.owner},
		effect:["buff","owner",function(buff,owner){
			return {
				casterId:buff.id,
				targetId:buff.ownerId,
				fireEvent:messageType.heal,
				effect:{
					hp:.2*owner.get("maxHp")
				}
			};
		}]
	},
	{
		onEvent:messageType.afterHeal,
		condition:{target:buffRelationType.owner}, // afterHeal的target是buff的owner
		effect:["buff","target",function(buff,target){
			if(target.get("hp") === target.get("maxHp")){
				return {
					casterId:buff.id,
					targetId:target.id,
					fireEvent:messageType.removeBuff,
					effect:{
						buff:{$remove:"dongmian"},
						canMove:{$set:true},
						canCast:{$set:true}
					}
				};
			}
		}]
	}
];

// 春风
// 每个回合恢复100hp+5%最大生命值
buffDict["chunfeng"] = {
	onEvent:messageType.nextRound,
	condition:{caster:buffRelationType.owner},
	effect:["buff","owner",function(buff,owner){
		return {
			fireEvent:messageType.heal,
			casterId:buff.id,
			targetId:owner.id, // 用buff.ownerId也一样
			effect:{
				hp:100+caster.get("maxHp")*.05
			}
		};
	}]
};


// 生命护符
buffDict["shengminghufu"] = {

};

// 共生
// 周围3格内任何友军棋子收到伤害，由这周围三格内所有友军棋子均摊
/*
	-> -> -> -> -> -> -> -> -> -> -> -> -> -> -> -> 
		有一些buff只直接去修改bag中的数值
		只会触发事件"updateBag"	(它不会继续触发事件)	
	-> -> -> -> -> -> -> -> -> -> -> -> -> -> -> -> 
*/
buffDict["gongsheng"] = {
	onEvent:messageType.attack,
	condition:"##gongsheng.condition", // 把"3格之内","友军"这样的约束条件全部交给condition去做
	effect:["buff","owner","bag","target","##gongsheng.friends",function(buff,owner,bag,target,friends){
		var avgDamage = bag.get("hp") / firends.length;
		var buffBag = [];
		buffBag.push({
			fireEvent:messageType.updateBag,
			casterId:buff.id,
			targetId:bag.id,
			effect:{
				hp:-avgDamage
			}
		});

		_.each(firends,function(ch){
			buffBag.push({
				fireEvent:messageType.attack,
				casterId:caster.id,
				targetId:ch.id,
				effect:{
					hp:avgDamage
				}
			});
		});

		return buffBag;
	}]
};


// 痛感麻木
// 如果许褚血量高于90%，则减少75%的伤害
buffDict["tongganmamu"] = {
	onEvent:messageType.attack,
	condition:{target:buffRelationType.owner},
	effect:["buff","owner","bag",function(buff,owner,bag){
		var subDamage = (owner.get("hp") > caster.get("maxHp") *.9 ? (.75) : 0) * bag.get("damage");
		return {
			fireEvent:messageType.updateBag,
			casterId:buff.id,
			targetId:bag.id,
			effect:{
				hp:subDamage
			}
		};
	}]
};

// 胖子
// 许褚每个回合回复5%的血量
buffDict["pangzi"] = {
	onEvent:messageType.nextRound,
	condition:{caster:buffRelationType.owner},
	effect:["buff","owner",function(buff,owner){
		return {
			fireEvent:messageType.heal,
			casterId:buff.ownerId,
			targetId:owner.id,
			effect:{
				hp:owner.get("maxHp")*.05
			}
		};
	}]
};


// 流血
// 每回合让宿主丢失5%最大生命值
buffDict["liuxue"] = {
	onEvent:messageType.nextRound,
	condition:{caster:buffRelationType.owner},
	effect:["buff","owner",function(buff,owner){
		return {
			fireEvent:messageType.attack,
			casterId:buff.id,
			targetId:owner.id,
			effect:{
				hp:-.05*owner.get("maxHp")
			}
		};
	}]
};



// 中风
// 被攻击的目标棋子的hp如果低于最大hp的15%，则会被会击晕3个回合
buffDict["zhongfeng"] = {
	onEvent:messageType.attack,
	condition:{target:buffRelationType.owner},
	effect:["buff","bag",function(buff,bag){
		if(target.get("hp") < target.get("maxHp")*.15){
			return {
				fireEvent:messageType.updateBag,
				casterId:buff.id,
				targetId:bag.id,
				effect:{
					stun:3
				}
			};
		};
	}]
};


// 伤口撕裂
// 被攻击的目标棋子，附加其已经损失的hp的20%
buffDict["shangkousilie"] = {
	onEvent:messageType.attack,
	condition:{caster:buffRelationType.owner},
	effect:["buff","bag","owner",function(buff,bag,owner){
		return {
			fireEvent:messageType.updateBag,
			casterId:buff.id,
			targetId:bag.id,
			effect:{
				hp:-.2 * (owner.get("maxHp") - owner.get("hp"))
			}
		};
	}]
};

// 传染
// 被攻击的目标棋子，如果有目标棋子的友军棋子与目标棋子相连，则被传染“流血”buff
buffDict["chuanran"] = {
	onEvent:messageType.afterAttack,
	condition:{caster:buffRelationType.owner},
	effect:["buff","##chuanran.enemies",function(buff,enemies){
		return _.map(enemies,function(ch){
			return {
				casterId:buff.id,
				targetId:ch.id,
				fireEvent:messageType.addBuff,
				effect:{
					buff:{$add:"liuxue"}
				}
			};
		});
	}]
};

// 从这里开始只从buff上获取buff的信息
// 冻结
// 不能移动，但是可以使用技能
buffDict["dongjie"] = buffBenefit.create({canMove:{$set:false}});

// 迟缓
// speed-20
buffDict["chihuan"] = buffBenefit.create({speed:-20});

// 零度
// 所有敌方棋子每个回合都会损失8%的hp，但是却会回复5%的mp
buffDict["lingdu"] = {
	onEvent:messageType.nextRound,
	condition:{caster:buffRelationType.owner},
	effect:["buff","##lingdu.enemies",function(buff,enemies){
		return _.map(enemies,function(ch){
			return {
				fireEvent:messageType.attack,
				casterId:buff.id,
				targetId:ch.id,
				effect:{
					hp:-.08*ch.get("maxHp"),
					mp:.05*ch.get("maxMp")
				}
			};
		});
	}]
};


// 龙甲
// 刘备一旦遭遇攻击,对周围一个格子内的所有敌方棋子造成50点伤害
buffDict["longjia"] = {
	onEvent:messageType.afterAttack,
	condition:{target:buffRelationType.owner},
	effect:["buff","##longjia.enemies",function(buff,enemies){
		return _.map(enemies,function(ch){
			return {
				fireEvent:messageType.attack,
				casterId:buff.id,
				targetId:ch.id,
				effect:{
					hp:-50
				}
			};
		});
	}]
};

// 辉耀
// 刘备2格内敌方棋子每个回合收到75+7%敌方棋子自身最大血量的伤害
buffDict["huiyao"] = {
	onEvent:messageType.nextRound,
	condition:{caster:buffRelationType.owner},
	effect:["buff","##huiyao.enemies",function(buff,enemies){
		return _.map(enemies,function(ch){
			return {
				fireEvent:messageType.attack,
				casterId:buff.id,
				targetId:ch.id,
				effect:{
					hp:-75+ch.get("maxHp")*.07
				}
			};
		});
	}]
};

// 点燃
// 每个回合减少2%最大hp，减少3%最大mp
buffDict["dianran"] = {
	onEvent:messageType.nextRound,
	condition:{caster:buffRelationType.owner},
	effect:["buff","owner",function(buff,owner){
		return {
			fireEvent:messageType.attack,
			casterId:buff.id,
			targetId:buff.ownerId,
			effect:{
				hp:-.02*owner.get("maxHp"),
				mp:-.03*owner.get("maxMp")
			}
		};
	}]
};


// 焦痕守护
// 攻击诸葛亮的敌方棋子，都会得到一个“焦痕”buff
buffDict["jiaohengshouhu"] = {
	onEvent:messageType.afterAttack,
	condition:{target:buffRelationType.owner}, // 攻击目标是buff拥有者,为了更加简单的处理问题
	effect:["buff","caster",function(buff,caster){
		return {
			fireEvent:messageType.addBuff,
			casterId:buff.id,
			targetId:caster.id,
			effect:{
				buff:{$add:"jiaoheng"}
			}
		};
	}]
};

// 焦痕
// 每次移动，减少（3%*移动格子数）的当前最大hp
buffDict["jiaoheng"] = {
	onEvent:messageType.afterMove,
	condition:{caster:buffRelationType.owner},
	effect:["buff","caster","##jiaoheng.moveDist",function(buff,caster,moveDist){
		var moveLen = Math.abs(lastPosition.x-currPosition.x)+Math.abs(lastPosition.y-currPosition.y);
		return {
			fireEvent:messageType.attack,
			casterId:buff.id,
			targetId:caster.id,
			effect:{
				hp:-.03*moveDist*caster.get("maxHp")
			}
		};
	}]
};


// 火焰
// 如果周围有敌方棋子回复hp，则诸葛亮会自动发射火球攻击目标一次，造成65%的伤害；
buffDict["huoyan"] = {
	onEvent:messageType.afterHeal,
	condition:{target:buffRelationType.enemy},
	effect:["buff","target",function(buff,target){
		return {
			fireEvent:messageType.attack,
			casterId:buff.id,
			targetId:target.id,
			effect:{
				hp:-.65*caster.get("damage")
			}
		};
	}]
};

// 垂死挣扎
// buff消失的时候，目标死亡
buffDict["chuisizhengzha"] = {
	onEvent:messageType.afterRemoveBuff,
	condition:{target:buffRelationType.buff},
	effect:["buff",function(buff){
		return {
			fireEvent:messageType.die,
			casterId:buff.id,
			targetId:buff.ownerId,
			effect:{} // 直接死亡
		};
	}]
};

// == == == == == == 魏延 == == == == == == // 
// 远行之力
// 周围2格内所有友军棋子得到“远行之力”buff
buffDict["yuanxingzhili"] = buffBenefit.create({power:1});

// 愤怒
// 当然有一个友军棋子死亡的时候，魏延speed+10
buffDict["fengnu"] = {
	onEvent:messageType.die,
	condition:{target:buffRelationType.friend},
	effect:["buff",function(buff){
		return {
			fireEvent:messageType.updateChess,
			casterId:buff.id,
			targetId:buff.ownerId,
			effect:{
				speed:10
			}
		};
	}]
};

// 二次出击
// 魏延击杀一个地方棋子的时候，魏延得到一次额外的行动机会
buffDict["ercichuji"] = {
	onEvent:messageType.die,
	condition:{caster:buffRelationType.owner},
	effect:["buff",function(buff){
		return {
			fireEvent:messageType.getActionRound,
			casterId:buff.id,
			targetId:buff.ownerId,
			effect:{}
		};
	}]
};


// == == == == == == 孟获 == == == == == == // 
// 泥泞
buffDict["nining"] = buffBenefit.create({power:-1}); 

// 劳累
// 当孟获将mp耗尽，每个回合回复25%的最大mp和4%的最大hp

buffDict["laolei"] = {
	onEvent:messageType.nextRound,
	condition:{caster:buffRelationType.owner},
	condition:"##laolei.outOfMp",
	effect:["buff",function(buff){
		return {
			fireEvent:messageType.heal,
			casterId:buff.id,
			targetId:buff.ownerId,
			effect:{
				hp:.04*owner.get("maxHp"),
				mp:.25*owner.get("maxMp")
			}
		};
	}]
};


// 鼓励
// 孟获周围2格的友军棋子会额外获得孟获15%的攻击力
// 这里描述的其实是"+15%攻击"的buff
buffDict["guli"] = buffBenefit.create({damagePerc:.15});


// 关怀
// 孟获周围2格的友军棋子收到伤害，则孟获会帮该友军棋子承担50%的伤害
buffDict["guanhuai"] = {
	onEvent:messageType.attack,
	effect:["buff","bag",function(buff,bag){
		var deltaHp = Math.abs(bag.get("hp"));
		return [{
			fireEvent:messageType.updateBag,
			casterId:buff.id,
			targetId:bag.id,
			effect:{
				hp:+.5*deltaHp
			}
		},{
			fireEvent:messageType.attack,
			casterId:buff.id,
			targetId:buff.senderId,
			effect:{
				hp:-.5*deltaHp
			}
		}];
	}]
};

// 赵云
// 协助
// 如果友军棋子攻击敌方棋子，而赵云贴着敌方棋子，则赵云会协助攻击，对敌方棋子造成100%伤害
buffDict["xiezhu"] = {
	onEvent:messageType.afterAttack,
	condition:"##xiezhu.xiangling",
	effect:["buff","owner","target",function(buff,owner,target){
		return {
			fireEvent:messageType.attack,
			casterId:buff.id,
			targetId:target.id,
			effect:{
				hp:-owner.get("damage")
			}
		};
	}]
};

// 秒杀
// 如果敌方棋子如果血量低于25%最大hp，则在被赵云攻击的时候，会被赵云秒杀
buffDict["miaosha"] = {
	onEvent:messageType.beforeAttack,
	condition:{caster:buffRelationType.owner},
	effect:["buff","target",function  (buff,target) {
		if(target.get("hp") < target.get("maxHp")*.25){
			return {
				fireEvent:messageType.kill,
				casterId:buff.id,
				targetId:target.id,
				effect:{}
			}
		}
	}]
};

// 百战余生
// 赵云如果收到一次可以导致赵云死亡的攻击，那么赵云会闪避开这次攻击，但是在接下来4个回合内，赵云无法再次闪避
buffDict["baizhanyushegn"] = [{
	onEvent:messageType.attack,
	condition:{target:buffRelationType.owner},
	effect:["buff","bag",function(buff,bag){
		if(Math.abs(bag.get("hp"))>buff.caster.get("hp") && buff.memo.set("round")==0){
			buff.memo.set("round",4);
			return {
				fireEvent:messageType.updateBag,
				casterId:buff.id,
				targetId:bag.id,
				effect:{
					hp:0
				}
			};
		}
	}]
},{
	onEvent:messageType.nextRound,
	condition:{caster:buffRelationType.owner},
	effect:["buff",function(buff){
		return {
			fireEvent:messageType.updateBuffMemory,
			casterId:buff.id,
			targetId:buff.id,
			effect:{
				buff:{$setMemo:{"round":buff.memo.get("round")-1}}
			}
		};
	}]
}];


// 板甲
// 减少50%的所有伤害
buffDict["banjia"] = {
	onEvent:messageType.attack,
	condition:{target:buffRelationType.owner},
	effect:["buff","bag",function(buff,bag){
		return	{
			fireEvent:messageType.updateBag,
			casterId:buff.id,
			targetId:bag.id,
			effect:{
				hp:{$set:.5*bag.get("hp")}
			}
		};
	}]
};

// 糜竺
// 啃萝卜
// 如果糜竺在上一个回合没有被攻击，则会安心的啃食萝卜，从而恢复10%的最大hp和25%的最大mp；
buffDict["kenluobo"] = [{
	onEvent:messageType.nextRound,
	condition:{caster:buffRelationType.owner},
	effect:["buff","owner","##kenluobo.currRound",function(buff, owner,currRound){
		if(currRound - buff.get("lastAttackRound") >1){
			return {
				fireEvent:messageType.heal,
				casterId:buff.id,
				targetId:buff.ownerId,
				effect:{
					hp:.1*buff.owner.get("maxHp"),
					mp:.25*buff.owner.get("maxMp")
				}
			};
		}
	}]
},{
	onEvent:messageType.attack,
	condition:{target:buffRelationType.owner},
	effect:["buff","caster","##kenluobo.currRound",function(buff,caster,currRound){
		return {
			fireEvent:messageType.updateBuffMemory,
			casterId:buff.id,
			targetId:buff.id,
			effect:{
				lastAttackRound:currRound
			}
		};
	}]
}];

// 求饶
// 在遇到攻击的时候，糜竺有15%的可能用自己的100点mp来贿赂攻击者，从而躲过这次攻击
buffDict["qiurao"] = {
	onEvent:messageType.beforeAttack,
	condition:{target:buffRelationType.owner},
	effect:["buff","owner","caster","bag",function(buff,owner,caster,bag){
		if(Math,random()<.15){
			return [{
				fireEvent:messageType.heal,
				casterId:buff.id,
				targetId:caster.id,
				effect:{
					mp:100
				}
			},{
				fireEvent:messageType.attack,
				casterId:buff.id,
				targetId:owner.id,
				effect:{
					mp:-100
				}
			},{
				fireEvent:messageType.killBag,
				casterId:buff.id,
				targetId:bag.id,
				effect:{}
			}];
		}
	}]
};

// 最后的牺牲
// 糜竺战死之后，糜竺会补满战场上所有友军棋子的hp和mp，并且给予“为兔子复仇”buff
buffDict["zuihoudexisheng"] = {
	onEvent:messageType.afterDie,
	condition:{target:buffRelationType.owner},
	effect:["buff","##firends",function(buff,friends){
		return _.map(friends,function(ch){
			return {
				fireEvent:messageType.addBuff,
				casterId:buff.id,
				targetId:ch.id,
				effect:{
					buff:{$add:"weituzifuchou"}
				}
			};
		});
	}]
};

// 为兔子复仇	永久	damage+30%，power+1
buffDict["weituzifuchou"] = buffBenefit.create({damagePerc:.3,power:1});

// 视死如生
// 每损失5%最大hp，则增加5%伤害
buffDict["shisirugui"] = buffBenefit.create(["buff","owner",function(buff,owner){
	return {
		damagePerc:.05*Math.floor((owner.get("maxHp")-owner.get("hp"))/owner.get("maxHp"))
	};
}]);

// 长驱
// 增加关羽的power，第一个回合+3，第二个回合+2，第三个回合+1，如此循环
buffDict["changqu"] = buffBenefit.create(["##changqu.currRound",function(currRound){
	return {
		power:[3,2,1][currRound%3]
	};
}]);

// 军神
// 70%的几率造成2.5倍伤害
buffDict["junshen"] = {
	onEvent:messageType.attack,
	condition:{caster:buffRelationType.owner},
	effect:["buff","bag",function  (buff,bag) {
		if(Math.random<.7){
			return {
				casterId:buff.id,
				target:bag.id,
				effect:{
					hp:bag.get("hp")*2.5
				}
			};
		};
	}]
};

// todo
// 陆逊
// 破伤风
// 1级病毒的时候，目标会得到一个“破伤风”buff

// 麻醉剂
// 2级病毒的时候，目标会得到一个“麻痹”buff3
buffDict["bingdu"] = {
	onEvent:messageType.afterAddBuff,
	condition:{caster:buffRelationType.owner},
	effect:["buff","bag","target",function(buff,bag,target){
		if(bag.get("addBuff") != "bingdu" ) return;

		// 初始化病毒次数
		buff.memo.set("bingduCount",buff.memo.get("bingduCount")||0);

		// 病毒次数+1
		buff.memo.set("bingduCount",buff.memo.get("bingduCount")+1);

		var bingduCount = buff.memo.get("bingduCount");
			if(bingduCount==1){
				return {
					fireEvent:messageType.addBuff,
					casterId:buff.id,
					targetId:target.id,
					effect:{
						buff:{$add:"poshangfeng"}
					}
				};
			};
			if(bingduCount==2){
				return {
					fireEvent:messageType.addBuff,
					casterId:caster.id,
					targetId:target.id,
					effect:{
						buff:{$add:"mabi"}
					}
				};
			};
	}]
};

// 太史慈
// 步步为营
// 太史慈每行走一个格子，就加10%的伤害减免，最高为90%；一旦遭受一次攻击，则伤害减免消失
// 把棋子的伤害减免作为一个"公式属性"
buffDict["bubuweiying"] = [{
	onEvent:messageType.afterMove,
	condition:{caster:buffRelationType.owner},
	effect:["buff","##bubuweiying.moveCount",function(buff,moveCount){
		// 设置默认值
		buff.memo.setDefault("unDamagePerc",0);
		var unDamagePerc = buff.memo.get("unDamagePerc")+.1*moveCount;
		return {
			fireEvent:messageType.updateBuffMemory,
			caster:buff.id,
			targetId:buff.ownerId,
			effect:{
				buff:{$setMemo:{unDamagePerc:unDamagePerc}}
			}
		};
		// 等同于 buff.memo.set("unDamagePerc",unDamagePerc);
	}]
},{
	onEvent:messageType.afterAttack,
	condition:{target:buffRelationType.owner},
	effect:["buff",function(buff,target){
		return {
			fireEvent:messageType.updateBuffMemory,
			casterId:buff.id,
			targetId:buff.ownerId,
			effect:{
				buff:{$setMemo:{unDamagePerc:0}} 
			}
		};
	}]
},{
	// 在计算棋子属性的时候,buff报告对棋子的增益
	onEvent:messageType.requestBuffBenefit,
	effect:["buff","chess",function(buff,chess){
		if(chess.id == buff.owner.id){
			return {
				fireEvent:messageType.reportBuffBenefit,
				casterId:buff.id,
				targetId:chess.id,
				effect:{
					unDamagePerc:buff.memory.unDamagePerc
				}
			};
		}
	}]
}];

// 寒冷
// 太史慈周围2格内所有敌军power_1，但是每个回合回复20mp
buffDict["hanleng"] = [{
	onEvent:messageType.nextRound,
	condition:{caster:buffRelationType.owner},
	effect:["buff","owner",function(buff,owner){
		return {
			fireEvent:messageType.heal,
			casterId:buff.id,
			targetId:owner.id,
			effect:{
				mp:20
			}
		};
	}]
},{
	onEvent:messageType.requestBuffBenefit,
	condition:{caster:buffRelationType.owner},
	effect:["buff",function(buff){
		return {
			fireEvent:messageType.reportBuffBenefit,
			casterId:buff.id,
			targetId:buff.ownerId,
			effect:{
				power:-1
			}
		};
	}]
}];

// 孙权
// 摄取
// 摄取孙权周围3格之内所有敌方棋子3%最大mp+20mp
buffDict["shequ"] = {
	onEvent:messageType.nextRound,
	condition:{caster:buffRelationType.owner},
	effect:["buff","##shequ.enemies",function(caster,enemies){
		return _.map(enemies,function(ch){
			return {
				fireEvent:messageType.attack,
				casterId:buff.id,
				targetId:ch.id,
				effect:{
					mp:-(ch.get("maxMp")*.03+20)
				}
			};
		});
	}]
};

// 折冲
// 孙权收到攻击，攻击者会得到50mp+2%攻击者最大mp，孙权则会丢失想等量的mp；孙权每个回合都会得到100mp
buffDict["zhechong"] = [{
	onEvent:messageType.afterAttack,
	condition:{target:buffRelationType.owner},
	effect:["buff","caster","target",function(buff,caster,target){
		return [{
			fireEvent:messageType.heal,
			casterId:buff.id,
			targetId:caster.id,
			effect:{
				mp:50+.02*caster.get("maxMp")
			}
		},{
			fireEvent:messageType.attack,
			casterId:buff.id,
			targetId:buff.ownerId,
			effect:{
				mp:-(50+.02*caster.get("maxMp"))
			}
		}];
	}]
},{
	onEvent:messageType.nextRound,
	condition:{caster:buffRelationType.owner},
	effect:["buff",function(buff){
		return {
			fireEvent:messageType.heal,
			casterId:buff.id,
			targetId:buff.ownerId,
			effect:{
				mp:100
			}
		};
	}]
}];

// 巨兽
// 孙权由于庞大的巨兽体型，因此不会被击晕，减速，加速
buffDict["jushou"] = {
	onEvent:messageType.afterAttack,
	condition:{target:buffRelationType.owner},
	effect:["buff","owner",function(buff,owner){
		return {
			fireEvent:messageType.updateChess,
			casterId:buff.id,
			targetId:owner.id,
			effect:{
				stun:{$set:0},
				speed:{$set:owner.get("originSpeed")},
				power:{$set:owner.get("originPower")}
			}
		};
	}]
};

// 失控
// 当孙权的mp充满的时候，孙权会消耗自己所有的mp，对所有敌方棋子造成400%的伤害
buffDict["shikong"] = {
	onEvent:messageType.nextRound,
	condition:{caster:buffRelationType.owner},
	effect:["buff","owner","##shikong.enemies",function(buff,owner,enemies){
		if(owner.get("mp") != owner.get("maxMp")) return;

		var bags = _.map(enemies,function(ch){
			return {
				fireEvent:messageType.attack,
				casterId:buff.id,
				targetId:ch.id,
				effect:{
					hp:-4*owner.get("damage")
				}
			};
		});
		bags.push({
			fireEvent:messageType.attack,
			casterId:buff.id,
			targetId:buff.ownerId,
			effect:{
				mp:{$set:0}
			}
		});
		return bags;

	}]
};

// 孙策
// 嗜血
// 如果孙策攻击的敌军棋子是不满血的，则会造成额外50%伤害
buffDict["shixue"] = {
	onEvent:messageType.attack,
	condition:{caster:buffRelationType.owner},
	effect:["buff","bag","target",function(buff,bag,target){
		if(target.get("hp") != targe.get("maxHp")){
			return {
				fireEvent:messageType.updateBag,
				casterId:buff.id,
				targetId:bag.id,
				effect:{
					hp:bag.get("hp")*.5
				}
			};
		}
	}]
};

// 恐吓
// 如果孙策攻击的敌军棋子是不满血的，则敌军棋子会被击晕1个回合
buffDict["konghe"] = {
	onEvent:messageType.attack,
	condition:{caster:buffRelationType.owner},
	effect:["buff","owner","bag","target",function(buff,owner,bag,target){
		if(target.get("hp") != targe.get("maxHp")){
			return {
				fireEvent:messageType.updateBag,
				casterId:buff.id,
				targetId:bag.id,
				effect:{
					stun:1
				}
			};
		}
	}]
};


// 奉献
// 自己收到的伤害所丢失的hp会输送给受伤最严重的友军棋子
buffDict["fengxian"] = {
	onEvent:messageType.afterAttack,
	condition:{target:buffRelationType.owner},
	effect:["buff","bag","##fengxian.friend",function(buff,bag,friend){
		return {
			fireEvent:messageType.heal,
			casterId:buff.id,
			targetId:friend.id,
			effect:{
				hp:Math.abs(bag.get("hp"))
				// hp:bag.get("damage") // 其实是损失的hp,但是这样可以更加语义化
			}
		};
	}]
};

// 花蕾
// 1个回合之后，如果没有收到伤害，则恢复周围4格所有友军棋子30%最大hp+50%最大mp
buffDict["hualei"] = [{
	onEvent:messageType.afterAttack,
	condition:{target:buffRelationType.owner},
	effect:["buff","currRound",function(buff,currRound){
		return {
			fireEvent:messageType.updateBuffMemory,
			casterId:buff.id,
			targetId:buff.ownerId,
			effect:{
				buff:{$setMemo:{"lastAttackRound":currRound}}
			}
		};
	}]
},{
	onEvent:messageType.nextRound,
	condition:{caster:buffRelationType.owner},
	effect:["buff","##hualei.friends",function(buff,firends){
		return _.map(friends,function  (ch) {
			return {
				fireEvent:messageType.heal,
				casterId:buff.id,
				targetId:ch.id,
				effect:{
					hp:.3*ch.get("maxHp"),
					mp:.5*ch.get("maxMp")
				}
			};
		});
	}]
}];

// 幸运女神
// 小乔周围5格的棋子，在攻击时候，有35%的几率造成200%的伤害
buffDict["xinyunnvshen"] = {
	onEvent:messageType.attack,
	condition:{caster:buffRelationType.owner},
	effect:["buff","bag",function(buff,bag){
		if(Math.random()<.35){
			return {
				fireEvent:updateBag,
				casterId:buff.id,
				targetId:bag.id,
				effect:{
					hp:bag.get("hp")*2
				}
			};
		}
	}]
};

module.exports = buffDict;