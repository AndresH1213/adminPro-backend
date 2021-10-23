const { Router } = require('express');
/*
route: api/total/:busqueda
*/ 
const { validateJWT } = require('../middlewares/validate-jwt');
const { getSearch, getCollection } = require('../controllers/search');

const router = Router();



router.get('/:query', validateJWT, getSearch);

router.get('/collection/:table/:query', validateJWT, getCollection);


module.exports = router;