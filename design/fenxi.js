曹操的"火球"技能思路演变历程

"火球"技能解释:
对目标造成100%基础伤害+目标的当前血量的30%

1 传统的写法,也就是不考虑buff的情况
var skill = function(caster,target){
	var damage = caster.attack + target.hp * .3;
	target.hp -= damage;
};

** 
不考虑buff的情况,伤害也就成了"纯粹"伤害
所以可以在棋子的技能内部完成整个逻辑运算
(这里还没有考虑target的"死亡"情况)

2 tuple方式来处理传统写法
var skill = ["caster","target",function(caster,target){
	var damage = caster.attack + target.hp * .3;
	target.hp -= damage;
}];

tuple需要一个"注入器"reader和"执行器"commander来完成函数执行
"注入器"在当前的环境下,读起当前字符串所表示的值
"执行器"函数一般如下
function commander(reader,tuple){
	var params = _.map(tuple.slice(0,-1),function(str){return reader(str);});
	var fn = tuple[tuple.length-1];
	fn.apply(null,params);
};


** tuple的意义在于可以自由的选择注入的参数
所以上面的方法也可以改写成
var skill =["casterAttack","targetHp","target",function(attack,hp,target){
	target.hp -= (attack+hp*.3);
}];

3 交由中介者来处理逻辑运算()
传统处理方法中的代码,"target.hp-=damage;"是非常武断的
比如被攻击的目标有个减免50%,那么在这里将没有机会去"减免"了

所以skill中的代码,设计成"我期望做成什么",而不是"我要做成什么"
"我期望做成什么"可以生成一个"包",这个"包"被传递给中介者,中介者会遍历caster和target的buff,来进行及时的修改

var skill = ["caster","target",function(caster,target){
	return {
		event:messageType.attack,
		casterId:caster.id,
		targetId:target.id,
		skillName:"s1",
		info:{
			target:{
				damage:50
			}
		}
	};
}];

4 buff的处理
有2个buff
一个buff是"+30%攻击力"
另一个buff是"攻击的时候有50%可能+30%攻击力"
作为前者,我们在处理的时候,可以直接在棋子获得buff的时候,即"messageType.addBuff"的时候,直接在棋子的"攻击力"属性上加30%
而在"messageType.removeBuff"的时候,直接在棋子的"攻击力"属性上移除30%

而作为后者,显然是不能直接加在攻击力属性上
如果这个百分比是"倍击"(200%攻击),还简单一些,我们可以建立了一个"倍击"属性,而现在的更加负责

为了统一,我们把这些buff都做成触发器
上述两个buff都去监听"messageType.beforeAttack",从而在计算伤害之前就修改了caster的攻击力

5 buff的优先级
一个buff是"+20点攻击力",记作A
另一个buff是"+50%攻击力",记作B
它们对攻击力的加成应该是怎么计算的?
假设棋子的基础攻击力是100,
如果buff的加成顺序是"AB",则加成之后的攻击力为(100+20)*(1+50%)=180
如果buff的加成顺序是"BA",则加成之后的攻击力为(100)*(1+50%)+20=170
所以这里有2个处理方法:
1 buff触发顺序由buff添加的顺序决定
2 明确buff的优先级级
建议采取这个方式,理由让我们考虑在游戏<<英雄无敌4>>中一个很特殊的buff"先攻"
"先攻"的意思A对B进行攻击,但是B有"先攻"buff,那么B会在A攻击之前抢先攻击
这样就会导致一个结果,就是有可能A在攻击B之前,就被B干掉了;或则A在攻击B之前,就被B干掉了,
这些结果都会让A的攻击失去意义
所以buff应该有明确的优先级,而在这里"先攻"显然有着非常高的优先级

6 buff的合并和冲突
第一个例子
一个buff是"+20点攻击力",记作A
另一个buff是"+40点攻击力",记作B
对此有2种处理方法:第一种是累加,第二种是同类型buff相排斥,取效果最佳的buff
第一种处理可以让2个buff都去监听"messageType.beforeAttack"来完成,棋子最后会获得(20+40)点攻击力
第二种处理,需要这些buff给出一个用以比较的key,从而计算出最佳buff,所以这样的方式,棋子最后会获得40点攻击力
第一种处理方式,显然需要我们把遍历的buff的数据结构设计成树状结构
如图(纵向为buff优先级)
|--D
|--[A,B]
|--C
可以看到AB是处于一个优先级的,首先要对AB进行运算,得到一个"+60点攻击力"的虚拟buff,然后再来进行纵向遍历

第二个例子,来源于<<英雄无敌4>>的傀儡龙和蛇妖
傀儡龙有2个buff,分别是"先攻"和"否定先攻"(意思是否定目标的"先攻"能力),记作A和B
蛇妖有个buff,是"先攻",记作C
蛇妖攻击傀儡龙的运算流程如下:
|--B
|--[A,C]
然后遍历的时候,傀儡龙的"否定先攻"B优先运算,移除了蛇妖的"先攻"C
所以成为了
|--A
从而让A优先触发了一个由傀儡龙发起的攻击

第三个例子,来源于<<WAR3>>的暴击运算
WAR3中的单位如果有多个暴击buff,运算原则是当有一个暴击buff起作用的时候,则忽略其余的buff
所以这里也涉及到一个buff之间相互作用的运算

7 buff的记忆
第一个例子,来源于<<DOTA>>的熊战士
熊战士的"怒意狂击"技能会使得每次攻击造成的伤害叠加,但是如果攻击间隔过长,或者切换攻击目标,则伤害叠加又会被清零,记作"s1"
这里的问题,在于当第N次攻击的时候,buff如何计算出正确的伤害叠加?
所以这里涉及到buff的记忆的问题,buff需要一个静态量来保存这个信息
一个简单的做法如下:
memo(buffId).get("s1Count"),来获取熊战士攻击了几次
memo(buffId).get("s1LastTimeStamp"),最后一次攻击的时间戳
memo(buffId).get("s1TargetId"),最后一次攻击的目标id
通过以上3个"记忆"则可以完成该buff

第二个例子,来源于<<英雄无敌6>>的天使
天使有个"惩戒"buff,在攻击所有攻击过天使友军的敌军时,会额外造成20%的伤害,记作s1
天使如何记忆?
其实相对简单
memo(buffId).get("s1PunishIdList"),记录所有攻击过友军的敌军的id


8 before doing 和 after
一个动作的发生,必然发生before和after
比如发生了一个attack事件
那么一定会依次发生beforeAttack attack 和 afterAttack事件
