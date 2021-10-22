const mongoose = require('mongoose');

exports.dbConnection = async () => {   
    try {
        await mongoose.connect(process.env.DB_CNN);
        console.log('DB Online');
    } catch (err) {
        console.log(err);
        throw new Error('Error at the time to inicialized the DB. See logs')
    }
};
