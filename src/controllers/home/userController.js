const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
let db;

/**DB연결 */
MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true },(err, client) => {
            if (err) return console.log(err);
        
            db = client.db('todoapp');
        });

const output = {
  /** 로그인&회원가입 화면 랜더링 */
    login : (req, res) => {
        res.render("login.ejs");
    }
}

const pro = {
  /** 로그인 */
    login : (req, res) => {
        res.redirect('/');
    },
    /**회원가입 */
    register : (req, res) => {
      db.collection('member').findOne({ id : req.body.id}, (err, result) => {
        if (!result) {
          db.collection('member').insertOne({ id : req.body.id, password: req.body.password }, (err, result) => {
            res.redirect('/');
          });
        }
      })
    }
}

const middleware = {
    /** 인증 관련 호출 미들웨어 */
    authenticate : passport.authenticate('local', {
        failureRedirect :'/fail'
    }),
    /** 인증함수 */
    sessionAuth : passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password',
        session: true, // 세션으로 저장할지 -> true
        passReqToCallback: false,
    }, (userId, userPassword, done) => {
    db.collection('member').findOne({ id : userId }, (err, result) => {
      if (err) return done(err)
        /**done(서버에러, 성공시사용자DB데이터, 에러msg넣는곳) */
      if (!result) return done(null, false, { message: '존재하지않는 아이디요' })
      if (userPassword == result.password) {
        return done(null, result)
      } else {
        return done(null, false, { message: '비번틀렸어요' })
      }
    })
  })),

  /**id를 이용해서 세션을 저장시키는 코드 (로그인 성공시 발동) user에는 result가 들어감 */
  storeSession : passport.serializeUser((user, done)=> {
    done(null, user.id);
  }),

/**이 세션 데이터를 가진 사람을 DB에서 찾아주세요 */
  findUser : passport.deserializeUser((id, done)=> {
    db.collection('member').findOne({ id : id }, (err, result) => {
      done(null, { data : result });
    });
  })
}

module.exports = {
    output,
    pro,
    middleware
}