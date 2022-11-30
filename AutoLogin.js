// ==UserScript==
// @name            Auto login
// @version         0.8
// @author          Cyka
// @match           *://*/*
// @run-at          document-end
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/AutoLogin.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/AutoLogin.js
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

	if (!!loginForm) {
		let loginEntry;
		let passwordEntry;
		let loginButton;

		try {
			loginEntry = loginForm.querySelector(loginInfo.loginEntry);
		} catch (DOMException) {
			console.log("Error finding login entry");
		}
		try {
			passwordEntry = loginForm.querySelector(loginInfo.passwordEntry);
		} catch (DOMException) {
			console.log("Error finding password entry");
		}
		try {
			loginButton = loginForm.querySelector(loginInfo.loginButton);
		} catch (DOMException) {
			console.log("Error finding login button");
		}

		if (!!loginEntry) {
			loginEntry.value = atob(loginInfo.login);
		}
		if (!!passwordEntry) {
			passwordEntry.value = atob(loginInfo.password);
		}
		if (!!loginButton) {
			loginButton.click();
		}
	}
}