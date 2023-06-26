const router = require('express').Router();
const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, './src/public/image');
    },
    filename : (req, file, cb) => {
        cb(null, file.originalname);
    },

});

const upload = multer({ storage : storage });

router.get('/', (req, res) => {
    res.render('upload.ejs')
});

router.post('/', upload.single('profile'),(req, res) => {
    res.send('업로드 완료');
});

router.get('/:imageName', (req, res) => {
    let parentFolderPath = path.resolve(__dirname, '../..');
    res.sendFile(parentFolderPath + '/public/image/' + req.params.imageName);
});

module.exports = router;