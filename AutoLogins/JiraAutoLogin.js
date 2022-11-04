// ==UserScript==
// @name         Confluence auto login
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://support.inovatrend.com/jira/login.jsp*
// @grant        none
// @run-at       document-end
// ==/UserScript==

let loginForm = document.querySelector("#login-form");

let loginEntry = loginForm.querySelector("#login-form-username");
let passwordEntry = loginForm.querySelector("#login-form-password");
let loginButton = loginForm.querySelector("#login-form-submit");

loginEntry.value = "david.majdandzic";
passwordEntry.value = "-[dGFT6e65[@D4XPdJs_q<3(T4LM9K";
loginButton.click();
