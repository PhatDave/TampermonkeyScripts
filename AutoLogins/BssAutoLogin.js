// ==UserScript==
// @name         BSS auto login
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://*/bss/web/loginpage*
// @grant        none
// @run-at       document-end
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/AutoLogins/BssAutoLogin.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/AutoLogins/BssAutoLogin.js
// ==/UserScript==

let loginForm = document.querySelector("#username").parentElement.parentElement.parentElement;

let loginEntry = loginForm.querySelector("#username");
let passwordEntry = loginForm.querySelector("#password");
let loginButton = loginForm.querySelector("input.button");

loginEntry.value = "admin";
passwordEntry.value = "admin";
loginButton.click();
