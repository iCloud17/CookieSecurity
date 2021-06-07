var port = chrome.extension.connect({name:'currentCookieInfo'});
console.log('Chrome ready to go!');
var emptyMsg = 0;


function postRequest() {
    console.log('post req!', emptyMsg);
    port.postMessage({action:"getNetworkLog"});
    if(emptyMsg < 4) {
        setTimeout(function () {
            try {
                postRequest();    
            } catch (error) {
                console.log("error in fetching!");
                console.log(error);
            }
        }, 8000);
    }
}

window.onload = postRequest;

port.onMessage.addListener(function(msg) {
    if(msg.length == 0) {
        console.log('Empty Msg!', emptyMsg);
        emptyMsg += 1;
    }
    console.log(msg);
    for(var i = 0; i < msg.length; i++) {
        for(var j = 0; j < msg[i].responseHeaders.length; j++) {
            if(msg[i].responseHeaders[j].name === 'set-cookie') {
                console.log(msg[i].responseHeaders[j]);
            }
        }
    }
    console.log('-----------BREAK-----------');
});