const router = require('express').Router();
const ctrl = require('../../controllers/home/boardController');

router.get('/', ctrl.output.search);

module.exports = router;