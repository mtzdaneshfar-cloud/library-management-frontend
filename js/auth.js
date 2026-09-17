const TOKEN_KEY = 'jwt_token';
function setToken(token, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = TOKEN_KEY + "=" + (token || "") + expires + "; path=/; SameSite=Strict";
}
function getToken() {
    const name = TOKEN_KEY + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }

    return null;
}

function removeToken() {
    document.cookie = TOKEN_KEY + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict";

}

function isAuthenticated() {
    const token = getToken();
    return token !== null && token !== "";

}