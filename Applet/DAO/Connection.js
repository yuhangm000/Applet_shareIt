var mysql = require('mysql');
var dbConfig = require('../config/mysql');
//mysql pool
var pool = mysql.createPool(dbConfig.mysql);


function query(sql, callback) {
    pool.getConnection(function (err, connection) {//get connection
        if(err){
            console.log(err);
        }
        else{ 
            connection.query(sql, function (err, rows) {              
                callback(err, rows);
                connection.release();//release 
            });
        }
        
    });
}


function queryArgs(sql, args, callback) {
    pool.getConnection(function (err, connection) {
        if(err){
            console.log(err);
        }
        else{
            var query=connection.query(sql, args,function (err, rows) {
                console.log(query.sql);
                callback(err, rows);
                console.log(rows);
                connection.release();
            });
            
        }
        
    });
}


//return json back
function doReturn(res, msg=200, result='null') {
    if(!result){
        res.json({'msg': 'failed to do'});
    }
    else{
        res.json({'msg':msg, 'result':result});
    }
};


module.exports = {
    query: query,
    queryArgs: queryArgs,
    doReturn: doReturn,
}
