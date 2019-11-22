let express = require('express');
let morgan = require('morgan');
let mongoose = require('mongoose');
const path = require('path');
let {DATABASE_URL, PORT} = require('./config');
let app = express();
const apiusers = require('./api/users/users');
const apiteams = require('./api/teams/teams');
const apitournaments = require('./api/tournaments/tournaments');
const profile = require('./routes/users/users');
const tournaments = require('./routes/tournaments/tournaments');
const teams = require('./routes/teams/teams');
const search = require('./routes/search/search');
const bodyParser = require('body-parser');



mongoose.Promise = global.Promise;

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    if (req.method === "OPTIONS") {
      return res.send(204);
    }  
    next();
});
app.use('/api/users',apiusers);
app.use('/api/teams',apiteams);
app.use('/api/tournaments',apitournaments);
app.use('/tournaments', tournaments);
app.use('/profile', profile);
app.use('/teams', teams);
app.use('/search', search);


app.get('/', ( req, res, next ) => {             
    res.sendFile(path.join(__dirname+'./public/index.html'));
});

app.get('/home', ( req, res, next ) => {             
    res.sendFile(path.join(__dirname+'./public/home.html'));
});

app.get('/create', ( req, res, next ) => {             
    res.sendFile(path.join(__dirname+'./public/create.html'));
});
app.get('/edit/:id', ( req, res, next ) => {             
    res.sendFile(path.join(__dirname+'./public/create.html'));

});

let server;


function runServer(port, databaseUrl){
    return new Promise( (resolve, reject ) => {
        mongoose.connect(databaseUrl, response => {
            if ( response ){
                return reject(response);
            }
            else{
                server = app.listen(port, () => {
                    console.log( "App is running on port " + port );
                    resolve();
                })
                .on( 'error', err => {
                    mongoose.disconnect();
                    return reject(err);
                })
            }
        });
    });
}

function closeServer(){
    return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log('Closing the server');
                server.close( err => {
                    if (err){
                        return reject(err);
                    }
                    else{
                        resolve();
                    }
                });
            });
        });
}

runServer( PORT, DATABASE_URL )
    .catch( err => {
        console.log( err );
    });

module.exports = { app, runServer, closeServer };