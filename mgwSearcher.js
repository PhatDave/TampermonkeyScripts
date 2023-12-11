// ==UserScript==
// @name            MGW Searcher
// @author          Cyka
// @include         *search-requests/messages*
// @version         1.2
// @run-at          document-idle
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/mgwSearcher.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/mgwSearcher.js
// @grant           GM_getValue
// @grant           GM_setValue
// @noframes
// ==/UserScript==

function padLeft(str, len, char) {
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
function waitForElement(selector) {
	return new Promise((resolve) => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector));
		}

		const observer = new MutationObserver((mutations) => {
			if (document.querySelector(selector)) {
				resolve(document.querySelector(selector));
				observer.disconnect();
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	});
}

let timeInput = await waitForElement("input#rangePicker");
let tenMinButton = await waitForElement(".range-button > button:nth-child(1)");
let searchButton = await waitForElement(".pull-right > button:nth-child(1)");

// let originalMethod = searchButton.onclick;
searchButton.onclick = function (event) {
	let time = timeInput.value;
	if (time === "") {
		tenMinButton.click();
	}
	// originalMethod(event);
};
