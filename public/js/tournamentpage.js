let user, topA, botB;
let tournament;
let creator = false;
let started = false;
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
        tournament = data;
        console.log(data);
        creator = (data.creator == user) ? true : false; 
        started = data.started;
        if(!data.started){
            if(creator){
                $("#start").show();                
            }
            $("#overlay").show();
        }
        else{
            
        }
        
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
        bracketTemplate(data.participants.length);
        if(started) loadMatches(data.matches);
        $(".game-top > span").on('click', (e)=>{
            e.preventDefault();
            if(started){
                botB= e.target.parentNode.nextSibling.nextSibling;
                topA= e.target.parentNode;
                $("#A").css({"font-weight": "bold"});
                $("#B").css({"font-weight": "normal"});
                setScore(e.target.innerText, e.target.parentNode.nextSibling.nextSibling.innerText);    
            }
        });
        
        $(".game-bottom > span").on('click', (e)=>{
            e.preventDefault();
            if(started){
                topA= e.target.parentNode.previousSibling.previousSibling;
                botB= e.target.parentNode;
                $("#A").css({"font-weight": "normal"});
                $("#B").css({"font-weight": "bold"});
                setScore(e.target.parentNode.previousSibling.previousSibling.innerText, e.target.innerText);
            }
        });
    });
}

function checkWinners(){
    let matches = tournament.matches;
    let bracketLength = Math.ceil(tournament.participants.length /4)*4;
    let x=0;
    console.log(matches);
    for(let i=0; i<matches.length; i++){
        if(matches[i].winner.length > 0){
            x++;
        }
    }
    if(x == matches.length){
        let round = Math.floor(matches[x-1]._id/10);
        let newMatches = [];
        let s=0;
        let l= bracketLength;
        for(let j=round, m=1; j>1; j--, m++){
            s += Math.floor(bracketLength/(2*m));
        }
        for(let j=round+1; j>0; j--){
            l = l/2;
        }
        console.log(s);
        let n = 0;
        console.log(l);
        for(let i=0; i<l; i++){
            newMatches.push(
                {   _id:  ((round+1)*10)+n,
                    p1: matches[s].winner, p2: matches[s+1].winner,
                    score: '', winner: ''
                }
            );
            n++;
            s+=2;
        }
        let sendData = {
            matches: newMatches,
            _id: tournament._id
        };
        $.ajax({
            type: 'POST',
            url: '/api/tournaments/addM',
            contentType: "application/json",
            data: JSON.stringify(sendData)
        }).done(function (data) {
            tournament.matches = tournament.matches.concat(newMatches);
            loadMatches(newMatches);
        });

    }

}

function bracketTemplate(numberOfParticipants){

    $("#tournament").append('<ul class="round round-1"> <li class="spacer">&nbsp;</li> </ul> <ul class="round round-2"> <li class="spacer">&nbsp;</li> </ul>');
    for(let i=0; i<2; i++){
        $(".round-1").append('<li class="game game-top n'+(i)+'"> <span></span></li>'+
        '<li class="game game-spacer n'+(i)+'">&nbsp;</li>'+
        '<li class="game game-bottom n'+(i)+'"> <span></span></li>'+
        '<li class="spacer">&nbsp;</li>');  
    }
    $(".round-2").append('<li class="game game-top n0"> <span></span></li>'+
    '<li class="game game-spacer n0">&nbsp;</li>'+
    '<li class="game game-bottom n0"> <span></span></li>'+
    '<li class="spacer">&nbsp;</li>');
    if(numberOfParticipants > 4){
        $("#tournament").append('<ul class="round round-3"> <li class="spacer">&nbsp;</li> </ul>');
        for(let i=0; i<2; i++){
            $(".round-1").append('<li class="game game-top n'+(i+2)+'"> <span></span></li>'+
            '<li class="game game-spacer n'+(i+2)+'">&nbsp;</li>'+
            '<li class="game game-bottom n'+(i+2)+'"> <span></span></li>'+
            '<li class="spacer">&nbsp;</li>');  
        }
        $(".round-2").append('<li class="game game-top n1"> <span></span></li>'+
        '<li class="game game-spacer n1">&nbsp;</li>'+
        '<li class="game game-bottom n1"> <span></span></li>'+
        '<li class="spacer">&nbsp;</li>');
        $(".round-3").append('<li class="game game-top n0"> <span></span></li>'+
        '<li class="game game-spacer n0">&nbsp;</li>'+
        '<li class="game game-bottom n0"> <span></span></li>'+
        '<li class="spacer">&nbsp;</li>');
    }
    if(numberOfParticipants > 8){
        $("#tournament").append('<ul class="round round-4"> <li class="spacer">&nbsp;</li> </ul>');
        for(let i=0; i<4; i++){
            $(".round-1").append('<li class="game game-top n'+(i+4)+'"> <span></span></li>'+
            '<li class="game game-spacer n'+(i+4)+'">&nbsp;</li>'+
            '<li class="game game-bottom n'+(i+4)+'"> <span></span></li>'+
            '<li class="spacer">&nbsp;</li>');      
        }
        for(let i=0; i<2; i++){
            $(".round-2").append('<li class="game game-top n'+(i+2)+'"> <span></span></li>'+
            '<li class="game game-spacer n'+(i+2)+'">&nbsp;</li>'+
            '<li class="game game-bottom n'+(i+2)+'"> <span></span></li>'+
            '<li class="spacer">&nbsp;</li>');          
        }
        $(".round-3").append('<li class="game game-top n1"> <span></span></li>'+
        '<li class="game game-spacer n1">&nbsp;</li>'+
        '<li class="game game-bottom n1"> <span></span></li>'+
        '<li class="spacer">&nbsp;</li>');
        $(".round-4").append('<li class="game game-top n0"> <span></span></li>'+
        '<li class="game game-spacer n0">&nbsp;</li>'+
        '<li class="game game-bottom n0"> <span></span></li>'+
        '<li class="spacer">&nbsp;</li>');

    }
    if(numberOfParticipants > 16){
        $("#tournament").append('<ul class="round round-5"> <li class="spacer">&nbsp;</li> </ul>');
        for(let i=0; i<8; i++){
            $(".round-1").append('<li class="game game-top n'+(i+8)+'"> <span></span></li>'+
            '<li class="game game-spacer n'+(i+8)+'">&nbsp;</li>'+
            '<li class="game game-bottom n'+(i+8)+'"> <span></span></li>'+
            '<li class="spacer">&nbsp;</li>');             
        }
        for(let i=0; i<4; i++){
            $(".round-2").append('<li class="game game-top n'+(i+4)+'"> <span></span></li>'+
            '<li class="game game-spacer n'+(i+4)+'">&nbsp;</li>'+
            '<li class="game game-bottom n'+(i+4)+'"> <span></span></li>'+
            '<li class="spacer">&nbsp;</li>');           
        }
        for(let i=0; i<2; i++){
            $(".round-3").append('<li class="game game-top n'+(i+2)+'"> <span></span></li>'+
            '<li class="game game-spacer n'+(i+2)+'">&nbsp;</li>'+
            '<li class="game game-bottom n'+(i+2)+'"> <span></span></li>'+
            '<li class="spacer">&nbsp;</li>');            
        }
        $(".round-4").append('<li class="game game-top n1"> <span></span></li>'+
        '<li class="game game-spacer n1">&nbsp;</li>'+
        '<li class="game game-bottom n1"> <span></span></li>'+
        '<li class="spacer">&nbsp;</li>');            

        $(".round-5").append('<li class="game game-top n0"> <span></span></li>'+
        '<li class="game game-spacer n0">&nbsp;</li>'+
        '<li class="game game-bottom n0"> <span></span></li>'+
        '<li class="spacer">&nbsp;</li>');
    }
    
    
}

function loadMatches(matches){
    console.log(matches);
    for(let i=0; i<matches.length; i++){
        let round = Math.floor(matches[i]._id/10);
        let matchN = matches[i]._id - round*10;
        if(matches[i].winner == matches[i].p1){
            $(".round-"+round+ " > .game-top.n"+matchN).removeClass('winner');
            $(".round-"+round+ " > .game-top.n"+matchN).addClass('winner');
        }
        $(".round-"+round+ " > .game-top.n"+matchN+ " > span").empty();
        $(".round-"+round+ " > .game-top.n"+matchN+ " > span").append(
            matches[i].p1
        );
        if(matches[i].winner == matches[i].p2){
            $(".round-"+round+ " > .game-bottom.n"+matchN).removeClass('winner');
            $(".round-"+round+ " > .game-bottom.n"+matchN).addClass('winner');
        }
        $(".round-"+round+ " > .game-bottom.n"+matchN+ " > span").empty();
        $(".round-"+round+ " > .game-bottom.n"+matchN+ " > span").append(
            matches[i].p2
        );
        $(".round-"+round+ " > .game-spacer.n"+matchN).empty();
        $(".round-"+round+ " > .game-spacer.n"+matchN).append(
            matches[i].score
        );
    }
}

function shufflePart(participants){
    var currentIndex = participants.length, temporaryValue, randomIndex;
    
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = participants[currentIndex];
        participants[currentIndex] = participants[randomIndex];
        participants[randomIndex] = temporaryValue;
    }
    let bracketLength = Math.ceil(participants.length /4)*4;
    let x=0;
    for(let i=0; i<bracketLength; i+=2){
        $(".round-1 > .game-top.n"+x+" > span").empty();
        if(i+1 >= participants.length){
            console.log(".round-2 > .game-bottom.n"+(x/2)+" > span");
            $(".round-2 > .game-bottom.n"+(Math.floor(x/2))+" > span").empty();
            $(".round-1 > .game-bottom.n"+(x)+" > span").empty();
        }
        else{
            $(".round-1 > .game-bottom.n"+(x)+" > span").empty();
        }
        x++;
    }
    x=0;
    for(let i=0; i<bracketLength; i+=2){
        if(i >= participants.length){
            $(".round-1 > .game-top.n"+(x)+" > span").append("--BYE--");
        }
        else
            $(".round-1 > .game-top.n"+x+" > span").append(participants[i]);
        if(i+1 >= participants.length){
            $(".round-1 > .game-top.n"+(x)).addClass('winner');
            $(".round-1 > .game-bottom.n"+(x)+" > span").append("--BYE--");
        }
        else{
            $(".round-1 > .game-bottom.n"+(x)+" > span").append(participants[i+1]);
        }
        x++;
    }
      
    return participants;
      
}

function setScore(A, B){
    $("#A").text(A);
    $("#B").text(B);
    $('#scoreModal').modal('show');
}

$("#modalYes").on('click', (e)=>{
    var numberPattern = /\d+/g;
    let sendData = {
        match: {
            _id: String(topA.parentNode.className.match(numberPattern) + topA.className.match(numberPattern)),
            score : $("#scoreA").val() + "-" + $("#scoreB").val(),
            p1: topA.innerText,
            p2: botB.innerText,
            winner: ''
        },
        id: tournament._id
    }
    let _id = parseInt((topA.parentNode.className.match(numberPattern) + topA.className.match(numberPattern)), 10);

    if($("#scoreA").val() >  $("#scoreB").val()){
        topA.classList.add('winner');
        botB.classList.remove('winner');
        topA.nextSibling.innerText = $("#scoreA").val() + "-" + $("#scoreB").val();
        sendData.match.winner = topA.innerText;
    }
    else{
        botB.classList.add('winner');
        topA.classList.remove('winner');
        botB.previousSibling.innerText = $("#scoreA").val() + "-" + $("#scoreB").val();
        sendData.match.winner = botB.innerText;
    }
    
    
    $.ajax({
        type: 'PUT',
        url: '/api/tournaments/match',
        contentType: "application/json",
        data: JSON.stringify(sendData)
    }).done(function (data) {
        for (var i=0; i < tournament.matches.length; i++) {
            if (tournament.matches[i]._id == _id) {
                tournament.matches[i] = sendData.match;
            }
        }
        checkWinners();
        console.log(data);
    });
    $('#scoreModal').modal('hide');
});



$("#start").on('click', (e) =>{
    e.preventDefault();
    console.log(creator);
    if(creator){
        $("#overlay").hide();
        $("#shuffle").show();
        $("#lock").show();
    }
});



$("#shuffle").on('click', (e)=>{
    tournament.participants = shufflePart(tournament.participants);
    
});

$("#lock").on('click', (e)=>{

    let bracketLength = Math.ceil(tournament.participants.length /4)*4;
    let participants = tournament.participants;

    let matches = [];
    let x = 0;
    for(let i=0; i<bracketLength; i+=2){
        matches.push(
            {   _id:  10+x,
                p1: participants[i]||'--BYE--', p2: participants[i+1]||'--BYE--',
                score: '', winner: ''
            }
        );
        x++;
    }

    let sendData = {
        matches: matches,
        _id: tournament._id
    };
    let sendData2 = {
        started : true
    };

    $.ajax({
        type: 'POST',
        url: '/api/tournaments/addM',
        contentType: "application/json",
        data: JSON.stringify(sendData)
    }).done(function (data) {
        console.log(data);
        $.ajax({
            type: 'PUT',
            url: '/api/tournaments/update/'+tournament._id,
            contentType: "application/json",
            data: JSON.stringify(sendData2)
        }).done(function (data) {
            $("#start").hide();
            $("#shuffle").hide();
            $("#lock").hide();
            started = true;
            tournament.matches = matches;
            console.log(tournament.matches);
        });
    });

});



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