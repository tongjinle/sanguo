/*
	这里描述游戏代码逻辑的设计思路
	create by:tongjinle
	date: 2015-9-30
*/

思路流程
1 元数据和实例
	1.1 chess
		chess"元数据"结构
		{
			name:String,
			hp:Number,
			range:Number,
			moveEnery:Number,
			skillNameList:[String]
		}

		chess"实例"结构
		{
			id:Number,// 唯一标识
			name:String,
			position:{x:Number,y:Number}, // chess在棋盘上的坐标
			hp:Number,
			maxhp:Number,
			range:Tuple,
			moveEnery:Number,
			isMoved:Boolean, // 是否棋子已经移动过了
			isCasted:Boolean, // 是否棋子已经使用过技能了
			isRoundOver:Booleanm // 是否棋子的回合结束
			buffIdList:[Number], // buffId列表
			skillIdList:[Number], // skillId列表
		}


	1.2 buff
		buff"元数据"结构
		{
			name:String,
			roundCount:Number, // buff持续回合数量
			triggerList:[
				{
					event:String,
					condi:Tuple, // 触发条件
					effect:Tuple // buff效果
				}
			] // 触发器数组
		}

		buff"实例"结构
		{
			id:Number,
			name:String,
			casterId:Number, // buff创建者编号
			targetId:Number, // buff宿主编号
			roundIndex:Number,
			roundCount:Number,
			triggerList:[
				{
					event:String,
					condi:Tuple,
					effect:Tuple
				}
			]

		}

	1.3 skill
		skill"元数据"结构
		{
			name:String,
			type:String,
			energy:Number,
			castRange:Tuple,
			cast:Tuple
		}

		skill"实例"结构
		{
			id:Number,
			name:String,
			type:String,
			energy:Number,
			castRange:Tuple,
			cast:Tuple
		}

2 基本模块
	2.1 中介者,负责消息的传递,记作m
		2.1.1 接受来自chess的动作信息
			格式:
			例1: 棋子A对B施放了技能s1
			{
				casterId: aid,
				targetId:bid,
				type:messageType.cast
				skillName:"s1"
			}

			例2: 棋子A向坐标为posi的格子移动
			{
				casterId:aid,
				targetPosi:posi,
				type:messageType:move
			}
		2.1.2 转发来自"仲裁者"的信息
			格式:
			例1: 棋子A对B施放了技能s1,s1对目标造成100点伤害
			{
				casterId:aid,
				targetId:bid,
				type:messageType.cast,
				skillName:"s1",
				update:{
					hp:-100
				}
			}

	2.2 仲裁者,负责逻辑计算,记作j
		2.2.1 基本计算流程
			接受来自"中介者"的信息,计算出需要参与到本次计算的棋子
			棋子来源于2个部分
			一个是信息通过"仲裁者"计算出来的所有涉及到的棋子
			另一个是这些棋子的buff二次产生了新的"信息",传递给中介者,这是一个递归过程
			所以我们在这里只要考虑前一个

			当"中介者"向"仲裁者"发送信息的时候
			"仲裁者"通过这个信息,生成一个package,这个package中有一个属性叫event,以此来广播给所有监听了这个event的buff
			所有监听

		2.2.2 一切buff都是触发器

	