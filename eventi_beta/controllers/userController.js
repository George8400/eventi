// file upload
const AWS = require('aws-sdk');
const { AWS_SECRET_ACCESS, AWS_ACCESS_KEY } = require('../config/configurations');
const uuid = require('uuid');

// bcrypt
const bcrypt = require('bcryptjs');

// event schema
const EventSchema = require('../models/EventModel');

// UserModel
const UserSchema = require('../models/UserModel');





// initialized S3 for file upload
const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS
});

module.exports = {

    /* get view/user/index */
    index: (req, res) => {
        res.render('user/index');
    },

    /* get view/user/createEvent */
    createEvent: (req, res) => {
        res.render('user/createEvent');
    },

    /* Save event in db */
    submitCreateEvent: (req, res) => {

        // upload image
        let file = req.files.image; 
        const fileData = file.data;
        const fileName = file.name.split('.');        // divide la stringa in tante stringhe ogni volta che incontra un "."
        const fileType = fileName[fileName.length - 1];     // assegna a fileType l'ultima stringa dell'array (in questo caso il tipo dell'oggetto)
        const newFileName = uuid.v4();

        const fileKey = `${newFileName}.${fileType}`;

        const params = {
            Bucket: 'eventi-images',
            Key: fileKey,
            Body: fileData,
            ACL: 'public-read'       // rende l'oggetto leggibile da esterno in automatico
        }

        s3.upload(params, (error, data) => {
            if(error){
                res.status(500).send('bucket non raggiungibile');
            }
            /* res.status(200).send(data); */
        });


        
        // create addressParser for maps
        let citta = req.body.citta;
        let indirizzo = req.body.indirizzo;

        citta = citta.split(' ').join('+');
        indirizzo = indirizzo.split(' ').join('+');
        var addressParser = citta + '%2C' + '+' + indirizzo + '%2C';
        

        // create dateUtility
        const day = req.body.giorno;
        const month = req.body.mese;
        const year = req.body.anno;
        const data = (year+month+day);
            
        // Save post in mongodb
        const newEvent = new EventSchema({
            title: req.body.title,
            titleUtility: req.body.title.toUpperCase(),
            description: req.body.description,
            categories: req.body.categories,
            image: fileKey,
            citta: req.body.citta,
            cittaUtility: req.body.citta.toUpperCase(),    // attributo di utilità, memorizziamo la stringa in maiuscolo per favorire il controllo nella ricerca
            provincia: req.body.provincia,
            provinciaUtility: req.body.provincia.toUpperCase(),
            indirizzo: req.body.indirizzo,
            indirizzoMaps: addressParser, 
            giorno: req.body.giorno,
            mese: req.body.mese,
            anno: req.body.anno,
            ora: req.body.ora,
            dateUtility: data,

        });
    
        newEvent.save().then(event => {
            console.log('Salvato con successo');
            console.log(event); 
            res.redirect('/');
        });

    },

    /* Register user */
    getRegister: (req, res) => {
        res.render('user/register');
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
            res.render('user/register', { errors: errors, email, password, password2});
        } else {
            // Validation passed
            UserSchema.findOne({ email: email})
                .then(user => {
                    if(user) {
                        // User exists
                        errors.push('Email già registrata, prova ad effettuare il login');
                        res.render('user/register', { warning: errors, email, password, password2});
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
                                res.redirect('/user/login');
                            }).catch(err => console.log(err));
                        }));

                        
                    }
                });
        } 

        

    },

    /* Login user */
    getLogin: (req, res) => {
        res.render('user/login');
    },
    postLogin: (req, res) => {
        res.send('user/login');
    },

};

