// ==UserScript==
// @name            BSS Poker
// @version         0.7
// @author          Cyka
// @match           *://*/*
// @run-at          document-end
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/bssSmsPricer.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/bssSmsPricer.js
// @grant           GM_getValue
// @grant           GM_setValue
// ==/UserScript==

// {"options":{"a*":0,"b*":0,"c*":0,"d*":0,"e*":0,"f*":0,"g*":0,"h*":0,"i*":0,"j*":0,"k*":0,"l*":0,"m*":0,"n*":0,"o*":0,"p*":0,"q*":0,"r*":0,"s*":0,"t*":0,"u*":0,"v*":0,"w*":0,"x*":0,"y*":0,"z*":0,"A*":0,"B*":0,"C*":0,"D*":0,"E*":0,"F*":0,"G*":0,"H*":0,"I*":0,"J*":0,"K*":0,"L*":0,"M*":0,"N*":0,"O*":0,"P*":0,"Q*":0,"R*":0,"S*":0,"T*":0,"U*":0,"V*":0,"W*":0,"X*":0,"Y*":0,"Z*":0,"61*":0.25,"611*":0.09,"612*":0.13,"613*":0.20,"614*":0.26,"615*":0.33,"616*":0.39,"617*":0.66,"618*":0,"619*":0,"62*":0.25,"621*":0.09,"622*":0.13,"623*":0.20,"624*":0.26,"625*":0.33,"626*":0.39,"627*":0.66,"628*":0,"629*":0,"63*":0.25,"631*":0.09,"632*":0.13,"633*":0.20,"634*":0.26,"635*":0.33,"636*":0.39,"637*":0.66,"638*":0,"639*":0,"64*":0.25,"641*":0.09,"642*":0.13,"643*":0.20,"644*":0.26,"645*":0.33,"646*":0.39,"647*":0.66,"648*":0,"649*":0,"65*":0.25,"651*":0.09,"652*":0.13,"653*":0.20,"654*":0.26,"655*":0.33,"656*":0.39,"657*":0.66,"658*":0,"659*":0,"66*":0.25,"661*":0.25,"662*":0.25,"663*":0.25,"664*":0.25,"665*":0.25,"666*":0.25,"667*":0.25,"668*":0.25,"669*":0.25,"67*":0.25,"671*":0.09,"672*":0.13,"673*":0.20,"674*":0.26,"675*":0.33,"676*":0.39,"677*":0.66,"678*":0,"679*":0,"68*":0.25,"681*":0.09,"682*":0.13,"683*":0.20,"684*":0.26,"685*":0.33,"686*":0.39,"687*":0.66,"688*":0,"689*":0,"69*":0.25,"691*":0.09,"692*":0.13,"693*":0.20,"694*":0.26,"695*":0.33,"696*":0.39,"697*":0.66,"698*":0,"699*":0,"1*":0.09,"2*":0.13,"8*":0}}
let table = document.querySelector('table.table1');
let input1 = table.querySelector('input#textfield');
let input2 = table.querySelector('input#textfield_0');
let input3 = table.querySelector('input#textfield_1');
let submit = table.querySelector('input.button');

let options = GM_getValue("options", {});
let key = Object.keys(options).shift();
let value = options[key];
delete options[key];
GM_setValue("options", options);

if (key !== undefined && value !== undefined) {
	input1.value = key;
	input2.value = value;
	submit.click();
}
