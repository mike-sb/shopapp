let LocalStrategy = require('passport-local').Strategy;

let pg = require('pg');

const config = {
    user: 'postgres',
    password: '94cfpmky',
    host: '127.0.0.1',
    port: 5432,
    database: 'shop'
}

var con = new pg.Client(config);





module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id)
    });
    passport.deserializeUser(function (id, done) {
        con.query(`Select Username From Clients Where id = ${id};`, (err, reslt) => {

            if (user == null) {
                done(new Error('Wrong user id.'))
            }
            done(null, reslt);
        })
    });

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'username',
        passReqToCallback: true
    },
        function (req, username, done) {
console.log(done)
            con.connect().then(client => {
                
                con.query(`Select * From Clients Where username = '${username}';`, (err, reslt1) => {
                    if (reslt1 == null) {
                        console.log('Неверные данные для входа.')
                        req.flash('message', 'Неверные данные для входа.')
                        return done(null, false)
                    }
                    return done(null, reslt1);
                })

            }).catch(e => {
                console.log(e);
            });
        }))
}