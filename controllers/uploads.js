const path = require('path');
const fs = require('fs');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { updateImage } = require("../helpers/update-image");

exports.fileUpload = (req, res = response) => {
    
    const type = req.params.type;
    const uid = req.params.id;
    const typesAllowed = ['hospitals','doctors','users']

    if (!typesAllowed.includes(type)){
        return res.status(400).json({
            ok: false,
            msg: 'the type selected is not hospital, doctor or user'
        });
    }
    // validate file exist
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'There is no files uploaded'
        })
    }

    // image process...
    const file = req.files.image;

    const nameSplit = file.name.split('.');
    const extFile = nameSplit[nameSplit.length - 1]
    // validate extension
    const validExt = ['png','jpg','jpeg','gif'];
    if (!validExt.includes(extFile)){
        return res.status(400).json({
            ok: false,
            msg: 'the ext is not allowed'
        });
    }

    // Generate the file name
    const filename = `${ uuidv4()}.${extFile}`;

    // Path to save the image
    const path = `./uploads/${type}/${filename}`;

    // move the image
    file.mv(path, function(err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error moving the image onto the server'
            });
        }

        // updated database
        updateImage(type, uid, filename);

        res.json({
            ok:true,
            msg:'File uploaded',
            filename
        })
    });

}

exports.retrieveImage = (req, res = response ) => {
    const type = req.params.type;
    const photo = req.params.photo;

    const pathImg = path.join(__dirname, `../uploads/${type}/${photo}`);

    // default image
    if (fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    } else {
        const pathDefaul = path.join(__dirname, '../uploads/no-img.jpg')
        res.sendFile(pathDefaul);
    }

}