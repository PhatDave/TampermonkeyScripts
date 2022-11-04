// ==UserScript==
// @name         MPAS auto login
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        http://*/mpas/web/login*
// @grant        none
// @run-at       document-end
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/AutoLogins/MpasAutoLogin.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/AutoLogins/MpasAutoLogin.js
// ==/UserScript==

let loginForm = document.querySelector(".form-horizontal > fieldset");


let loginEntry = loginForm.querySelector("div:nth-child(2) > div > input");
let passwordEntry = loginForm.querySelector("div:nth-child(3) > div > input");
let loginButton = loginForm.querySelector("div:nth-child(5) > div > button");

loginEntry.value = "root";
passwordEntry.value = "mpas";
loginButton.click();
