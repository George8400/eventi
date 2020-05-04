// Global Variables
const { mongodbUrl, PORT } = require('./config/configurations');

// Modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const handlebars = require('express-handlebars');




// EXPRESS SERVER
const app = express();

// Configure express
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


// CONNECT TO THE DATABASE
mongoose.connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true})
        .then(response => {
            console.log("MongoDB Connected Succesfully.");
        }).catch(err => {
            console.log("Database connection failed.");
});


// SETUP VIEW ENGINE TO USE HANDLEBARS
app.engine('handlebars', handlebars({defaultLayout: 'index'}));
app.set('view engine', 'handlebars');


//ROUTES
const indexRoutes = require('./routes/indexRoutes');
app.use('/', indexRoutes);





//START SERVER
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});