/* 
 * navbar.js
 * Function definitions for tab navigation and sign out
 *
 * Authors:
 * - Tanuj Sane
 * - Nikhil Castelino
 * - Matthew Piazza
 *
 * Usage:
 * <script src="navbar.js"></script>
 */

function performLogout() {            
    document.cookie = 'user=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';
    document.cookie = 'password=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';
    window.sessionStorage.removeItem('account');
    window.localStorage.removeItem('account');
    window.location = 'login.html';
} 

function navClick(action) {            
    console.log(action);
} 