/** 모듈 추가 */
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const dotenv = require("dotenv");

dotenv.config();

app.set('views', './src/views/home');
app.set('view engine', 'ejs');

/**라우팅 index 경로 추가 */
const home = require('./src/routes/home');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use(methodOverride('_method'));
app.use(session({ secret : '비밀코드', resave : true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session()); 
app.use(express.json());


/** app.js에 미들웨어로 등록하기 위해 넣어주기
 * 위에있는 미들웨어 적용을 위해 하단에 작성
 */
app.use('/', home);

module.exports = app;