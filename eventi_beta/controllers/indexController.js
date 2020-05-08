const EventSchema = require('../models/EventModel');
const CategorySchema = require('../models/CategoryModel');

module.exports = {

    index: (req, res) => {
        res.render('index/categories');
    },

    searchEvent: (req, res) => {

        let search_box = req.body.search_box;

        let categories = req.body.categories;

        /* EventSchema.find({title: search_box}),lean().than(event =>{
            res.render('index/showEvent', {event: event});
        })
        */

        EventSchema.find({categories: categories}).lean().then(event =>{  //lean() risolve il problema di handlbars, convertendo gli oggetti in oggetti json

             if(!event.length){
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
                console.log(event); 

            res.render('index/showEvent', {event: event});
        });
        
        
    },

    createEvent: (req, res) => {
        res.render('index/createEvent');

        console.log(req.body);
    },

    submitCreateEvent: (req, res) => {

        const newEventSchema = new EventSchema({
            title: req.body.title,
            description: req.body.description,
            categories: req.body.categories
        });

        newEventSchema.save().then(event => {
            console.log('Salvato con successo');
            res.redirect('/');
        });
    }



};