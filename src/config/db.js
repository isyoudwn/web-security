// const MongoClient = require('mongodb').MongoClient;
// let db;

// db = async() => {
//     try {
//         await MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true },(err, client) => {
//             if (err) return console.log(err);
        
//             db = client.db('todoapp');

//             console.log(db);
        
        
//         });
//     }
//     catch (err) {

//     }
// }


// module.exports = db;
