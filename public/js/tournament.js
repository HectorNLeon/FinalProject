function load(){
    let user = Cookies.get('userName');
    let teams = 
    $.ajax({
        type: 'GET',
        url: '/api/tournaments'
    }).done(function (data) {
        data.forEach(element => {
            let place;
            if(element.creator == Cookies.get('userName')){
                place = "#mistorneos > .list-group";
            }
            else if(element.participants.includes(user) || element.participants.includes(teams)){
                place = "#registrados > .list-group";
            }
            if(place){
                $(place)
                .append('<a class="list-group-item list-group-item-action" id="list-profile-list" href ="/tournaments/'+element._id+'" "data-toggle="list"  role="tab" aria-controls="tournament">'+
                    '<div class="card bg-dark text-white" style="width:100%; overflow:hidden; height:125px;" >'+
                    '<img class="card-img" src="./img/placeholder.png" style="height:150%; margin: auto;" alt="Card image">'+
                    '<div class="card-img-overlay">'+
                    '<h5 class="card-title">'+element.name+'</h5>'+
                    '<p class="card-text">'+element.desc+'</p>'+
                    '<p class="card-text">'+element.date+'</p>'+
                    '</div>'+
                '</div>'+
                    '</a>')
            }
        });
        
    });

}

load();