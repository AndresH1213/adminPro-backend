const { response } = require("express");
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { generateJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");
const { getMenu } = require('../helpers/menu-frontend');



exports.login = async (req, res = response) => {

    const { email, password } = req.body;
    
    try {
        // email verify
        const userDB = await User.findOne({ email });

        if ( !userDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email invalid',
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
            token,
            menu: getMenu(userDB.role)
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comunicate with the admin'
        })
    }
};

exports.googleSignIn = async (req, res= response) => {
    const googleToken = req.body.token;

    try {
        const {name, email, picture } = await googleVerify(googleToken);

        const userDB = await User.findOne({ email });
        let user;

        if (!userDB) {
            user = new User({
                name,
                email,
                password: '***',
                img: picture,
                google: true
            })
        } else {
            user = userDB;
            user.google = true;
        }

        await user.save();
        
        // generate token JWT
        const token = await generateJWT( user.id );

        res.json({
            ok: true,
            token,
            menu: getMenu(user.role),
        })
    } catch (error) {
        res.json({
            ok:false,
            mgs: 'token no es correcto'
        })
    } 
};

exports.renewToken = async (req, res = response) => {

    const uid = req.uid;

    const user = await User.findById(uid);

    // generate token JWT
    const token = await generateJWT( uid );

    res.json({
        ok: true,
        token,
        user,
        menu: getMenu(user.role),
    });
}