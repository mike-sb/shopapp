let Pool = require('pg-pool');
const passport = require('passport');
const myPassport = require('../passport_setup')(passport);

const config={
    user:'postgres',
    password:'94cfpmky',
    host:'127.0.0.1',
    port:5432,
    database:'shop'
}

let pool=new Pool(config);
exports.main_page = function(req, res, next) {
    res.render('index', { title: 'Express' });
  };

  exports.get_new_order = function (req, res, next) {
    res.render('auth/login', { formData: {}, errors: {}});
}

exports.new_order = function (req, res, next) {


    pool.connect().then(client=>{
        client.query('INSERT INTO Cheques(datum,id_client) Values(NOW(),'+req.user.id+');',['pg-pool']).then(reslt=>{
  
            client.query('INSERT INTO Sales(id_cheques,id_product) Values ('+reslt.rows[0].id+',(SELECT id From Products Where name='+req.body.product+'));',['pg-pool']).then(reslt2=>{
            
                client.query('UPDATE Products SET Count=(SELECT Count From Products Where name='+req.body.product+')-'+ req.body.count+';',['pg-pool']).then(reslt3=>{
                    client.release();
                    res.render('/', { formData: {}, errors: {}, message:'Заказ успешно оформлен'});
                });
            });
    
        })
       
    });

   
}