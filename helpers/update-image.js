const fs  = require('fs');

const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');

const deleteImage = ( path ) => {
    if ( fs.existsSync(path ) ){
        // delete the old image
        fs.unlinkSync( path )
    }
}

exports.updateImage = async ( type, id, filename) => {

    let oldPath = '';

    switch (type) {
        case 'doctors':
            const doctor = await Doctor.findById(id);
            if (!doctor) {
                console.log('Doctor not found.');
                return false;
            }

            oldPath = `./uploads/doctors/${ doctor.img }`;
            deleteImage(oldPath)

            doctor.img = filename;
            await doctor.save();
            
            return true;
    
        case 'hospitals':

            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log('hospital not found.');
                return false;
            }

            oldPath = `./uploads/hospitals/${ hospital.img }`;
            deleteImage(oldPath)

            hospital.img = filename;
            await hospital.save();
            
            return true;
    
        case 'users':

            const user = await User.findById(id);
            if (!user) {
                console.log('user not found.');
                return false;
            }

            oldPath = `./uploads/users/${ user.img }`;
            deleteImage(oldPath)

            user.img = filename;
            await user.save();
            
            return true;
    
        default:
            break;
    }
}