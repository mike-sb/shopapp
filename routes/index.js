var express = require('express');
var router = express.Router();

let user = require('../controllers/user');
let main = require('../controllers/main');

/* GET home page. */
router.get('/', main.main_page);


router.get('/login', user.show_login);

router.post('/login', user.login);

router.get('/signup', user.show_signup);

router.post('/signup', user.signup);

router.get('/order'.main.get_new_order);
router.post('/order'.main.new_order);



module.exports = router;
