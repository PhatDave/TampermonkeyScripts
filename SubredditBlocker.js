// ==UserScript==
// @name            Subreddit blocker
// @author          Cyka
// @include         *reddit.com/*
// @version         1.12
// @run-at          document-start
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/SubredditBlocker.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/SubredditBlocker.js
// @grant           GM_getValue
// @grant           GM_setValue
// @noframes
// ==/UserScript==
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

		let datePrefix = `[${day}/${month}/${year}-${hours}:${minutes}:${seconds}:${milliseconds}]`;

		// let out = `${datePrefix} [${this.clazz}] (${logLevel}) ${data}`;
		let out =
			datePrefix.padEnd(30, " ") +
			`[${this.clazz}]`.padEnd(28, " ") +
			`(${logLevel})`.padEnd(8, " ") +
			data;
		console.log(out);
	}

	log1 = this.log.bind(this, 1);
	log2 = this.log.bind(this, 2);
	log3 = this.log.bind(this, 3);
	log4 = this.log.bind(this, 4);
	log5 = this.log.bind(this, 5);
	log6 = this.log.bind(this, 6);
}

let logger = new Logger("TamperMonkey-SubredditBlocker");

let persistenceKey = "blockedReddits";
// GM_setValue(persistenceKey, JSON.stringify("[]"))
let blocked = JSON.parse(
	await GM_getValue(persistenceKey, JSON.stringify("[]"))
);
if (blocked.constructor === "".constructor) {
	blocked = JSON.parse(blocked);
}
blocked = blocked.sort();
console.log(blocked);

function sleep(ms) {
	return new Promise((resolve) =>
		setTimeout(() => resolve({ time: ms }), ms)
	);
}

class ElementProcessor {
	constructor(blockedSubreddits) {
		this.elementQueue = {};
		this.blockedSubreddits = blockedSubreddits;
		this.processing = false;
	}

	async run() {
		setInterval(this.processQueue.bind(this), 1000);
		this.processQueue();
	}

	processQueue() {
		logger.log1(`Processing queue call`);
		if (!this.processing) {
			logger.log1(`Processing queue`);
			this.processing = true;
			while (Object.keys(this.elementQueue).length > 0) {
				logger.log1(
					`${Object.keys(this.elementQueue).length} elements in queue`
				);
				let key = Object.keys(this.elementQueue).shift();
				let element = this.elementQueue[key];
				this.processElement(element);
				delete this.elementQueue[key];
			}
			this.processing = false;
		} else {
			logger.log1(`Queue already being processed!`);
		}
	}

	processElement(element) {
		logger.log1(`Processing element ${element}`);
		element.setAttribute("data-processed", "true");
		let subreddit = this.getSubredditFromLink(element.href);
		if (subreddit in this.blockedSubreddits) {
			logger.log1(`Blocking subreddit ${subreddit}`);
			element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display =
				"none";
		} else {
			logger.log1(`Setting display to block`);
			element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display =
				"block";
			if (!!!element.attributes["has-delete-button"]) {
				element.setAttribute("has-delete-button", "true");
				logger.log1(`Adding delete button to subreddit ${subreddit}`);
				let button = createButton();
				button.onclick = blockSubreddit;
				element.parentElement.prepend(button);
			}
		}
	}

	getSubredditFromLink(url) {
		logger.log1(`Getting subreddit from link ${url}`);
		let subreddit = url
			.replace("https://www.reddit.com/r/", "")
			.split("/")[0]
			.toLowerCase();
		logger.log1(`Subreddit is ${subreddit}`);
		return subreddit;
	}

	pushAllToQueue(elements) {
		logger.log1(`Pushing ${elements.length} elements to queue`);
		elements.forEach((element) => {
			this.pushToQueue(element);
		});
	}

	pushToQueue(element) {
		let subreddit = this.getSubredditFromLink(element.href);
		if (!this.elementQueue[subreddit]) {
			logger.log1(`Pushing element ${element} to queue`);
			this.elementQueue[subreddit] = element;
			element.setAttribute("processing-queued", "true");
		}
	}
}

let elementProcessor = new ElementProcessor(blocked);

function processUnprocessedElements() {
	let elements = document.querySelectorAll(
		'a[data-click-id="body"]:not([processing-queued]):not([data-processed])'
	);
	elementProcessor.pushAllToQueue(elements);
}

setInterval(processUnprocessedElements, 5000);

function processAllElements() {
	logger.log1(`Processing all elements`);
	let elements = document.querySelectorAll('a[data-click-id="body"]');
	elementProcessor.pushAllToQueue(elements);
}

function blockSubreddit(event, target) {
	let a = event.target.parentElement.querySelector("a");
	let subreddit = getSubredditFromLink(a.href);
	blocked.push(subreddit);
	GM_setValue(persistenceKey, JSON.stringify(blocked));
	let listItem = createBlockedSubredditListItem(subreddit);
	document.querySelector("div.subredditList").append(listItem);
	processAllElements();
}

function createButton() {
	return htmlToElement(`<button class="deleteButton">D E L E T E</button>`);
}

function htmlToElement(html) {
	let template = document.createElement("template");
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

let runCount = 0;

function addSidebarIfNotExist() {
	if (!document.querySelector("div.subredditList")) {
		let sidebar = document.querySelector(
			'div[data-testid="frontpage-sidebar"] > div:last-child > div:last-child'
		);
		let listContainer = htmlToElement(`<div>
	Blocked subreddits
	<div class="subredditList overflow-scroll" style="10vh">
	</div>
</div>`);
		let subredditList = listContainer.querySelector("div.subredditList");
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
	mutations = mutations.filter((mutation) => mutation.addedNodes.length > 0);
	if (mutations.length > 0) {
		processUnprocessedElements();
	}
}).observe(document.documentElement, {
	childList: true,
	subtree: true,
});

processAllElements();
elementProcessor.run();
