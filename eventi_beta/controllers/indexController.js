const multer = require('multer');
const AWS = require('aws-sdk');
const { AWS_SECRET_ACCESS, AWS_ACCESS_KEY } = require('../config/configurations');
const uuid = require('uuid');
const EventSchema = require('../models/EventModel');

const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS
});

module.exports = {

    index: (req, res) => {
        res.render('index/categories');
    },

    searchEvent: (req, res) => {

        let search_box = req.body.search_box.toUpperCase();
        let category = req.body.categories;

        /*  EventSchema.find({title: search_box}).lean().than(event =>{
            res.render('index/showEvent', {event: event});
        }); */
        

        if(!category.length){
            EventSchema.find({cittaUtility: search_box}, null ,{sort: {dateUtility: 1}}).lean().then(event =>{  //lean() risolve il problema di handlbars, convertendo gli oggetti in oggetti json
                console.log(event);
                res.render('index/showEvent', {event: event});
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

             /* if(!event.length){
                console.log('la ricerca non ha prodotto risultati, prova con meno tag');
                if(Array.isArray(categories)){
                    EventSchema.find({categories: categories[0]}).lean().then(event2 =>{
                        console.log(event2);
                    });
                }
                else
                EventSchema.find({categories: categories}).lean().then(event2 =>{
                    console.log(event2);
                });
            }
            else
                console.log(event);  */
                console.log(event);
            res.render('index/showEvent', {event: event});
        }); 
    }
    },

    createEvent: (req, res) => {
        res.render('index/createEvent');
    },

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

        // create dateUtility
        const day = req.body.giorno;
        const month = req.body.mese;
        const year = req.body.anno;

        const data = (year+month+day);


        // Save post in mongodb
         const newEventSchema = new EventSchema({
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
            giorno: req.body.giorno,
            mese: req.body.mese,
            anno: req.body.anno,
            ora: req.body.ora,
            dateUtility: data
        });

        newEventSchema.save().then(event => {
            console.log('Salvato con successo');
            /* console.log(event); */
            res.redirect('/');
        }); 

        
    }



};