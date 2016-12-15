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
        elMyItems = document.getElementById("myItems");
        elVendorItems = document.getElementById("vendorItems");
        elMyItems.innerHTML = "";
        elVendorItems.innerHTML = "";
        var index = 0;
        for (index = 0; index < response.clientItems.length; index++){            
            item = '<div class="card">';
            item += '<div class="card-block">';
            item += '<h4 class="card-title">'+response.clientItems[index].name+'</h4>';
            item += '<h6 class="card-subtitle text-muted">'+response.clientItems[index].username+'</h6>';
            item += '</div>';
            item += '<img class="col-md-12" src="/img/'+response.clientItems[index].mainImage+'" alt="'+response.clientItems[index].mainImage+'">';
            item += '<div class="card-block">';
            item += '<p class="card-text">'+response.clientItems[index].description+'</p>';
            item += '<button class="btn btn-primary" onclick="tradeItem('+response.clientItems[index].itemID+');">Add to trade</button>';            
            item += '<button class="btn btn-secondary" onclick="viewItem('+response.clientItems[index].itemID+');">View item</button>';
            item += '</div>';
            item += '</div>';
            elMyItems.innerHTML += item;
        }
        for (index = 0; index < response.vendorItems.length; index++){            
            item = '<div class="card">';
            item += '<div class="card-block">';
            item += '<h4 class="card-title">'+response.vendorItems[index].name+'</h4>';
            item += '<h6 class="card-subtitle text-muted">'+response.vendorItems[index].username+'</h6>';
            item += '</div>';
            item += '<img class="col-md-12" src="/img/'+response.vendorItems[index].mainImage+'" alt="'+response.vendorItems[index].mainImage+'">';
            item += '<div class="card-block">';
            item += '<p class="card-text">'+response.vendorItems[index].description+'</p>';
            item += '<button class="btn btn-primary" onclick="tradeItem('+response.vendorItems[index].itemID+');">Add to trade</button>';            
            item += '<button class="btn btn-secondary" onclick="viewItem('+response.vendorItems[index].itemID+');">View item</button>';
            item += '</div>';
            item += '</div>';
            elVendorItems.innerHTML += item;
        }
        if (elMyItems.innerHTML === "") elMyItems.innerHTML = "No Items to Trade";
        if (elVendorItems.innerHTML === "") elVendorItems.innerHTML = "No Items to Trade";        
    }
    ajax.open('POST', '/getPossTradeItems');
    ajax.send('username=' + account.u + '&password=' + account.p + '&other=' + vendorName);   
}

function viewItem(itemID){
    window.sessionStorage.setItem('itemID', itemID);
    window.location = "/item.html";
}
