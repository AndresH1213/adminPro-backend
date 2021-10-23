const { Router } = require("express");
const { check } = require('express-validator');
const { getHospitals, createHospitals, updateHospital, deleteHospitals } = require("../controllers/hospitals");

/* 
 Routes: /api/hospital
*/

const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

router.get("/" , getHospitals);

router.post("/", [
    validateJWT,
    check('name', 'The hospital name is required').not().isEmpty(),
    validateFields
], createHospitals);

router.put('/:id',[
   validateJWT,
   check('name','The name is required'),
   validateFields
] ,updateHospital);

router.delete('/:id', validateJWT, deleteHospitals )

module.exports = router;
