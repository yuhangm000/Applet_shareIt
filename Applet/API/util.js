var https = require('https');
var db = require('../DAO/Connection');
var WXBizDataCrypt = require('./WXBizDataCrypt')

//insert information into table user
function insert(req, res, open_id){
	params = req.body;
    var sql = 'insert into user(id,name,head) values(?,?,?)';
    var attrs = [open_id, params.user_name, params.avatarUrl];
    db.queryArgs(sql, attrs, function(err, result) {
        db.doReturn(res, 200, {'open_id':open_id});
    });
}

//query: Does this openID exist?
function query(req, res, data){
    var open_id = data.openid;
    if(!open_id)
        db.doReturn(res, 'get openID error');
    else{
        //decode
        var sessionKey = data.session_key;
        var iv = req.body.iv;
        var encryptedData = req.body.encryptedData;
        var pc = new WXBizDataCrypt('wxca45b4d74f06ecb0', sessionKey)
        var data = pc.decryptData(encryptedData , iv);
        open_id = data.openId;

        var sql = 'select id from user where id=?';
        db.queryArgs(sql, open_id, function(err, result) {
            if(result.length){
            	//has been created
                db.doReturn(res, 'this user has assigned', {'open_id': open_id});
            }
            else{
                insert(req, res, open_id);
            }
        });
    }
}

//utils
function get_openID(req, res){
    var code = req.body.js_code;
	var url = "https://api.weixin.qq.com/sns/jscode2session?appid=wxca45b4d74f06ecb0&secret=e2016e939fc75f90edc7f71daac1857b&js_code="+code+"&grant_type=authorization_code&connect_redirect=1";
	https.get(url,function(request,response){
		var result='';
	    request.on('data',function(data){
            console.log(123);
	        result+=data;
	    });  
	    request.on('end',function(){ 
	    	//get openID.. from wxAPI
	        query(req, res, JSON.parse(result));
	    });  
	});  
}


//get_openID(1,213,123);

module.exports = {
    get_openID: get_openID,
};