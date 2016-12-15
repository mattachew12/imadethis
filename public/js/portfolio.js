/* 
 * portfolio.js
 * Function definitions for client-side code
 *
 * Authors:
 * - Tanuj Sane
 * - Nikhil Castelino
 * - Matthew Piazza
 *
 * Usage:
 * <script src="portfolio.js"></script>
 */
 
var account;

window.onload = function() { 
    if(!window.sessionStorage.getItem('account')) window.location = 'login.html';    
    account = JSON.parse(window.sessionStorage.getItem('account'));  
    document.getElementById('hello-username').innerHTML = 'Hello, ' + account.u;    
    getMyItems();
}    
        
function getMyItems() {    
    var ajax = new XMLHttpRequest();
    ajax.onload = function () {
        var response = JSON.parse(this.responseText);
        elMyItems = document.getElementById("myItems");
        elMyItems.innerHTML = "";          
        var index = 0;
        for (index = 0; index < response.length; index++){            
            if (response[index].description == undefined) response[index].description = "";
            var len = response[index].description.length;
            if (len > 40) len = 40;
            item = '<div class="card item-card col-md-3">';
            item += '<div class="card-block">';
            item += '<h4 class="card-title">'+response[index].name+'</h4>';            
            item += '</div>';
            item += '<img src="/img/'+response[index].mainImage+'" alt="'+response[index].mainImage+'">';
            item += '<div class="card-block">';
            item += '<p class="card-text">'+response[index].description.substr(0,len)+'</p>';
            //item += '<button class="btn btn-primary">Delete Item</button>'; // TODO
            item += '</div>';
            item += '</div>';
            elMyItems.innerHTML += item;
        }
        if (elMyItems.innerHTML === "") elMyItems.innerHTML = "You haven't uploaded any items";        
    }
    ajax.open('POST', '/portfolio');
    ajax.send('username=' + account.u + '&password=' + account.p);   
}

function addNewItem() {    
    var ajax = new XMLHttpRequest();
    var name = document.getElementById("itemName").value;
    var cat = document.getElementById("cat").value;
    var desc = document.getElementById("desc").value;
    var mainFile = document.getElementById("upload-main").value.split("\\").pop(); // extract only the name
    var sendString = 'username=' + account.u + '&password=' + account.p + '&name=' + name;
    if (name && cat && desc && mainFile){
        sendString += '&cat=' + cat + '&desc=' + desc + '&main=' + mainFile;
        ajax.onload = function(){
            console.log(this.responseText);
            resetForm();
            getMyItems();        
        }
        ajax.open('POST', '/addNewItem');    
        ajax.send(sendString);   
    } else alert("Not all fields filled in");
}

function resetForm() {
    document.getElementById("upload-main").value = "";   
}