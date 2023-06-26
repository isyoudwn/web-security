
const output = {
    myPage : (req, res) => {
        const userData = req.user;
        res.render('mypage.ejs', { user : userData });
      }
}

const pro = {
    
}

const middleware = {
  /** 로그인 했는지 검사하는 미들웨어 */
    sessionAuth: (req, res, next) => {
    if (req.user) {
      next();
    } 
    else {
        res.send('로그인 해주세요');
    }
  }
}

module.exports = {
    output,
    pro,
    middleware
}