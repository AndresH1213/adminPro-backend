const  { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

exports.getUsers = async (req, res) => {
    
    const user = await User.find({}, 'name email google');

    res.status(400).json({
        ok: true,
        user,
        uid: req.uid
    })
};

exports.createUsers = async (req, res = response) => {
    
    const { email, password } = req.body;

    try {

        const emailExist = await User.findOne({ email });

        if (emailExist) {
            return res.status(400).json({
                ok: false,
                msg: 'There is already that email'
            })
        }

        const user = new User( req.body );

        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt)

        //save user
        await user.save();

        // generate token JWT
        const jwt = await generateJWT(user._id);

        res.status(200).json({
            ok: true,
            user,
            jwt
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })
    };
};

exports.updateUser = async (req, res= response) => {
    
    const uid = req.params.id;

    // TODO: Validate token and check if is the correct user
    try {

        const userDB = await User.findById(uid);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'There is no such user id'
            });
        }

        // Update
        // if password and google are sent we don't change it
        const { password, google, ...fields } = req.body;
        console.log(userDB.t, req.body.email)
        if ( userDB.email !== req.body.email ) {
            const existEmail = await User.findOne({ email: req.body.email });
            if ( existEmail ){
                return res.status(400).json({
                    ok: false,
                    msg: 'Theres already one user with that email'
                })
            }
        }
        
        const userActualized = await User.findByIdAndUpdate( uid, fields, { new: true } );

        res.json({
            ok: true,
            uid,
            user: userActualized
        })

    } catch (err){
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

exports.deleteUser = async (req, res = response ) => {

    const uid = req.params.id;

    try {
        
        const userDB = await User.findById(uid);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'There is no such user id'
            });
        }

        await User.findOneAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario deleted'
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Please comunicate with the admin'
        })
    }
}
