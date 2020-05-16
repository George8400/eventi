const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.all('/*', (req, res, next) => {
    
    req.app.locals.layout = 'user';
    
    next();
});

/* default route user */
router.route('/')
    .get(userController.index);

/* create event */ 
router.route('/createEvent')
	.get(userController.createEvent)
    .post(userController.submitCreateEvent);

/* register user */ 
router.route('/register')
    .get(userController.getRegister)
    .post(userController.postRegister);

/* login user */ 
router.route('/login')
    .get(userController.getLogin)
    .post(userController.postLogin);

module.exports = router;