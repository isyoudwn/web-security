const MongoClient = require('mongodb').MongoClient;
let db;

/**DB연결 */
MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true },(err, client) => {
    if (err) return console.log(err);

    db = client.db('todoapp');
});

const output = {
    /** todo list 랜더링 */
    list : (req, res) => {
        db.collection('post').find().toArray((err, result) => {
            console.log(result);
            res.render('list.ejs', { posts : result });
        });
    },
    /** todo 상세페이지 랜더링 */
    detail : (req, res) => {
        db.collection('post').findOne({ _id : parseInt(req.params.id) }, (err, result) => {
            res.render('detail.ejs', { data : result });
        })
    },
    /** todo 수정페이지 랜더링 */
    update : (req, res)=> {
        let postNum = parseInt(req.params.id);
        db.collection('post').findOne({ _id : postNum }, (err, result) => {
            console.log(result);
            res.render('update.ejs', { data : result });
        });
    },
    /** todo 항목 검색 */
    search : (req, res) => {
        let search = [
          {
            $search: {
              index: 'titleSearch',
              text: {
                query : req.query.value,
                path : '제목'
              }
            }
          },
        ];
    
        db.collection('post').aggregate(search).toArray((err, result) => {
          console.log(result);
          res.render("list.ejs", { posts : result });
        });
      },
      /** todo 작성페이지 랜더링 */
      write : (req, res) => {
        res.render('write.ejs');
    }
}

const pro = {
    /** todo 목록 삭제 */
    delete : (req, res) => {
        req.body._id =  parseInt(req.body._id);
        deleteData = { _id : req.body._id, 작성자 : req.user.data.id };
         db.collection('post').deleteOne(deleteData, (err, result) => {
             if (err) {
               console.log(err);
               res.send('너가 쓴 데이터 아님');
             }
             else {
               res.status(200).send( { message:'성공했습니다.' } );
             }
         });
     },
    /** todo 목록 수정 */
    update : (req, res)=> {
        let postNum = parseInt(req.params.id);
        db.collection('post').updateOne({ _id : postNum }, { $set : { 제목: req.body.title, 날짜: req.body.date }}, (err, result) => {
            if(err) console.log(err)
            else {
                res.redirect('/list');
            }
        })
    },
    /** todo 작성 */
    write : (req, res) => {
        db.collection('counter').findOne( {name : '게시물개수' }, (err, result) => {
            let totalPost = result.totalPost;
            let data = { _id: totalPost + 1, 제목 : req.body.title, 날짜 : req.body.date, 작성자: req.user.data.id };
    
            db.collection('post').insertOne(data, (err, data) => {
                /** update류의 함수를 사용하기 위해서는 operator를 사용해야 함.
                 * set은 '데이터를 아예 바꿔주세요'
                 * inc는 '해당 숫자를 더해주세요'*/ 
                db.collection('counter').updateOne({ name : '게시물개수' }, { $inc : { totalPost : 1 } }, (err, result) => {
                    if(err) {console.log(err)};
                    res.redirect("/list");
                });
            });
        })
    }
}

module.exports = {
    output,
    pro
}