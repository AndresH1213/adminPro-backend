const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

/*
    Route:  /api/login
*/

router.post( '/', [
    check('email','The email is required').isEmail(),
    check('password','Password is required').not().isEmpty(),
    validateFields
], login)


module.exports = router;