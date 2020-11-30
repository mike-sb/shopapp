let LocalStrategy = require('passport-local').Strategy;

let Pool = require('pg-pool');

const config={
    user:'postgres',
    password:'94cfpmky',
    host:'127.0.0.1',
    port:5432,
    database:'shop'
}

let pool=new Pool(config);





module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id)
	});
	passport.deserializeUser(function(id, done) {
		models.User.findOne({
			where: {
				id : id
			}
		}).then(user => {
			if (user == null) {
				done(new Error('Wrong user id.'))
			}
			done(null, user);
		})
    });
    
	passport.use(new LocalStrategy({
        usernameField: 'username', 
        passwordField: 'username', 
		passReqToCallback: true
	},
	function(req, username, done) {

        pool.connect().then(client=>{
            client.query('Select username From Clients Where username='+username+';',['pg-pool']).then(reslt=>{
                if (user == null) {
                    console.log('Неверные данные для входа.')
                    req.flash('message', 'Неверные данные для входа.')
                    return done(null, false)
                } 
                return done(null, user);
            })
           
        }).catch(e=>{
            console.log(e);
        });
	}))
}