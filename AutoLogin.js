// ==UserScript==
// @name            Auto login
// @version         0.12
// @author          Cyka
// @match           *://*/*
// @run-at          document-end
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/AutoLogin.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/AutoLogin.js
// @grant		    GM_getValue
// @grant		    GM_setValue
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
	MGW: {
		urlRegex: "Liova2Fhcy9sb2dpbi4q",
		loginForm: "form",
		loginEntry: "#input-username",
		passwordEntry: "#input-password",
		loginButton: "button",
		login: "bWd3M19hZG1pbg",
		password: "bWd3MzIxISM",
		triggerFunction: "KCkgPT4gdHJ1ZQ==",
	},
};

const storageKey = "loginInfo";
const info = GM_getValue(storageKey, defaultInfo);
GM_setValue(storageKey, info);
console.log(info);

for (const key of Object.keys(info)) {
	const item = info[key];
	const urlRe = parseToRegex(item.urlRegex);
	console.log(
		`Checking for match for ${key} (using ${atob(item.urlRegex)}) on ${
			window.location.href
		}`
	);
	if (matchUrl(window.location.href, urlRe)) {
		const loginInfo = item;
		console.log(`Matched ${key} on ${window.location.href}`);
		try {
			console.log(
				`Running trigger function for ${key}: ${atob(
					loginInfo.triggerFunction
				)}`
			);
			if (eval(atob(loginInfo.triggerFunction))()) {
				console.log(`Login time`);
				doLogin(item);
			}
		} catch (e) {
			alert("Syntax error in trigger function for " + key);
		}
	} else {
		console.log("No match");
	}
}

function parseToRegex(urlRe) {
	console.log(urlRe);
	urlRe = atob(urlRe);
	const regex = urlRe.replace("/", "/");
	console.log(`Parsing ${regex}`);
	return new RegExp(regex);
}

function matchUrl(url, urlRegex) {
	let regex = new RegExp(urlRegex);
	return url.match(regex);
}

function waitForElement(element, selector) {
	return new Promise((resolve) => {
		if (element.querySelector(selector)) {
			return resolve(element.querySelector(selector));
		}

		const observer = new MutationObserver((mutations) => {
			if (element.querySelector(selector)) {
				resolve(element.querySelector(selector));
				observer.disconnect();
			}
		});

		observer.observe(element, {
			childList: true,
			subtree: true,
		});
	});
}

async function doLogin(loginInfo) {
	console.log(`Looking for login form via ${loginInfo.loginForm}`);
	let loginForm = await waitForElement(document, loginInfo.loginForm);

	if (loginForm) {
		console.log(`Found login form`);
		let loginEntry;
		let passwordEntry;
		let loginButton;

		try {
			console.log(`Looking for login entry via ${loginInfo.loginEntry}`);
			loginEntry = await waitForElement(loginForm, loginInfo.loginEntry);
			console.log(`Found login entry: ${loginEntry}`);
		} catch (DOMException) {
			console.log("Error finding login entry");
		}
		try {
			console.log(
				`Looking for password entry via ${loginInfo.passwordEntry}`
			);
			passwordEntry = await waitForElement(
				loginForm,
				loginInfo.passwordEntry
			);
			console.log(`Found password entry: ${passwordEntry}`);
		} catch (DOMException) {
			console.log("Error finding password entry");
		}
		try {
			console.log(
				`Looking for login button via ${loginInfo.loginButton}`
			);
			loginButton = await waitForElement(
				loginForm,
				loginInfo.loginButton
			);
			console.log(`Found login button: ${loginButton}`);
		} catch (DOMException) {
			console.log("Error finding login button");
		}

		if (loginEntry) {
			console.log(
				`Setting login entry value to ${atob(loginInfo.login)}`
			);
			loginEntry.value = atob(loginInfo.login);
		}
		if (passwordEntry) {
			console.log(
				`Setting password entry value to ${atob(loginInfo.password)}`
			);
			passwordEntry.value = atob(loginInfo.password);
		}
		if (loginButton) {
			console.log(`Clicking login button`);
			loginButton.click();
		}
	}
}
