// ==UserScript==
// @name            Steam Workshop To Json
// @author          Cyka
// @match           *steamcommunity.com/id/top_kek_id/myworkshopfiles*
// @version         1.1
// @run-at          document-end
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/SteamWorkshopToJson.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/SteamWorkshopToJson.js
// @noframes
// ==/UserScript==

function waitForElm(element, selector) {
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

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	});
}

function createElementFromHTML(htmlString) {
	let div = document.createElement("div");
	div.innerHTML = htmlString.trim();
	return div.firstChild;
}

setTimeout(() => {
	let allElements = JSON.parse(localStorage.getItem("cyka-steam-workshop-allElements")) || [];
	let promises = [];

	document.querySelectorAll(".workshopItemSubscription").forEach((element) => {
		if (element.id.includes("Subscription")) {
			let promise = waitForElm(element, ".workshopItemSubscriptionDetails > a");
			promises.push(promise);
			promise.then((elm) => {
				let itemLink = element.querySelector(".workshopItemSubscriptionDetails > a").attributes.href.value;
				allElements.push(itemLink);
			});
		}
	});

	Promise.all(promises).then(() => {
		console.log(allElements);
		localStorage.setItem("cyka-steam-workshop-allElements", JSON.stringify(allElements));
		document.querySelectorAll(".pagebtn")[1].click();
	});
}, 250);
