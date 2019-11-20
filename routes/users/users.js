let express = require('express');
let router = express.Router();
const path = require('path');
//et {UserList} = require('../project-model');


router.get('/', ( req, res, next ) => {             
    res.sendFile(path.join(__dirname+'/../../public/perfil.html'));
});


module.exports = router;