// ==UserScript==
// @name            Repeat youtube video blocker
// @author          Cyka
// @match           https://www.youtube.com/
// @version         1.19
// @run-at          document-idle
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/YoutubeVideoBlocker.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/YoutubeVideoBlocker.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
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
			datePrefix.padEnd(30, " ") + `[${this.clazz}]`.padEnd(28, " ") + `(${logLevel})`.padEnd(8, " ") + data;
		console.log(out);
	}

	log1 = this.log.bind(this, 1);
	log2 = this.log.bind(this, 2);
	log3 = this.log.bind(this, 3);
	log4 = this.log.bind(this, 4);
	log5 = this.log.bind(this, 5);
	log6 = this.log.bind(this, 6);
}

let logger = new Logger("TamperMonkey-YoutubeVideoBlocker");

GM_config.init({
	id: "configyes",
	title: GM_info.script.name + " Settings",
	fields: {
		BLOCK_THRESHOLD: {
			label: "Block threshold",
			type: "number",
			min: 0,
			max: 100,
			default: 5,
			title: "How many times must a video appear for it to be blocked",
		},
	},
});
GM_registerMenuCommand("Settings", () => {
	GM_config.open();
});

let persistenceKey = "seenVideos";
let videos = JSON.parse(await GM_getValue(persistenceKey, JSON.stringify("{}")));
if (videos.constructor === "".constructor) {
	videos = JSON.parse(videos);
}
let timer = -1;

function processUnprocessedElements() {
	// Not great, not terrible...
	if (timer !== -1) {
		clearTimeout(timer);
		timer = -1;
	}
	if (timer === -1) {
		logger.log1(`Starting timer for processing elements`);
		timer = setTimeout(processElements, 200, document.querySelectorAll("a.ytd-thumbnail:not([data-processed])"));
	}
}

function processAllElements() {
	logger.log1(`Processing all elements`);
	processElements(document.querySelectorAll("a.ytd-thumbnail"));
}

function processElements(elements) {
	logger.log1(`Found ${elements.length} elements to process`);
	for (const element of elements) {
		const video = element;
		logger.log1(`Processing element ${video}`);
		video.setAttribute("data-processed", "true");
		const videoTitleElement = video.parentElement.parentElement.parentElement.querySelector("#video-title");
		if (videoTitleElement === null || videoTitleElement === undefined) {
			logger.log1(`Could not find video title element for video ${video}`);
			return null;
		}
		const videoTitle = videoTitleElement.innerText.trim();
		logger.log1(`Video title: ${videoTitle}`);
		if (Object.keys(videos).indexOf(videoTitle) == -1) {
			logger.log1(`Video title not in seen videos, adding it`);
			videos[videoTitle] = 0;
		}
		if (isNaN(videos[videoTitle])) {
			logger.log1(`Video title in seen videos, but value is not a number, resetting it`);
			videos[videoTitle] = 0;
		}
		videos[videoTitle]++;
		logger.log1(`Video title in seen videos, value is ${videos[videoTitle]}`);

		logger.log1(`Setting video title to (${videos[videoTitle]}) ${videoTitle}`);
		videoTitleElement.innerText = `(${videos[videoTitle]}) ${videoTitle}`;
		if (videos[videoTitle] > GM_config.get("BLOCK_THRESHOLD")) {
			logger.log1(
				`Video title has been seen ${videos[videoTitle]} times (over ${GM_config.get(
					"BLOCK_THRESHOLD"
				)} threshold), blocking it`
			);
			console.log(video);
			if (window.location.href == "https://www.youtube.com/") {
				logger.log1(`Window location recognized as youtube homepage, blocking video`);
				video.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = "none";
			} else if (window.location.href == "https://www.youtube.com/feed/subscriptions") {
				logger.log1(`Window location recognized as youtube subscriptions page, skipping`);
				break;
			} else if (/https:\/\/www\.youtube\.com\/.+/.test(window.location.href)) {
				logger.log1(`Window location recognized as youtube video page, blocking video`);
				video.parentElement.parentElement.parentElement.style.display = "none";
			}
		}
	}
	logger.log1(`Finished processing elements`);
	GM_setValue(persistenceKey, JSON.stringify(videos));
	timer = -1;
}

processAllElements();

new MutationObserver((mutations) => {
	mutations = mutations.filter((mutation) => mutation.addedNodes.length > 0);
	if (mutations.length > 0) {
		processUnprocessedElements();
	}
}).observe(document.documentElement, {
	childList: true,
	subtree: true,
});
