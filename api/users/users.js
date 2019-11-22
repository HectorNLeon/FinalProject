let express = require('express');
let router = express.Router();
let {UserList} = require('../../project-model');
let bp = require('body-parser');
let jsonParser = bp.json();
let bcrypt = require('bcrypt');
let Bcrypt = require('bcryptjs');
let saltRounds=10;


router.get( "/", ( req, res, next ) => {                          //GET ALL USERS
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


router.get( "/id/:Id", ( req, res, next ) => {                           //GET ONE USER
    let user = req.params.Id;
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
router.get( "/search", ( req, res, next ) => {                   //GET ONE TEAM
    let user = req.query;
    console.log(user);
    for(var key in user){
        let temp = user[key];
        user[key] = new RegExp(".*" + temp + ".*")
    }
    UserList.getUsers(user)
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

  
router.post("/", jsonParser, ( req, res, next ) => {
    let user = req.body;
    console.log(user);
    bcrypt.hash(user.password, saltRounds, function (err, hash){ 
    user.password = hash,
    UserList.post(user,hash)
        .then( user => {
        console.log(user,hash);
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
});

router.put("/", jsonParser, ( req, res, next ) => {
    let user = req.body;
    UserList.update(user)
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

router.post("/login", jsonParser, (req, res, next) => {          //USER LOGIN
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
        .then(user => {
            console.log(user);
            if(!user){
                return res.status(400).json({
                    message: "Username does not exist",
                    status: 400
                });
            }
            if(!Bcrypt.compareSync(authUser.pass, user.password)) {
                return res.status(400).json({
                    message: "Password incorrect",
                    status: 400
                });
            }
            return res.status(201).json(user);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        });
});

module.exports = router;