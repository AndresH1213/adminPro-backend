const jwt = require('jsonwebtoken');
const User = require('../models/User')

exports.validateJWT = (req, res, next) => {
    // Read the token
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'There is no token in the request'
        })
    }

    try {
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );
        req.uid = uid;
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'No valid token'
        })
    }
}

exports.validateADMIN_ROLE = async (req, res, next) => {
    
    const uid = req.uid;
    
    try {

        const userDB = await User.findById(uid);
        
        if (!userDB) {
            return res.status(404).json({
                ok:false,
                msg: "User does not exist"
            })
        }

        if ( userDB.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok:false,
                msg: "Does not have privileges to do that"
            })
        }

        next();

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Speak with the administrator'
        })
    }
}

exports.validateAdminOsameUser = async (req, res, next) => {
    
    const uid = req.uid;
    const id = req.params.id;
    
    try {

        const userDB = await User.findById(uid);
        
        if (!userDB) {
            return res.status(404).json({
                ok:false,
                msg: "User does not exist"
            })
        }

        if ( userDB.role === 'ADMIN_ROLE' || uid === id) {
            next();
        } else {
            return res.status(403).json({
                ok:false,
                msg: "Does not have privileges to do that"
            });
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Speak with the administrator'
        })
    }
}