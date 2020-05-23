// file upload
const AWS = require('aws-sdk');
const {
    AWS_SECRET_ACCESS,
    AWS_ACCESS_KEY
} = require('../config/configurations');
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

    searchEvent: (req, res) => {

        const search_box = req.body.search_box.toUpperCase();
        const category = req.body.categories;
        

        if(category === undefined){
            EventSchema.find({cittaUtility: search_box}, null ,{sort: {dateUtility: 1}}).lean().then(event =>{  //lean() risolve il problema di handlbars, convertendo gli oggetti in oggetti json
                if(event.length){
                    console.log(event);
                    res.render('user/showEvent', {event: event});
                }
                else{
                    EventSchema.find({titleUtility: search_box}, null ,{sort: {dateUtility: 1}}).lean().then(event =>{  //lean() risolve il problema di handlbars, convertendo gli oggetti in oggetti json
                        console.log(event);
                        res.render('user/showEvent', {event: event});
                   }); 
                }
                
           }); 
        }
        else if(!search_box.length){
            EventSchema.find({categories: { $all: category}}, null ,{sort: {dateUtility: 1}}).lean().then(event =>{  //lean() risolve il problema di handlbars, convertendo gli oggetti in oggetti json
                console.log(event);
                res.render('user/showEvent', {event: event});
           }); 
        }
        else{
            EventSchema.find({categories: { $all: category}, cittaUtility: search_box}, null ,{sort: {dateUtility: 1}}).lean().then(event =>{  //lean() risolve il problema di handlbars, convertendo gli oggetti in oggetti json
                console.log(event);
                res.render('user/showEvent', {event: event});
            }); 
        }

    },

    /* get view/user/createEvent */
    createEvent: (req, res) => {
        res.render('user/createEvent');
    },

    /* Save event in db */
    submitCreateEvent: (req, res) => {

        // upload image
        let file = req.files.image;
        let fileData = file.data;
        let fileName = file.name.split('.'); // divide la stringa in tante stringhe ogni volta che incontra un "."
        let fileType = fileName[fileName.length - 1]; // assegna a fileType l'ultima stringa dell'array (in questo caso il tipo dell'oggetto)
        let newFileName = uuid.v4();

        let fileKey = `${newFileName}.${fileType}`;

        const params = {
            Bucket: 'eventi-images',
            Key: fileKey,
            Body: fileData,
            ACL: 'public-read' // rende l'oggetto leggibile da esterno in automatico
        }

        s3.upload(params, (error, data) => {
            if (error) {
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

        //create oraUtility_i for Calendar
        /* ora di inizio */
        let oraUtility_i = req.body.ora_i;
        oraUtility_i = Number(oraUtility_i.split(':').join("")) - 200;
        oraUtility_i = oraUtility_i.toString();

        if(oraUtility_i == '-200') oraUtility_i = '2200';
        if(oraUtility_i == '-170') oraUtility_i = '2230';
        if(oraUtility_i == '-100') oraUtility_i = '2300';
        if(oraUtility_i == '-70') oraUtility_i = '2330'; 
        if(oraUtility_i == '0') oraUtility_i = '0000';
        if(oraUtility_i == '30') oraUtility_i = '0030';       

        if(oraUtility_i.length == 3) {
            oraUtility_i = '0' + oraUtility_i;
        }
        /* Ora di fine */
        let oraUtility_f = req.body.ora_f;
        oraUtility_f = Number(oraUtility_f.split(':').join("")) - 200;
        oraUtility_f = oraUtility_f.toString();

        if(oraUtility_f == '-200') oraUtility_f = '2200';
        if(oraUtility_f == '-170') oraUtility_f = '2230';
        if(oraUtility_f == '-100') oraUtility_f = '2300';
        if(oraUtility_f == '-70') oraUtility_f = '2330'; 
        if(oraUtility_f == '0') oraUtility_f = '0000';
        if(oraUtility_f == '30') oraUtility_f = '0030';       

        if(oraUtility_f.length == 3) {
            oraUtility_f = '0' + oraUtility_f;
        }


        // create dateUtility_i
        const day_i = req.body.giorno_i;
        const month_i = req.body.mese_i;
        const year_i = req.body.anno_i;
        const data_i = (year_i + month_i + day_i);
        // create dateUtility_f
        const day_f = req.body.giorno_f;
        const month_f = req.body.mese_f;
        const year_f = req.body.anno_f;
        const data_f = (year_f + month_f + day_f);

        // Save post in mongodb
        const newEvent = new EventSchema({
            user: req.user._id,
            title: req.body.title,
            titleUtility: req.body.title.toUpperCase(),
            description: req.body.description,
            categories: req.body.categories,
            image: fileKey,
            citta: req.body.citta,
            cittaUtility: req.body.citta.toUpperCase(), // attributo di utilità, memorizziamo la stringa in maiuscolo per favorire il controllo nella ricerca
            provincia: req.body.provincia,
            provinciaUtility: req.body.provincia.toUpperCase(),
            indirizzo: req.body.indirizzo,
            indirizzoMaps: addressParser,
            /* data inizio */
            giorno_i: req.body.giorno_i,
            mese_i: req.body.mese_i,
            anno_i: req.body.anno_i,
            ora_i: req.body.ora_i,
            dateUtility_i: data_i,
            hoursUtility_i: oraUtility_i,
            /* data fine */
            giorno_f: req.body.giorno_f,
            mese_f: req.body.mese_f,
            anno_f: req.body.anno_f,
            ora_f: req.body.ora_f,
            dateUtility_f: data_f,
            hoursUtility_f: oraUtility_f,

        });

        newEvent.save().then(event => {
            req.flash('success_msg', 'Evento creato con successo!');
            console.log(event);
            res.redirect('/user');
        });

    },



    /* Show event in edit event */
    getEditEvent: (req, res) => {

        const event_id = req.params._id;
        const user_id = req.user._id;

        EventSchema.findOne({
                _id: event_id,
                user: user_id
            }).lean()
            .then(event => {
                res.render('user/editEvent', {
                    event: event
                });
            }).catch(err => console.log(err));
            
    },

    /* submit edit event */
    submitEditEvent: (req, res) => {


        const event_id = req.params._id;

        if (req.files) {
            // upload image
            let file = req.files.image;
            let fileData = file.data;
            let fileName = file.name.split('.'); // divide la stringa in tante stringhe ogni volta che incontra un "."
            let fileType = fileName[fileName.length - 1]; // assegna a fileType l'ultima stringa dell'array (in questo caso il tipo dell'oggetto)
            let newFileName = uuid.v4();

            let fileKey = `${newFileName}.${fileType}`;

            const params = {
                Bucket: 'eventi-images',
                Key: fileKey,
                Body: fileData,
                ACL: 'public-read' // rende l'oggetto leggibile da esterno in automatico
            }

            s3.upload(params, (error, data) => {
                if (error) {
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


        //create hoursUtility for Calendar
        let oraUtility = req.body.ora;
        oraUtility = Number(oraUtility.split(':').join("")) - 200;
        oraUtility = oraUtility.toString();

        if(oraUtility == '-200') oraUtility = '2200';
        if(oraUtility == '-170') oraUtility = '2230';
        if(oraUtility == '-100') oraUtility = '2300';
        if(oraUtility == '-70') oraUtility = '2330'; 
        if(oraUtility == '0') oraUtility = '0000';
        if(oraUtility == '30') oraUtility = '0030';       

        if(oraUtility.length == 3) {
            oraUtility = '0' + oraUtility;
        }

        // create dateUtility
        const day = req.body.giorno;
        const month = req.body.mese;
        const year = req.body.anno;
        const data = (year + month + day);


        EventSchema.findById({
                _id: event_id
            })
            .then(event => {
                event.user = req.user._id;
                event.title = req.body.title;
                event.titleUtility = req.body.title.toUpperCase();
                event.description = req.body.description;
                event.categories = req.body.categories;
                event.image = fileKey;
                event.citta = req.body.citta;
                event.cittaUtility = req.body.citta.toUpperCase(); // attributo di utilità, memorizziamo la stringa in maiuscolo per favorire il controllo nella ricerca
                event.provincia = req.body.provincia;
                event.provinciaUtility = req.body.provincia.toUpperCase();
                event.indirizzo = req.body.indirizzo;
                event.indirizzoMaps = addressParser;
                /* data inizio */
                event.giorno_i = req.body.giorno_i;
                event.mese_i = req.body.mese_i;
                event.anno_i = req.body.anno_i;
                event.ora_i = req.body.ora_i;
                event.dateUtility_i = data_i;
                event.hoursUtility_i = oraUtility_i;
                /* data fine */
                event.giorno_f = req.body.giorno_f;
                event.mese_f = req.body.mese_f;
                event.anno_f = req.body.anno_f;
                event.ora_f = req.body.ora_f;
                event.dateUtility_f = data_f;
                event.hoursUtility_f = oraUtility_f;

                event.save().then(updateEvent => {
                    req.flash('success_msg', 'Evento modificato con successo!');
                    res.redirect('/user/userEvents');
                }).catch(err => console.log(err));
            });
        }

        else if(!req.files){
        // create addressParser for maps
        let citta = req.body.citta;
        let indirizzo = req.body.indirizzo;

        citta = citta.split(' ').join('+');
        indirizzo = indirizzo.split(' ').join('+');
        var addressParser = citta + '%2C' + '+' + indirizzo;

        //create hoursUtility for Calendar
        let oraUtility = req.body.ora;
        oraUtility = Number(oraUtility.split(':').join("")) - 200;
        oraUtility = oraUtility.toString();

        if(oraUtility == '-200') oraUtility = '2200';
        if(oraUtility == '-170') oraUtility = '2230';
        if(oraUtility == '-100') oraUtility = '2300';
        if(oraUtility == '-70') oraUtility = '2330'; 
        if(oraUtility == '0') oraUtility = '0000';
        if(oraUtility == '30') oraUtility = '0030';       

        if(oraUtility.length == 3) {
            oraUtility = '0' + oraUtility;
        }

        // create dateUtility
        const day = req.body.giorno;
        const month = req.body.mese;
        const year = req.body.anno;
        const data = (year + month + day);


        EventSchema.findById({
                _id: event_id
            })
            .then(event => {
                event.user = req.user._id;
                event.title = req.body.title;
                event.titleUtility = req.body.title.toUpperCase();
                event.description = req.body.description;
                event.categories = req.body.categories;
                event.citta = req.body.citta;
                event.cittaUtility = req.body.citta.toUpperCase(); // attributo di utilità, memorizziamo la stringa in maiuscolo per favorire il controllo nella ricerca
                event.provincia = req.body.provincia;
                event.provinciaUtility = req.body.provincia.toUpperCase();
                event.indirizzo = req.body.indirizzo;
                event.indirizzoMaps = addressParser;
                /* data inizio */
                event.giorno_i = req.body.giorno_i;
                event.mese_i = req.body.mese_i;
                event.anno_i = req.body.anno_i;
                event.ora_i = req.body.ora_i;
                event.dateUtility_i = data_i;
                event.hoursUtility_i = oraUtility_i;
                /* data fine */
                event.giorno_f = req.body.giorno_f;
                event.mese_f = req.body.mese_f;
                event.anno_f = req.body.anno_f;
                event.ora_f = req.body.ora_f;
                event.dateUtility_f = data_f;
                event.hoursUtility_f = oraUtility_f;

                event.save().then(updateEvent => {
                    req.flash('success_msg', 'Evento modificato con successo!');
                    res.redirect('/user/userEvents');
                    console.log(updateEvent);
                }).catch(err => console.log(err));
            });
        }
    },

    /* edit cancel */
    getCancelEdit: (req, res) => {
        req.flash('success_msg', 'Modifica annullata');
        res.redirect('/user/userEvents');
    },

    /* delete event */
    getDeleteEvent: (req, res) => {
        EventSchema.findByIdAndDelete({_id: req.params._id})
            .then(deleteEvent => {
                req.flash('success_msg', `L'evento ${deleteEvent.title} è stato eliminato`);
                res.redirect('/user/userEvents');
            })

    },



    /* Show user events */
    getUserEvents: (req, res) => {

        const user_id = req.user._id;

        EventSchema.find({
            user: user_id
        }).lean()
            .then(event => {
                UserSchema.find({
                    _id: user_id
                }).lean()
                .then(user => {
                    res.render('user/showEvent', {
                        event: event, user: user
                });
                console.log(user[0].email);
            });
            
        }).catch(err => console.log(err));

    },

    /* Show single event of user */
    getSingleEventUser: (req, res) => {

        const event_id = req.params._id;
        const user_id = req.user._id;

        EventSchema.findOne({
            _id: event_id, 
            user: user_id
        }).lean()
            .then(eventUser => {
                if(!eventUser){
                    EventSchema.findOne({
                        _id: event_id, 
                    }).lean()
                        .then(event => {  
                            res.render('user/schedaEvent', {
                                event: event
                            });
                        }).catch(err => console.log(err));
                } else {
                res.render('user/schedaEvent', {
                    eventUser: eventUser
                });
            }
            }).catch(err => console.log(err));
    },


    

    /* Logout user */
    getLogout: (req, res) => {
        req.logout();
        req.flash('success_msg', 'Logout effettuato con successo');
        res.redirect('/login');
    },

};