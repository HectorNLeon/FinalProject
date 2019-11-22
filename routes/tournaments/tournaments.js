let express = require('express');
let router = express.Router();
const path = require('path');
let {TournamentList} = require('../../project-model');



router.get('/', ( req, res, next ) => {             
    res.sendFile(path.join(__dirname+'/../../public/tournaments.html'));
});

router.get('/:tournament', (req,res,next) =>{
    res.sendFile(path.join(__dirname+'/../../public/tournamentpage.html'));
});



module.exports = router;