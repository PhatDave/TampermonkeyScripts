// ==UserScript==
// @name            Auto login
// @version         0.9
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
		password: "admin",
		triggerFunction: "() => true"
	}
}

let info = GM_getValue("loginInfo", defaultInfo);
GM_setValue("loginInfo", info);

class Logger {
	constructor(clazz) {
		this.clazz = clazz;
	}

	leftPad(str, len, char) {
		str = String(str);
		let i = -1;
		len = len - str.length;
		if (char === undefined) {
			char = " ";
		}
		while (++i < len) {
			str = char + str;
		}
		return str;
	}

	log(...args) {
		let logLevel = args.at(0);
		let data = args.at(1);
		let date = new Date();

		let year = this.leftPad(date.getFullYear(), 4);
		let month = this.leftPad(date.getMonth(), 2, 0);
		let day = this.leftPad(date.getDay(), 2, 0);

		let hours = this.leftPad(date.getHours(), 2, 0);
		let minutes = this.leftPad(date.getMinutes(), 2, 0);
		let seconds = this.leftPad(date.getSeconds(), 2, 0);
		let milliseconds = this.leftPad(date.getMilliseconds(), 3, 0);

		let datePrefix = `[${day}/${month}/${year}-${hours}:${minutes}:${seconds}:${milliseconds}]`

		// let out = `${datePrefix} [${this.clazz}] (${logLevel}) ${data}`;
		let out = datePrefix.padEnd(30, ' ') + `[${this.clazz}]`.padEnd(28, ' ') + `(${logLevel})`.padEnd(8, ' ') + data;
		console.log(out);
	}

	log1 = this.log.bind(this, 1);
	log2 = this.log.bind(this, 2);
	log3 = this.log.bind(this, 3);
	log4 = this.log.bind(this, 4);
	log5 = this.log.bind(this, 5);
	log6 = this.log.bind(this, 6);
}

let logger = new Logger("TamperMonkey-AutoLogin");

Object.keys(info).forEach((key) => {
	let urlRe = parseToRegex(info[key].urlRegex);
	logger.log1(`Checking for match for ${key} on ${window.location.href}`);
	if (matchUrl(window.location.href, urlRe)) {
		let loginInfo = info[key];
		logger.log1(`Matched ${key} on ${window.location.href}`);
		try {
			logger.log1(`Running trigger function for ${key}: ${atob(loginInfo.triggerFunction)}`);
			if (eval(atob(loginInfo.triggerFunction))()) {
				logger.log1(`Login time`);
				doLogin(info[key]);
			}
		}
		catch (SyntaxError) {
			alert("Syntax error in trigger function for " + key);
		}
	}
});

function parseToRegex(urlRe) {
	urlRe = atob(urlRe);
	let regex = urlRe.replace("/", "\/");
	logger.log1(`Parsing ${regex}`);
	return new RegExp(regex);
}

function matchUrl(url, urlRegex) {
	let regex = new RegExp(urlRegex);
	return url.match(regex);
}

function doLogin(loginInfo) {
	logger.log1(`Looking for login form via ${loginInfo.loginForm}`);
	let loginForm = document.querySelector(loginInfo.loginForm);

	if (!!loginForm) {
		logger.log1(`Found login form`);
		let loginEntry;
		let passwordEntry;
		let loginButton;

		try {
			logger.log1(`Looking for login entry via ${loginInfo.loginEntry}`);
			loginEntry = loginForm.querySelector(loginInfo.loginEntry);
			logger.log1(`Found login entry: ${loginEntry}`);
		} catch (DOMException) {
			logger.log1("Error finding login entry");
		}
		try {
			logger.log1(`Looking for password entry via ${loginInfo.passwordEntry}`);
			passwordEntry = loginForm.querySelector(loginInfo.passwordEntry);
			logger.log1(`Found password entry: ${passwordEntry}`);
		} catch (DOMException) {
			logger.log1("Error finding password entry");
		}
		try {
			logger.log1(`Looking for login button via ${loginInfo.loginButton}`);
			loginButton = loginForm.querySelector(loginInfo.loginButton);
			logger.log1(`Found login button: ${loginButton}`);
		} catch (DOMException) {
			logger.log1("Error finding login button");
		}

		if (!!loginEntry) {
			logger.log1(`Setting login entry value to ${atob(loginInfo.login)}`);
			loginEntry.value = atob(loginInfo.login);
		}
		if (!!passwordEntry) {
			logger.log1(`Setting password entry value to ${atob(loginInfo.password)}`);
			passwordEntry.value = atob(loginInfo.password);
		}
		if (!!loginButton) {
			logger.log1(`Clicking login button`);
			loginButton.click();
		}
	}
}
