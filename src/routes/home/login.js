const router = require('express').Router();
const ctrl = require('../../controllers/home/userController');

router.get('/', ctrl.output.login);

/** 회원기능*/
router.post('/', ctrl.middleware.authenticate, ctrl.pro.login);


module.exports = router;