let edit = false;
let tournament;
var formatDate = function(date) {
    return date.getFullYear() +"-"+(date.getMonth()+1)+ "-"  +date.getDate();
}  

function init(){
    let path = window.location.pathname;
    if(path.includes("edit")){
        let id = path.substring(6);
        edit = true;
        console.log(id);
        $.ajax({
            type: 'GET',
            url: '/api/tournaments/id/' + id
        }).done(function(data) {
            tournament = data;
            $("#name").val(data.name);
            $("#desc").val(data.desc);
            $("#place").val(data.place);
            $("#date").val(formatDate(new Date(data.date)));
            $("#game").val(data.game);
            $(".custom-file-label").html(data.img.substring(4));
        });
    }

    let user = Cookies.get('userName');
    $("form").submit(function(e){
        e.preventDefault();
        var form = $('form')[0];
        console.log(form);
        var formData = new FormData(form);
        formData.append('creator', user);
        if(edit){
            formData.append('oimg', tournament.img);
            formData.append('id', tournament._id);
            $.ajax({
                url: '/api/tournaments/edit',
                data: formData,
                type: 'POST',
                contentType: false,
                processData: false, // NEEDED, DON'T OMIT THIS
                success: function(data){
                    window.location.href = '/tournaments';
                  }
            });
        }
        else{
            $.ajax({
                url: '/api/tournaments',
                data: formData,
                type: 'POST',
                contentType: false,
                processData: false, // NEEDED, DON'T OMIT THIS
                success: function(data){
                    window.location.href = '/tournaments';
                  }
            });
        }
        
        
    });
    $('#inputGroupFile01').on('change',function(){
        //get the file name
        var fileName = $(this).val();
        //replace the "Choose a file" label
        $(this).next('.custom-file-label').html(fileName);
    });
}


init()