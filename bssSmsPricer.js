// ==UserScript==
// @name            BSS Poker
// @version         0.6
// @author          Cyka
// @match           *://*/*
// @run-at          document-end
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/bssSmsPricer.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/bssSmsPricer.js
// @grant           GM_getValue
// @grant           GM_setValue
// ==/UserScript==

// let options = ['A*','a*','B*','b*','C*','c*','D*','d*','E*','e*','F*','f*','G*','g*','H*','h*','I*','i*','J*','j*','K*','k*','L*','l*','M*','m*','N*','n*','O*','o*','P*','p*','Q*','q*','R*','r*','S*','s*','T*','t*','U*','u*','V*','v*','W*','w*','X*','x*','Y*','y*','Z*','z*']
let table = document.querySelector('table.table1');
let input1 = table.querySelector('input#textfield');
let input2 = table.querySelector('input#textfield_0');
let input3 = table.querySelector('input#textfield_1');
let submit = table.querySelector('input.button');

let options = GM_getValue("options", []);
let item = options.shift();
GM_setValue("options", options);

input1.value = item;
input2.value = '0';
submit.click();
