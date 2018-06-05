$( document ).ready(function() {
    $('#newtodo').val("");
$.ajax({
    type: 'GET',
    url:'/todos',
    headers:{
    "x-auth": getCookie('x-auth')
    },
    success: function(data){
        
        loadData(data);
             
    }
    });
});

$('#newtodo').click(function(){
     $('#newtodo').css("color","#f0f8ff");
});

$('#addbutton').click(function(){
    
    var textt = $('#newtodo').val();
    if(!textt){
        $('#newtodo').attr("placeholder", "Please enter some ToDo here").val("").focus().blur().css("color","#ff0000");
    }else{
        var data = {
            text : textt
        };
        $.ajax({
        type: 'POST',
        url:'/todos',
        contentType: "application/json; charset=utf-8",
        data:JSON.stringify(data),
        headers:{
            "x-auth": getCookie('x-auth')
        },
        success: function(data){
            $('#newtodo').val("");
            $.ajax({
                type: 'GET',
                 url:'/todos',
                headers:{
                "x-auth": getCookie('x-auth')
                },
                success: function(data){
        
                    loadData(data);
             
                }
            });
        }
    });
    }
    
});

function deleteTodo(id){
     
 
    $.ajax({
        type: 'DELETE',
        url:'/todos/' + id,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        
        headers:{
            "x-auth": getCookie('x-auth')
        },
        success: function(data){
            $('#newtodo').val("");
             $.ajax({
                type: 'GET',
                 url:'/todos',
                headers:{
                "x-auth": getCookie('x-auth')
                },
                success: function(data){
        
                    loadData(data);
             
                }
            });
        }
    });
    
    
    
}

function loadData(data){
        obj = data;
        var myNode = document.getElementById("addcardshere");
        while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
        }
       
        for(var i = 0; i < obj.todos.length; i++){
            var todo = obj["todos"][i];
            
            var div1 = document.createElement('div');
            div1.className = 'card';
            div1.style.width = '200px';
            
            var h1 = document.createElement('h1');
            var timeStamp = todo['madeOn'];
            var date = new Date(timeStamp);
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            h1.innerHTML = "Made on : " + day + "\/" + month + "\/" + year;
            var p = document.createElement('p');
//            var input = document.createElement('input');
//            input.style.display = "hidden";
//            input.value = todo['_id'];
            
            var divUp = document.createElement('div');
            
            divUp.className = "cancelTodo";
            divUp.id = "cancelTodoBtn";
            
            var deleteInputBtn = document.createElement('input');
            deleteInputBtn.value = "X";
            deleteInputBtn.type = "button";
            deleteInputBtn.style.backgroundColor = "transparent";
            deleteInputBtn.style.borderRadius = "5px";
            deleteInputBtn.style.color = "purple";
            deleteInputBtn.style.border = "0px";
            deleteInputBtn.id = todo['_id'];
            divUp.appendChild(deleteInputBtn);
            deleteInputBtn.addEventListener("click", function(){
                deleteTodo(this.id);
            }); 
            
            var completedCheckbox = document.createElement('input');
            completedCheckbox.type = "checkbox";
            completedCheckbox.name = todo['_id'];
            completedCheckbox.value = false;
            completedCheckbox.className = "checkbox";
            
            var completedBoolean = todo['completed'];
            if(completedBoolean){
                completedCheckbox.checked = true;
            }else{
                completedCheckbox.checked = false;
            }
            completedCheckbox.addEventListener("click", function(){
                var checkedOrNot = this.checked;
                completedCheck(checkedOrNot, this.name);
            });
//            var newlabel = document.createElement("Label");
//            newlabel.className = "completedLabel";
//            newlabel.setAttribute("for",completedCheckbox.id);
//            newlabel.innerHTML = "Completed:";
            
            
            
            p.innerHTML = todo['text'];
            div1.appendChild(completedCheckbox);
            div1.appendChild(divUp);
            div1.appendChild(p);
            div1.appendChild(h1);
            
//            div1.appendChild(newlabel);
            
            document.getElementById('addcardshere').appendChild(div1);
        }
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}


function completedCheck(checked, name){

        var data = {
        completed: checked
    }
    $.ajax({
        type: 'PATCH',
        url:'/todos/' + name,
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(data),
        headers:{
            "x-auth": getCookie('x-auth')
        },
        success: function(data){
            
            $('#newtodo').val("");
             $.ajax({
                type: 'GET',
                 url:'/todos',
                headers:{
                "x-auth": getCookie('x-auth')
                },
                success: function(data){
        
                    loadData(data);
             
                }
            });
        }
    });
    
}