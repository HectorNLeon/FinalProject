let mongoose = require('mongoose');

mongoose.Promise = global.Promise;



let userSchema = mongoose.Schema({
    name : { type : String },
    bio : { type : String },
    age : { type : Number },
    phone : { type : String },
    mail : { type : String },
    memberSince : { type : Date},
    user : { type : String },
    password : { type : String }
});

let teamSchema = mongoose.Schema({	
	teamName : { type : String },
	creator : { type : userSchema },
    creationDate : {type : Date},
	desc : { type : String },
	members : [userSchema]
});

let users = mongoose.model('users', userSchema);
let teams = mongoose.model('teams', teamSchema );


let UserList = {
    get: function(){                        //GET ALL USERS
        return users.find()
            .then( users => {
                return users;
            })
            .catch( error => {
                throw Error( error );
            });
        
    },
    getUser: function(userSearch){                        //GET ONE USER
        return users.findOne({user: userSearch})
            .then( user => {
                return user;
            })
            .catch( error => {
                throw Error( error );
            });
        
    },
    post: function(newUser) {               //CREATE USER
        return users.create(newUser)
            .then( user => {
                return user;
            })
            .catch( error => {
                throw Error( error );
            });
    },
    postLogin: function(authUser) {               //LOGIN USER
        return users.findOne({user: authUser.user, password: authUser.pass}, {user : 1 , name : 1})
            .then( user => {
                return user;
            })
            .catch( error => {
                throw Error( error );
            });
    },
    update: function(updUser) {             //UPDATE USER
        return users.updateOne({id:updUser.id}, updUser)
            .then( user => {
                return user;
            })
            .catch( error => {
                throw Error( error );
            });
    },
    delete: function(userID) {              //DELETE USER
        return users.findOneAndRemove({id:userID})
            .then( user => {
                return user;
            })
            .catch( error => {
                throw Error( error );
            });
    }
};


let TeamList = {
    get: function(){                        //ALL TEAMS
        return teams.find()
            .then( teams => {
                return teams;
            })
            .catch( error => {
                throw Error( error );
            });
		
	},
    getTeam: function(teamSearch){                        //GET ONE TEAM
        return teams.findOne({teamName: teamSearch})
            .then( team => {
                return team;
            })
            .catch( error => {
                throw Error( error );
            });
        
    },
    post: function(newTeam) {               //CREATE TEAM, newTeam must have the creator added
        return teams.create(newTeam)
            .then( team => {
                return team;
            })
            .catch( error => {
                throw Error( error );
            });
    },
    //db.teams.update({"teamName" : "EQUIPO A MODIFICAR"}, {$push: {"members" : "USUARIO A AGREGAR"}})
    addMember: function(team, member) {             //ADD MEMBER TO TEAM   MEMBER:user and MEMBER:name
        return teams.updateOne({teamName:team}, {$push:{members : member}})
            .then( team => {
                return team;
            })
            .catch( error => {
                throw Error( error );
            });
    },
    update: function(updTeam) {             //UPDATE TEAM
        return teams.updateOne({id:updTeam.id}, updTeam)
            .then( team => {
                return team;
            })
            .catch( error => {
                throw Error( error );
            });
    },
    delete: function(teamID) {              //DELETE TEAM
        return teams.findOneAndRemove({id:teamID})
            .then( team => {
                return team;
            })
            .catch( error => {
                throw Error( error );
            });
    }
};

module.exports = { 
    UserList,
    TeamList 
};
