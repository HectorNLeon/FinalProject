let express = require('express');
let router = express.Router();
let {TournamentList} = require('../../project-model');
let bp = require('body-parser');
let jsonParser = bp.json();


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

router.get( "/:tournament", ( req, res, next ) => {                   //GET ONE TEAM
    let tournament = req.params.tournament;
    TournamentList.getTournament(tournament)
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

router.post("/", jsonParser, (req, res, next) => {            //CREATE TEAM
    let newTournament = req.body;

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

router.post("/AddP", jsonParser, (req, res, next) => {     //ADD MEMBER TO TEAM
    let info = req.body;

    if (!info.part.name && !info.part.teamName) {
        res.statusMessage = "Missing field in the body";
        return res.status(406).json( {
            message: "Missing field in the body",
            status: 406
        });
    }
    TournamentList.addParticipant(teamName, member)
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

router.post("/AddM", jsonParser, (req, res, next) => {     //ADD MEMBER TO TEAM
    let info = req.body;

    if (!info.p1 || !info.p2) {
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

    if (!info.id) {
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



module.exports = router;