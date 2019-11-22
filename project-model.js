let mongoose = require('mongoose');

mongoose.Promise = global.Promise;



let userSchema = mongoose.Schema({
    _id: {type: String},
    name : { type : String },
    bio : { type : String },
    age : { type : Number },
    phone : { type : String },
    mail : { type : String },
    user : {type : String},
    memberSince : { type : Date},
    password : { type : String }
});

let teamSchema = mongoose.Schema({
    _id:{type: String},
	teamName : { type : String },
	creator : { type : String },
    creationDate : {type : Date},
	desc : { type : String },
	members : [String]
});

let matchSchema = mongoose.Schema({
    _id: {type: Number},
    p1: {type: String},
    p2: {type: String},
    score: {type: String},
    winner: {type: String}
})

let tournamentSchema = mongoose.Schema({
    name: {type: String},
    creator: {type: String},
    date: {type: Date},
    place: {type: String},
    game: {type: String},
    desc: {type: String},
    participants: [String],
    ptype: {type: String},
    numberOfParticipants: {type: Number},
    started: {type: Boolean},
    matches: [matchSchema],
    img: { type: String}

});


let users = mongoose.model('users', userSchema);
let teams = mongoose.model('teams', teamSchema );
let tournaments = mongoose.model('tournaments', tournamentSchema);


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
    getUsers: function(userSearch){                        //GET ONE USER
        return users.find(userSearch)
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
        return users.findOne({user: authUser.user})
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
        return teams.findOne({_id: teamSearch})
            .then( team => {
                return team;
            })
            .catch( error => {
                throw Error( error );
            });
        
    },
    getTeams: function(teamSearch){    
        console.log(teamSearch);                    //GET ONE TEAM
        return teams.find(teamSearch)
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
                console.log(error);
                throw Error( error );
            });
    },
    //db.teams.update({"teamName" : "EQUIPO A MODIFICAR"}, {$push: {"members" : "USUARIO A AGREGAR"}})
    addMember: function(team, member) {             //ADD MEMBER TO TEAM
        return teams.updateOne({_id:team}, {$push:{members : member}})
            .then( team => {
                return team;
            })
            .catch( error => {
                throw Error( error );
            });
    },
    removeMember: function(team, member) {             //REMOVE MEMBER TO TEAM
        return teams.updateOne({_id:team}, {$pull:{members : member}})
            .then( team => {
                return team;
            })
            .catch( error => {
                throw Error( error );
            });
    },
    update: function(updTeam) {             //UPDATE TEAM
        return teams.updateOne({_id:updTeam._id}, {$set : {teamName:updTeam.teamName, desc:updTeam.desc}})
            .then( team => {
                return team;
            })
            .catch( error => {
                throw Error( error );
            });
    },
    delete: function(teamID) {              //DELETE TEAM
        return teams.findOneAndRemove({_id:teamID})
            .then( team => {
                return team;
            })
            .catch( error => {
                throw Error( error );
            });
    }
};

let TournamentList = {
    get: function(){                        //ALL TEAMS
        return tournaments.find()
            .then( tournaments => {
                return tournaments;
            })
            .catch( error => {
                throw Error( error );
            });
		
	},
    getTournamentByID: function(tournamentSearch){                        //GET ONE TEAM
        return tournaments.findOne({_id: tournamentSearch})
            .then( tournaments => {
                return tournaments;
            })
            .catch( error => {
                throw Error( error );
            });
        
    },
    getTournaments: function(tournamentSearch){             
        console.log(tournamentSearch);       //GET ONE TEAM
        return tournaments.find(tournamentSearch)
            .then( tournaments => {
                return tournaments;
            })
            .catch( error => {
                throw Error( error );
            });
    },
    post: function(newTournament) {               //CREATE TOURNAMENT
        return tournaments.create(newTournament)
            .then( tournament => {
                return tournament;
            })
            .catch( error => {
                console.log(error);
                throw Error( error );
            });
    },
    update: function(id, updTournament) {           //UPDATE TOURNAMENT
        console.log(updTournament);
        console.log(id);
        return tournaments.updateOne({_id: id}, updTournament)
            .then( tournament => {
                return tournament;
            })
            .catch( error => {
                throw Error( error );
            });
    },
    addParticipant: function(updTo) {             //UPDATE TEAM
        return tournaments.updateOne({_id :updTo.id}, {$push: {participants: updTo.part}})

            .then( tournament => {
                return tournament;
            })
            .catch( error => {
                throw Error( error );
            });
    },
    addMatch: function(updTo) {             //UPDATE TEAM
        return tournaments.updateOne({_id :updTo._id}, {$push: {matches: updTo.matches}})

            .then( tournament => {
                return tournament;
            })
            .catch( error => {
                throw Error( error );
            });
    },
    updateMatch: function(id, matchId, match){
        return tournaments.updateOne({_id : id, "matches._id": matchId}, {$set: {"matches.$": match}})

            .then( tournament => {
                return tournament;
            })
            .catch( error => {
                console.log(error);

                throw Error( error );
            });
    },
    delete: function(tournamentId) {              //DELETE TEAM
        return tournaments.findOneAndRemove({_id:tournamentId})

            .then( tournament => {
                return tournament;
            })
            .catch( error => {
                throw Error( error );
            });
    }
};

module.exports = { 
    UserList,
    TeamList,
    TournamentList
};
