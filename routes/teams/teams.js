let express = require('express');
let router = express.Router();
const path = require('path');
let {TeamList} = require('../../project-model');


router.get('/', ( req, res, next ) => {             
    res.sendFile(path.join(__dirname+'/../../public/equipos.html'));
});

router.get('/:team', ( req, res, next ) => {             
    res.sendFile(path.join(__dirname+'/../../public/equipo.html'));
});

module.exports = router;