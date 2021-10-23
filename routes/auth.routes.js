const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

/*
    Route:  /api/login
*/

router.post( '/', [
    check('email','The email is required').isEmail(),
    check('password','Password is required').not().isEmpty(),
    validateFields
], login);
router.post( '/google', [
    check('token','google token is required').not().isEmpty(),
    
], googleSignIn)


module.exports = router;