const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { dbConnection } = require('./database/config');


const app = express();

// CORS Config
app.use( cors() ); 

dbConnection();

//Rutas
app.get('/', (req, res) => {
    
    res.status(400).json({
        ok: true,
        mgs: 'Hola Mundo'
    })
})
app.listen(process.env.PORT, ()=> {
    console.log(`listen in ${process.env.PORT} port`)
});
