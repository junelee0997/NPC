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
  res.json({message: '관리자용 앱입니다.'});
});
/*
기능 : 관리자 로그인
파라미터:
    id: 입력한 아이디
응답 : 
    message: 로그인 여부
    data: 아이디
*/
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
      res.json({message: '관리자 계정과 다릅니다'});
    }
  } catch(err){
    res.json({message: '관리자 계정과 다릅니다'});
  }
});
//사용자:로그인(post), 회원가입(post), 사진 전송(post), 코인 정보 받기(get), 
//관리자:로그인(post), 회원가입(post), 사진 받기(get), 코인 지급(put), 승인 대기 목록(get), 유저가 보낸 사진(get)
//백엔드에 신호 보낼 때 변수 이름 아이디(id), 비밀번호(password), 코인 개수(coin), 전기세(elec), 수도세(water), 전기세인지 수도세인지 사진 종류 변수(mode)
/*
기능 : 사진 승인 시 코인 전송
파라미터:
  header{
    id: 'npc'
  }
  body{
    mode:전기세를 적은 사진인지 수도세를 적은 사진인지 판별하는 것 (전기세 사진이어서 전기세를 적었으면 'elec', 수도세면 'water'값을 넣어서 전송)
    elec:전기세
    water:수도세
    phid:사진 고유 아이디
  }
응답 : 
    message: 코인 전송 여부
    data: 비트코인 양
*/
router.put('/approve', async function(req, res, next) {
  if(req.headers['id'] == 'npc'){
    if(req.body.mode == 'elec'){
      let price = (28000 - req.body.elec) / 280, coinneed = 0;
      if(price > 0 && price <= 25) coinneed = 0.0001;
      else if(price > 25 && price <= 50) coinneed = 0.0002;
      else if(price > 50 && price <= 75) coinneed = 0.0003;
      else if(price > 75) coinneed = 0.0004;
      let resu = await Admin.findOne({where: {id: 'npc'}});
      if(resu.dataValues.coin >= coinneed){
        var photoid = req.body.phid
        let Userid = await Picture.findOne({where: {pictureid: photoid}});
        bitcoin.createNewTransaction(coinneed, req.headers['id'], Userid.dataValues.userid)
        Admin.update({coin:resu.dataValues.coin - coinneed},{where: {id: "npc"}}).then((res) => {
          console.log('업데이트 성공');
          res.json({message:'관리자 코인 가져감', data: res.dataValues.coin})
        }).catch((err) => {
          console.log('업데이트 실패', err);
        })
        let result = await User.findOne({where: {id: Userid.dataValues.userid}});
        User.update({coin:result.dataValues.coin + coinneed},{where: {id: Userid.dataValues.userid}}).then((res) => {
          console.log('업데이트 성공');
          res.json({message:'사용자에게 코인 지급', data: res.dataValues.coin})
        }).catch((err) => {
          console.log('업데이트 실패', err);
        })
        Picture.destroy({where: {pictureid: photoid}});
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
        var photoid = req.body.id
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
        Picture.destroy({where: {pictureid: photoid}});
      }
    }
  }
});
/*
기능 : 승인 대기 사진 리스트
파라미터:
응답 : 
    data: 사진 아이디 리스트
*/
router.get('/picturelist', async function(req, res, next){
  let result = await Picture.findAll();
  let response = []
  for(let i of result){
    response.push(i.dataValues.pictureid)
  }
  res.json({data: response});
});
/*
기능 : 승인 대기 사진 리스트
파라미터:
  url형식{
    id: 사진 아이디(/showpicture/사진 아이디   형식으로 사진 아이디 정보 받음)
  }
응답 : 
    data: 사진 주소
*/
router.get('/showpicture/:id', async function(req, res, next){
  var photoid = req.params.id;
  let result = await Picture.findOne({where: {pictureid: photoid}});
  res.json({data: result.dataValues.adress});
});
module.exports = router;
/*
기능: 채굴
파라미터:
응답 : 
    data: 채굴 데이터
*/
router.get('/mine', function(req, res, next){
  var previousHash = bitcoin.getLastBlock().hash
  var currentBlockchainData = bitcoin.pendingTransaction + 'ewjqed'
  var nonce = bitcoin.proofOfWork(previousHash, currentBlockchainData)
  var blockhash = bitcoin.hashBlock(previousHash, currentBlockchainData, nonce)
  var newblock = bitcoin.createNewBlock(nonce,previousHash, blockhash)
  res.json({data: newblock});
});