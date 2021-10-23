const { Router } = require('express');
const { fileUpload, retrieveImage } = require('../controllers/uploads');
const expressFileupload = require('express-fileupload');

/*
route: api/upload
*/ 
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.use(expressFileupload());

router.put('/:type/:id', validateJWT, fileUpload);
router.get('/:type/:photo', retrieveImage );

module.exports = router;