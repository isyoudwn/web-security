const router = require('express').Router();
const ctrl = require('../../controllers/home/boardController');

/** write 폼 랜더링 */
router.get('/', ctrl.output.write);

/**게시글 추가 */
router.post('/', ctrl.pro.write);

module.exports = router;