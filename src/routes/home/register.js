const router = require('express').Router();
const ctrl = require('../../controllers/home/userController');

router.post('/', ctrl.pro.register);

module.exports = router;