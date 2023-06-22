const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');
require('dotenv').config();
let db;

app.use(express.urlencoded({extended: true}));
app.use('/public', express.static('public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session()); 



MongoClient.connect(process.env.DB_URL, (err, client) => {
    if (err) return console.log(err);

    db = client.db('todoapp');

    app.listen(process.env.PORT,() => {
        console.log("listening on " + process.env.PORT);
    });
});


app.get('/', (req, res) => {
    res.render("index.ejs");
});

app.get('/write', (req, res) => {
    res.render('write.ejs');
});

app.post('/add', (req, res) => {
    db.collection('counter').findOne({name : '게시물개수'}, (err, result) => {
        let totalPost = result.totalPost;

        db.collection('post').insertOne({ _id: totalPost + 1, 제목 : req.body.title, 날짜 : req.body.date}, (err, data) => {
            /** update류의 함수를 사용하기 위해서는 operator를 사용해야 함.
             * set은 '데이터를 아예 바꿔주세요'
             * inc는 '해당 숫자를 더해주세요'*/ 
            db.collection('counter').updateOne({ name : '게시물개수' }, { $inc : { totalPost : 1 } }, (err, result) => {
                if(err) {console.log(err)};
                console.log('전송완료');
                res.send("전송완료");
            });
        });
    })
});

app.get('/list', (req, res) => {
    db.collection('post').find().toArray((err, result) => {
        console.log(result);
        res.render('list.ejs', { posts : result });
    });
});

/**삭제 API*/
app.delete('/delete', (req, res) => {
   req.body._id =  parseInt(req.body._id);
   console.log(req.body);
    db.collection('post').deleteOne(req.body, (err, result) => {
        res.status(200).send( { message:'성공했습니다.' } );
    });
});

/**상세페이지 랜더링 API */
app.get('/detail/:id', (req, res) => {
    db.collection('post').findOne({ _id : parseInt(req.params.id) }, (err, result) => {
        res.render('detail.ejs', { data : result });
    })
});

/**수정 화면 랜더링 API */
app.get('/update/:id', (req, res)=> {
    let postNum = parseInt(req.params.id);
    db.collection('post').findOne({ _id : postNum }, (err, result) => {
        console.log(result);
        res.render('update.ejs', { data : result });
    });
})

/**수정 API */
app.put('/update/:id', (req, res)=> {
    let postNum = parseInt(req.params.id);
    db.collection('post').updateOne({ _id : postNum }, { $set : { 제목: req.body.title, 날짜: req.body.date }}, (err, result) => {
        if(err) console.log(err)
        else {
            res.redirect('/');
        }
    })
})

app.get('/login', (req, res) => {
    res.render('login.ejs');
})

/** 회원기능*/
app.post('/login', passport.authenticate('local', {
    failureRedirect :'/fail'
}), (req, res) => {
    res.redirect('/');
});


/** 인증함수 */
passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password',
    session: true, // 세션으로 저장할지 -> true
    passReqToCallback: false,
  }, (userId, userPassword, done) => {
    console.log(userId, userPassword);
    db.collection('member').findOne({ id: userId }, (err, result) => {
      if (err) return done(err)
        /**done(서버에러, 성공시사용자DB데이터, 에러msg넣는곳) */
      if (!result) return done(null, false, { message: '존재하지않는 아이디요' })
      if (userPassword == result.password) {
        return done(null, result)
      } else {
        return done(null, false, { message: '비번틀렸어요' })
      }
    })
  })); 

  /**id를 이용해서 세션을 저장시키는 코드 (로그인 성공시 발동) user에는 result가 들어감 */
  passport.serializeUser((user, done)=> {
    done(null, user.id);
  });

/**이 세션 데이터를 가진 사람을 DB에서 찾아주세요 */
  passport.deserializeUser((id, done)=> {
    db.collection('member').findOne({ id : id }, (err, result) => {
      done(null, { data : result });
    });
  })

  app.get('/mypage', sessionAuth, (req, res) => {
    let userData = req.user;
    res.render('mypage.ejs', { user : userData });
  });

  /** 로그인 했는지 검사 미들웨어 */
  function sessionAuth(req, res, next) {
    if (req.user) {
      next();
    } 
    else {
        res.send('로그인 해주세요');
    }
  }