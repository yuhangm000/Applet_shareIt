var express = require('express');
var router = express.Router();
var API = require('../API/API');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('please use post');
});

router.get('/share', function(req, res, next) {
	res.render('share',{});
});

router.post('/search_article', function(req, res, next) {
	API.search_article(req, res)
});

router.post('/search_user', function(req, res, next) {
	API.search_user(req, res)
});

router.post('/insert_user', function(req, res, next) {
	API.insert_user(req, res)
});

router.post('/share_article', function(req, res, next) {
	API.share_article(req, res)
});

router.post('/share_article_delete', function(req, res, next) {
	API.share_article_delete(req, res)
});

router.post('/inbox_list', function(req, res, next) {
	API.inbox_list(req, res)
});

router.post('/outbox_list', function(req, res, next) {
	API.outbox_list(req, res)
});

router.post('/create_article', function(req, res, next) {
	API.create_article(req, res)
});

router.post('/delete_article', function(req, res, next) {
	API.delete_article(req, res)
});

router.post('/get_article', function(req, res, next) {
	API.get_article(req, res)
});

//var multer = require('multer')  // upload files
//var upload = multer({ dest: 'uploads/' });
router.post('/file_to_text',function(req, res, next) {
	API.file_to_text(req, res)
});

module.exports = router;
