const { response } = require('express');
const Hospital = require('../models/Hospital');


exports.getHospitals = async (req, res = response) => {

    const hospitales = await Hospital.find()
                                .populate('user', 'name img')

    res.json({
        ok: true,
        hospitales
    })
}

exports.updateHospital = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'updateHospitales'
    })
}

exports.createHospitals = async (req, res = response) => {
    
    const uid = req.uid;
    const hospital = new Hospital( {user: uid,
        ...req.body} );
    try {


        const hospitalDb = await hospital.save()

        res.json({
        ok: true,
            hospital: hospitalDb
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Comunicate with the admin'
        })
        console.log(error)
    }

}

exports.deleteHospitals = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'deleteHospitales'
    })
}