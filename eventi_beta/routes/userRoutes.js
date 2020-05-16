const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// controller authentication
const { ensureAuthenticated } = require('../config/auth');

router.all('/*', (req, res, next) => {
    
    req.app.locals.layout = 'user';
    
    next();
});

/* default route user */
router.route('/')
    .get(userController.index);

/* create event */ 
router.route('/createEvent')
	.get(ensureAuthenticated, userController.createEvent)
    .post(userController.submitCreateEvent);



/* logout user */
router.route('/logout')
    .get(userController.getLogout);

module.exports = router;