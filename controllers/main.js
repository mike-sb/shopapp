const passport = require('passport');
const myPassport = require('../passport_setup')(passport);
let pg = require('pg');
const config = {
    user: 'postgres',
    password: '94cfpmky',
    host: '127.0.0.1',
    port: 5432,
    database: 'shop'
}


exports.main_page = function(req, res, next) {
    let con = new pg.Client(config);
    con.connect().then(client => {

        con.query(`Select * from Products INNER JOIN Categories on(Categories.id=Products.id_category) INNER JOIN Suppliers on(Suppliers.id_product=Products.id_product);`, (err, reslt1) => {
            if (err) {
                console.log(err)
            }
            console.log(reslt1);
            res.render('index', { title: 'MyShopApp', user: req.user, prdos: reslt1.rows });

        });
    });

    // res.render('index', { title: 'MyShopApp', user: req.user });
};

exports.get_new_order = function(req, res, next) {
    let products = [];

    let con = new pg.Client(config);
    con.connect().then(client => {
        con.query(`Select * from products;`, (err, reslt) => {

            for (let i = 0; i < reslt.rows.length; i++) {
                products.push(reslt.rows[i]);
                console.log(products[i]);
            }
            con.end().then(resll => {
                res.render('admin/order', { formData: {}, errors: {}, user: req.user, products: products });
            });

        });

    });

}

exports.new_order = function(req, res, next) {

    let con = new pg.Client(config);
    con.connect().then(client => {
        con.query(`INSERT INTO Cheques(datum,id_client) Values(NOW(),'${req.user.id}');`, (err, reslt1) => {
            if (err) {
                console.log(err)
            }
            if (reslt1) {
                console.log(reslt1)
                con.query(`Select * From Cheques Where id_client='${req.user.id}' Order by datum desc limit 1;`).then(reslt2 => {
                    console.log(reslt2)

                    con.query(`INSERT INTO Sales(id_cheques,id_product,buy_count) Values ('${reslt2.rows[0].id_cheques}',(SELECT id_product From Products Where name='${req.body.product}'),${req.body.count});`).then(reslt3 => {

                        con.query(`UPDATE Products SET Count= Count-${req.body.count} Where name='${req.body.product}';`).then(reslt4 => {

                            console.log(reslt4)
                            con.end().then(resll => {

                                res.render('index', { title: 'MyShopApp', user: req.user, message: 'Заказ успешно оформлен' });
                            });

                        });
                    });

                });
            }

        })
    });

}


exports.get_orders = function(req, res, next) {
    let con = new pg.Client(config);
    con.connect().then(client => {

        if (req.user.username == "root") {
            con.query(`Select * from Cheques INNER JOIN Sales on(Sales.id_cheques=Cheques.id_cheques) INNER JOIN Products on(Sales.id_product=Products.id_product);`, (err, reslt1) => {
                if (err) {
                    console.log(err)
                }
                console.log(reslt1);
                res.render('admin/orders', { title: 'MyShopApp', user: req.user, orders: reslt1.rows });

            });
        } else {
            con.query(`Select * from Cheques INNER JOIN Sales on(Sales.id_cheques=Cheques.id_cheques) INNER JOIN Products on(Sales.id_product=Products.id_product) Where Cheques.id_client='${req.user.id}';`, (err, reslt1) => {
                if (err) {
                    console.log(err)
                }
                console.log(reslt1);
                res.render('admin/orders', { title: 'MyShopApp', user: req.user, orders: reslt1.rows });

            });
        }


    });


}





exports.add_category = function(req, res, next) {
    let con = new pg.Client(config);
    con.connect().then(client => {

        con.query(`INSERT INTO Categories(name) Values('${req.body.category}');`, (err, reslt1) => {
            if (err) {
                console.log(err)
            } else {
                res.status(200).json(message: "OK!");
            }
        });
    });
}



exports.add_supplier = function(req, res, next) {

    let con = new pg.Client(config);
    con.connect().then(client => {

        con.query(`INSERT INTO Categories(name) Values('${req.body.category}');`, (err, reslt1) => {
            if (err) {
                console.log(err)
            } else {
                res.status(200).json(message: "OK!");
            }
        });
    });
}



exports.add_product = function(req, res, next) {

    let con = new pg.Client(config);
    con.connect().then(client => {

        con.query(`INSERT INTO Categories(name) Values('${req.body.category}');`, (err, reslt1) => {
            if (err) {
                console.log(err)
            } else {
                res.status(200).json(message: "OK!");
            }
        });
    });
}



exports.get_prods = function(req, res, next) {

    let con = new pg.Client(config);
    con.connect().then(client => {

        con.query(`Select * from Products INNER JOIN Categories on(Categories.id=Products.id_category) INNER JOIN Suppliers on(Suppliers.id_product=Products.id_product);`, (err, reslt1) => {
            if (err) {
                console.log(err)
            }
            console.log(reslt1);
            res.status(200).json({ prdos: reslt1.rows });

        });
    });
}