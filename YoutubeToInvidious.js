// ==UserScript==
// @name     Youtube redirect
// @match    *://www.youtube.com/*
// @run-at   document-start
// @grant    none
// ==/UserScript==

function doRedirect() {
	const currentUrl = document.location.href;
	if (!/www.youtube.com\/watch\?v=.*/.test(currentUrl)) {
		return;
	}
	const newUrl = currentUrl.replace(
		"www.youtube.com",
		"invidious.site.quack-lab.dev"
	);
	location.replace(newUrl);
}

let oldHref = document.location.href;
window.onload = function () {
	const bodyList = document.querySelector("body");
	doRedirect();

	const observer = new MutationObserver(function (mutations) {
		if (oldHref != document.location.href) {
			oldHref = document.location.href;
			doRedirect();
		}
	});

	const config = {
		childList: true,
		subtree: true,
	};

	observer.observe(bodyList, config);
};
