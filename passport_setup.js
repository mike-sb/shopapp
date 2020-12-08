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


let bcrypt = require('bcrypt');
let models = require('./models');

const validPassword = function(user, password) {
	return bcrypt.compareSync(password, user.password);
}
module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		console.log('Serial')
		done(null, user.id)
	});
	passport.deserializeUser(function(id, done) {
		console.log('Deserial')
		models.User.findOne({
			where: {
				'id' : id
			}
		}).then(user => {
			if (user == null) {
				console.log('Error')
				done(new Error('Wrong user id.'))
			}
			done(null, user);
		})
	});
	passport.use(new LocalStrategy({
		usernameField: 'username', 
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, username, password, done) {
		console.log('Serarching')
		return models.User.findOne({
			where: {
				'username' : username
			},
		}).then(user => {
			if (user == null) {
				console.log('Error')
				req.flash('message', 'Incorrect credentials.')
				return done(null, false)
			} else if (user.password == null || user.password == undefined) {
				console.log('Error')
				req.flash('message', 'You must reset your password')
				return done(null, false)
			} else if(!validPassword(user, password)) {
				console.log('Error')
				req.flash('message', 'Incorrect credentials')
				return done(null, false)
			}
			return done(null, user);
		}).catch(err => {
			done(err, false);
		})
	}))
}



// module.exports = function (passport) {
//     passport.serializeUser(function (user, done) {
//         done(null, user.id)
//     });
//     passport.deserializeUser(function (id, done) {
//         con.query(`Select Username From Clients Where id = ${id};`, (err, reslt) => {

//             if (user == null) {
//                 done(new Error('Wrong user id.'))
//             }
//             done(null, reslt);
//         })
//     });

//     passport.use(new LocalStrategy({
//         usernameField: 'username',
//         passwordField: 'username',
//         passReqToCallback: true
//     },
//         function (req, username, done) {
// console.log(done)
//             con.connect().then(client => {
                
//                 con.query(`Select * From Clients Where username = '${username}';`, (err, reslt1) => {
//                     if (reslt1 == null) {
//                         console.log('Неверные данные для входа.')
//                         req.flash('message', 'Неверные данные для входа.')
//                         return done(null, false)
//                     }
//                     return done(null, reslt1);
//                 })

//             }).catch(e => {
//                 console.log(e);
//             });
//         }))
// }