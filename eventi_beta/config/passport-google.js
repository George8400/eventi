var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

// Load user model
const UserSchema = require('../models/UserModel');

/* Google */

module.exports = function(passport) {



passport.use(new GoogleStrategy({
                clientID: '944703173810-ase1vc469ieoge1c91asn1kmj7p6cfki.apps.googleusercontent.com',
                clientSecret: '7-E44hybdcDIZNUplZxAf9Oz',
                callbackURL: "http://localhost:3000/auth/google/callback"
            },
            function (accessToken, refreshToken, profile, done) {

                console.log('access Token:  ' + accessToken);
                console.log('refresh Roken:  ' + refreshToken);
                console.log('profile  ' + profile.id + ' ' + profile.emails[0].value);

                UserSchema.findOne({
                        id_google: profile.id
                    }).then(user => {
                        if (user) {
                            return done(null, user);
                        } else if (!user) {
                            const newUser = new UserSchema({
                                id_google: profile.id.toString(),
                                email: profile.emails[0].value
                            });
                            // save the user
                            newUser.save().then(user => {
                                console.log('Utente salvato con successo');
                                console.log(user);
                            }).catch(err => console.log(err));

                        } else {
                            return done(err);
                        }


                    
                    });


                

                }));
            
                passport.serializeUser((user, done) => {
                    done(null, user.id);
                    console.log('serialize');
                });

                passport.deserializeUser((id, done) => {
                    UserSchema.findById(id, (err, user) => {
                        done(err, user);
                        console.log('deserialize');
                    })
                });
            


            };