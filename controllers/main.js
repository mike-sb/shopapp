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

        con.query(`Select * from Products INNER JOIN Categories on(Categories.id_category=Products.id_category) INNER JOIN Suppliers on(Suppliers.id_product=Products.id_product);`, (err, reslt1) => {
            if (err) {
                console.log(err)
            }
            console.log(reslt1);
            res.render('index', { title: 'MyShopApp', user: req.user, products: reslt1.rows });

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

        con.query(`INSERT INTO Categories(cat_name) Values('${req.body.category}');`, (err, reslt1) => {
            if (err) {
                console.log(err)
            } else {
                res.redirect('/get_sup')
            }
        });
    });
}



exports.add_supplier = function(req, res, next) {

    let con = new pg.Client(config);
    con.connect().then(client => {

        con.query(`INSERT INTO Suppliers(sup_name,id_product) Values('${req.body.name}','${req.body.prod}');`, (err, reslt1) => {
            if (err) {
                console.log(err)
            } else {
                res.status(200).json({ message: "OK!" });
            }
        });
    });
}

async function get_p(con, products) {
    let prods = [];

    for (let i = 0; i < products.length; i++) {
        console.log("await: ")
        let prod = await con.query(`Select * from Products Where name='${products[i].name}';`);
        prods.push(prod.rows[0]);

    }
    return prods;
}

exports.get_sup = function(req, res, next) {


    let con = new pg.Client(config);
    con.connect().then(client => {

        con.query(`Select * from Products left join Suppliers on suppliers.id_product=products.id_product Where suppliers.id_product is null;`, (err, products) => {
            if (err) {
                console.log(err)
            } else {

                get_p(con, products.rows).then(prds => {
                    console.log("Prods: ")
                    console.log(prds)
                    res.render('admin/new_sup', { products: prds, user: req.user, });
                });




            }

        });
    });

}


exports.add_product = function(req, res, next) {

    let con = new pg.Client(config);
    con.connect().then(client => {

        con.query(`INSERT INTO Products(name,id_category,count,cost,garanty) Values('${req.body.name}','${req.body.id_category}','${req.body.count}','${req.body.cost}''${req.body.garanty}');`, (err, reslt1) => {
            if (err) {
                console.log(err)
            } else {
                res.status(200).json({ message: "OK!" });
            }
        });
    });
}

exports.get_add_product = function(req, res, next) {


    let con = new pg.Client(config);
    con.connect().then(client => {

        con.query(`Select * from Categories;`, (err, categories) => {
            if (err) {
                console.log(err)
            } else {
                con.query(`Select * from Suppliers;`, (err, suppliers) => {
                    if (err) {
                        console.log(err)
                    }
                    console.log(categories)
                    res.render('admin/new_prod', { categories: categories.rows, suppliers: suppliers.rows, user: req.user, });

                });
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


exports.add_storage = function(req, res, next) {
    let con = new pg.Client(config);
    con.connect().then(client => {

        con.query(`INSERT INTO Storages(adress) Values('${req.body.address}');`, (err, reslt1) => {
            if (err) {
                console.log(err)
            } else {
                res.redirect('/get_add_store')
            }
        });
    });
}


exports.get_add_store = function(req, res, next) {


    res.render('admin/new_address', { user: req.user, });

}


exports.get_add_prod_address = function(req, res, next) {

    let con = new pg.Client(config);
    con.connect().then(client => {

        con.query(`Select * from Products left join Avaliables on Avaliables.id_product=products.id_product Where products.id_product is null; `, (err, reslt1) => {
            if (err) {
                console.log(err)
            } else {
                con.query(`Select * from Storages; `, (err, storages) => {
                    if (err) {
                        console.log(err)
                    } else {

                        res.render('admin/new_prod_address', { user: req.user, products: reslt1.rows, storages: storages.rows });
                    }
                });
            }
        });
    });
}



exports.add_prod_address = function(req, res, next) {
    let con = new pg.Client(config);
    con.connect().then(client => {

        con.query(`INSERT INTO Avaliables(id_product,id_storage) Values('${req.body.product}','${req.body.address}');`, (err, reslt1) => {
            if (err) {
                console.log(err)
                res.render('admin/new_prod_address', { user: req.user, message: "Продукт не удалось добавить. Повторите попытку позже." });
            } else {
                res.render('admin/new_prod_address', { user: req.user, message: "Продукт добавлен на склад" });
            }
        });
    });

}