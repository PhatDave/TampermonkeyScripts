// ==UserScript==
// @name            Freakz Armory Scraper
// @version         0.2
// @author          Dave
// @match           https://felsong.gg/en/community/armory/*
// @run-at          document-end
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/freakzArmoryScraper.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/freakzArmoryScraper.js
// @grant           GM_getValue
// @grant           GM_setValue
// ==/UserScript==

const baseUrl = "https://felsong.gg/en/community/armory/6/11/";
const options = { method: "GET" };

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

function getLatestIlvlEntry(character) {
	return new Promise((resolve, reject) => {
		fetch(
			`https://indecisive-data.app.jet-black.xyz/api/collections/armory_character_snapshot/records?perPage=1&sort=-created&filter=(character.id='${character.id}')`,
			options
		)
			.then((response) => response.json())
			.then((response) => {
				resolve(response.items[0]);
			});
	});
}

fetch("https://indecisive-data.app.jet-black.xyz/api/collections/armory_character/records", options)
	.then((response) => response.json())
	.then((response) => {
		response = response.items;
		response.forEach((record) => {
			let shouldUpdate = true;
			getLatestIlvlEntry(record).then((entry) => {
				let lastUpdated = new Date(entry?.created || 0);
				let now = new Date();
				let diff = now - lastUpdated;
				let diffHours = Math.floor(diff / 1000 / 60 / 60);
				if (diffHours < 1) {
					shouldUpdate = false;
				}
				console.log(record.name + " last updated " + diffHours + " hours ago");
				console.log(`shouldUpdate = ${shouldUpdate}`);

				if (shouldUpdate) {
					if (window.location.href.endsWith(record.freakzId)) {
						waitForElement(document, "span.ilevel").then((elm) => {
							let ilvl = parseInt(elm.innerText);
							let data = {
								character: record.id,
								ilvl: ilvl,
							};
							let postOptions = {
								method: "POST",
								body: JSON.stringify(data),
								headers: { "Content-Type": "application/json" },
							};
							fetch(
								"https://indecisive-data.app.jet-black.xyz/api/collections/armory_character_item/records",
								postOptions
							);
						});
					} else {
						console.log("Do navigate to " + record.name);
						window.location.href = baseUrl + record.freakzId;
					}
				}
			});
		});
	})
	.catch((err) => console.error(err));
