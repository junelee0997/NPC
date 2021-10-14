var express = require('express');
var router = express.Router();
var db = require('../models/index');
const user = require('../models/user');
const picture = require('../models/picture');
var User = db.User
var Picture = db.Picture
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('메인 페이지!');
});
/*
기능 : 내가 가지고 있는 비트코인 양 조회
파라미터:
    id: 사용자 아이디
응답 : 
    message: 성공여부
    data: 비트코인 양
*/
router.get('/wallet/:id', async function(req, res, next) {
  var userid = req.params.id
  let result = await User.findOne({
    where: {
      id: userid
    }
  });
  res.json({ message: '내 지갑', data: result.dataValues.coin});
});
/*
기능 : 회원가입
파라미터:
    id: 사용자 아이디
    password: 사용자 비밀번호
응답 : 
    message: 회원가입 성공여부
    data: 가입된 사용자 아이디
*/
router.post('/sign_up', function(req, res, next) {
  if(req.body.id.length < 4) res.json({message: '길이가 너무 짧습니다'})
  else if(req.body.id.length > 14) res.json({message: '길이가 너무 깁니다'})
  else{
    User.create({
      id: req.body.id,
      password: req.body.password,
      coin: 0
    })
    .then(result => {
      res.json({message: '회원가입에 성공하였습니다', data: req.body.id});
    })
    .catch(err => {
      console.log(err);
      res.json({message: '오류가 발생하였습니다'});
    });
  }
});
/*
기능 : 로그인
파라미터:
    id: 사용자 아이디
    password: 사용자 비밀번호
응답 : 
    message: 로그인 성공여부
    data: 사용자 아이디
*/
router.post('/login', async function(req, res, next) { 
  try{
    let result = await User.findOne({
      where: {
        id: req.body.id
      }
    });
    if(result.dataValues.password === req.body.password){
      res.json({ message: '로그인 성공', data: result.dataValues.id});
    }
    else{
      res.json({message: '비밀번호가 일치하지 않습니다'});
    }
  } catch(err){
    res.json({message: 'id가 존재하지 않습니다'})
  }
});
/*
기능 : 사진 전송
파라미터:
    id: 사진 보내는 사람 아이디
    address: 사진 주소
응답 : 
    message: 사진 전송 여부
    data: 사진 아이디
*/
router.post('/sendpicture', function(req, res, next) {
  Picture.create({
    adress:req.body.address,
    userid:req.body.id
  })
  .then(result => {
    res.json({message: '사진 전송에 성공하였습니다.', data: result.dataValues.pictureid});
  })
  .catch(err => {
    console.log(err);
    res.json({message: '오류가 발생하였습니다'});
  });
});
//사용자:로그인(post), 회원가입(post), 사진 전송(post), 코인 정보 받기(get), 
//관리자:로그인(post), 회원가입(post), 사진 받기(get), 코인 지급(put), 
module.exports = router;
