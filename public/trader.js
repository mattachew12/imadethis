/* 
 * client.js
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
 
 function populateTrades() {
    var username = document.getElementById('username');
    var password = document.getElementById('password');
    var rememberme = document.getElementById('rememberme');

    var ajax = new XMLHttpRequest();
    ajax.onload = function () {
        switch(this.responseText) {
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
    ajax.open('POST', '/login');
    ajax.send('username=' + username.value + '&password=' + password.value);
    console.log('username=' + username.value + '&password=' + password.value);
}

populateUserItems()
populateOtherItems()