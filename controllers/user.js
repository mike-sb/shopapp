
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



exports.show_signup = function (req, res, next) {
        res.render('auth/signup', { formData: {}, errors: {}});
}

exports.show_login = function (req, res, next) {
    res.render('auth/login', { formData: {}, errors: {}});
}

exports.login = function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next)

}

exports.signup = function (req, res, next) {
    pool.connect().then(client=>{
        client.query('INSERT INTO Clients(Username,ID_card) Values('+req.body.username+',(SELECT ID_cardFROM Cards WHERE Sale = 0));',['pg-pool']).then(reslt=>{
            client.release();
            console.log('user added', res.rows);
            passport.authenticate('local', {
                successRedirect: "/",
                failureRedirect: "/signup",
                failureFlash: true
            })(req, res, next)
        })
       
    });
}


exports.logout = function (req, res, next) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
}