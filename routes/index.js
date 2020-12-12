var express = require('express');
var router = express.Router();

let user = require('../controllers/user');
let main = require('../controllers/main');

/* GET home page. */
router.get('/', main.main_page);


router.get('/login', user.show_login);

router.post('/login', user.login);

router.get('/logout', user.logout);

router.get('/signup', user.show_signup);

router.post('/signup', user.signup);

router.get('/order', main.get_new_order);
router.post('/order', main.new_order);

router.get('/req', main.get_orders);

router.post('/add_category', main.add_category);
router.post('/add_supplier', main.add_supplier);
router.post('/add_product', main.add_product);

router.get('/prods', main.get_prods);


module.exports = router;