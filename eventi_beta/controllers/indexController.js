// EventModel
const EventSchema = require('../models/EventModel');

// UserModel
const UserSchema = require('../models/UserModel');

// bcrypt
const bcrypt = require('bcryptjs');

// passport
const passport = require('passport');





module.exports = {

    index: (req, res) => {
        res.render('index/categories');
    },

    searchEvent: (req, res) => {

        const search_box = req.body.search_box.toUpperCase();
        const category = req.body.categories;
        

        if(category === undefined){
            EventSchema.find({cittaUtility: search_box}, null ,{sort: {dateUtility: 1}}).lean().then(event =>{  //lean() risolve il problema di handlbars, convertendo gli oggetti in oggetti json
                if(event.length){
                    console.log(event);
                    res.render('index/showEvent', {event: event});
                }
                else{
                    EventSchema.find({titleUtility: search_box}, null ,{sort: {dateUtility: 1}}).lean().then(event =>{  //lean() risolve il problema di handlbars, convertendo gli oggetti in oggetti json
                        console.log(event);
                        res.render('index/showEvent', {event: event});
                   }); 
                }
                
           }); 
        }
        else if(!search_box.length){
            EventSchema.find({categories: { $all: category}}, null ,{sort: {dateUtility: 1}}).lean().then(event =>{  //lean() risolve il problema di handlbars, convertendo gli oggetti in oggetti json
                console.log(event);
                res.render('index/showEvent', {event: event});
           }); 
        }
        else{
            EventSchema.find({categories: { $all: category}, cittaUtility: search_box}, null ,{sort: {dateUtility: 1}}).lean().then(event =>{  //lean() risolve il problema di handlbars, convertendo gli oggetti in oggetti json
                console.log(event);
                res.render('index/showEvent', {event: event});
            }); 
        }
    },

    
    getEvent: (req, res) => {

        const id = req.params._id;

        EventSchema.findByIdAndUpdate({ _id: id}, {$inc: {views: 1}}, { new: true }, (err) => {
            if(err) throw(err);
        });
    
        EventSchema.findById(id).lean()
            .then(event => {
                res.render('index/schedaEvent', {event: event});
            })

    },

    /* Register user */
    getRegister: (req, res) => {
        res.render('index/register');
    },
    postRegister: (req, res) => {
        const { email, password, password2 } = req.body;
        
        let errors = [];

        // Check required fields
        if(!email || !password || !password2){
            errors.push('Riempire tutti i campi');
            console.log('riempire tutti i campi')
        }

        // Check passwords match
        if(password !== password2) {
            errors.push('Le passwords non corrispondono');
            console.log('le password non si trovano')
        }

        // check pass length
        if(password.length < 8) {
            errors.push( 'La lunghezza della password deve essere maggiore o uguale a 8 caratteri' );
        }

        // render messages errors
        if(errors.length > 0){
            res.render('index/register', { errors: errors, email, password, password2});
        } else {
            // Validation passed
            UserSchema.findOne({ email: email})
                .then(user => {
                    if(user) {
                        // User exists
                        errors.push('Email già registrata, prova ad effettuare il login');
                        res.render('index/register', { warning: errors, email, password, password2});
                    } else {
                        const newUser = new UserSchema({
                            email,
                            password
                        });

                        // Hash Password
                        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            // set password to hashed
                            newUser.password = hash;
                            // Save User in db
                            newUser.save().then(user => {
                                console.log('Utente salvato con successo');
                                console.log(user); 
                                req.flash('success_msg' , 'Registrazione effettuata con successo, ora puoi procedere con il login');
                                res.redirect('/login');
                            }).catch(err => console.log(err));
                        }));

                        
                    }
                });
        } 

        

    },

    /* Login user */
    getLogin: (req, res) => {
        res.render('index/login');
    },
    postLogin: (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/user/createEvent',
            failureRedirect: '/login', 
            failureFlash: 'Username o password errata',
            successFlash: 'Login effettuato con successo'
        })(req, res, next);
    },



    /* login google */
    getAuthGoogle: (req, res, next) => {
        console.log('getAuthGoogle');
        passport.authenticate('google', {scope: ['profile', 
                                        'email']})(req, res, next);
    },

    getAuthGoogleCallback: (req, res, next) => {
        console.log('getAuthGoogleCallback');
        passport.authenticate('google', { 
            failureRedirect: '/login',
            successRedirect: '/user/createEvent',
            failureFlash: 'Qualcosa è andato storto :( ..riprova',
            successFlash: 'Login effettuato con successo'
        })(req, res, next);
    }



};