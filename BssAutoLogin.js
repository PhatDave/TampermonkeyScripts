// ==UserScript==
// @name         BSS auto login
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://localhost:8080/bss/web/loginpage.*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.on('dom:loaded', function() {
        let loginForm = document.querySelector("#username").parentElement.parentElement;

        loginForm.querySelector("#username").value = "admin";
        loginForm.querySelector("#password").value = "admin";
        loginForm.querySelector("input.button").click();
    });
})();
