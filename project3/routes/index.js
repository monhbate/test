var express = require('express');
var router = express.Router();
var model=require('../model/index.js');
var moment=require('moment');
/* GET home page. */
router.get('/', function(req, res, next) {
	//获取用户名
    var username = req.session.username || ''
	var page = req.query.page || 1
	var data = {
		total: 0,
		curPage: page,
		list: []
	}
	var pageSize = 2
    model.connect(function(db) {
	  //第一步,查询所有文档
  	    db.collection('article').find().toArray(function(err, docs){
  		console.log('文章列表', err)
		
		
		
		data.total = Math.ceil(docs.length / pageSize)
		//第二步,查询当前页文章数
		model.connect(function(db){
			db.collection('article').find().sort({_id: -1}).limit(pageSize).skip((page-1)*pageSize).toArray(function(err,docs2) {
				if(docs2.length == 0){
					res.redirect('/?page='+((page-1) || 1))
				}else{
					docs2.map(function(ele,index){
						ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss')
					})
					data.list = docs2
				}				
				res.render('index', { username: username,data: data });
			})
		})
  		
  	    })
    })
});
//渲染注册页
router.get('/regist', function(req, res, next) {
	res.render('regist',{})
});
//渲染登录页
router.get('/login', function(req, res, next) {
	res.render('login',{})
});
//渲染写文章页面
router.get('/write', function(req, res, next) {
	var username = req.session.username|| ''
	res.render('write',{username:username})
});
//删除文章
router.get('/delete',function(req,res,next){
	var id = parseInt(req.query.id)
	var page = req.query.page
	model.connect(function(db){
		db.collection('article').deleteOne({id: id},function(err,ret){
			if(err){
				console.log('删除失败')
			}else{
				console.log('删除成功')
			}
			res.redirect('/?page='+page)
		})
	})
})

module.exports = router;
