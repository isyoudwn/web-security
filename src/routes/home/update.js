const router = require('express').Router();
const ctrl = require('../../controllers/home/boardController');

/**수정 화면 랜더링 API */
router.get('/:id', ctrl.output.update);

/**수정 API */
router.put('/:id', ctrl.pro.update);

module.exports = router;