const router = require('express').Router();
const ctrl = require('../../controllers/home/boardController')

/**게시글 list 랜더링 */
router.get('/', ctrl.output.list);

/**게시물 상세페이지 랜더링 */
router.get('/detail/:id', ctrl.output.detail);

/** 게시글 삭제 */
router.delete('/delete', ctrl.pro.delete);

router.use('/search', require('./search'));
router.use('/update', require('./update'));


module.exports = router;