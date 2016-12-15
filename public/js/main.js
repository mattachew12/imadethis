/* 
 * main.js
 * Function definitions for client-side code
 *
 * Authors:
 * - Tanuj Sane
 * - Nikhil Castelino
 * - Matthew Piazza
 *
 * Usage:
 * <script src="main.js"></script>
 */

var account;
var navmenu = {
    'browse': document.getElementById('browse'),
    'inbox': document.getElementById('inbox'),
    'history': document.getElementById('history')
}

window.onload = function () {
    if(!window.sessionStorage.getItem('account')) window.location = 'login.html';
    account = JSON.parse(window.sessionStorage.getItem('account'));
    document.getElementById('hello-username').innerHTML = 'Hello, ' + account.u;
    search();
}

document.getElementById('searchbar').addEventListener('input', (event) => {
    search();
});

function navClick(id) {
    console.log(id);
    for(var key of Object.keys(navmenu)) {
        if(key === id) navmenu[key].className += ' active';
        else navmenu[key].className = 'nav-item nav-link';
    }
    var hideables = document.getElementsByClassName('hideable');
    for(var i = 0; i < hideables.length; i++) {
        if(hideables[i].className.includes(id)) hideables[i].removeAttribute('style');
        else hideables[i].setAttribute('style', 'display:none;');
    }

}

function search() {
    var searchVal = document.getElementById('searchbar').value.toLowerCase();
    var category = document.getElementById("cat").value.toLowerCase();

    var ajax = new XMLHttpRequest();
    ajax.onload = function () {
        var response = JSON.parse(this.responseText);
        elBrowseItems = document.getElementById("browseItems");
        elBrowseItems.innerHTML = "";
        var index = 0;
        for(index = 0; index < response.length; index++) {
            if(response[index].description == undefined) response[index].description = "";
            item = '<div class="card item-card col-md-3">';
            item += '<div class="card-block">';
            item += '<h4 class="card-title">' + response[index].name + '</h4>';
            item += '<h6 class="card-subtitle text-muted">' + response[index].username + '</h6>';
            item += '</div>';
            item += '<img src="/img/' + response[index].mainImage + '" alt="' + response[index].mainImage + '">';
            item += '<div class="card-block">';
            item += '<p class="card-text">' + response[index].description + '</p>';
            item += '<button class="btn btn-primary">View Item</button>';
            item += '<button class="btn btn-secondary">Message Seller</button>';
            item += '</div>';
            item += '</div>';
            elBrowseItems.innerHTML += item;
        }
        if(elBrowseItems.innerHTML === "") elBrowseItems.innerHTML = "No Items Found";
    }
    ajax.open('POST', '/randItemsFromCat');
    ajax.send('username=' + account.u + '&password=' + account.p + '&category=' + category + '&search=' + searchVal);
}