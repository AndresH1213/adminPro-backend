const { Router } = require("express");
const { check } = require('express-validator');

const { getUsers, createUsers, updateUser, deleteUser } = require("../controllers/users");
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require("../middlewares/validate-jwt");

/*
    main Route : /api/users
*/

const router = Router();

router.get("/", validateJWT , getUsers);

router.post("/", [
    // validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validateFields
], createUsers);

router.put('/:id',[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('role', 'El role es obligatorio'),
    validateFields
] ,updateUser);

router.delete('/:id', validateJWT, deleteUser )

module.exports = router;
