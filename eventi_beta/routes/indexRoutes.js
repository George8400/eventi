const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.all('/*', (req, res, next) => {

	req.app.locals.layout = 'index';  //impostiamo il layout

	next();   //passiamo il controllo al prossimo gestore

});

/* index */
router.route('/')
	.get(indexController.index);

/* register user */ 
router.route('/register')
    .get(indexController.getRegister)
    .post(indexController.postRegister);

/* login index */ 
router.route('/login')
    .get(indexController.getLogin)
	.post(indexController.postLogin);
	
 /* login google */
 router.route('/auth/google')
	.get(indexController.getAuthGoogle);
	
router.route('/auth/google/callback')
	.get(indexController.getAuthGoogleCallback);

/* show all events */
router.route('/eventi')
	.post(indexController.searchEvent);

/* show single event */
router.route('/eventi/:_id')
	.get(indexController.getEvent);



module.exports = router;