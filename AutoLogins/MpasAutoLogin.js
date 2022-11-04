// ==UserScript==
// @name         MPAS auto login
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://localhost:8080/mpas/web/login*
// @grant        none
// @run-at       document-end
// ==/UserScript==

let loginForm = document.querySelector(".form-horizontal > fieldset");


let loginEntry = loginForm.querySelector("div:nth-child(2) > div > input");
let passwordEntry = loginForm.querySelector("div:nth-child(3) > div > input");
let loginButton = loginForm.querySelector("div:nth-child(5) > div > button");

loginEntry.value = "root";
passwordEntry.value = "mpas";
loginButton.click();
