var express = require('express');
var router = express.Router();
var db = require('../models/index');
const user = require('../models/user');
var User = db.User
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('메인 페이지!');
});
router.get('/wallet', function(req, res, next) {
  let result = await User.findOne({
    where: {
      id: req.body.id
    }
  });
  res.json({ message: '내 지갑', data: result.dataValues.coin});
});
router.post('/sign_up', function(req, res, next) {
  if(req.body.id.length < 4) res.json({'data': '길이가 너무 짧습니다'})
  else if(req.body.id.length > 14) res.json({'data': '길이가 너무 깁니다'})
  else{
    User.create({
      id: req.body.id,
      password: req.body.password
    })
    .then(result => {
      res.json('회원가입에 성공하였습니다');
    })
    .catch(err => {
      console.log(err);
      res.json('이미 존재하는 ID입니다');
    });
  }
});
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
      res.json('비밀번호가 일치하지 않습니다');
    }
  } catch(err){
    res.json('id가 존재하지 않습니다')
  }
});
//사용자:로그인(post), 회원가입(post), 사진 전송(post), 코인 정보 받기(get), 
//관리자:로그인(post), 회원가입(post), 사진 받기(get), 코인 지급(put), 
module.exports = router;
