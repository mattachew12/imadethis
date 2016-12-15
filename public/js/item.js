/* 
 * item.js
 * Function definitions for client-side code
 *
 * Authors:
 * - Tanuj Sane
 * - Nikhil Castelino
 * - Matthew Piazza
 *
 * Usage:
 * <script src="item.js"></script>
 */
 
window.onload = function() { 
    if(!window.sessionStorage.getItem('account')) window.location = 'login.html';    
    if(!window.sessionStorage.getItem('itemID')) {
        alert("No item ")
        window.location = 'main.html';    
    }
    var account = JSON.parse(window.sessionStorage.getItem('account'));  
    document.getElementById('hello-username').innerHTML = 'Hello, ' + account.u;    
    
    var itemID = window.sessionStorage.getItem('itemID');      
    getItem(account, itemID);
}    
        
function getItem(account, itemID) {    
    var ajax = new XMLHttpRequest();
    ajax.onload = function () {
        var response = JSON.parse(this.responseText);        
        elItem = document.getElementById("theItem");
        elItem.innerHTML = "";              
        if (response.description == undefined) response.description = "";
        item = '<div class="card item-card col-md-3">';
        item += '<div class="card-block">';
        item += '<h4 class="card-title">'+response.name+'</h4>';            
        item += '</div>';
        item += '<img src="/img/'+response.mainImage+'" alt="'+response.mainImage+'">';
        item += '<div class="card-block">';
        item += '<p class="card-text">'+response.description+'</p>';        
        item += '<button class="btn btn-primary" onclick="proposeTrade('+"'"+response.username+"'"+');">Propose Trade</button>';
        item += '</div>';
        item += '</div>';
        elItem.innerHTML += item;        
        if (elItem.innerHTML === "") elItem.innerHTML = "No matching items found";        
    }
    ajax.open('POST', '/getItem');
    ajax.send('username=' + account.u + '&password=' + account.p + '&itemID=' + itemID);   
}

function proposeTrade(vendorName){
    window.sessionStorage.setItem('vendorName', vendorName);
    window.location = 'trader.html';
}