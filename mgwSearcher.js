// ==UserScript==
// @name            MGW Searcher
// @author          Cyka
// @include         *search-requests/messages*
// @version         1.0
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
	return new Promise(resolve => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector));
		}

		const observer = new MutationObserver(mutations => {
			if (document.querySelector(selector)) {
				resolve(document.querySelector(selector));
				observer.disconnect();
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	});
}

waitForElement("input#rangePicker").then(() => {
	let rangePicker = document.querySelector("input#rangePicker");
	let date = new Date().getTime();

	let dateFrom = new Date(date - (1000 * 60 * 5));
	let dateTo = new Date(date + (1000 * 60 * 5));

	let fromDay = padLeft(dateFrom.getDate(), 2, 0);
	let fromMonth = padLeft(dateFrom.getMonth() + 1, 2, 0);
	let fromYear = dateFrom.getFullYear();
	let fromHour = padLeft(dateFrom.getHours(), 2, 0);
	let fromMinute = padLeft(dateFrom.getMinutes(), 2, 0);
	let fromSecond = padLeft(dateFrom.getSeconds(), 2, 0);

	let toDay = padLeft(dateTo.getDate(), 2, 0);
	let toMonth = padLeft(dateTo.getMonth() + 1, 2, 0);
	let toYear = dateTo.getFullYear();
	let toHour = padLeft(dateTo.getHours(), 2, 0);
	let toMinute = padLeft(dateTo.getMinutes(), 2, 0);
	let toSecond = padLeft(dateTo.getSeconds(), 2, 0);

	let newValue = `${fromDay}-${fromMonth}-${fromYear} ${fromHour}:${fromMinute}:${fromSecond} - ${toDay}-${toMonth}-${toYear} ${toHour}:${toMinute}:${toSecond}`
	rangePicker.value = newValue;
	rangePicker.dispatchEvent(new Event("change"));
	rangePicker.dispatchEvent(new Event("changed"));
	rangePicker.dispatchEvent(new Event("update"));
	rangePicker.dispatchEvent(new Event("updated"));
	// Does not get picked up into request :(
});
