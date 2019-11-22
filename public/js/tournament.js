var formatDate = function(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];
    return monthNames[date.getMonth()] + " "  +date.getDate() + " "+ date.getFullYear();
  } 
let tournaments;
let currentD;
let currentE;


function load(){
    let user = Cookies.get('userName');
    let teams = 
    $.ajax({
        type: 'GET',
        url: '/api/tournaments'
    }).done(function (data) {
        tournaments = data;
        data.forEach(element => {
    
            if(element.creator == Cookies.get('userName')){
                $("#mistorneos > .list-group").append('<a class="list-group-item list-group-item-action" id="list-profile-list" onclick =" location.href = \'/tournaments/'+element._id+'\'" "data-toggle="list"  role="tab" aria-controls="tournament">'+
                '<div class="card bg-dark text-white" style="width:100%; overflow:hidden; height:120px;" >'+
                '<img class="card-img" src="'+element.img+'" alt="Card image">'+
                '<div class="card-img-overlay">'+
                '<h5 class="card-title">'+element.name+'</h5>'+
                '<div class="cardp"> <p class="card-text">'+element.place+'</p> </div>'+
                '<div class="cardp"> <p class="card-text">'+formatDate(new Date(element.date))+'</p> </div>'+
                '</div>'+
                '<div style="margin: 10px 0 0 90%; position: absolute;">'+
                '<button class="btn btn-primary edit" style="display: true; " > <i class="fas fa-edit"></i> Edit</button>'+
                '<button class="btn btn-danger delete" data-toggle="modal" data-target="#deleteModal" style="display: true; margin-top:10px;" > <i class="fas fa-trash"></i> Delete</button>'+
                '</div>'+
            '</div>'+
                '</a>');
                $("#mistorneos > .vacio").hide();
            }
            if(element.participants.includes(user) || element.participants.includes(teams)){
                $("#registrados > .list-group").append('<a class="list-group-item list-group-item-action" id="list-profile-list" href ="/tournaments/'+element._id+'" "data-toggle="list"  role="tab" aria-controls="tournament">'+
                '<div class="card bg-dark text-white" style="width:100%; overflow:hidden; height:120px;" >'+
                '<img class="card-img" src="'+element.img+'" alt="Card image">'+
                '<div class="card-img-overlay">'+
                '<h5 class="card-title">'+element.name+'</h5>'+
                '<div class="cardp"> <p class="card-text">'+element.place+'</p> </div>'+
                '<div class="cardp"> <p class="card-text">'+formatDate(new Date(element.date))+'</p> </div>'+
                '</div>'+
            '</div>'+
                '</a>');
                $("#registrados > .vacio").hide();
            }
        });
        let deleteButtons = document.getElementsByClassName( "delete" );
        for ( let i = 0; i < deleteButtons.length; i ++ ){
            deleteButtons[i].addEventListener( "click", (event) =>{
                currentD = i;
                currentE = event;
                $('#deleteModal').modal('show');
                event.preventDefault();
                event.stopPropagation();
                
             });
        }
        let editButtons = document.getElementsByClassName( "edit" );
        for ( let i = 0; i < editButtons.length; i ++ ){
            editButtons[i].addEventListener( "click", (event) =>{
                event.preventDefault();
                event.stopPropagation();
                location.href = '/edit/'+tournaments[i]._id;
            });
        }
    });
    
    $("#modalYes").on('click', (e)=>{
        let sendData= {
            path: tournaments[currentD].img
        };
        
        $.ajax({
            type: 'DELETE',
            url: '/api/tournaments/'+tournaments[currentD]._id,
            contentType: "application/json",
            data: JSON.stringify(sendData)
        }).done(function (data) {
            currentE.srcElement.parentElement.parentElement.parentElement.remove();
        });
        $('#deleteModal').modal('hide');
    });

}

load();