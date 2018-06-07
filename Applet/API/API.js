var db = require('../DAO/Connection');
var Utils = require('./util');
var fs = require("fs");


// return article_id, article_name, author, create_time
function search_article(req, res){
    if(!req.body.article_id){
        res.json({'msg': 'parameter error'});
    }
    else{
        var sql = 'select article.id,article.title,user.name as author,user.head,article.create_time from article, user where article.user_id=user.id and article.id=?';
        db.queryArgs(sql, req.body.article_id, function(err, result) {
                if(result.length){
                    db.doReturn(res, 200, result);
                }
                else{
                    db.doReturn(res, 'this article does not exist', result);
                }
            }
        );
    }
}


function search_user(req, res){
    if(!req.body.author_id){
        res.json({'msg': 'parameter error'});
    }
    else{
        var sql = 'select article.id,article.title,user.name as author,user.head,article.create_time from article, user where article.user_id=user.id and article.user_id=?';
        db.queryArgs(sql, req.body.author_id, function(err, result) {
                if(result.length){
                    db.doReturn(res, 200, result);
                }
                else{
                    db.doReturn(res, 'this user does not exist', result);
                }
            }
        );
    }
}


function share_article(req, res){
    var params = req.body;
    if(!params.user_id || !params.article_id)
        res.json({'msg': 'parameter error'});
    else{
        var sql = 'insert into reader(user_id,article_id) values(?,?)';
        db.queryArgs(sql, [params.user_id, params.article_id], function(err, result) {
                db.doReturn(res, 200, result);
            }
        );
    }
}


function inbox_list(req, res){
    console.log(req.body);
    if(!req.body.user_id)
        res.json({'msg': 'parameter error'});
    else{
        var sql = 'select article.id,article.title,user.name as author,user.head,article.create_time from article,user where article.user_id=user.id and user.id in (select user_id from reader where user_id=?)'
        db.queryArgs(sql, req.body.user_id, function(err, result) {
                if(result.length){
                    db.doReturn(res, 200, result);
                }
                else{
                    db.doReturn(res, 'this user does not exist article', result);
                }
            }
        );
    }
}


function outbox_list(req, res){
    if(!req.body.user_id){
        res.json({'msg': 'parameter error'});
    }
    else{
        var sql = 'select article.id,article.title,user.name as author,user.head,article.create_time from article, user where article.user_id=user.id and article.user_id=?';
        db.queryArgs(sql, req.body.user_id, function(err, result) {
                if(result.length){
                    db.doReturn(res, 200, result);
                }
                else{
                    db.doReturn(res, 'this user does not exist', result);
                }
            }
        );
    }
}


function create_article(req, res){
    var params = req.body;
    if(!params.author_id || !params.article_title || !params.article_content)
        res.json({'msg': 'parameter error'});
    else{
        article_content = params.article_content;
        article_content_path = "./articles/" + params.author_id + "_" + Date.now() + ".txt";//article path
        //write content into file; save path in db
        fs.writeFile(article_content_path, article_content, function(err){
            if(err){
                console.log(err);
            }else{
                console.log("file writes sucess!!");
            }
        });
        var sql = 'insert into article(user_id, title, content) values(?,?,?)';
        var attrs = [params.author_id, params.article_title, article_content_path];
        db.queryArgs(sql, attrs, function(err, result) {
                db.doReturn(res, 200, result);
            }
        );
    }
}


function delete_article(req, res){
    var params = req.body;
    if(!params.article_id)
        res.json({'msg': 'parameter error'});
    else{
        //delete data in files
        var sql2 = 'select content from article where id=?';
        db.queryArgs(sql2, params.article_id, function(err, result) {
                var path = result[0].content;
                fs.unlinkSync(path);
            }
        );
        //delete data in db
        var sql = 'delete from article where id=?';
        db.queryArgs(sql, params.article_id, function(err, result) {
                db.doReturn(res, 200, result);
            }
        );
    }
}


function insert_user(req, res){
    var params = req.body;
    console.log(params);
    if(!params.avatarUrl || !params.js_code || !params.nickname)
        res.json({'msg': 'parameter error'});
    else{
        Utils.get_openID(req, res, params.js_code);
    }
}


function get_article(req, res){
    var params = req.body;
    if(!params.article_id)
        res.json({'msg': 'parameter error'});
    else{
        var sql = 'select content from article where id=?';
        db.queryArgs(sql, params.article_id, function(err, result) {
                var path = result[0].content;
                fs.readFile(path, 'utf-8', function(err,data){
                    if(err){ 
                        console.log(err); 
                    }else{ 
                        db.doReturn(res, 200, data);
                    } 
                });
            }
        );
    }
}


function file_to_text(req, res){
    console.log(req.file);
    res.json({'msg': 'uncomplete'});
}


module.exports = {
    search_article: search_article,
    search_user: search_user,
    share_article: share_article,
    inbox_list: inbox_list,
    outbox_list: outbox_list,
    create_article: create_article,
    delete_article: delete_article,
    insert_user: insert_user,
    get_article: get_article,
    file_to_text: file_to_text,
};
