// ==UserScript==
// @name            Nextcloud Download Link Generator
// @version         0.2
// @author          Dave
// @match           *://*/*
// @run-at          document-end
// @updateURL       https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/NextcloudDownloadLink.js
// @downloadURL     https://raw.githubusercontent.com/PhatDave/TampermonkeyScripts/master/NextcloudDownloadLink.js
// @grant           GM_setClipboard
// ==/UserScript==

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

async function main() {
    await waitForElement(document, "tr[data-type]");
    let files = document.querySelectorAll("tr[data-type]");
    files.forEach(element => {
        let fileActions = element.querySelector("span.fileactions");
        // This shit just does not work, fuck off dumb shit
    });
}

if (window.location.href.includes("nextcloud")) {
    main();
}
