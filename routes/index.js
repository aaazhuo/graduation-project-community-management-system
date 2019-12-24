var express = require('express');
var mongoose = require('../common/dbConnection');
var router = express.Router();

// 登陆路由
router.get('/login', function(req, res, next) {
  req.session.user = null;
  res.render('login');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.session.user){
    res.redirect('/login');
    return;
  }
  res.render('index');
});

// 配置iframe首页路由
router.get('/main',function(req,res,next){
  res.render('main')
});

/* 配置个人面板路由 */
// 个人信息路由
router.get('/personInfo',function(req,res,next){
  res.render('personInfo')
});
// 修改密码路由
router.get('/changepwd',function(req,res,next){
  res.render('changepwd')
});

/* 配置房屋管理路由 */
// 房屋信息路由
router.get('/houseInfo',function(req,res,next){
  res.render('houseInfo')
});
// 房屋出售路由
router.get('/houseSale',function(req,res,next){
  res.render('houseSale')
});
// 添加房屋信息路由
router.get('/addhouse',function(req,res,next){
  res.render('addhouse')
});

/* 配置业主信息路由 */
// 业主信息路由
router.get('/userInfo',function(req,res,next){
  res.render('userInfo')
});
// 添加业主信息路由
router.get('/addHousehold',function(req,res,next){
  res.render('addHousehold')
});

/* 配置物业收费路由 */
// 添加物业水费信息路由
router.get('/waterFee',function(req,res,next){
  res.render('waterFee')
});
router.get('/addWater',function(req,res,next){
  res.render('addWater')
});
// 添加物业电费信息路由
router.get('/electricityFee',function(req,res,next){
  res.render('electricityFee')
});
router.get('/addElectricity',function(req,res,next){
  res.render('addElectricity')
});

/* 配置维修投诉信息路由 */
// 添加维修投诉信息路由
router.get('/repairComplaintInfo',function(req,res,next){
  res.render('repairComplaintInfo')
});
// 添加已处理路由
router.get('/processed',function(req,res,next){
  res.render('processed')
});

/* 用户登陆页面添加维修或投诉 */
// 添加已处理路由
router.get('/addrepairComplaint',function(req,res,next){
  res.render('addrepairComplaint')
});
module.exports = router;
