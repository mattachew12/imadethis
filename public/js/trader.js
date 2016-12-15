/* 
 * trader.js
 * Function definitions for client-side code
 *
 * Authors:
 * - Tanuj Sane
 * - Nikhil Castelino
 * - Matthew Piazza
 *
 * Usage:
 * <script src="trader.js"></script>
 */
 
window.onload = function () {
    if(!window.sessionStorage.getItem('account')) window.location = 'login.html';   
    populatePossTradeItems();
}

function populatePossTradeItems() {
    var account = JSON.parse(window.sessionStorage.getItem('account'));
    var vendorName = window.sessionStorage.getItem('vendorName');
    document.getElementById("vendorHeader").innerText = vendorName + "'s Portfolio";
    
    var ajax = new XMLHttpRequest();
    ajax.onload = function () {
        var response = JSON.parse(this.responseText);
        console.log(response[0]);
        console.log(response[1]);
        elMyItems = document.getElementById("myItems");
        elVendorItems = document.getElementById("vendorItems");
        elMyItems.innerHTML = "";
        elVendorItems.innerHTML = "";
        var index = 0;
        for (index = 0; index < response.clientItems.length; index++){
            console.log(response.clientItems[index]);
            item = '<div class="card">';
            item += '<div class="card-block">'
            item += '<h4 class="card-title">Card title</h4>'
            item += '<h6 class="card-subtitle text-muted">Support card subtitle</h6>'
            item += '</div>'
            item += '<img src="..." alt="Card image">'
            item += '<div class="card-block">'
            item += '<p class="card-text">Some quick example text to build on the card title</p>'
            item += '</div>'
            item += '</div>'
            elMyItems.innerHTML += item;
        }
        for (index = 0; index < response.vendorItems.length; index++){
            console.log(response.vendorItems[index]);
            item = '<div class="card">';
            item += '<div class="card-block">'
            item += '<h4 class="card-title">Card title</h4>'
            item += '<h6 class="card-subtitle text-muted">Support card subtitle</h6>'
            item += '</div>'
            item += '<img src="..." alt="Card image">'
            item += '<div class="card-block">'
            item += '<p class="card-text">Some quick example text to build on the card title</p>'
            item += '</div>'
            item += '</div>'
            elVendorItems.innerHTML += item;
        }
        if (elMyItems.innerHTML === "") elMyItems.innerHTML = "No Items to Trade";
        if (elVendorItems.innerHTML === "") elVendorItems.innerHTML = "No Items to Trade";        
    }
    ajax.open('POST', '/getPossTradeItems');
    ajax.send('username=' + account.u + '&password=' + account.p + '&other=' + vendorName);   
}