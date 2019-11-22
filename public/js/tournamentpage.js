let user;
let tournament;
let creator = false;
var formatDate = function(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];
    return monthNames[date.getMonth()] + " "  +date.getDate() + " "+ date.getFullYear();
  }  

function load(){
    user = Cookies.get('userName');
    tournament = window.location.pathname;
    tournament = tournament.substring(13);
    console.log(tournament);
    $.ajax({
        type: 'GET',
        url: '/api/tournaments/id/' + tournament
    }).done(function(data) {
        tournament = data
        console.log(data);
        if(user == data.creator)
            creator = true;
        if(data.participants.includes(user))
            $("#unregister").show();
        else
            $("#register").show();
            
        $("#informacion").append('<p>'+data.desc+' </p>');
        $(".col1 > .card").prepend(
        '<img class="card-img" src="'+data.img+'" alt="Card image">'+
        '<div class="card-img-overlay">'+
        '<h5 class="card-title">'+data.name+'</h5>'+
        '<div class="cardp"> <p class="card-text">'+data.place+'</p> </div>'+
        '<div class="cardp"> <p class="card-text">'+formatDate(new Date(data.date))+'</p> </div>'+
        '</div>');
        data.participants.forEach(element => {
            $("#inscritos > .list-group").append('<a class="list-group-item list-group-item-action" id="list-profile-list" href ="/profile/'+element+'" "data-toggle="list"  role="tab" aria-controls="tournament">'
             + element+'</a>')
        });
        console.log(data.numberOfParticipants);
        if(data.numberOfParticipants >= 4){
            $("#tournament").append('<ul class="round round-1"> <li class="spacer">&nbsp;</li> </ul> <ul class="round round-2"> <li class="spacer">&nbsp;</li> </ul>');
             for(let i=0; i<2; i++){
                 $(".round-1").append('<li class="game game-top"> <span></span></li>'+
                 '<li class="game game-spacer">&nbsp;</li>'+
                 '<li class="game game-bottom "> <span></span></li>'+
                 '<li class="spacer">&nbsp;</li>');
             }
             $(".round-2").append('<li class="game game-top"> <span></span></li>'+
             '<li class="game game-spacer">&nbsp;</li>'+
             '<li class="game game-bottom "> <span></span></li>'+
             '<li class="spacer">&nbsp;</li>');
        }
        if(data.numberOfParticipants >= 8){
            $("#tournament").append('<ul class="round round-3"> <li class="spacer">&nbsp;</li> </ul>');
            for(let i=0; i<2; i++){
                $(".round-1").append('<li class="game game-top"> <span></span></li>'+
                '<li class="game game-spacer">&nbsp;</li>'+
                '<li class="game game-bottom "> <span></span></li>'+
                '<li class="spacer">&nbsp;</li>');
            }
            $(".round-2").append('<li class="game game-top"> <span></span></li>'+
            '<li class="game game-spacer">&nbsp;</li>'+
            '<li class="game game-bottom "> <span></span></li>'+
            '<li class="spacer">&nbsp;</li>');
            $(".round-3").append('<li class="game game-top"> <span></span></li>'+
            '<li class="game game-spacer">&nbsp;</li>'+
            '<li class="game game-bottom "> <span></span></li>'+
            '<li class="spacer">&nbsp;</li>');
        }
        if(data.numberOfParticipants >= 16){
            $("#tournament").append('<ul class="round round-4"> <li class="spacer">&nbsp;</li> </ul>');
            for(let i=0; i<4; i++){
                $(".round-1").append('<li class="game game-top"> <span></span></li>'+
                '<li class="game game-spacer">&nbsp;</li>'+
                '<li class="game game-bottom "> <span></span></li>'+
                '<li class="spacer">&nbsp;</li>');            }
            for(let i=0; i<2; i++){
                $(".round-2").append('<li class="game game-top"> <span></span></li>'+
                '<li class="game game-spacer">&nbsp;</li>'+
                '<li class="game game-bottom "> <span></span></li>'+
                '<li class="spacer">&nbsp;</li>');            
            }
            $(".round-3").append('<li class="game game-top"> <span></span></li>'+
            '<li class="game game-spacer">&nbsp;</li>'+
            '<li class="game game-bottom "> <span></span></li>'+
            '<li class="spacer">&nbsp;</li>');
            $(".round-4").append('<li class="game game-top"> <span></span></li>'+
            '<li class="game game-spacer">&nbsp;</li>'+
            '<li class="game game-bottom "> <span></span></li>'+
            '<li class="spacer">&nbsp;</li>');

        }
        if(data.numberOfParticipants >= 32){
            $("#tournament").append('<ul class="round round-5"> <li class="spacer">&nbsp;</li> </ul>');
            for(let i=0; i<8; i++){
                $(".round-1").append('<li class="game game-top"> <span></span></li>'+
                '<li class="game game-spacer">&nbsp;</li>'+
                '<li class="game game-bottom "> <span></span></li>'+
                '<li class="spacer">&nbsp;</li>');            }
            for(let i=0; i<4; i++){
                $(".round-2").append('<li class="game game-top"> <span></span></li>'+
                '<li class="game game-spacer">&nbsp;</li>'+
                '<li class="game game-bottom "> <span></span></li>'+
                '<li class="spacer">&nbsp;</li>');            
            }
            for(let i=0; i<2; i++){
                $(".round-3").append('<li class="game game-top"> <span></span></li>'+
                '<li class="game game-spacer">&nbsp;</li>'+
                '<li class="game game-bottom "> <span></span></li>'+
                '<li class="spacer">&nbsp;</li>');            
            }
            $(".round-4").append('<li class="game game-top"> <span></span></li>'+
            '<li class="game game-spacer">&nbsp;</li>'+
            '<li class="game game-bottom "> <span></span></li>'+
            '<li class="spacer">&nbsp;</li>');            

            $(".round-5").append('<li class="game game-top"> <span></span></li>'+
            '<li class="game game-spacer">&nbsp;</li>'+
            '<li class="game game-bottom "> <span></span></li>'+
            '<li class="spacer">&nbsp;</li>');
        }
    });
}

$("#register").on('click', (e) =>{
    e.preventDefault();
    let senData = {
        id: tournament._id,
        part: user 
    }
    $.ajax({
        type: 'PUT',
        url: '/api/tournaments/addP',
        contentType: "application/json",
        data: JSON.stringify(senData)
    }).done(function(data) {
        console.log(data);
        alert('Registered for tournament!');
        location.reload();
    });
});

$("#unregister").on('click', (e) =>{
    e.preventDefault();
    for( var i = 0; i < tournament.participants.length; i++){ 
        if (tournament.participants[i] === user){
            tournament.participants.splice(i, 1); 
        }
     }
     console.log(tournament.participants);
     let part = {
         participants: tournament.participants
     };
    $.ajax({
        type: 'PUT',
        url: '/api/tournaments/update/'+tournament._id,
        contentType: "application/json",
        data: JSON.stringify(part)
    }).done(function(data) {
        console.log(data);
        alert('Unregistered for tournament!');
        location.reload();
    });
});

load();