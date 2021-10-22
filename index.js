const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { dbConnection } = require('./database/config');


const app = express();

// CORS Config
app.use( cors() ); 

// Data Base
dbConnection();

// reading and parsing body
app.use( express.json() );

//Rutas
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/login', require('./routes/auth.routes'));


app.listen(process.env.PORT, ()=> {
    console.log(`listen in ${process.env.PORT} port`)
});
