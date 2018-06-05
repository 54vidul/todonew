$(document).ready(function(){
    $('.login-info-box').fadeOut();
    $('.login-show').addClass('show-log-panel');
    $('#log-login-show').prop('checked', false);
    $('#log-reg-show').prop('checked', true);
    $("#login_email, #register_email").val('');
    $("#register_confirm_password, #register_password").keyup(checkPasswordMatch);
    $("#login_email").keyup(isEmailBox);
    $("#register_email").keyup(isEmailBoxRegister);
    $("#login_password").keyup(checkLoginPass);
    $("#register_password").keyup(checkRegisterPass);
   
});

$('#login_button').click(function(){
    
     var email = $('#login_email').val();
    var password = $('#login_password').val();
     if(!isEmail(email) || !password){
         if(!isEmail(email)){
            $('#login_email').attr("placeholder", "Please enter valid email").val("").focus().blur().css("color","#ff0000");
        }
        
        if(!password){
            $('#login_password').attr("placeholder", "Please enter password").val("").focus().blur().css("color","#ff0000");
        }
     }else{
         var logincredentials = {email: email, password: password};
         $.ajax({
            type: 'POST',
            url:'/users/login',
            data: logincredentials,
            success: function(data , textStatus, request){
                var d = new Date();
                d.setDate(d.getDate()+1);
                var expires = "expires="+d.toUTCString();
                document.cookie='x-auth='+ request.getResponseHeader('x-auth')+ ";" + expires + ";path=/";
                location.href = '/todo';
                
               
            }
        });
     }
     
    
    
});

function checkPasswordMatch() {
    var password = $("#register_password").val();
    var confirmPassword = $("#register_confirm_password").val();

    if (password != confirmPassword)
        $('#register_confirm_password').css({"border":"2px solid red"});
    else
        $('#register_confirm_password').css({"border":"2px solid green"});
}

function checkLoginPass() {
    var password = $("#login_password").val();
    if(testPassword(password)){
        $('#login_password').css({"border":"2px solid green"});
    }else{
        if(!testPassword(password)){
            $('#login_password').css({"border":"2px solid red"});
        }else{
            $('#login_password').css({"border":"1px solid gray"});
        }
    }
}

function checkRegisterPass() {
    var password = $("#register_password").val();
    if(testPassword(password)){
        $('#register_password').css({"border":"2px solid green"});
    }else{
        if(!testPassword(password)){
            $('#register_password').css({"border":"2px solid red"});
        }else{
            $('#register_password').css({"border":"1px solid gray"});
        }
    }
}

function testPassword(value) {
   return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
        && /[a-z]/.test(value) // has a lowercase letter
        && /\d/.test(value) // has a digit
}

function isEmailBox(){
    var email = $('#login_email').val();
    
    if(!isEmail(email) ){
        if(!isEmail(email)){
            $('#login_email').css({"border":"2px solid red"});
        }
        
        
    }else{
        if(isEmail(email)){
            if(isEmail(email)){
                $('#login_email').css({"border":"2px solid green"});
            }
            
            
        }else{
            $('#login_email').css({"border":"1px solid gray"});
        }
    }
}

function isEmailBoxRegister(){
    var remail = $('#register_email').val();
    if( !isEmail(remail)){
        
        if(!isEmail(remail)){
            $('#register_email').css({"border":"2px solid red"});
        }
        
    }else{
        if( isEmail(remail)){
            
            if(isEmail(remail)){
                $('#register_email').css({"border":"2px solid green"});
            }
            
        }else{
            $('#register_email').css({"border":"1px solid gray"});

        }
    }
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}


$('#register_button').click(function(){
    
    var email = $('#register_email').val();
    var password = $('#register_password').val();
     if(!isEmail(email) || !password){
         if(!isEmail(email)){
            $('#register_email').attr("placeholder", "Please enter valid email").val("").focus().blur().css("color","#ff0000");
        }
        
        if(!password){
            $('#register_password').attr("placeholder", "Please enter password").val("").focus().blur().css("color","#ff0000");
        }
     }else{
         var registercredentials = {email: email, password: password};
         $.ajax({
            type: 'POST',
            url:'/users',
            data: registercredentials,
            success: function(data){
                alert("registered");
            }
        });
     }
});

$('#login_email').click(function(){
    $('#login_email').css("color","#000000");
});

$('#login_password').click(function(){
    $('#login_password').css("color","#000000");
});

$('.login-reg-panel input[type="radio"]').on('change', function() {
    if($('#log-login-show').is(':checked')) {
        $('.register-info-box').fadeOut(); 
        $('.login-info-box').fadeIn();
        
        $('.white-panel').addClass('right-log');
        $('.register-show').addClass('show-log-panel');
        $('.login-show').removeClass('show-log-panel');
        
    }
    else if($('#log-reg-show').is(':checked')) {
        $('.register-info-box').fadeIn();
        $('.login-info-box').fadeOut();
        
        $('.white-panel').removeClass('right-log');
        
        $('.login-show').addClass('show-log-panel');
        $('.register-show').removeClass('show-log-panel');
    }
});

