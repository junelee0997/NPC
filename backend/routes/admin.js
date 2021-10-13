var express = require('express');
var router = express.Router();
var db = require('../models/index')
const admin = require('../models/admin');
const user = require('../models/user');
const bitcoin = require('../blockchain/blockchain');
const picture = require('../models/picture');
var Admin = db.Admin
var User = db.User
var Picture = db.Picture
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('관리자용 앱입니다.');
});
router.post('/login', async function(req, res, next) {
  try{
    let result = await Admin.findOne({
      where: {
        id: req.body.id
      }
    });
    if(result.dataValues.password === req.body.password){
      res.json({ message: '환영합니다', data: result.dataValues.id});
    }
    else{
      res.json('관리자 계정과 다릅니다');
    }
  } catch(err){
    res.json('관리자 계정과 다릅니다');
  }
});
//사용자:로그인(post), 회원가입(post), 사진 전송(post), 코인 정보 받기(get), 
//관리자:로그인(post), 회원가입(post), 사진 받기(get), 코인 지급(put), 승인 대기 목록(get), 유저가 보낸 사진(get)
//변수 아이디(id), 비밀번호(password), 코인 개수(coin), 전기세(elec), 수도세(water), 전기세인지 수도세인지 사진 종류 변수(mode)
router.put('/approve/:id', async function(req, res, next) {
  if(req.headers['id'] == 'npc'){
    if(req.body.mode == 'elec'){
      let price = (28000 - req.body.elec) / 280, coinneed = 0;
      if(price >= 0 && price <= 25) coinneed = 0.0001;
      else if(price > 25 && price <= 50) coinneed = 0.0002;
      else if(price > 50 && price <= 75) coinneed = 0.0003;
      else if(price > 75) coinneed = 0.0004;
      if(req.body.coin >= coinneed){
        var photoid = req.params.id
        let Userid = await Picture.findOne({where: {pictureid: photoid}});
        bitcoin.createNewTransaction(coinneed, req.body.id, Userid.dataValues.userid)
        Admin.update({coin:req.body.coin - coinneed},{where: {id: "npc"}}).then((res) => {
          console.log('업데이트 성공');
        }).catch((err) => {
          console.log('업데이트 실패', err);
        })
        let result = await User.findOne({where: {id: Userid.dataValues.userid}});
        User.update({coin:result.dataValues.coin + coinneed},{where: {id: Userid.dataValues.userid}}).then((res) => {
          console.log('업데이트 성공');
        }).catch((err) => {
          console.log('업데이트 실패', err);
        })
      }
    }
    else if(req.body.mode == 'water')
    {
      let price = (8850 - req.body.water) / 88.5, coinneed = 0;
      if(price >= 0 && price <= 25) coinneed = 0.0001;
      else if(price > 25 && price <= 50) coinneed = 0.0002;
      else if(price > 50 && price <= 75) coinneed = 0.0003;
      else if(price > 75) coinneed = 0.0004;
      if(req.body.coin >= coinneed){
        var photoid = req.params.id
        let Userid = await Picture.findOne({where: {pictureid: photoid}});
        bitcoin.createNewTransaction(coinneed, req.body.id, Userid.dataValues.userid)
        Admin.update({coin:req.body.coin - coinneed},{where: {id: "npc"}}).then((res) => {
          console.log('업데이트 성공');
        }).catch((err) => {
          console.log('업데이트 실패', err);
        })
        let result = await User.findOne({where: {id: Userid.dataValues.userid}});
        User.update({coin:result.dataValues.coin + coinneed},{where: {id: Userid.dataValues.userid}}).then((res) => {
          console.log('업데이트 성공');
        }).catch((err) => {
          console.log('업데이트 실패', err);
        })
      }
    }
  }
});
router.get('/picturelist', async function(req, res, next){
  let result = await Picture.findAll();
  res.json({data: result.dataValues.pictureid});
});
router.get('/showpicture/:id', async function(req, res, next){
  var photoid = req.params.id;
  let result = await Picture.findOne({where: {pictureid: photoid}});
  res.json({data: result.dataValues.adress});
});
module.exports = router;
