// ==UserScript==
// @name           SteamWorkshop.Download Button
// @namespace      http://vova1234.com/blog/web/69.html
// @description    Adds a button to the Steam Workshop pages that lets you head straight to the specific addon page at steamworkshop.download
// @include        *steamcommunity.com/sharedfiles/filedetails/?id=*
// @version        0.1
// @downloadURL    http://st.abcvg.info/swd/steamwd.user.js
// ==/UserScript==

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

let patt = new RegExp("[0-9]{2,15}");
let id = patt.exec(document.URL);

waitForElm(document, "#SubscribeItemBtn").then((elm) => {
	elm = elm.parentNode;
	let node = createElementFromHTML(`<div class="apphub_OtherSiteInfo">
	<a class="btnv6_blue_hoverfade btn_medium" href="http://steamworkshop.download/download/view/${id}">
		<span>Download</span>
	</a>
</div>`);
	elm.prepend(node);
});
