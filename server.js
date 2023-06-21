const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true})) 


const MongoClient = require('mongodb').MongoClient;

let db;
MongoClient.connect('mongodb+srv://admin:admin1234@cluster0.wmnmkps.mongodb.net/?retryWrites=true&w=majority', (err, client) => {
    if (err) return console.log(err);

    db = client.db('todoapp');

    db.collection('post');

    db.collection('post').insertOne({ 이름 : 'yuze', 나이 : 20 }, function(err, data) {
        console.log('저장완료');
    });

    app.listen(8080,() => {
        console.log("listening on 8080");
    });
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/write', (req, res) => {
    res.sendFile(__dirname + '/write.html');
});

app.post('/add', (req, res) => {
    res.send('전송완료');
});