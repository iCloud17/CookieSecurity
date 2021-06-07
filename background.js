var aNetworkLog = [];
// var port = chrome.extension.connect({
// 	name: "currentCookieInfo"
// });
// var completed = {};
// chrome.webRequest.onCompleted.addListener(function(oCompleted) {
//         var sCompleted = JSON.stringify(oCompleted);
//         completed.push(sCompleted);
//         console.log('comleted!', oCompleted, completed.length);
//     }
//     ,{urls: ["<all_urls>"]}
// );

var networkLog = {};
chrome.webRequest.onSendHeaders.addListener(
    function(details) {
        networkLog[details.requestId] = details;
        // console.log('request headers-', details);
    },
    {urls: ["<all_urls>"]},
    ["requestHeaders", "extraHeaders"]
);

chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
        // console.log('detaillog', details);
        var cookieResponse = false;
        for(var i = 0; i < details.responseHeaders.length; i++) {
            if(details.responseHeaders[i].name === "set-cookie") {
                console.log("COOKIE SETTER", details);
                cookieResponse = true;
                break;
            }
        }
        if(cookieResponse) {
            try {
                networkLog[details.requestId].responseStatusCode = details.statusCode;
                networkLog[details.requestId].responseStatusLine = details.statusLine;
                networkLog[details.requestId].requestTimeStamp = networkLog[details.requestId].timeStamp;
                delete networkLog[details.requestId].timeStamp;
                networkLog[details.requestId].responseTimeStamp = details.timeStamp;
                networkLog[details.requestId].responseHeaders = details.responseHeaders;
                // console.log('received headers-', details);
            } catch (error) {
                console.log("ERROR", error, networkLog[details.requestId]);
            }
        } else {
            delete networkLog[details.requestId];
        }
    },
    {urls: ["<all_urls>"]},
    ["responseHeaders", "extraHeaders"]
);

chrome.extension.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (message) {
        if (message.action === "getNetworkLog") {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

                // since only one tab should be active and in the current window at once
                // the return variable should only have one entry
                var activeTab = tabs[0];
                console.log('FINAL NETWORK LOG', networkLog)
                // console.log('tab', activeTab);
                // var activeTabId = activeTab.url; // or do whatever you need
                // aNetworkLog.push(activeTabId);
                aNetworkLog = Object.values(networkLog);
                port.postMessage(aNetworkLog);
                aNetworkLog = [];
                networkLog = {};
            });
        }
    });
});