// ==UserScript==
// @name         BSS auto login
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://localhost:8080/bss/web/loginpage*
// @grant        none
// @run-at       document-end
// ==/UserScript==

let loginForm = document.querySelector("#username").parentElement.parentElement.parentElement;

let loginEntry = loginForm.querySelector("#username");
let passwordEntry = loginForm.querySelector("#password");
let loginButton = loginForm.querySelector("input.button");

loginEntry.value = "admin";
passwordEntry.value = "admin";
loginButton.click();
