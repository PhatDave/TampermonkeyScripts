// ==UserScript==
// @name            Auto login
// @version         0.5
// @author          Cyka
// @match           *://*/*
// @run-at          document-end
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/AutoLogins/AutoLogin.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/AutoLogins/AutoLogin.js
// @grant           GM_getValue
// @grant           GM_setValue
// ==/UserScript==

// Use a location regex to match an URL to a logger
// Allow use to create loggers
// Have them in form of...
// {
//    name: "BSS",
//    urlRegex: "http://*/bss/web/loginpage*",
//    loginEntry: "#username",
//    passwordEntry: "#password",
//    loginButton: "input.button",
//    login: "admin",
//    password: "admin"
// }
// Somehow allow parentElement...

const defaultInfo = {
	BSS: {
		urlRegex: "http://.*/bss/web/loginpage.*",
		loginForm: "#form",
		loginEntry: "#username",
		passwordEntry: "#password",
		loginButton: "input.button",
		login: "admin",
		password: "admin"
	}
}

let info = GM_getValue("loginInfo", defaultInfo);
GM_setValue("loginInfo", info);

Object.keys(info).forEach((key) => {
	let urlRe = parseToRegex(info[key].urlRegex);
	if (matchUrl(window.location.href, urlRe)) {
		doLogin(info[key]);
	}
});

function parseToRegex(urlRe) {
	let regex = urlRe.replace("/", "\/");
	return new RegExp(regex);
}

function matchUrl(url, urlRegex) {
	let regex = new RegExp(urlRegex);
	return url.match(regex);
}

function doLogin(loginInfo) {
	let loginForm = document.querySelector(loginInfo.loginForm);

	let loginEntry = loginForm.querySelector(loginInfo.loginEntry);
	let passwordEntry = loginForm.querySelector(loginInfo.passwordEntry);
	let loginButton = loginForm.querySelector(loginInfo.loginButton);

	loginEntry.value = loginInfo.login;
	passwordEntry.value = loginInfo.password;
	loginButton.click();
}
