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

exports.updateDoctor = async (req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;
    try {
        const doctor =  await Doctor.findById(id);

        if (!doctor) {
            return res.status(404).json({
                ok: false,
                msg: 'that ids Doctor is not found'
            })
        };

        const doctorChanges = {
            ...req.body,
            user: uid
        };

        const doctorUpdate = await Doctor.findOneAndUpdate(id, doctorChanges, {new:true});

        res.json({
            ok: true,
            doctor: doctorUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please comunicate with your administrator'
        })    
    }
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

exports.deleteDoctors = async (req, res = response) => {
    const id = req.params.id
    try {
        
        const doctorDB = await Doctor.findById(id);

        if (!doctorDB) {
            return  res.status(404).json({
                ok: false,
                msg: 'There is no such doctor'
            })
        };
        await Doctor.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'doctor deleted'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Comunicate with the admin'
        })
        console.log(error)
    }
}