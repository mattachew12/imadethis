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
}

function populatePossTradeItems() {
    var account = window.sessionStorage.getItem('account');
    var vendorName = window.sessionStorage.getItem('vendorName');
    document.getElementById("vendorHeader").innerText = vendorName + "'s Portfolio";
    
    var ajax = new XMLHttpRequest();
    ajax.onload = function () {
        var response = JSON.parse(this.responseText);
        
        case 'username-invalid':
            username.parentElement.setAttribute('class', 'form-group has-danger');
            break;
        case 'password-invalid':
            password.parentElement.setAttribute('class', 'form-group has-danger');
            break;
        case 'success':
            window.sessionStorage.setItem('account', JSON.stringify({
                u: username.value,
                p: password.value
            }));
            if(rememberme.checked === 'true') {
                window.localStorage.setItem('account', JSON.stringify({
                    u: username.value,
                    p: password.value
                }));
            }
        }
    }
    ajax.open('POST', '/getPossTradeItems');
    ajax.send('username=' + account.u + '&password=' + account.p + '&other=' + vendorName);
    console.log('username=' + username.value + '&password=' + password.value);    
}

populatePossTradeItems()