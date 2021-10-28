require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');


const app = express();

// CORS Config
app.use( cors() ); 

// Data Base
dbConnection();

// Public dir
app.use(express.static('public'))

// reading and parsing req.body
app.use( express.json() );

//Routes
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/hospitals', require('./routes/hospitals.routes'));
app.use('/api/doctors', require('./routes/doctors.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/total', require('./routes/search.routes'));
app.use('/api/upload', require('./routes/uploads.routes'));

// SPA
app.get('*', (req, res) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) )
})

app.listen(process.env.PORT, ()=> {
    console.log(`listen in ${process.env.PORT} port`)
});
