

let models = require('../models');
let bcrypt = require('bcrypt');
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





exports.show_signup = function (req, res, next) {
    res.render('auth/signup', { formData: {}, errors: {} });
}

exports.show_login = function (req, res, next) {
    res.render('auth/login', { formData: {}, errors: {} });
}

exports.login = function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next)

}
const generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}
exports.signup = function (req, res, next) {

    let User = models.User.build({
        username: req.body.username,
        password: generateHash(req.body.password)
    });

let con = new pg.Client(config);

    User.save().then(resultat => {
        con.connect().then(client => {

            con.query(`INSERT INTO Clients(id_client, username, ID_card) Values('${resultat.id}','${req.body.username}',(SELECT ID_card FROM Cards WHERE Sale = 0));`, (err, reslt1) => {
                if (err) {
                    console.log(err)
                }
                if (reslt1) {
                    console.log('user added', reslt1.rows[0]);
                    console.log(reslt1)
                    
                }
                con.end()
            })

        }).catch(e => {
            console.log(e);
        });

        console.log(resultat)
        passport.authenticate('local', {
            successRedirect: "/",
            failureRedirect: "/signup",
            failureFlash: true
        })(req, res, next)

    })


}


exports.logout = function (req, res, next) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
}