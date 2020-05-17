// Global Variables
const { mongodbUrl, PORT } = require('./config/configurations');
const {globalVariables} = require('./config/configurations');

// Modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const handlebars = require('express-handlebars');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
 
// Passport config
require('./config/passport-google')(passport);
require('./config/passport-setup')(passport);



// EXPRESS SERVER
const app = express();

// CONNECT TO THE DATABASE
mongoose.connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(response => {
        console.log("MongoDB Connected Succesfully.");
    }).catch(err => {
        console.log("Database connection failed.");
});

// Configure express
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


// SETUP VIEW ENGINE TO USE HANDLEBARS
app.engine('handlebars', handlebars({defaultLayout: 'index'}));
app.set('view engine', 'handlebars');


// Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Connect flash
app.use(flash());

// Passport middleware initialize 
app.use(passport.initialize());
app.use(passport.session());

// Use global variables
app.use(globalVariables);



// File Upload Middleware
app.use(fileUpload());

//ROUTES
const indexRoutes = require('./routes/indexRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/', indexRoutes);
app.use('/user', userRoutes);




//START SERVER
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});