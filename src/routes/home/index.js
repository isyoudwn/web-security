const router = require('express').Router();
const ctrl = require('../../controllers/home/homeController');

router.get('/', ctrl.output.home);



/** 미들웨어 등록 */
router.use('/login', require('./login'));
router.use('/list', require('./list'));
router.use('/mypage', require('./myPage'));
router.use('/register', require('./register'));
router.use('/write', require('./write'));
router.use('/upload', require('./upload'));


module.exports = router;
