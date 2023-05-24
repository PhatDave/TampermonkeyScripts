// ==UserScript==
// @name            Pocketbase Linkifier
// @version         0.2
// @author          Dave
// @match           *://*/*
// @run-at          document-end
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/PocketbaseLinkifier.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/PocketbaseLinkifier.js
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

    let urlElements = document.querySelectorAll("div.alert > div.content > p");

    console.log(urlElements);
    urlElements.forEach(element => {
        console.log(element.innerText);
        element.innerText = `${rootUrl}${element.innerText}`;
    });
}

console.log(window.location.href);
if (window.location.href.includes("pocketbase")) {
    waitForElement(document, "div.btns-group button.btn.btn-outline").then(elm => {
        elm.addEventListener("click", doPatchUrls);
    });
}
