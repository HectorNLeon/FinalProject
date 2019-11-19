let express = require('express');
let morgan = require('morgan');
let bp = require('body-parser');
let jsonParser = bp.json();

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let {UserList,TeamList} = require('./project-model');

let {DATABASE_URL, PORT} = require('./config');

let app = express();
app.use(express.static('public'));
app.use(morgan('dev'));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get( "/users", ( req, res, next ) => {                          //GET ALL USERS
    UserList.get()
        .then( users => {
            return res.status( 200 ).json( users );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : "Something went wrong with the DB. Try again later."
            })
        });
});

app.get( "/user", ( req, res, next ) => {                           //GET ONE USER
    let user = req.query.user;
    UserList.getUser(user)
        .then( user => {
            return res.status( 200 ).json( user );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : "Something went wrong with the DB. Try again later."
            })
        });
});

app.post("/users/login", jsonParser, (req, res, next) => {          //USER LOGIN
    let authUser = {
        user: "",
        pass: ""
    };
    authUser.user = req.body.user;
    authUser.pass = req.body.pass;

    if (!authUser.user || !authUser.pass) {
        res.statusMessage = "Missing field in the body";
        return res.status(406).json( {
            message: "Missing field in the body",
            status: 406
        });
    }
    UserList.postLogin(authUser)
        .then(authUser => {
            console.log(authUser);
            //res.redirect('/home');
            return res.status(201).json(authUser);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        });
});

app.delete("/blog-posts/:id", jsonParser, (req, res, next) => {
    
});

app.put("/blog-posts/:id", jsonParser, (req, res, next) => {
    

});

/*-------------------------------------     TEAMS --------------------------------------------------*/
app.get( "/teams", ( req, res, next ) => {              //GET ALL TEAMS
    TeamList.get()
        .then( teams => {
            return res.status( 200 ).json( teams );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : "Something went wrong with the DB. Try again later."
            })
        });
});

app.get( "/team", ( req, res, next ) => {                   //GET ONE TEAM
    let team = req.query.team;
    TeamList.getTeam(team)
        .then( team => {
            return res.status( 200 ).json( team );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : "Something went wrong with the DB. Try again later."
            })
        });
});

app.post("/teams", jsonParser, (req, res, next) => {            //CREATE TEAM
    let creator = {
        user: "",
        name: ""
    };
    let newTeam = {
        teamName : "",
        creator : creator,
        creationDate : "",
        desc : "",
        members : []
    }
    newTeam.teamName = req.body.teamName;
    newTeam.desc = req.body.desc;
    newTeam.creationDate = req.body.creationDate;
    newTeam.creator.user = req.body.creator.user;
    newTeam.creator.name = req.body.creator.name;

    if (!newTeam.teamName || !newTeam.desc || !newTeam.creator.user || !newTeam.creator.name) {
        res.statusMessage = "Missing field in the body";
        return res.status(406).json( {
            message: "Missing field in the body",
            status: 406
        });
    }
    TeamList.post(newTeam)
        .then(newTeam => {
            return res.status(201).json(newTeam);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        });
});

app.post("/teamsAdd", jsonParser, (req, res, next) => {     //ADD MEMBER TO TEAM
    let member = {
        user: "",
        name: ""
    };
    let teamName = req.body.teamName;
    member.user = req.body.member.user;
    member.name = req.body.member.name;

    if (!teamName || !member.user || !member.name) {
        res.statusMessage = "Missing field in the body";
        return res.status(406).json( {
            message: "Missing field in the body",
            status: 406
        });
    }
    TeamList.addMember(teamName, member)
        .then(updTeam => {
            return res.status(201).json(updTeam);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        });
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