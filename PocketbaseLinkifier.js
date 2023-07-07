// ==UserScript==
// @name            Pocketbase Linkifier
// @version         0.5
// @author          Dave
// @match           *://*/*
// @run-at          document-end
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/PocketbaseLinkifier.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/PocketbaseLinkifier.js
// @grant           GM_setClipboard
// ==/UserScript==

console.log(window.location.href);

function waitForElement(element, selector) {
    return new Promise(resolve => {
        if (element.querySelector(selector)) {
            return resolve(element.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (element.querySelector(selector)) {
                resolve(element.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(element, {
            childList: true,
            subtree: true
        });
    });
}

function doPatchUrls() {
    console.log("patching time");
    let rootUrl = window.location.href.split("_")[0];
    rootUrl = rootUrl.slice(0, -1);

    document.querySelectorAll("button.sidebar-item:not([processed])").forEach(element => {
        element.setAttribute("processed", "true");
        element.addEventListener('click', doPatchUrls);
    });

    let urlElements = document.querySelectorAll("div.alert > div.content > p:not([processed])");

    console.log(urlElements);
    urlElements.forEach(element => {
        console.log(element.innerText);
        element.setAttribute("processed", "true");
        element.innerText = `${rootUrl}${element.innerText}`;
        element.addEventListener('click', event => {
            console.log("IS CLICK");
            console.log(event);
            let text = event.target.innerText.trim();
            console.log(text);
            GM_setClipboard(text);
        })
    });
}

if (window.location.href.includes("pocketbase")) {
    doPatchUrls();
    setInterval(doPatchUrls, 500);
}
