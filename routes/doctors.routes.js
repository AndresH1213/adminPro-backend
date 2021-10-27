const { Router } = require("express");
const { check } = require('express-validator');
const { getDoctors, createDoctors, updateDoctor, deleteDoctors, getByIdDoctors } = require('../controllers/doctors')

/* 
 Routes: /api/doctors
*/

const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

router.get("/" ,validateJWT, getDoctors);

router.post("/", [
    validateJWT,
    check('name', 'The doctor name is required.').not().isEmpty(),
    check('hospital','The hospital ID have to be valid').isMongoId(),
    validateFields
], createDoctors);

router.put('/:id',[
   validateJWT,
   check('name','The name is required').not().isEmpty(),
   check('hospital','The hospital ID have to be valid').isMongoId(),
   validateFields
] ,updateDoctor);

router.delete('/:id', validateJWT ,deleteDoctors );

router.get('/:id', validateJWT , getByIdDoctors );

module.exports = router;