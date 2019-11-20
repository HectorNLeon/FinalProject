let endpointUser = "/user";
let endpointLogin = "/users/login";
let endpointTeam = "/team";
let endpointTeams = "/teams";
let endpointTeamsAdd = "/teamsAdd";


function checkSession(){
    let userProfile = Cookies.get('userName');
    if(!userProfile){        
        window.location.href = "index.html";
    }
}

function checkLogin(){
    let userProfile = Cookies.get('userName');
    if(userProfile){        
        window.location.href = "home.html";
    }
}

function loadProfile(){
    checkSession();
    let userProfile = Cookies.get('userName');
    $.ajax({
        url: endpointUser+"?user="+userProfile,
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
    checkSession();
    let url = new URL(window.location.href);
    let teamPage = url.searchParams.get("team");
    $.ajax({
        url: endpointTeam+"?team="+teamPage,
        method: "GET",
        dataType: "json",
        success: function(responseJSON){
            try{
                let nameField = $("#nameTeam");
                let descField = $("#descTeam");
                nameField.text(responseJSON.teamName);
                descField.text(responseJSON.desc);
                let list = $("#membersTeam");
                list.html("");
                list.append(`<li class="list-group-item text-primary" id="creatorTeam">
                        ${responseJSON.creator.name}
                        </li>`);
                for (let i = 0; i < responseJSON.members.length; i++) {
                    list.append(`<li class="list-group-item">
                        ${responseJSON.members[i].name}
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
                    <a href="./equipos.html?team=${responseJSON[i].teamName}">
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
    if(Cookies.get('nameUser') == $("#creatorTeam").text().trim()){
        $("#addMember").show();
        return true;
    }else{
        $("#addMember").hide();
        return false;
    }
}

$("#Form-addMember").on("click", function(e){
    e.preventDefault();
    let memberAndTeam = {
        id: "",
        user: "",
        name: "",
        teamName :""
    };  
    memberAndTeam.teamName = $("#nameTeam").text().trim();
    //GET NEW MEMBER DATA
    memberAndTeam.user = $("#Form-teamMemberName").val();
    $.ajax({
        url: endpointUser+"?user="+memberAndTeam.user,
        method: "GET",
        dataType: "json",
        success: function(responseJSON){
            try{
                memberAndTeam.name=responseJSON.name;
                memberAndTeam.id = responseJSON._id;
                $.ajax({
                    url: endpointTeamsAdd,
                    data : JSON.stringify(memberAndTeam),
                    method: "POST",
                    dataType : "JSON",
                    contentType : "application/json",
                    success: function(responseJSON){
                        if(!responseJSON){
                            alert("Miembro no añadido");
                        }else{
                            alert("Miembro añadido");                                            
                            window.location.href = "equipos.html?team="+memberAndTeam.teamName;
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
    let creator = {
        id: "",
        user: "",
        name: ""
    };
    let newTeam = {  
        teamName : "",
        creator : creator,
        creationDate : "",
        desc : "",
        members : []
    };    
    newTeam.teamName = $("#Form-teamName").val();
    newTeam.desc = $("#Form-desc").val();
    newTeam.creator.id = Cookies.get("id");
    newTeam.creator.user = Cookies.get("userName");
    newTeam.creator.name = Cookies.get("nameUser");
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
                window.location.href = "equiposConsulta.html";
            }
        },
        error : function(err){
            if(err.status == 406){
                alert("Faltan campos para crear");
            }else{
                alert("Error al crear equipo");
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
            console.log(responseJSON);
            if(!responseJSON){
                alert("Usuario no registrado");
            }else{
                alert("Bienvenido");
                Cookies.set('userName', authUser.user);
                Cookies.set('nameUser', responseJSON.name);
                Cookies.set('idUser', responseJSON._id);
                window.location.href = "home.html";
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

$("#logout").on("click", function(e){
    e.preventDefault();
    Cookies.remove('userName');
    Cookies.remove('nameUser');
    Cookies.remove('idUser');
    window.location.href = "index.html";
});