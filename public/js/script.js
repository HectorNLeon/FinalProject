

let endpointUser = "/api/users";
let endpointLogin = "/api/users/login";
let endpointTeam = "/api/teams"


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
    $.ajax({url: endpointUser+"?user="+userProfile,
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
    checkSession();
    let teamPage = "gunters";
    $.ajax({url: endpointTeam+"?team="+teamPage,
        method: "GET",
        dataType: "json",
        success: function(responseJSON){
            let nameField = $("#nameTeam");
            let descField = $("#descTeam");
            nameField.text(responseJSON.teamName);
            descField.text(responseJSON.desc);
            let list = $("#membersTeam");
            list.html("");
            list.append(`<li class="list-group-item text-primary">
                    ${responseJSON.creator.name}
                    </li>`);
            for (let i = 0; i < responseJSON.members.length; i++) {
                list.append(`<li class="list-group-item">
                    ${responseJSON.members[i].name}
                    </li>`);
            }
        },
        error: function(err){
                console.log(err);
               }
    });
}

function getUserURL(){    
    var user = parent.document.URL.substring(parent.document.URL.indexOf('?')+6, parent.document.URL.length);
    let userField = $("#userLogged");
    userField.text(user)
}

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