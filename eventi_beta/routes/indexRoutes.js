const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.all('/*', (req, res, next) => {

	req.app.locals.layout = 'index';  //impostiamo il layout

	next();   //passiamo il controllo al prossimo gestore

});

router.route('/')
	.get(indexController.index)
	.post(indexController.searchEvent);

router.route('/createEvent')
	.get(indexController.createEvent)
	.post(indexController.submitCreateEvent);

module.exports = router;