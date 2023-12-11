// ==UserScript==
// @name            SteamWorkshop Downloader
// @include         *steamcommunity.com/sharedfiles/filedetails/?id=*
// @match           *steamcommunity.com/id/*/myworkshopfiles*
// @run-at          document-end
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/WorkshopDownloader.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/WorkshopDownloader.js
// @version         0.3
// ==/UserScript==

const userNameStorageKey = "cyka-steam-workshop-userName";
const userIDStorageKey = "cyka-steam-workshop-userID";
const queueAllStorageKey = "cyka-steam-workshop-queueAll";
const pocketbaseUrl = `https://pocketbase-workshop-downloader.site.quack-lab.dev/api/collections`;

const isQueueAll = localStorage.getItem(queueAllStorageKey) === "true";

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

function getOrCreateUser() {
	return new Promise((resolve) => {
		fetch(
			`${pocketbaseUrl}/user/records?filter=(name='${localStorage.getItem(
				userNameStorageKey
			)}')`
		)
			.then((res) => res.json())
			.then((json) => {
				if (json.totalItems === 0) {
					fetch(`${pocketbaseUrl}/user/records`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							name: localStorage.getItem(userNameStorageKey),
						}),
					})
						.then((res) => res.json())
						.then((json) => {
							localStorage.setItem(userIDStorageKey, json.id);
							resolve();
						});
				} else {
					localStorage.setItem(userIDStorageKey, json.items[0].id);
					resolve();
				}
			});
	});
}

function getUserInfo() {
	waitForElm(document, "#HeaderUserInfoName").then((elm) => {
		let userName = elm.innerText;
		localStorage.setItem(userNameStorageKey, userName.trim());
		getOrCreateUser();
	});
}

function postWorkshopItem(url) {
	const itemId = url.split("=")[1].trim();
	const appId = Number(/appid=(\d+)/.exec(window.location.href)[1].trim());

	const data = {
		user: localStorage.getItem(userIDStorageKey),
		url,
		deleted: false,
		itemId,
		appId,
	};

	return fetch(`${pocketbaseUrl}/workshop_link/records`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}).then((res) => res.json());
}

function enqueueAll() {
	let promises = [];
	let elements = document.querySelectorAll(".subscribeCtn");
	elements.forEach((elm) => {
		let url = elm.parentElement.parentElement.children[1].children[0].href;
		console.log(`Pushing ${url} to queue`);
		promises.push(postWorkshopItem(url));
	});
	return promises;
}

function goNextPage() {
	const nextButton = getNextPageButton();
	nextButton.click();
}

function isOnLastPage() {
	return getNextPageButton().classList.contains("disabled");
}

function getNextPageButton() {
	return document.querySelectorAll(".pagebtn")[1];
}

getUserInfo();

if (isQueueAll) {
	if (isOnLastPage()) {
		localStorage.setItem(queueAllStorageKey, "false");
	}
	const promises = enqueueAll();
	Promise.all(promises).then(() => {
		if (!isOnLastPage()) {
			goNextPage();
		}
	});
} else {
	if (window.location.href.includes("myworkshopfiles")) {
		waitForElm(document, ".subscribeCtn").then((elm) => {
			let elements = document.querySelectorAll(".subscribeCtn");
			elements.forEach((elm) => {
				elm.style =
					"display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 20vw";
				const node =
					createElementFromHTML(`<span class="general_btn subscribe panelSwitch toggled"
                                                          style="text-align: center">ENQUEUE</span>`);
				elm.prepend(node);
				node.addEventListener("click", () => {
					let url =
						elm.parentElement.parentElement.children[1].children[0]
							.href;
					postWorkshopItem(url);
				});
			});
		});

		waitForElm(document, ".workshopBrowsePagingWithBG").then((elm) => {
			elm.style =
				"display: flex; flex-direction: row; justify-content: space-between; align-items: center;";
			const node =
				createElementFromHTML(`<span class="general_btn subscribe panelSwitch toggled"
                                                      style="width: 15vw; text-align: center">ENQUEUE ALL</span>`);
			elm.prepend(node);
			node.addEventListener("click", () => {
				// let pagingControl = document.querySelector(".workshopBrowsePaging");
				// pagingControl.querySelectorAll("a").forEach(elm => {
				// 	if (elm.href.includes("30")) {
				// 		elm.click();
				// 	}
				// });
				localStorage.setItem(queueAllStorageKey, "true");
				Promise.all(enqueueAll()).then(() => {
					if (!isOnLastPage()) {
						goNextPage();
					}
				});
			});
		});
	}
}
