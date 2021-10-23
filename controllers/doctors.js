const { response } = require('express');
const Doctor = require('../models/Doctor');

exports.getDoctors = async (req, res = response) => {

    const doctors = await Doctor.find()
                        .populate('user','name img')
                        .populate('hospital','name img');
    res.json({
        ok: true,
        doctors
    })
}

exports.updateDoctor = (req, res = response) => {

    res.json({
        ok: true,
        msg: 'updateDoctores'
    })
}

exports.createDoctors = async (req, res = response) => {

    const uid = req.uid;
    const { name, hospital } = req.body; 
    const doctor = new Doctor({user: uid,
        name,
        hospital
        });
        
    try {
        const doctorDB = await doctor.save();
        res.json({
            ok: true,
            doctor: doctorDB
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Please comunicate with the admin'
        })
    }

}

exports.deleteDoctors = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'deleteDoctores'
    })
}