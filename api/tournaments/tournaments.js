let express = require('express');
let router = express.Router();
let {TournamentList} = require('../../project-model');
let bp = require('body-parser');
const { parse } = require('querystring');
let jsonParser = bp.json();
var multiparty = require('multiparty');
const path = require('path');
const fs = require('fs')




router.get( "/", ( req, res, next ) => {              //GET ALL TEAMS
    TournamentList.get()
        .then( tournaments => {
            return res.status( 200 ).json( tournaments );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : "Something went wrong with the DB. Try again later."
            })
        });
});

router.get( "/id/:tournament", ( req, res, next ) => {                   //GET ONE TEAM
    let tournament = req.params.tournament;
    TournamentList.getTournamentByID(tournament)

        .then( tournament => {
            return res.status( 200 ).json( tournament );
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
    let tournament = req.query;
    for(var key in tournament){
        let temp = tournament[key];
        tournament[key] = new RegExp(".*" + temp + ".*")
    }
    TournamentList.getTournaments(tournament)
        .then( tournaments => {
            return res.status( 200 ).json( tournaments );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : "Something went wrong with the DB. Try again later."
            })
        });
});

router.post("/", (req, res, next) => {            //CREATE TEAM
    var form = new multiparty.Form({uploadDir:  './public/img'});
    form.parse(req, function(err, fields, files) {
        let newTournament = {};
        console.log(fields);
        Object.keys(fields).forEach(function(name) {
            newTournament[name] = fields[name][0];
        });

        Object.keys(files).forEach(function(name) {
            if(files[name][0].size > 0)
                newTournament[name] = files[name][0].path.substring(6);
            else{
                newTournament.img = '/img/placeholder.png';
                newTournament.trash =  files[name][0].path.substring(6);
            }
        });
        try {
            fs.unlinkSync(path.join(__dirname,'../../public/'+newTournament.trash));
            //file removed
        } catch(err) {
            console.error(err);
        }
        delete newTournament.trash;
        newTournament.participants = [];
        newTournament.matches = [];
        newTournament.first= '';
        newTournament.second = '';
        newTournament.third = '';
        console.log(newTournament);
        if (!newTournament.name || !newTournament.desc || !newTournament.creator) {
            res.statusMessage = "Missing field in the body";
            return res.status(406).json( {
                message: "Missing field in the body",
                status: 406
            });
        }
        TournamentList.post(newTournament)
            .then(newTournament => {
                return res.status(201).json(newTournament);
            })
            .catch(err => {
                res.statusMessage = "Something went wrong with the DB";
                return res.status(500).json({
                    message: "Something went wrong with the DB",
                    status: 500
                })
         });
    }); 
});

router.post("/edit", (req, res, next) => {            //CREATE TEAM
    var form = new multiparty.Form({uploadDir:  './public/img'});
    form.parse(req, function(err, fields, files) {
        let editTournament = {};
        console.log(fields);
        Object.keys(fields).forEach(function(name) {
            editTournament[name] = fields[name][0];
        });

        Object.keys(files).forEach(function(name) {
            if(files[name][0].size > 0)
                editTournament[name] = files[name][0].path.substring(6);
            else
                editTournament.trash =  files[name][0].path.substring(6);     
        });
        try {
            fs.unlinkSync(path.join(__dirname,'../../public/'+editTournament.trash));
            //file removed
        } catch(err) {
            console.error(err);
        }
        if(editTournament.img){
            try {
                fs.unlinkSync(path.join(__dirname,'../../public/'+editTournament.oimg));
                //file removed
            } catch(err) {
                console.error(err);
            }
        }
        delete editTournament.oimg;
        delete editTournament.trash;
        const id = editTournament.id;
        delete editTournament.id;
        console.log(editTournament);
        if (!editTournament.name || !editTournament.desc || !editTournament.creator) {
            res.statusMessage = "Missing field in the body";
            return res.status(406).json( {
                message: "Missing field in the body",
                status: 406
            });
        }
        TournamentList.update(id, editTournament)
            .then(editTournament => {
                return res.status(201).json(editTournament);
            })
            .catch(err => {
                res.statusMessage = "Something went wrong with the DB";
                return res.status(500).json({
                    message: "Something went wrong with the DB",
                    status: 500
                })
         });
    }); 
});

router.put("/update/:id", (req, res, next) => {     //ADD MEMBER TO TEAM
    let id = req.params.id;
    let info = req.body;
    if (!id) {
        res.statusMessage = "Missing id!";
        return res.status(406).json( {
            message: "Missing id!",
            status: 406
        });
    }
    TournamentList.update(id, info)
        .then(updPart => {
            return res.status(201).json(updPart);

        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        });
});

router.put("/addP", (req, res, next) => {     //ADD MEMBER TO TEAM
    let info = req.body;
    console.log(info);
    if (!info.part && !info.id) {
        res.statusMessage = "Missing fields!";
        return res.status(406).json( {
            message: "Missing fields!",
            status: 406
        });
    }
    TournamentList.addParticipant(info)
        .then(updPart => {
            return res.status(201).json(updPart);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        });
});

router.post("/addM", jsonParser, (req, res, next) => {     //ADD MEMBER TO TEAM
    let info = req.body;
    console.log(info);
    if (!info._id) {
        res.statusMessage = "Missing field in the body";
        return res.status(406).json( {
            message: "Missing field in the body",
            status: 406
        });
    }
    TournamentList.addMatch(info)
        .then(updMatch => {
            return res.status(201).json(updMatch);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        });
});

router.put("/match", jsonParser, (req, res, next) => {     //ADD MEMBER TO TEAM
    let info = req.body;
    const matchID = info.match._id;
    if (!info.id) {
        res.statusMessage = "Missing field in the body";
        return res.status(406).json( {
            message: "Missing field in the body",
            status: 406
        });
    }
    TournamentList.updateMatch(info.id, matchID, info.match)
        .then(updMatch => {
            return res.status(201).json(updMatch);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        });
});

router.delete("/:id", (req, res, next) => {     //ADD MEMBER TO TEAM
    let id = req.params.id;
    let imgpath = req.body.path;
    console.log(imgpath);
    if (!id) {
        res.statusMessage = "Missing id!";
        return res.status(406).json( {
            message: "Missing id!",
            status: 406
        });
    }
    try {
        fs.unlinkSync(path.join(__dirname,'../../public/'+imgpath));
        //file removed
    } catch(err) {
        console.error(err);
    }
    TournamentList.delete(id)
        .then(updPart => {
            return res.status(201).json(updPart);
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