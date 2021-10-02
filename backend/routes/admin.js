var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/login', function(req, res, next) {
  
});
router.post('/login', function(req, res, next) {
  
});
//사용자:로그인(post), 회원가입(post), 사진 전송(post), 코인 정보 받기(get), 
//관리자:로그인(post), 회원가입(post), 사진 받기(get), 코인 지급(put), 
module.exports = router;
