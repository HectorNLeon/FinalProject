function init(){
    $.ajax({
        type: 'GET',
        url: '/api/tournaments'
    }).done(function (data){
        data.forEach(element => {
            $("#all > .list-group").append(
                '<a class="list-group-item list-group-item-action" id="list-profile-list" href ="/tournaments/'+element._id+'" "data-toggle="list"  role="tab" aria-controls="tournament">'+
                '<div class="card bg-dark text-white" style="width:100%; overflow:hidden; height:125px;" >'+
                '<img class="card-img" src="./img/placeholder.png" style="height:150%; margin: auto;" alt="Card image">'+
                '<div class="card-img-overlay">'+
                '<h5 class="card-title">'+element.name+'</h5>'+
                '<p class="card-text">'+element.desc+'</p>'+
                '<p class="card-text">'+element.date+'</p>'+
                '</div>'+
            '</div>'+
                '</a>');
            if(element.game == "Soccer"){
                $("#soccer > .list-group").append(
                    '<a class="list-group-item list-group-item-action" id="list-profile-list" href ="/tournaments/'+element._id+'" "data-toggle="list"  role="tab" aria-controls="tournament">'+
                    '<div class="card bg-dark text-white" style="width:100%; overflow:hidden; height:125px;" >'+
                    '<img class="card-img" src="./img/placeholder.png" style="height:150%; margin: auto;" alt="Card image">'+
                    '<div class="card-img-overlay">'+
                    '<h5 class="card-title">'+element.name+'</h5>'+
                    '<p class="card-text">'+element.desc+'</p>'+
                    '<p class="card-text">'+element.date+'</p>'+
                    '</div>'+
                '</div>'+
                    '</a>');
            }
            else if(element.game == "Tennis"){
                $("#tennis > .list-group").append(
                    '<a class="list-group-item list-group-item-action" id="list-profile-list" href ="/tournaments/'+element._id+'" "data-toggle="list"  role="tab" aria-controls="tournament">'+
                    '<div class="card bg-dark text-white" style="width:100%; overflow:hidden; height:125px;" >'+
                    '<img class="card-img" src="./img/placeholder.png" style="height:150%; margin: auto;" alt="Card image">'+
                    '<div class="card-img-overlay">'+
                    '<h5 class="card-title">'+element.name+'</h5>'+
                    '<p class="card-text">'+element.desc+'</p>'+
                    '<p class="card-text">'+element.date+'</p>'+
                    '</div>'+
                '</div>'+
                    '</a>');
            }
            else if(element.game == "Football"){
                $("#football > .list-group").append(
                    '<a class="list-group-item list-group-item-action" id="list-profile-list" href ="/tournaments/'+element._id+'" "data-toggle="list"  role="tab" aria-controls="tournament">'+
                    '<div class="card bg-dark text-white" style="width:100%; overflow:hidden; height:125px;" >'+
                    '<img class="card-img" src="./img/placeholder.png" style="height:150%; margin: auto;" alt="Card image">'+
                    '<div class="card-img-overlay">'+
                    '<h5 class="card-title">'+element.name+'</h5>'+
                    '<p class="card-text">'+element.desc+'</p>'+
                    '<p class="card-text">'+element.date+'</p>'+
                    '</div>'+
                '</div>'+
                    '</a>');
            }
        });

    });

}

init();