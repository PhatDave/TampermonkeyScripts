// ==UserScript==
// @name            Repeat youtube video blocker
// @author          Cyka
// @match           https://www.youtube.com/
// @version         1.16
// @run-at          document-start
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/YoutubeVideoBlocker.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/YoutubeVideoBlocker.js
// @require         file://C:/Users/Dave/WebstormProjects/TampermonkeyScripts/YoutubeVideoBlocker.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @noframes
// ==/UserScript==

/* global GM_config, GM_info, GM_registerMenuCommand */

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
// GM_setValue(persistenceKey, JSON.stringify("{}"))
let videos = JSON.parse(await GM_getValue(persistenceKey, JSON.stringify("{}")));
if (videos.constructor === "".constructor) {
	videos = JSON.parse(videos);
}
let timer = -1
console.log(videos);

function processUnprocessedElements() {
	if (timer === -1) {
		timer = setTimeout(processElements, 350, document.querySelectorAll("a.ytd-thumbnail:not([data-processed])"));
	}
}

function processAllElements() {
	processElements(document.querySelectorAll("a.ytd-thumbnail"));
}

function processElements(elements) {
	elements.forEach((video) => {
		video.setAttribute("data-processed", "true");
		let videoTitleElement = video.parentElement.parentElement.querySelector("#video-title");
		if (videoTitleElement === null || videoTitleElement === undefined) {
			return null;
		}
		let videoTitle = videoTitleElement.innerText.trim();
		// console.log(`videoTitle = ${videoTitle}`);
		if (!videoTitle in Object.keys(videos)) {
			videos[videoTitle] = 0;
		}
		if (isNaN(videos[videoTitle])) {
			videos[videoTitle] = 0;
		}
		videos[videoTitle]++;

		videoTitleElement.innerText = `(${videos[videoTitle]}) ${videoTitle}`;
		if (videos[videoTitle] > GM_config.get('BLOCK_THRESHOLD')) {
			video.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = "none";
			console.log(`Removing wideo ${videoTitle}`);
		} else {
			console.log(`Keeping wideo ${videoTitle}`);
		}
	});
	GM_setValue(persistenceKey, JSON.stringify(videos));
	timer = -1;
}

processAllElements();

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
