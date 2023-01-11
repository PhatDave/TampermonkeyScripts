// ==UserScript==
// @name            Repeat youtube video blocker
// @author          Cyka
// @match           https://www.youtube.com/
// @version         1.17
// @run-at          document-end
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/YoutubeVideoBlocker.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/YoutubeVideoBlocker.js
// @require         file://C:/Users/Dave/WebstormProjects/TampermonkeyScripts/YoutubeVideoBlocker.js
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

		let datePrefix = `[${day}/${month}/${year}-${hours}:${minutes}:${seconds}:${milliseconds}]`

		// let out = `${datePrefix} [${this.clazz}] (${logLevel}) ${data}`;
		let out = datePrefix.padEnd(30, ' ') + `[${this.clazz}]`.padEnd(28, ' ') + `(${logLevel})`.padEnd(8, ' ') + data;
		console.log(out);
	}

	log1 = this.log.bind(this, 1);
	log2 = this.log.bind(this, 2);
	log3 = this.log.bind(this, 3);
	log4 = this.log.bind(this, 4);
	log5 = this.log.bind(this, 5);
	log6 = this.log.bind(this, 6);
}

let logger = new Logger("TamperMonkey-AutoLogin");

GM_config.init({
	               id: 'configyes',
	               title: GM_info.script.name + ' Settings',
	               fields: {
		               BLOCK_THRESHOLD: {
			               label: 'Block threshold',
			               type: 'number',
			               min: 0,
			               max: 100,
			               default: 5,
			               title: 'How many times must a video appear for it to be blocked'
		               }
	               }
               });
GM_registerMenuCommand('Settings', () => {
	GM_config.open()
});

let persistenceKey = "seenVideos"
let videos = JSON.parse(await GM_getValue(persistenceKey, JSON.stringify("{}")));
if (videos.constructor === "".constructor) {
	videos = JSON.parse(videos);
}
let timer = -1

function processUnprocessedElements() {
	if (timer === -1) {
		logger.log1(`Starting timer for processing elements`);
		timer = setTimeout(processElements, 350, document.querySelectorAll("a.ytd-thumbnail:not([data-processed])"));
	} else {
		logger.log1(`Timer for processing elements already running`);
	}
}

function processAllElements() {
	logger.log1(`Processing all elements`);
	processElements(document.querySelectorAll("a.ytd-thumbnail"));
}

function processElements(elements) {
	logger.log1(`Found ${elements.length} elements to process`);
	for (let i = 0; i < elements.length; i++) {
		let video = elements[i];
		logger.log1(`Processing element ${video}`);
		video.setAttribute("data-processed", "true");
		let videoTitleElement = video.parentElement.parentElement.querySelector("#video-title");
		if (videoTitleElement === null || videoTitleElement === undefined) {
			logger.log1(`Could not find video title element for video ${video}`);
			return null;
		}
		let videoTitle = videoTitleElement.innerText.trim();
		logger.log1(`Video title: ${videoTitle}`);
		if (!videoTitle in Object.keys(videos)) {
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
		if (videos[videoTitle] > GM_config.get('BLOCK_THRESHOLD')) {
			logger.log1(`Video title has been seen ${videos[videoTitle]} times (over ${GM_config.get('BLOCK_THRESHOLD')} threshold), blocking it`);
			video.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = "none";
		}
	}
	logger.log1(`Finished processing elements`);
	GM_setValue(persistenceKey, JSON.stringify(videos));
	timer = -1;
}

processAllElements();

// Block future elements that are not yet rendered
new MutationObserver((mutations) => {
	mutations.forEach(mutation => {
		console.log(mutation);
		for (const newElement of mutation.addedNodes) {
			processUnprocessedElements();
		}
	});
}).observe(document.documentElement, {
	childList: true,
	subtree: true
});

function observeUrlChange() {
	let href = document.location.href;
	const body = document.querySelector("body");
	const observer = new MutationObserver(mutations => {
		mutations.forEach(() => {
			if (href !== document.location.href) {
				console.log(`Href changed! old -> ${href}, new -> ${document.location.href}`);
				href = document.location.href;
			}
		});
	});
	observer.observe(body, {
		childList: true,
		subtree: true
	});
}

// window.onload = observeUrlChange;
