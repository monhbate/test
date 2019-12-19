var express = require('express');
var router = express.Router();
var model = require('../model');

router.post('/add', function(req, res, next){
	var data = {
		title: req.body.title,
		content: req.body.content,
		id: Date.now(),
		username: req.session.username
	}
	model.connect( function(db){
		db.collection('article').insertOne(data,function(err,ret){
			if(err){
				console.log('文章发布失败',err)
				res.redirect('/write')
			}else{
				res.redirect('/')
			}
		})
	})
})


module.exports = router;
