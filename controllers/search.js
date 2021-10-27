const  { response } = require('express');

const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const User = require('../models/User');

exports.getSearch = async (req, res = response) => {
    
    const query = req.params.query;
    const regex = new RegExp(query, 'i');

    const [ users, doctors, hospitals ] = await Promise.all([
        User.find({name: regex}),
        Doctor.find({name: regex}),
        Hospital.find({name: regex})
    ]);


    res.json({
        ok: true,
        users,
        doctors,
        hospitals
    })
}

exports.getCollection = async (req, res = response) => {
    const { table, query } = req.params;
    const regex = new RegExp(query, 'i');

    let data = [];

    switch (table) {
        case 'doctors':
            data = await Doctor.find({name: regex})
                                .populate('user', 'name img')
                                .populate('hospital', 'name img')
            break;
        case 'hospitals':
            data = await Hospital.find({name: regex})
                                .populate('user', 'name img')
            break;
        case 'users':
            data = await User.find({name: regex})
            break;
    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'The query has to be in users/doctors or hospitals'
            })
    }

    res.json({
        ok: true,
        results: data
    });
}