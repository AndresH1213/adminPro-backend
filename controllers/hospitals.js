const { response } = require('express');
const Hospital = require('../models/Hospital');


exports.getHospitals = async (req, res = response) => {

    const hospitals = await Hospital.find()
                                .populate('user', 'name img')

    res.json({
        ok: true,
        hospitals
    })
}

exports.updateHospital = async (req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;
    try {
        const hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) {
            return  res.status(404).json({
                ok: false,
                msg: 'Comunicate with the administrator'
            })
        }

        const hospitalChanges = {
            ...req.body,
            user: uid
        }

        const hospitalUpdate = await Hospital.findByIdAndUpdate(id, hospitalChanges, { new: true }); 

        res.json({
            ok: true,
            msg: 'updateHospitales',
            hospital: hospitalUpdate
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comunicate with the administrator'
        })
    }
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

exports.deleteHospitals = async (req, res = response) => {
    const id = req.params.id
    try {
        
        const hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) {
            return  res.status(404).json({
                ok: false,
                msg: 'There is no such hospital'
            })
        };
        await Hospital.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Hospital deleted'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Comunicate with the admin'
        })
        console.log(error)
    }
}