const { response } = require("express");
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { generateJWT } = require("../helpers/jwt");

exports.login = async (req, res = response) => {

    const { email, password } = req.body;
    
    try {
        // email verify
        const userDB = await User.findOne({ email });

        if ( !userDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email invalid'
            });
        }

        // password verify
        const validPassword = bcrypt.compareSync(password, userDB.password );
        
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password invalid'
            })
        }

        // generate token JWT
        const token = await generateJWT( userDB.id );

        res.json({
            ok: true,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comunicate with the admin'
        })
    }
};