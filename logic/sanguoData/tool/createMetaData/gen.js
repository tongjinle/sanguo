var tr = require('transliteration');
var fs = require("fs");
var _ = require("underscore");

// var cityData = require("./data/city");
// var fortData = require("./data/fort");
var chessData = require("./data/chess");
var skillData = require("./data/skill");
var buffData = require("./data/buff");
// var potionData = require("./data/potion");
// var stoneData = require("./data/stone");
// var pathData = require("./data/path");
// var subpathData = require("./data/subpath");

// var subpathPointData = require("./data/subpathPoint");

// var chessTypeData = require("./data/chessType");

// transCity();
// transFort();
transChess();
transSkill();
transBuff();
// transPotion();
// transStone();
// transPath();
// transSubpath();

// transSubpathPoint();

// transChessType();

// 棋子
function transChess() {
  var data = _.map(chessData, function(n, i) {
    return tr(n);
  });
  writeFile('chess', data);

  function tr(singleChess) {
    return {
      name: myTrans(singleChess[0]),
      cn: singleChess[0],
      // type: myTrans(singleChess[1]),
      hp: singleChess[2],
      // maxhp: singleChess[2],
      mp: singleChess[3],
      // maxmp: singleChess[3],
      power: singleChess[4],
      speed: singleChess[5],
      damage: singleChess[6],
      skills: singleChess[7] ? _.map(singleChess[7].split("|"), function(n, i) {
        return myTrans(n);
      }) : null
    }
  };
};

// 技能
function transSkill() {
  var data = _.map(skillData, function(n, i) {
    return tr(n);
  });
  writeFile('skill', data);

  function tr(singleSkill) {
    // ["冷枪", 2,  120,  敌方棋子, "2_6",  "造成150%伤害,并且击晕目标棋子1个回合"],
    var data = {
      name: myTrans(singleSkill[0]),
      cn: singleSkill[0],
      cd: singleSkill[1] || 0,
      mp: singleSkill[2] || 0,
      targetDesc: singleSkill[3],
      targetType: formatTargetType(singleSkill[3]),
      range: formatDistance(singleSkill[4]),
      desc: singleSkill[5]
    };
    // 是否是被动技能
    data.isPassive = data.cd === 0 && data.mp === 0 && data.targetType === "empty";
    return data;

    function formatDistance(distance) {
      if (distance == "null" || distance == null) {
        return null;
      }
      if (distance.indexOf("_") >= 0) {
        return distance.split("_").map(function(n) {
          return n - 0;
        });
      }
      return distance - 0;
    }
  }
};

// buff
function transBuff() {
  var data = _.map(buffData, function(n, i) {
    return tr(n);
  });
  writeFile("buff", data);

  //["无限思维" ,"永久",  "每个回合让周围1格内的友军棋子回复100MP"],
  function tr(singleBuff) {
    return {
      name: myTrans(singleBuff[0]),
      cn: singleBuff[0],
      maxCd: singleBuff[1] == "永久" ? -1 : singleBuff[1] - 0,
      // priority: singleBuff[3] === undefined ? 10 : singleBuff[3],
      desc: singleBuff[2]
    };
  }
};

// potion
function transPotion() {
  var data = _.map(potionData, function(n, i) {
    return tr(n);
  });

  // writeFile("potion",data.replace(/\"fnMark\"/g,"function(args){}"));
  writeFile("potion", data);

  //  ["康复药水", "+100 HP", 1, 200, 50],
  function tr(singlePotion) {
    var data = {
      id: myTrans(singlePotion[0]),
      name: singlePotion[0],
      desc: singlePotion[1],
      level: singlePotion[2],
      buyPrice: singlePotion[3],
      sellPrice: singlePotion[4]

    };
    var benefit = getBenefit(data.desc);
    if (benefit)
      data.benefit = benefit;
    else
      data.effect = "";

    return data;

    function getBenefit(desc) {
      var data;
      desc = desc.toLowerCase();
      if (desc.indexOf("hp") >= 0) {
        data = {
          hp: desc.replace("+", "").replace("hp", "") - 0
        };
      }
      if (desc.indexOf("mp") >= 0) {
        data = {
          mp: desc.replace("+", "").replace("mp", "") - 0
        };
      }
      if (desc.indexOf("buff") >= 0) {
        data = {
          buff: myTrans(desc.replace("+", "").replace("buff", "").replace(/\s/g, ""))
        };
      }
      return data || null;
    };

  };



};

// city
function transCity() {
  var data = _.map(cityData, function(n, i) {
    return tr(n);
  });

  writeFile("city", data);

  //  ["交趾",  "中立", 2,  "吴巨",   1200, "50_80",  80]
  function tr(singleCity) {
    var price = singleCity[5].split("_");
    var data = {
      id: myTrans(singleCity[0]),
      name: singleCity[0],
      countryId: myTrans(singleCity[1]),
      countryName: singleCity[1],
      // 城市能达到的最高等级
      maxlevel: singleCity[2],
      chessId: myTrans(singleCity[3]),
      chessName: singleCity[3],
      basicDev: singleCity[4],
      // 神秘商人当前城市的出售价格
      stockBuyPrice: price[1] - 0,
      // 神秘商人当前城市的收购价格
      stockSellPrice: price[0] - 0,
      stockCount: singleCity[6]

    };

    return data;
  };
};

// fort
function transFort() {
  var data = _.map(fortData, function(n, i) {
    return tr(n);
  });

  writeFile("fort", data);

  //  ["潼关",  "长安"]
  function tr(singleFort) {
    var data = {
      id: myTrans(singleFort[0]),
      name: singleFort[0],
      cityId: myTrans(singleFort[1]),
      cityName: singleFort[1]

    };

    return data;
  };
};



// stone
function transStone() {
  var data = _.map(stoneData, function(n, i) {
    return tr(n);
  });
  writeFile("stone", data);

  //  ["勇士红宝石", 1,  "+15 HP", 500],
  function tr(singleStone) {
    var prop = singleStone[2].split(" ");
    var propName = prop[1],
      propAmount = prop[0] - 0;
    return {
      id: myTrans(singleStone[0]) + "_" + singleStone[1],
      name: singleStone[0],
      level: singleStone[1],
      propName: propName,
      propAmount: propAmount,
      desc: singleStone[2],
      buyPrice: singleStone[3],
      sellPrice: singleStone[3] / 4

    };
  }
};


// path
function transPath() {
  var data = _.map(pathData, function(n, i) {
    return tr(n);
  });
  writeFile("path", data);

  // ["长安", "宛城", "潼关", "新丰港",  "武关"]
  function tr(singlePath) {
    var from = singlePath[0],
      to = singlePath[1],
      points = [from].concat(singlePath.slice(2)).concat([to]);
    return {
      id: [myTrans(from), myTrans(to)].join("-"),
      name: [from, to].join("-"),
      fromId: myTrans(from),
      fromName: from,
      toId: myTrans(to),
      toName: to,
      pointIds: points.map(function(n) {
        return myTrans(n);
      }),
      pointNames: points
    };
  }
};


// subpath
function transSubpath() {
  var data = _.map(subpathData, function(n, i) {
    return tr(n);
  });
  writeFile("subpath", data);

  /*
    [
      ["城市",  "长安", "null", "null"],
      ["平地",  "平地", "null", "null"],
      ["野怪",  "野怪", "2",  "20-60"],
      ["野怪",  "野怪", "3",  "50-100"],
      ["宝箱",  "宝箱", "1",  "50-100"],
      ["宝箱",  "宝箱", "2",  "150-200"],
      ["平地",  "平地", "null", "null"],
      ["泉水",  "泉水", "null", "3-8"],
      ["泉水",  "泉水", "null", "3-5"],
      ["野怪",  "野怪", "3",  "30-80"],
      ["宝箱",  "宝箱", "1",  "50-100"],
      ["野怪",  "野怪", "2",  "20-40"],
      ["平地",  "平地", "null", "null"],
      ["据点",  "潼关", "null", "null"]
    ]
  */
  function tr(singleSubpath) {
    var from = singleSubpath[0][1],
      to = singleSubpath[singleSubpath.length - 1][1],
      points = singleSubpath.slice(0);
    return {
      id: [myTrans(from), myTrans(to)].join("-"),
      name: [from, to].join("-"),
      fromId: myTrans(from),
      fromName: from,
      toId: myTrans(to),
      toName: to,
      boxes: points.map(formatBox),
    };

    function formatBox(singleBox) {
      var interval = singleBox[3];
      return {
        type: formatBoxType(singleBox[0]),
        id: myTrans(singleBox[1]),
        name: singleBox[1],
        level: singleBox[2] - 0,
        interval: interval == null || interval == "null" ? null : interval.indexOf("-") >= 0 ? interval.split("-").map(function(n) {
          return n - 0;
        }) : interval - 0
      };
    }

  }
};


// subpathPoint
function transSubpathPoint() {
  var data = _.map(subpathPointData, function(n, i) {
    return tr(n);
  });
  writeFile("subpathPoint", data);

  /*
  points:...
  subpoints:...
  */
  function tr(singleSubpathPoint) {
    var from = singleSubpathPoint.from,
      to = singleSubpathPoint.to,
      points = singleSubpathPoint.points,
      subpoints = singleSubpathPoint.subpoints;

    return {
      id: [myTrans(from), myTrans(to)].join("-"),
      name: [from, to].join("-"),
      fromId: myTrans(from),
      fromName: from,
      toId: myTrans(to),
      toName: to,
      points: points,
      subpoints: subpoints
    };
  }
};


// 
function transChessType() {
  var data = {};
  _.each(chessTypeData, function(n) {
    data[myTrans(n)] = n;
  });
  writeFile("chessType", data);
};

/////////////////////////////////////////////////////////////////////////////////////////
//                              HELP                                            
/////////////////////////////////////////////////////////////////////////////////////////

function myTrans(hanzi) {
  return tr(hanzi).toLowerCase().replace(/\s/g, "");
};


function formatTargetType(targetType) {
  // SkillTarget: {
  //   ENEMY: "enemy",
  //   ENEMIES: "enemies",
  //   FRIEND: "friend",
  //   FRIENDS: "friends",
  //   EMPTY: "empty"
  // }
  var dict = {
    "敌方棋子": "enemy",
    "友军棋子": "friend",
    "友军棋子B": "friendExceptMe",
    "所有棋子": "all",
    "null": "empty",
    "格子": "square"
  };
  return dict[targetType] === undefined ? "not exist" : dict[targetType];
};

function formatBoxType(boxType) {
  var dict = {
    "城市": "city",
    "据点": "fort",
    "平地": "normal",
    "野怪": "monster",
    "宝箱": "chest",
    "野外boss": "boss",
    "十字路口": "cross",
    "古墓": "tomb",
    "泉水": "well",
    "副本": "dungeon",
    "黑市": "blackmarket"
  };

  return dict[boxType] || null;
}


function arr2obj(arr) {
  var obj = {};
  _.each(arr, function(n, i) {
    obj[n.id] = _.clone(n);
  });
  return obj;
};

function writeFile(name, data) {
  var nameDict = {
    "mine": "../../dict/FILENAME.json"
    // ,
    // "server": "../../MonsterSanguo/game-server/app/dict/json/FILENAME.json",
    // "client": "../../miniDemo/src/common/json/FILENAME.js"
  };

  _.each(nameDict, function(v, k) {
    if (k == "client") {
      fs.writeFileSync(v.replace("FILENAME", name), "sanguo.prop." + name + " =" + JSON.stringify(data, undefined, "\t")+";");
    } else {
      fs.writeFileSync(v.replace("FILENAME", name), JSON.stringify(data, undefined, "\t"));
    }
  });
};