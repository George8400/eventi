// event schema
const EventSchema = require('../models/EventModel');

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
    
        EventSchema.findById(id).lean()
            .then(event => {
                res.render('index/schedaEvent', {event: event});
            })

    }



};