
function load(){
    let tournament = window.location.pathname;
    tournament = tournament.substring(13);
    console.log(tournament);
    $.ajax({
        type: 'GET',
        url: '/api/tournaments/' + tournament
    }).done(function(data) {
        console.log(data);
        $("#informacion").append('<p>'+data.desc+' </p>');
        data.participants.forEach(element => {
            $("#inscritos > .list-group").append('<a class="list-group-item list-group-item-action" id="list-profile-list" href ="/profile/'+element+'" "data-toggle="list"  role="tab" aria-controls="tournament">'
             + element+'</a>')
        });

    });
}

load();