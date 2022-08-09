// ==UserScript==
// @name           Subreddit blocker
// @author         Cyka
// @include        *reddit.com/*
// @version        1.3
// @run-at document-start
// @updateURL   https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/SubredditBlocker.js
// @downloadURL https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/SubredditBlocker.js
// @grant          GM_getValue
// @grant          GM_setValue
// @noframes
// ==/UserScript==

let persistenceKey = "blockedReddits"
// GM_setValue(persistenceKey, JSON.stringify("[]"))
let blocked = JSON.parse(await GM_getValue(persistenceKey, JSON.stringify("[]")));
if (blocked.constructor === "".constructor) {
	blocked = JSON.parse(blocked);
}
blocked = blocked.sort();
console.log(blocked);
let timer = -1;

function processAllElements() {
	processElements(document.querySelectorAll('a[data-click-id="body"]'));
}

function processUnprocessedElements() {
	// console.log(timer);
	// To avoid doing 500 calls per second
	if (timer === -1) {
		timer = setTimeout(processElements, 350, document.querySelectorAll('a[data-click-id="body"]:not([data-processed])'));
	}
}

function processElements(elements) {
	// console.log(`Processing ${elements.length} elements`);
	elements.forEach((subredditElement) => {
		subredditElement.setAttribute("data-processed", "true");
		processElement(subredditElement);
	});
	timer = -1;
}

function getSubredditFromLink(url) {
	return url.replace("https://www.reddit.com/r/", "").split("/")[0].toLowerCase();
}

function processElement(element) {
	let subreddit = getSubredditFromLink(element.href);
	// console.log(subreddit);
	if (blocked.includes(subreddit)) {
		// console.log(blocked);
		element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
		// console.log("[Subreddit Blocker] Hiding r/", subreddit);
	} else {
		element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'block';
		if (!element.parentElement.querySelector('button.deleteButton')) {
			let button = createButton();
			button.onclick = blockSubreddit;
			element.parentElement.prepend(button);
		}
	}
}

function blockSubreddit(event, target) {
	let a = event.target.parentElement.querySelector('a');
	let subreddit = getSubredditFromLink(a.href);
	blocked.push(subreddit);
	GM_setValue(persistenceKey, JSON.stringify(blocked));
	let listItem = createBlockedSubredditListItem(subreddit);
	document.querySelector('div.subredditList').append(listItem);
	processAllElements();
}

function createButton() {
	return htmlToElement(`<button class="deleteButton">D E L E T E</button>`)
}

function htmlToElement(html) {
	let template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

processAllElements();

let runCount = 0;

function addSidebarIfNotExist() {
	if (!document.querySelector('div.subredditList')) {
		let sidebar = document.querySelector('div[data-testid="frontpage-sidebar"] > div:last-child > div:last-child');
		let listContainer = htmlToElement(`<div>
	Blocked subreddits
	<div class="subredditList overflow-scroll" style="10vh">
	</div>
</div>`);
		let subredditList = listContainer.querySelector('div.subredditList');
		blocked.forEach((item) => {
			let itemElement = createBlockedSubredditListItem(item);
			subredditList.append(itemElement);
		});
		sidebar.prepend(listContainer);
	}
	runCount++;
	if (runCount < 20) {
		setTimeout(addSidebarIfNotExist, 500);
	}
}

addSidebarIfNotExist();

function unblockSubreddit(event) {
	let div = event.target;
	blocked.pop(div.innerText);
	GM_setValue(persistenceKey, JSON.stringify(blocked));
	div.remove();
	processAllElements();
}

function createBlockedSubredditListItem(subreddit) {
	let element = htmlToElement(`<div>${subreddit}</div>`);
	element.onclick = unblockSubreddit;
	return element;
}

// Block future elements that are not yet rendered
new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		for (const newElement of mutation.addedNodes) {
			processUnprocessedElements();
		}
	});
}).observe(document.documentElement, {
	childList: true,
	subtree: true
});
