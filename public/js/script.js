

let endpointUser = "/api/users";
let endpointLogin = "/api/users/login";
let endpointTeams = "/api/teams";
let endpointTeamsAdd = "/api/teams/Add";


function checkSession(){
    let userProfile = Cookies.get('userName');
    if(!userProfile){        
        window.location.href = "/";
    }
}

function checkLogin(){
    let userProfile = Cookies.get('userName');
    if(userProfile){        
        window.location.href = "/home";
    }
}

function loadProfile(){
    checkSession();
    let userProfile = Cookies.get('userName');
    $.ajax({url: endpointUser+"/"+userProfile,
        method: "GET",
        dataType: "json",
        success: function(responseJSON){
            let nameField = $("#nameProfile");
            let userField = $("#userProfile");
            let ageField = $("#ageProfile");
            let mailField = $("#mailProfile");
            let phoneField = $("#phoneProfile");
            let bioField = $("#bioProfile");
            nameField.text(responseJSON.name);
            userField.text(responseJSON.user);
            ageField.text(responseJSON.age);
            mailField.text(responseJSON.mail);
            phoneField.text(responseJSON.phone);
            bioField.text(responseJSON.bio);
        },
        error: function(err){
                console.log(err);
               }
    });
}

function loadTeam(){    
    $("#addMember").hide();
    $("#deleteTeam").hide();
    checkSession();
    let teamPage = window.location.pathname;
    teamPage = teamPage.substring(7);    
    $.ajax({
        url: endpointTeams+"/"+teamPage,
        method: "GET",
        dataType: "json",
        success: function(responseJSON){
            try{
                let nameField = $("#nameTeam");
                let descField = $("#descTeam");
                let idField = $("#idTeam");
                nameField.text(responseJSON.teamName);
                descField.text(responseJSON.desc);
                idField.text(responseJSON._id);
                let list = $("#membersTeam");
                list.html("");
                list.append(`<li class="list-group-item text-primary" id="creatorTeam">
                        ${responseJSON.creator}
                        </li>`);
                for (let i = 0; i < responseJSON.members.length; i++) {
                    list.append(`<li class="list-group-item">
                        ${responseJSON.members[i]}
                        </li>`);
                }
                checkIfCreator();
            }catch(error){
                let list = $("#resultDiv");
                list.html("<p class ='display-2 text-center'>No se encontró el equipo</p>");
            }
        },
        error: function(err){            
                console.log(err);
               }
    });    
}

function loadAllTeams(){
    checkSession();    
    $.ajax({url: endpointTeams,
        method: "GET",
        dataType: "json",
        success: function(responseJSON){            
            let list = $("#allTeams");
            list.html("");            
            for (let i = 0; i < responseJSON.length; i++) {
                list.append(`<li class="list-group-item teamItem">
                    <img style="max-width:50px; margin: 10px;" src="./img/team.png" class="text-center rounded-circle">
                    <a href="/teams/${responseJSON[i]._id}">
                    ${responseJSON[i].teamName}
                    </a>
                    </li>`);
            }
        },
        error: function(err){
            console.log(err);
        }
    });
}

function checkIfCreator(){
    if(Cookies.get('userName') == $("#creatorTeam").text().trim()){
        $("#addMember").show();
        $("#deleteTeam").show();
        return true;
    }else{
        $("#addMember").hide();
        $("#deleteTeam").hide();
        return false;
    }
}

$("#Form-deleteTeam").on("click", function(e){
    e.preventDefault(); 
    let teamId = $("#idTeam").text().trim();        
    $.ajax({
        url: endpointTeams+"/"+teamId,
        method: "DELETE",
        dataType: "json",
        success: function(responseJSON){
            alert("Equipo borrado");
            window.location.href = "/teams";

        },
        error: function(err){            
            alert("Error al borrar equipo");            
        }
    });
    //ADD NEW MEMBER
    
});

$("#Form-addMember").on("click", function(e){
    e.preventDefault();
    let memberAndTeam = {
        user: "",
        teamName :""
    };  
    memberAndTeam.teamName = $("#nameTeam").text().trim();
    //GET NEW MEMBER DATA
    memberAndTeam.user = $("#Form-teamMemberName").val();
    $.ajax({
        url: endpointUser+"/"+memberAndTeam.user,
        method: "GET",
        dataType: "json",
        success: function(responseJSON){
            try{
                let a = responseJSON.name;
                $.ajax({
                    url: endpointTeamsAdd,
                    data : JSON.stringify(memberAndTeam),
                    method: "POST",
                    dataType : "JSON",
                    contentType : "application/json",
                    success: function(responseJSON2){
                        if(!responseJSON2){
                            alert("Miembro no añadido");
                        }else{
                            alert("Miembro añadido");                            
                            window.location.href = "/teams";
                        }
                    },
                    error : function(err){
                        if(err.status == 406){
                            alert("Faltan campos para añadir");
                        }else{
                            alert("Error al añadir miembro al equipo");
                        }            
                    }
                });
            }catch(error){
                alert("Usuario no encontrado");
            }
        },
        error: function(err){            
            alert("Error al encontrar usuario");
            return;
        }
    });
    //ADD NEW MEMBER
    
});

$("#Form-createTeam").on("click", function(e){
    e.preventDefault();
    let newTeam = {  
        _id : "",
        teamName : "",
        creator : "",
        creationDate : "",
        desc : "",
        members : []
    };    
    newTeam._id = $("#Form-teamId").val();
    newTeam.teamName = $("#Form-teamName").val();
    newTeam.desc = $("#Form-desc").val();
    newTeam.creator= Cookies.get("userName");
    $.ajax({
        url: endpointTeams,
        data : JSON.stringify(newTeam),
        method: "POST",
        dataType : "JSON",
        contentType : "application/json",
        success: function(responseJSON){
            if(!responseJSON){
                alert("Equipo no creado");
            }else{
                alert("Equipo creado");                
                window.location.href = "/teams/"+newTeam._id;
            }
        },
        error : function(err){
            if(err.status == 406){
                alert("Faltan campos para crear");
            }else{
                alert("Error al crear equipo, identificador repetido");
            }            
        }
    });
});


$("#btn_login").on("click", function(e){
    e.preventDefault();
    let authUser = {
        user: "",
        pass: ""
    };
    authUser.user = $("#inputUser").val();
    authUser.pass = $("#inputPassword").val();
    $.ajax({
        url: endpointLogin,
        data : JSON.stringify(authUser),
        method: "POST",
        dataType : "JSON",
        contentType : "application/json",
        success: function(responseJSON){
            if(!responseJSON){
                alert("Usuario no registrado");
            }else{
                alert("Bienvenido");
                Cookies.set('userName', authUser.user);
                window.location.href = "/home";
            }
        },
        error : function(err){
            if(err.status == 406){
                alert("Faltan campos para iniciar");
            }else{
                alert("Error al iniciar sesión");
            }            
        }
    });
});

$('#search').on('click', function(e) {
    var query = $("#searchString").val();
    window.location.href = "/search?name="+query;
});
$('#searchString').keypress(function (e) {
    var key = e.which;
    if(key == 13)  // the enter key code
     {
       $("#search").click();
       return false;  
     }
});   


$("#logout").on("click", function(e){
    e.preventDefault();
    Cookies.remove('userName');
    window.location.href = "index.html";
});