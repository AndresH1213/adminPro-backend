const  { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

exports.getUsers = async (req, res) => {

    const upTo = Number(req.query.upto) || 0;
    
    // Execute the two asynchronus task at the time.
    const [ users, total ] = await Promise.all([
        User.find({}, 'name email role google img').skip( upTo ).limit( 5 ),
        User.countDocuments()    
    ])

    res.json({
        ok: true,
        users,
        total
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
        const token = await generateJWT(user._id);

        res.status(200).json({
            ok: true,
            user,
            token
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
        const { password, google, email, ...fields } = req.body;

        if ( userDB.email !== req.body.email ) {
            const existEmail = await User.findOne({ email: email });
            if ( existEmail ){
                return res.status(400).json({
                    ok: false,
                    msg: 'Theres already one user with that email'
                })
            }
        }
        
        if (!userDB.google) {
            fields.email = email;
        } else if ( userDB.email !== email) {
            return res.status(400).json({
                ok: false,
                msg: 'Google users can not change their email'
            })
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

        await User.findOneAndDelete({'_id':uid});

        res.json({
            ok: true,
            msg: 'User deleted'
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Please comunicate with the admin'
        })
    }
}
