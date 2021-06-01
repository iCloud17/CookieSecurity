var currentCookieInfo = {};

chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
        console.log('msg', msg);
        if(Object.keys(msg).includes('url')) {
            console.log('checking!', currentCookieInfo, currentCookieInfo[msg.url]);
            if(Object.keys(currentCookieInfo).includes(msg.url)) {
                port.postMessage({msg: currentCookieInfo[msg.url], url: msg.url});
            } else {
                port.postMessage({msg: undefined, url: msg.url});
            }
        } else {
            var url = Object.keys(msg)[0];
            currentCookieInfo[url] = msg[url];
            console.log('stored!', msg, currentCookieInfo[url]);
        }
    });
})