// ==UserScript==
// @name            Steam App To RSS
// @author          Cyka
// @match           *store.steampowered.com/app/*/*$
// @version         1.14
// @run-at          document-end
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/SteamAppToRSS.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/SteamAppToRSS.js
// @noframes
// ==/UserScript==

function waitForElm(selector) {
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

function createElementFromHTML(htmlString) {
	let div = document.createElement("div");
	div.innerHTML = htmlString.trim();
	return div.firstChild;
}

const rssFeedUrlTemplate =
	"https://store.steampowered.com/feeds/news/app/{appId}/";

let appId = /https:\/\/store\.steampowered\.com\/app\/(\d+)/.exec(
	window.location.href
)[1];
let rssFeedUrl = rssFeedUrlTemplate.replace("{appId}", appId);

waitForElm(".apphub_HeaderStandardTop").then((elm) => {
	let node = createElementFromHTML(`<div class="apphub_OtherSiteInfo">
	<a class="btnv6_blue_hoverfade btn_medium" href="${rssFeedUrl}">
		<span>RSS</span>
	</a>
</div>`);
	elm.prepend(node);
});
