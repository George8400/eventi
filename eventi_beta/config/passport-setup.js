const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');

// Load user model
const UserSchema = require('../models/UserModel');

module.exports = function(passport) {

    /* Local */
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            // Match user
            UserSchema.findOne({ email: email })
                .then(user => {
                    if(!user) {
                        return done(null, false, {message: 'Questa email non è registrata'});
                    }

                    // Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch) {
                            return done(null, user, {message: 'Login effettuato con successo'});
                        } else {
                            return done(null, false, { message: 'Password non corretta' });
                        }

                    })

                }).catch(err => console.log(err));
        })
    )



    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        UserSchema.findById(id, (err, user) => {
            done(err, user);
        })
    });
};

