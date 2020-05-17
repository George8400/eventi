const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// controller authentication
const { ensureAuthenticated } = require('../config/auth');

router.all('/*', ensureAuthenticated, (req, res, next) => {
    
    req.app.locals.layout = 'user';
    
    next();
});

/* default route user */
router.route('/')
    .get(userController.index);

/* create event */ 
router.route('/createEvent')
	.get(ensureAuthenticated, userController.createEvent)
    .post(ensureAuthenticated, userController.submitCreateEvent);



/* logout user */
router.route('/logout')
    .get(ensureAuthenticated, userController.getLogout);

/* show events create user */
router.route('/userEvents')
    .get(ensureAuthenticated, userController.getUserEvents);

/* show single event of user */
router.route('/eventi/:_id')
    .get(ensureAuthenticated, userController.getSingleEventUser);

    
/* edit event */
router.route('/eventi/editEvent/:_id')
    .get(ensureAuthenticated, userController.getEditEvent)
    .put(ensureAuthenticated, userController.submitEditEvent);

module.exports = router;