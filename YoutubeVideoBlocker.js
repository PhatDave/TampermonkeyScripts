// ==UserScript==
// @name           Repeat youtube video blocker
// @author         Cyka
// @include        *youtube.com/*
// @version        1.0.0
// @run-at         document-end
// @updateURL   https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/YoutubeVideoBlocker.js
// @downloadURL https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/YoutubeVideoBlocker.js
// @grant          GM_getValue
// @grant          GM_setValue
// @noframes
// ==/UserScript==

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
		let videoTitle = videoTitleElement.innerText;
		// console.log(`videoTitle = ${videoTitle}`);
		if (!videoTitle in Object.keys(videos)) {
			videos[videoTitle] = 0;
		}
		if (isNaN(videos[videoTitle])) {
			videos[videoTitle] = 0;
		}
		videos[videoTitle]++;
		// console.log(videos);

		if (videos[videoTitle] > 5) {
			video.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = "none";
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
