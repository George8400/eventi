const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.all('/*', (req, res, next) => {

	req.app.locals.layout = 'index';  //impostiamo il layout

	next();   //passiamo il controllo al prossimo gestore

});

router.route('/')
	.get(indexController.index);



router.route('/eventi')
	.post(indexController.searchEvent);


router.route('/eventi/:_id')
	.get(indexController.getEvent);

module.exports = router;