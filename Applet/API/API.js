var db = require('../DAO/Connection');


// return article_id, article_name, author, create_time
function search_article(req, res){
    if(!req.body.article_id){
        res.json({'msg': 'parameter error'});
    }
    else{
        var sql = 'select article.id,article.title,user.name as author,article.create_time from article, user where article.user_id=user.id and article.id=?';
        db.queryArgs(sql, req.body.article_id, function(err, result) {
                if(result.length){
                    db.doReturn(res, 200, result[0]);
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
        var sql = 'select article.id,article.title,user.name as author,article.create_time from article, user where article.user_id=user.id and article.user_id=?';
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
    params = req.body;
    if(!params.author_id || !params.article_id)
        res.json({'msg': 'parameter error'});
    else{
        res.json({'msg': 'uncomplete'});
    }
}


function inbox_list(req, res){
    if(!req.body.user_id)
        res.json({'msg': 'parameter error'});
    else{
        var sql = 'select article.id,article.title,user.name as author,article.create_time from article,user where article.user_id=user.id and user.id in (select user_id from reader where user_id=?)'
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
        var sql = 'select article.id,article.title,user.name as author,article.create_time from article, user where article.user_id=user.id and article.user_id=?';
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
    params = req.body;
    if(!params.author_id || !params.article_title || !params.article_content)
        res.json({'msg': 'parameter error'});
    else{
        var sql = 'insert into article(user_id, title, content) values(?,?,?)';
        var attrs = [params.author_id, params.article_title, params.article_content];
        db.queryArgs(sql, attrs, function(err, result) {
                db.doReturn(res, 200, result);
            }
        );
    }
}


function file_to_text(req, res){
    res.json({'msg': 'uncomplete'});
}


module.exports = {
    search_article: search_article,
    search_user: search_user,
    share_article: share_article,
    inbox_list: inbox_list,
    outbox_list: outbox_list,
    create_article: create_article,
    file_to_text: file_to_text,
};
