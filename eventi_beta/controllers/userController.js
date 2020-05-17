// file upload
const AWS = require('aws-sdk');
const { AWS_SECRET_ACCESS, AWS_ACCESS_KEY } = require('../config/configurations');
const uuid = require('uuid');

// bcrypt
const bcrypt = require('bcryptjs');

// passport
const passport = require('passport');

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
        res.render('user/categories');
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
            user: req.user._id,
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
            res.redirect('/user');
        });

    },

    

    /* Logout user */ 
    getLogout: (req, res) => {
        req.logout();
        req.flash('success_msg', 'Logout effettuato con successo');
        res.redirect('/login');
    },


    /* Show user events */
    getUserEvents: (req, res) => {

        const user_id = req.user._id;

        EventSchema.find({ user: user_id }).lean().then(event => {
            
            res.render('user/showEvent', {event: event});

            console.log(event);
        }).catch(err => console.log(err));

    },

    /* Show single event of user */
    getSingleEventUser: (req, res) => {

        const id = req.params._id;
    
        EventSchema.findById(id).lean()
            .then(event => {
                res.render('user/schedaEvent', {event: event});
            }).catch(err => console.log(err));

    },

    /* Show event in edit evvent */
    getEditEvent: (req, res) => {

        const event_id = req.params._id;

        EventSchema.findById({_id: event_id}).lean()
            .then(event => {
                res.render('user/editEvent', {event: event});
            }).catch(err => console.log(err));

    },

    /* submit edit event */
    submitEditEvent: (req, res) => {

        const event_id = req.params._id;

        console.log('sfaasf');

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
        var addressParser = citta + '%2C' + '+' + indirizzo;
        

        // create dateUtility
        const day = req.body.giorno;
        const month = req.body.mese;
        const year = req.body.anno;
        const data = (year+month+day);


        EventSchema.findById({_id: event_id}).lean()
            .then(event => {
                event.user = req.user._id;
                event.title = req.body.title;
                event.titleUtility = req.body.title.toUpperCase();
                event.description = req.body.description;
                event.categories = req.body.categories;
                event.image = fileKey;
                event.citta = req.body.citta;
                event.cittaUtility = req.body.citta.toUpperCase();    // attributo di utilità, memorizziamo la stringa in maiuscolo per favorire il controllo nella ricerca
                event.provincia = req.body.provincia;
                event.provinciaUtility = req.body.provincia.toUpperCase();
                event.indirizzo = req.body.indirizzo;
                event.indirizzoMaps = addressParser; 
                event.giorno = req.body.giorno;
                event.mese = req.body.mese;
                event.anno = req.body.anno;
                event.ora = req.body.ora;
                event.dateUtility = data;

                event.save().then(updateEvent => {
                    req.flash('success_msg', 'Evento modificato con successo!');
                    res.redirect('user/userEvents');
                }).catch(err => console.log(err));
            })
    }

};

