
let endpointUser = "/api/users";
let endpointLogin = "/api/users/login";
let endpointTeams = "/api/teams";
let endpointTeamsAdd = "/api/teams/Add";
let endpointTeamsRemove = "/api/teams/Remove";

goMyProf();

function checkSession(){
    let userProfile = Cookies.get('userName');
    if(!userProfile){        
        window.location.href = "/";
    }
}

function goMyProf (){
    let myProfile = "/profile/"+Cookies.get("userName");
    $("#goProfile").attr("href", myProfile);
};

function checkLogin(){
    let userProfile = Cookies.get('userName');
    if(userProfile){        
        window.location.href = "/home";
    }
}

function loadProfile(){
    checkSession();
    let userProfile = window.location.pathname;
    userProfile = userProfile.substring(9);
    $.ajax({url: endpointUser+"/id/"+userProfile,

        method: "GET",
        dataType: "json",
        success: function(responseJSON){
            try{
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
            }catch(error){
                let nameField = $("#nameProfile");
                nameField.text("User not found");
                nameField.attr("class", "display-2 text-center");
                $("#imgProfile").hide();
                $("#result").hide();
            }
            checkIfMyProf();
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
        url: endpointTeams+"/id/"+teamPage,

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
                list.append(`<li class="list-group-item text-primary flex-row" id="creatorTeam">
                        <div class="d-flex flex-row">
                            <div class="p-0">
                                <a href="/profile/${responseJSON.creator}">
                                ${responseJSON.creator}
                            </a>
                            </div>                            
                        </div>
                        </li>`);
                for (let i = 0; i < responseJSON.members.length; i++) {
                    list.append(`<li class="list-group-item">
                        <div class="d-flex flex-row">
                            <div class="p-0">
                                <a href="/profile/${responseJSON.members[i]}" style="color:black">
                                ${responseJSON.members[i]}
                                </a>
                            </div>
                            <div class="ml-auto p-0 deleteMembers">
                                <button class="btn btn-danger button_delMember align-self-end"> Remove</button>
                            </div>                        
                        </li>`);
                }
                checkIfCreator();
            }catch(error){
                let list = $("#resultDiv");
                list.html("<p class ='display-2 text-center'>Team not found</p>");

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
        $("#modifyTeam").show();
        $(".deleteMembers").each(function(index, element) {
            $(element).show();
        });
        return true;
    }else{
        $("#addMember").hide();
        $("#deleteTeam").hide();
        $("#modifyTeam").hide();
        $(".deleteMembers").each(function(index, element) {
            $(element).hide();
        });
        return false;
    }
}

function checkIfMyProf(){
    if(Cookies.get('userName') == $("#userProfile").text().trim()){
        $("#modifyProfile").show();        
        return true;
    }else{
        $("#modifyProfile").hide();        
        return false;
    }
}

$("#modifyProfile").on("click", function(e){
    e.preventDefault();
    $("#Form-newName").val($("#nameProfile").text().trim());
    $("#Form-newAge").val($("#ageProfile").text().trim());
    $("#Form-newPhone").val($("#phoneProfile").text().trim());
    $("#Form-newMail").val($("#mailProfile").text().trim());
    $("#Form-newBio").val($("#bioProfile").text().trim());
});

$("#modifyTeam").on("click", function(e){
    e.preventDefault();
    $("#Form-newTeamName").val($("#nameTeam").text().trim());
    $("#Form-newDesc").val($("#descTeam").text().trim());
});

$("#Form-modifyProfile").on("click", function(e){
    e.preventDefault();
    let newProf = {
        user: "",
        name : "",
        age : "",
        phone : "",
        mail: "",
        bio :"" 
    };
    newProf.name = $("#Form-newName").val();    
    newProf.age = $("#Form-newAge").val();
    newProf.phone = $("#Form-newPhone").val();
    newProf.mail = $("#Form-newMail").val();
    newProf.bio = $("#Form-newBio").val();
    newProf.user = $("#userProfile").text().trim();
    console.log(newProf);
    $.ajax({
        url: endpointUser,
        data : JSON.stringify(newProf),
        method: "PUT",
        dataType : "JSON",
        contentType : "application/json",
        success: function(responseJSON){
            console.log(responseJSON);
            if(responseJSON.nModified==0){
                alert("User not modified");
            }else{
                alert("User modified");
                window.location.href = "/profile/"+newProf.user;
            }
        },
        error : function(err){
            if(err.status == 406){
                alert("Missing fields to modify");
            }else{
                alert("Error modifying user");
            }            
        }
    });
});

$("#Form-deleteTeam").on("click", function(e){
    e.preventDefault(); 
    let teamId = $("#idTeam").text().trim();        
    $.ajax({
        url: endpointTeams+"/"+teamId,
        method: "DELETE",
        dataType: "json",
        success: function(responseJSON){
            alert("Team deleted");
            window.location.href = "/teams";

        },
        error: function(err){            
            alert("Error deleting team");            
        }
    });    
});

$("#membersTeam").on("click", ".button_delMember", function(e){
    e.preventDefault();
    let memberAndTeam = {
        user: "",
        teamId :""
    };
    memberAndTeam.user = e.target.parentNode.parentNode.querySelector("a").innerText;
    memberAndTeam.teamId = $("#idTeam").text().trim();
    console.log(memberAndTeam.user);
    console.log(memberAndTeam.teamId);
    $.ajax({
        url: endpointTeamsRemove,
        data : JSON.stringify(memberAndTeam),
        method: "PUT",
        dataType : "JSON",
        contentType : "application/json",
        success: function(responseJSON2){
            if(!responseJSON2){
                alert("Member not removed");
            }else{
                alert("Member removed");
                window.location.href = "/teams/"+memberAndTeam.teamId;
            }
        },
        error : function(err){
            if(err.status == 406){
                alert("Missing fields");
            }else{
                alert("Error");
            }
        }
    });
});

$("#Form-addMember").on("click", function(e){
    e.preventDefault();
    let memberAndTeam = {
        user: "",
        teamId :""
    };  
    memberAndTeam.teamId = $("#idTeam").text().trim();
    //GET NEW MEMBER DATA
    memberAndTeam.user = $("#Form-teamMemberName").val();
    $.ajax({
        url: endpointUser+"/id/"+memberAndTeam.user,
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
                            alert("Member not added");
                        }else{
                            alert("Member added");                            
                            window.location.href = "/teams/"+memberAndTeam.teamId;
                        }
                    },
                    error : function(err){
                        if(err.status == 406){
                            alert("Missing fields");
                        }else{
                            alert("Error");
                        }            
                    }
                });
            }catch(error){
                alert("User not found");
            }
        },
        error: function(err){            
            alert("Error founding user");
            return;
        }
    });
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
                alert("Team not created");
            }else{
                alert("Team created");
                window.location.href = "/teams/"+newTeam._id;
            }
        },
        error : function(err){
            if(err.status == 406){
                alert("Missing fields to create");
            }else{
                alert("Error creating team, repeated id");
            }
        }
    });
});

$("#Form-modifyTeam").on("click", function(e){
    e.preventDefault();
    let newTeam = {
        _id : "",
        teamName : "",
        desc : ""
    };
    newTeam.teamName = $("#Form-newTeamName").val();
    newTeam.desc = $("#Form-newDesc").val();
    newTeam._id = $("#idTeam").text().trim();
    console.log(newTeam);
    $.ajax({
        url: endpointTeams,
        data : JSON.stringify(newTeam),
        method: "PUT",
        dataType : "JSON",
        contentType : "application/json",
        success: function(responseJSON){
            console.log(responseJSON);
            if(responseJSON.nModified==0){
                alert("Team not modified");
            }else{
                alert("Team modified");
                window.location.href = "/teams/"+newTeam._id;

            }
        },
        error : function(err){
            if(err.status == 406){
                alert("Missing fields to modify");
            }else{
                alert("Error modifying team");

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
                alert("User not registered");
            }else{
                alert("Welcome!");
                Cookies.set('userName', authUser.user);
                window.location.href = "/home";
            }
        },
        error : function(err){
            if(err.status == 406){
                alert("Missing fields");
            }else{
                alert("Error logging in");
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

$('#inputGroupFile01').on('change',function(){
    //get the file name
    var fileName = $(this).val();
    //replace the "Choose a file" label
    $(this).next('.custom-file-label').html(fileName);
})

$("#logout").on("click", function(e){
    e.preventDefault();
    Cookies.remove('userName');
    Cookies.remove('nameUser');
    Cookies.remove('idUser');
    window.location.href = "index.html";
});