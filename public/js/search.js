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
    const urlParams = new URLSearchParams(window.location.search);
    let search = urlParams.get('name');
    if(search.length){
        $.ajax({
            type: 'GET',
            url: '/api/tournaments/search',
            data: {
                name: search
            }
        }).done(function (data) {
            console.log(data);
            if(data.length){
                $("#tournies > .vacio").hide();
                data.forEach(element => {
                    $("#tournies > .list-group")
                    .append(
                        '<a class="list-group-item list-group-item-action" id="list-profile-list" href ="/tournaments/'+element._id+'" "data-toggle="list"  role="tab" aria-controls="tournament">'+
                        '<div class="card bg-dark text-white" style="width:100%; position:relative; overflow:hidden; height:125px;" >'+
                        '<img class="card-img" src="'+element.img+'"  alt="Card image">'+
                        '<div class="card-img-overlay">'+
                        '<h5 class="card-title">'+element.name+'</h5>'+
                        '<p class="card-text">'+element.place+'</p>'+
                        '<p class="card-text">'+formatDate(new Date(element.date))+'</p>'+
                        '</div>'+
                    '</div>'+
                        '</a>')
                });
            }
            else
                $("#tournies > .vacio").show();
    
        });
        $.ajax({
            type: 'GET',
            url: '/api/users/search',
            data: {
                name: search
            }
        }).done(function (data) {
            console.log(data);
            if(data.length){
                $("#users > .vacio").hide();
                data.forEach(element => {
                    $("#users > .list-group")
                    .append('<a class="list-group-item list-group-item-action" id="list-profile-list" href ="/profile/'+element.user+'" "data-toggle="list"  role="tab" aria-controls="tournament">'
                    + element.name+'</a>');
                });
            }
            else
                $("#users > .vacio").show();
    
        });
        $.ajax({
            type: 'GET',
            url: '/api/teams/search',
            data: {
                teamName: search
            }
        }).done(function (data) {
            console.log(data);
            if(data.length){
                $("#teams > .vacio").hide();
                data.forEach(element => {
                    $("#teams > .list-group")
                    .append('<a class="list-group-item list-group-item-action" id="list-profile-list" href ="/teams/'+element._id+'" "data-toggle="list"  role="tab" aria-controls="tournament">'
                    + element.teamName+'</a>');
                });
            }
            else
                $("#teams > .vacio").show();
        });
    }
   
}

load();