module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

// 登陆
Handler.prototype.entry = function(msg, session, next) {
	var self = this;
	var userName = msg.userName,
		password = msg.password;
	self.app.rpc.user.userRemote.getMember(session,userName,function(err,msg){
		var p = msg.member;
		console.debug(JSON.stringify(p,undefined,4));
		if(p && p.password == password){
			var sessionService = self.app.get("sessionService");
			if(sessionService.getByUid(userName)){
				next(null,{code:-1,msg:'duplicate login'});
			}else{
				session.bind(userName);
				var sid = self.app.get('serverId');
				// self.app.rpc.hall.hallRemote.enterHall(session,session.uid,sid,onUserEnter.bind(self,next),null);
				session.on('closed',onUserLeave.bind(self));
				next(null,{code:0,msg:'login success'});
			}
		}else{
			next(null,{code:-1,msg:'no such user OR password not correct'});
		}
	});
};

var onUserLeave = function(session){
	var self = this;
	if(session){
		console.debug("onUserLeave");
		var sid = self.app.get('serverId');
		// self.app.rpc.hall.hallRemote.quitHall(session,session.uid,sid,null);
	}
};

var onUserEnter = function(next,err,msg){
	next(null,msg);
};
