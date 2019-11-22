let express = require('express');
let router = express.Router();
const path = require('path');
let {UserList} = require('../../project-model');


router.get('/', ( req, res, next ) => {             
    res.sendFile(path.join(__dirname+'/../../public/perfil.html'));
});

router.get('/:Id', ( req, res, next ) => {             
    res.sendFile(path.join(__dirname+'/../../public/perfil.html'));
});
	

module.exports = router;