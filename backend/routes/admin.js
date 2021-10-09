var express = require('express');
var router = express.Router();
var db = require('../models/index')
const admin = require('../models/admin');
var Admin = db.Admin
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
      res.json({ message: '환영합니다. 관리자님', data: result.dataValues.id});
    }
    else{
      res.json('관리자 계정과 다릅니다');
    }
  } catch(err){
    res.json('관리자 계정과 다릅니다')
  }
});
//사용자:로그인(post), 회원가입(post), 사진 전송(post), 코인 정보 받기(get), 
//관리자:로그인(post), 회원가입(post), 사진 받기(get), 코인 지급(put), 
module.exports = router;
