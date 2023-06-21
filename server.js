const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
let db;
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
const MongoClient = require('mongodb').MongoClient;


MongoClient.connect('mongodb+srv://admin:admin1234@cluster0.wmnmkps.mongodb.net/?retryWrites=true&w=majority', (err, client) => {
    if (err) return console.log(err);

    db = client.db('todoapp');

    app.listen(8080,() => {
        console.log("listening on 8080");
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

app.delete('/delete', (req, res) => {
   req.body._id =  parseInt(req.body._id);
   console.log(req.body);
    db.collection('post').deleteOne(req.body, (err, result) => {
        res.status(200).send( { message:'성공했습니다.' } );
    });
});

app.get('/detail/:id', (req, res) => {
    db.collection('post').findOne({ _id : parseInt(req.params.id) }, (err, result) => {
        res.render('detail.ejs', { data : result });
    })
});