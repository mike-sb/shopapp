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
router.get('/get_sup', main.get_sup);
router.post('/add_supplier', main.add_supplier);
router.get('/get_add_product', main.get_add_product);
router.post('/add_product', main.add_product);
router.get('/get_add_store', main.get_add_storage);
router.post('/add_store', main.add_storage);
router.get('/get_add_prod_address', main.get_add_prod_address);
router.post('/add_prod_address', main.add_prod_address);



router.get('/prods', main.get_prods);




module.exports = router;