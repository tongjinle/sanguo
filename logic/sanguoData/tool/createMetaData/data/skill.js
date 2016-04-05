var jineng = [
	["冷枪", 2, 120, "敌方棋子", "2_5", "造成150%伤害,并且击晕目标棋子1个回合"],
	["碾压火球", 4, 200, "敌方棋子", "4_8", "造成100%伤害+目标的当前血量30%"],
	["无限思维光环", null, null, "null", "null", "每个回合让周围1格内的友军棋子回复100MP"],
	["火焰新星", 4, 600, "null", "null", "让周围3格内的所有敌军棋子受到100伤害+300%伤害"],
	["恐吓", 3, 120, "格子", "1", "徐晃左前方，正前方，右前方三个格子内，所有敌方棋子都被击晕一个回合，并且造成75点伤害+5%目标最大hp"],
	["锤击", 1, 50, "敌方棋子", "1", "造成100%伤害+击晕2个回合"],
	["万夫莫敌", 5, 0, "敌方棋子", "1_8", "冲锋强化版，向目标发起冲锋，击晕目标2个回合，并且把目标击退到棋盘边界，造成200%伤害，徐晃自己回复所有mp"],
	["冬眠", 10, 10, "null", "null", "进入冬眠的无敌状态，徐晃不能移动和施放技能，徐晃每个回合回复20%的最大生命值，一旦hp回满，则徐晃解除冬眠状态"],
	["汲取", 1, 0, "敌方棋子", "1_3", "如果目标棋子的mp高于目标棋子的50%，则造成50+目标棋子最大hp的2%；否则，则造成100伤害，并且偷去对方5%的mp"],
	["春风", 2, 150, "友军棋子", "1_3", "回春强化版，给予目标一个“春风”buff"],
	["生命护符", 4, 200, "友军棋子B", "1_4", "给予目标一个“生命护符”的buff"],
	["共生光环", null, null, "null", "null", "周围3格内任何友军棋子收到伤害，由这周围三格内所有友军棋子均摊"],
	["大地碎裂", 3, 150, "格子", "1", "锤击大地，击飞许褚跟格子一条线上3格的所有敌军。敌军棋子被随机推向左右两侧，并且受到150%伤害；如果敌军棋子没有被推开，则受到300%伤害"],
	["大木锤", 1, 50, "敌军棋子", "1", "造成100%伤害，有20%可能，造成400%伤害"],
	["痛感麻木", null, null, "null", "null", "如果许褚血量高于90%，则减少75%的伤害"],
	["胖子", null, null, "null", "null", "许褚每个回合回复5%的血量"],
	["流血", 1, 50, "敌方棋子", "1", "造成100%伤害，并且给予目标一个“流血”buff"],
	["中风", null, null, "null", "null", "被攻击的目标棋子的hp如果低于最大hp的15%，则会被会击晕3个回合"],
	["伤口撕裂", null, null, "null", "null", "被攻击的目标棋子，附加其已经损失的hp的20%"],
	["传染", null, null, "null", "null", "被攻击的目标棋子，如果有目标棋子的友军棋子与目标棋子相连，则被传染“流血”buff"],
	["冰霜新星", 2, 150, "自己", "null", "将以自己为中心的一格内所有敌方棋子冻结2个回合（给予目标一个“冻结”buff）"],
	["暴风雪", 4, 200, "格子", "1_3", "对以目标格子为中心2格子内所有敌方棋子造成100%的伤害，并且给予“迟缓”buff"],
	["冻结", 1, 50, "敌方棋子", "1_3", "造成225%的伤害，冻结2个回合（给予目标一个“冻结”buff），但是有80%的可能回复目标棋子20%的mp"],
	["零度", null, null, "null", "null", "所有敌方棋子每个回合都会损失8%的hp，但是却会回复5%的mp"],
	["龙甲", null, null, "null", "null", "刘备一旦遭遇攻击,对周围一个格子内的所有敌方棋子造成50点伤害"],
	["绝对治愈", 5, 150, "友军棋子B", "1_3", "治愈己方棋子,使之回复到最大hp(刘备不能治愈自己)"],
	["清醒", 3, 100, "友军棋子", "1_2", "重置己方棋子的所有技能cd(刘备不能自我施法)"],
	["辉耀光环", null, null, "null", "null", "刘备2格内敌方棋子每个回合收到75+7%敌方棋子自身最大血量的伤害"],
	["点燃", 1, 100, "敌方棋子", "1_5", "造成100%伤害，并且给予目标一个“点燃”buff"],
	["焦痕", null, null, "null", "null", "攻击诸葛亮的敌方棋子，都会得到一个“焦痕”buff"],
	["火焰守卫", null, null, "null", "null",	"如果周围有敌方棋子回复hp，则诸葛亮会自动发射火球攻击目标一次，造成65%的伤害；"],
	["垂死挣扎", 5, 300, "敌方棋子", "1_2", "给予目标一个“垂死挣扎”的buff"],
	["爪击", 1, 40, "敌方棋子", "1", "造成100%伤害，有50%可能，可以额外造成75%伤害"],
	["远行之力", 1, 80, "null", "null", "周围2格内所有友军棋子得到“远行之力”buff"],
	["愤怒", null, null, "null", "null", "当然有一个友军棋子死亡的时候，魏延speed+10"],
	["二次出击", null, null, "null", "null", "魏延击杀一个地方棋子的时候，魏延得到一次额外的行动机会"],
	["喷水", 1, 60, "null", "null", "对全体敌方棋子造成65%的伤害，并且给予全体敌方棋子“泥泞”buff"],
	["劳累", null, null, "null", "null", "当孟获将mp耗尽，孟获得到“劳累”buff"],
	["鼓励光环", null, null, "null", "null", "孟获周围2格的友军棋子会额外获得孟获15%的攻击力"],
	["关怀光环", null, null, "null", "null", "孟获周围2格的友军棋子收到伤害，则孟获会帮该友军棋子承担50%的伤害"],
	["突进", 1, 50, "敌方棋子", "1_4", "无视地形阻碍，闪烁到目标面前，造成（80%*格子数）伤害"],
	["协助", null, null, "null", "null", "如果友军棋子攻击敌方棋子，而赵云贴着敌方棋子，则赵云会协助攻击，对敌方棋子造成100%伤害"],
	["秒杀", null, null, "null", "null", "如果敌方棋子如果血量低于25%最大hp，则在被赵云攻击的时候，会被赵云秒杀"],
	["百战余生", null, null, "null", "null", "赵云如果收到一次可以导致赵云死亡的攻击，那么赵云会闪避开这次攻击，但是在接下来4个回合内，赵云无法再次闪避"],
	["战争践踏", 3, 80, "null", "null", "击晕周围一格内所有敌军棋子一个回合"],
	["怒击", 1, 50, "敌方棋子", "1", "造成75%伤害+目标的当前血量10%,并且击退目标5个格子"],
	["板甲", null, null, "null", "null", "减少50%的所有伤害"],
	["终极火炮", 5, 200, "敌方棋子", "1_8", "300%伤害+击晕2个回合"],
	["啃萝卜", null, null, "null", "null", "如果糜竺在上一个回合没有被攻击，则会安心的啃食萝卜，从而恢复10%的最大hp和25%的最大mp；"],
	["求饶", null, null, "null", "null", "在遇到攻击的时候，糜竺有15%的可能用自己的100点mp来贿赂攻击者，从而躲过这次攻击"],
	["输送", 1, 100, "友军棋子", "1", "糜竺以50%的折扣来损失自己的hp和mp，将目标的hp和mp补满"],
	["最后的牺牲", null, null, "null", "null", "糜竺战死之后，糜竺会补满战场上所有友军棋子的hp和mp，并且给予“为兔子复仇”buff"],
	["无惧", 1, 50, "敌方棋子", "1", "造成100%伤害+60%目标伤害"],
	["视死如生", null, null, "null", "null", "每损失5%最大hp，则增加5%伤害"],
	["长驱", null, null, "null", "null", "增加关羽的power，第一个回合+3，第二个回合+2，第三个回合+1，如此循环"],
	["军神", null, null, "null", "null", "70%的几率造成2.5倍伤害"],
	["注射", 1, 50, "敌方棋子", "1", "注射病毒，造成100%伤害，并且给予目标一个“病毒”buff，每次注射都会让病毒升级"],
	["破伤风", null, null, "null", "null", "1级病毒的时候，目标会得到一个“破伤风”buff"],
	["麻醉剂", null, null, "null", "null", "2级病毒的时候，目标会得到一个“麻痹”buff"],
	["药师资格证", 4, 100, "null", "null", "使得战场上所有病毒发作，病毒携带者会受到250%伤害，并且被击晕1个回合，但是过后会“痊愈”（移除“病毒”，“破伤风”，“麻痹”）"],
	["步步为营", null, null, "null", "null", "太史慈每行走一个格子，就加10%的伤害减免，最高为90%；一旦遭受一次攻击，则伤害减免消失"],
	["拖拽", 1, 80, "敌军棋子", "1", "将目标反方向拖拽2个格子，造成100%的伤害，并且击晕1个回合。（太史慈自然也后退2个格子）"],
	["寒冷光环", null, null, "null", "null", "太史慈周围2格内所有敌军power_1，但是每个回合回复20mp"],
	["大雪球", 4, 200, "敌军棋子", "1_3", "太史慈向目标投掷一个大雪球，造成150%伤害；如果目标直线3格内有敌方棋子，则雪球弹射攻击该目标；弹射次数最多为3次，一个目标最多被攻击一次，伤害依次增加，分别为150%，250%，350%"],
	["摄取光环", null, null, "null", "null", "摄取孙权周围3格之内所有敌方棋子3%最大mp+20mp"],
	["折冲", null, null, "null", "null", "孙权收到攻击，攻击者会得到50mp+2%攻击者最大mp，孙权则会丢失想等量的mp；孙权每个回合都会得到100mp"],
	["巨兽", null, null, "null", "null", "孙权由于庞大的巨兽体型，因此不会被击晕，减速，加速"],
	["失控", null, null, "null", "null", "当孙权的mp匆忙的时候，孙权会消耗自己所有的mp，对所有敌方棋子造成400%的伤害"],
	["撕咬", 1, 80, "敌军棋子", "1", "造成100%伤害，孙策回复50%的伤害的hp，周围2格内的友军棋子平分剩下50%伤害所带来的hp恢复"],
	["嗜血", null, null, "null", "null", "如果孙策攻击的敌军棋子是不满血的，则会造成额外50%伤害"],
	["恐吓", null, null, "null", "null", "如果孙策攻击的敌军棋子是不满血的，则敌军棋子会被击晕1个回合"],
	["海神", 1, 175, "敌军棋子", "1", "造成350%伤害（孙策hp低于10%的时候才可以使用）"],
	["生命燃烧", 1, 75, "所有棋子", "1_3", "消耗目标200hp+5%最大hp，但是能恢复目标8%最大mp"],
	["灿烂光环", null, null, "null", "null", "周围1格内所有友军棋子恢复50hp+10%最大hp"],
	["奉献", null, null, "null", "null", "自己收到的伤害所丢失的hp会输送给受伤最严重的友军棋子"],
	["花蕾", 4, 300, "自己", "null", "自己得到一个“花蕾”buff"],
	["幸运女神光环", null, null, "null", "null", "小乔周围5格的棋子，在攻击时候，有35%的几率造成200%的伤害"],
	["互助光环", null, null, "null", "null", "当小乔被治疗的时候，她周围5格的所有友军棋子都会收到同样的治疗"],
	["迷茫", 1, 100, "敌军棋子", "1_3", "造成100%伤害，有15%的可能消耗目标所有技能的CD"],
	["重生", null, null, "null", "null", "小乔有一次机会在被击杀后，满血满蓝复活"],
	["扫射", 1, 80, "敌军棋子", "1_2", "甘宁对正前方2排3个格子的所有敌方棋子造成80%的伤害"],
	["狙击", 2, 200, "敌军棋子", "3_8", "甘宁进行远举例狙击，造成225%伤害"],
	["弹药补充", 2, null, "null", "null", "补充甘宁25%最大mp，但是甘宁将在下个回合收到攻击时候，伤害加倍"],
	["核子弹", 4, 400, "null", "null", "甘宁引爆核子弹，使得周围5格内所有棋子（不论敌我）造成1500点伤害+200%伤害。（甘宁会战死）"],
	["强行", 2, 100, "敌方棋子", "1", "造成100%伤害，但是如果目标的mp小于100，则造成175%伤害，并且击晕目标"],
	["刺破", 1, 50, "敌方棋子", "1", "造成75点伤害，并且给予敌方一个'刺破'debuff"],
	["遁地", 6, 100, "格子", "null", "下一步可以随意出现在周围5格内的任意一个格子"],
	["反刺", null, null, "null", "null", "反弹收到的伤害的35%，反弹的伤害最大不会超过150"],
	["骚扰", 1, 75, "敌方棋子", "1", "造成100%伤害，吸取对方20MP+20%敌方棋子当前MP"],
	["吞噬光环", null, null, "null", "null", "孟达2格内敌方棋子每个回合流失10mp+5%当前mp，最大不超过80mp"],
	["法力护盾", null, null, "null", "null", "收到伤害的时候，消耗自己2点mp来抵抗1点伤害"],
	["谨慎", null, null, "null", "null", "收到的最大伤害，不会超过300点"],
	["震地者", 3, 100, "null", "null", "对周围1格的棋子造成100%伤害，都击退2格，并且击晕1个回合"],
	["炽热皮肤", null, null, "null", "null", "攻击董卓的敌人会受到20%的反弹伤害，但是会得到“炽热”buff"],
	["屠戮", 1, 50, "敌方棋子", "1", "对目标造成100%伤害；额外再造成250%的伤害，伤害由董卓周围1格的敌方棋子平均分担"],
	["恶魔", 4, 300, "友方棋子B", "1", "杀死一个友军棋子，回复30%最大hp+30%最大mp，同时得到一个“恶魔”buff"],
	["痛击", 1, 50, "敌方棋子", "1", "造成100%伤害，击退1格；如果马超在本轮走过3个格子，则额外造成50%伤害"],
	["讨伐", null, null, "null", "null", "被马超攻击的目标，如果周围2格没有友军，有15%的可能被秒杀"],
	["恐怖嚎叫", null, null, "null", "null", "马超消灭一个敌方棋子，就会发动一次恐怖嚎叫，会给予敌方全体棋子一个“恐怖嚎叫”buff"],
	["狂暴", null, null, "null", "null", "如果马超的hp掉到5%，damage*250%"],
	["蛇击", null, null, "null", "null", "吕布在收到攻击时，抢在对方出手前攻击对方，造成100%伤害"],
	["践破", 1, 80, "敌方棋子", "1_3", "如果目标敌方棋子背后有敌方棋子，则前方敌方棋子收到75%伤害，后方棋子受到125%伤害；如果没有，则前方棋子收到300%伤害，且被击晕2个回合"],
	["赤兔光环", null, null, "null", "null", "吕布周围1格所有棋子power+2"],
	["魔王降临", 4, 200, "null", "null", "所有敌方棋子都得到一个“魔王降临”的buff"],
	["丛林战士", 5, 300, "格子", "1_3", "召唤一个'丛林战士'棋子来为我方作战"],
	["荆棘", 1, 50, "友军棋子B", "1_5", "赋予目标一个'荆棘'buff"],
	["缠绕诅咒", 2, 100, "null", "null", "给予全体敌军棋子'缠绕诅咒'buff"],
	["宁静", 5, 250, "null", "null", "给予自己一个'宁静'buff"],
	["小心翼翼", 3, 100, "自己", "null", "给予自己一个“小心翼翼”buff"],
	["冲撞", 1, 50, "敌方棋子", "1_2", "对目标造成100%伤害，且有80%概率击晕对方1个回合"],
	["妖术", 3, 150, "敌方棋子", "1_2", "目标变成一只羊，不能使用技能，power降低为1，持续3个回合"],
	["巫毒", null, null, "null", "null", "一旦自己或则友军棋子消灭一个目标，木鹿大王的最大生命值会+20%"],
	["怜悯", null, null, "null", "null", "一旦吴巨收到伤害，则友军棋子的damage+5%，最高为60%"],
	["混乱药水", 1, 80, "友军棋子B", "1_3", "对没有药水cd友军棋子喂药水，可能是康复药水，法力药水，迅捷药水，猛烈药水的一种"],
	["预备", 1, 50, "敌方棋子", "1", "造成100%伤害，如果目标在行动前被吴巨方任意棋子攻击到，则会额外追加2个回合晕眩"],
	["最后的遗言", null, null, "null", "null", "击杀吴巨的敌方棋子，会获得“免疫破坏”的buff"],
	["蓄势待发", 3, 80, "null", "null", "得到“蓄势”buff																																																																																																																																																																																																																																																										"],
	["突破", 1, 40, "敌军棋子", "1", "对目标造成100%伤害；如果目标后一格可以行走，则曹彰冲过敌军，来到目标后一个，并且击晕目标1个回合																																																																																																																																																																																																																																																										"],
	["追击", null, null, "null", "null", "如果目标是曹彰上一轮攻击的敌军棋子，则造成150%伤害																																																																																																																																																																																																																																																										"],
	["昂扬", null, null, "null", "null", "消灭某个敌方棋子后，回复80%最大hp+50%最大mp																																																																																																																																																																																																																																																										"],
	["电击", 1, 20, "友军棋子B", "1_3", "对友军棋子进行电击，有可能恢复其30%的最大mp，有可能回复其20%最大hp，有可能给予其一个“远行”buff，最坏可能是扣去目标10%的最大hp，并且击晕目标一个回合																																																																																																																																																																																																																																																										"],
	["工程土方", 2, 120, "格子", "1", "建立一个hp为200的工程土方，作用同地形元素“石墙”																																																																																																																																																																																																																																																										"],
	["失控导弹", null, null, "null", "null", "每次轮到李典行动的时候，李典都会释放一个失控的导弹，随机攻击一个敌方棋子，造成150%伤害																																																																																																																																																																																																																																																										"],
	["孤军奋战", null, null, "null", "null", "周围一格内没有友军的时候，乐进的speed+30																																																																																																																																																																																																																																																										"],
	["最后一击", null, null, "null", "null", "乐进收到的攻击，如果会导致乐进死亡，那么乐进在临死前会对攻击者发动一次250%的攻击（如果乐进可以在这次攻击中消灭攻击者，则乐进可以躲过死亡）																																																																																																																																																																																																																																																										"],
	["巨人杀手", null, null, "null", "null", "如果目标的当前hp超过乐进2倍，则乐进的damage*200%																																																																																																																																																																																																																																																										"],
	["无耻", 2, 0, "null", "null", "抽取周围3格所有友军棋子当前mp的10%来补充自己																																																																																																																																																																																																																																																										"],
	["疯狂祝福", 1, 60, "所有棋子", "null", "给予目标一个“疯狂”的buff																																																																																																																																																																																																																																																										"],
	["木马", 4, 150, "所有棋子", "null", "将目标的mp补满,但是扣去目标50%的最大hp(扣去之后,目标的hp不会因此而低于20%最大hp)																																																																																																																																																																																																																																																										"],
	["缠绕攻击", 2, 50, "null", "null", "对目标造成120%伤害,并且给予目标一个“缠绕”的buff,如果邓艾移动了,那么目标的'缠绕'buff立刻消失																																																																																																																																																																																																																																																										"],
	["生长激素", null, null, "null", "null", "受到的治疗效果+45%																																																																																																																																																																																																																																																										"],
	["树皮术", null, null, "null", "null", "受到的攻击_20%																																																																																																																																																																																																																																																										"],
	["燎原", null, null, "null", "null", "钟会攻击带有“火种”buff的敌军棋子，钟会可以恢复5%最大mp+10mp；同时该敌军棋子会把“火种”传染给他相邻的敌军棋子																																																																																																																																																																																																																																																										"],
	["虚张声势", null, null, "null", "null", "如果周围一格的友军棋子多于敌军棋子，则damage+50%																																																																																																																																																																																																																																																										"],
	["机灵", null, null, "null", "null", "攻击钟会的敌军棋子，有30%的概率被钟会躲开，并且会被给予“火种”buff																																																																																																																																																																																																																																																										"],
	["置换", 3, 50, "友军棋子", "1", "消耗目标20%的最大mp，换成12%的最大hp（目标的mp低于20%最大mp，也可以）																																																																																																																																																																																																																																																										"],
	["后勤设备", 3, 100, "格子", "1", "制造一个“后勤设备”，后勤设备会在周围一格的棋子的回合，为棋子恢复5%最大hp+5%最大mp；“后勤设备”hp为1																																																																																																																																																																																																																																																										"],
	["推进器", null, null, "null", "null", "给予自己一个“推进器”buff																																																																																																																																																																																																																																																										"],
	["消魔", 1, 20, "敌军棋子", "1", "造成100%伤害，消去目标10mp+2%最大mp																																																																																																																																																																																																																																																										"],
	["弱点针对", null, null, "null", "null", "如果被攻击的棋子mp过低，已经小于35%最大mp，则曹真攻击它的时候，可以击晕他一个回合																																																																																																																																																																																																																																																										"],
	["恩怨", null, null, "null", "null", "攻击过曹真的敌方棋子，在第一次以后的攻击中，会对曹真造成额外10%的伤害；而曹真会对他们造成额外20%的伤害																																																																																																																																																																																																																																																										"],
	["战神", null, null, "null", "null", "每个回合获得10点MP,并且在对敌方棋子造成伤害后,获得10%伤害的MP(即'战神'buff)"],
	["冲锋", 3, 0, "棋子", "2_5", "向2_5格内的地方棋子冲锋,并且击退敌方1个格子,击晕其1个回合,产生10点MP"],
	["鲁莽", 5, 20, null, null, "施放后,自己得到持续4个回合的'鲁莽'的buff(暴击概率提升到100%,speed+20%)"],
	["致死打击", 5, 40, "棋子", "1", "对目标造成一次350%的严重打击,并且令目标得到一个'致死'的buff(治疗效果_50%)"],
	["会心一击", null, null, "null", "null", "当对同一个目标攻击第三次的时候,造成500%的伤害.并且击晕目标1个回合"],
	["蓄力攻击", 1, 0, "1", "造成50%伤害,恢复自身10MP"],
	["振奋光环", null, null, "null", "null", "周围2格内所有友军棋子+10 SPEED"],
	["横扫千军", 5, 100, "棋子", "1", "对目标棋子造成250%伤害,且晕眩1个回合;敌方任意棋子和目标棋子相连,也会受到250%伤害"],
	["回复光环", null, null, "null", "null", "治疗周围2格友军棋子80HP"],
	["回春", 2, 100, "友方棋子", "1_3", "赋予目标棋子一个'回春'BUFF,以治疗目标棋子"],
	["汹涌", 4, 0, "自己", "null", "恢复自己所有法力值"],
	["补给", 5, 0, "友方棋子", "1_2", "交换自己和目标棋子的法力值(不会超越最大值)"],
	["闪电箭", 4, 100, "敌方棋子", "1_3", "造成175%的伤害，但是被攻击者会得到一个“迅捷”的buff"],
	["穿刺", 1, 50, "敌方棋子", "1_4", "造成75%的伤害，被攻击者得到一个“穿刺”的debuff"],
	["闪烁", 3, 50, "格子", "1_4", "无视地形障碍（可以直线穿越石墙和水域），闪烁到目标地点（目标地点需要是可以行走的）"],
	["越战越勇", null, null, "null", "null", "对敌人造成一次伤害，则在本场战斗提升12%的基础伤害，每次提升最高不能高过40点基础伤害，最多能提升5次"],
	//
	["一般攻击",	0	,0,	"敌方棋子",	"1",	"造成100%伤害"]

];

module.exports = jineng;