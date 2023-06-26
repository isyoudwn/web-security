const router = require('express').Router();
const ctrl = require('../../controllers/home/myPageController');


router.get('/', ctrl.middleware.sessionAuth, ctrl.output.myPage);

module.exports = router;