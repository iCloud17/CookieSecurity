var localStore = {};
var currentCookieInfo = localStorage.getItem('currentCookieInfo');

var port = chrome.extension.connect({
	name: "currentCookieInfo"
});

port.onMessage.addListener(function(msg) {
	if(msg.msg === undefined) {
		console.log(msg.url, 'not in db!');
		cookieinfo(msg.url);
	} else {
		var content = document.getElementById("mainContent");
		content.outerHTML = msg.msg;
		var btn = document.getElementsByClassName('blockBtn');
		for(var i = 0; i < btn.length; i++) {
			btn[i].onclick = function(event) {
				//console.log(getComputedStyle(event.target).backgroundColor);
				if(event.target.value === "0") {
					event.target.value = "1";
					event.target.style.backgroundColor = "red";
					event.target.innerHTML = "BLOCKED";
				} else {
					event.target.value = "0";
					event.target.style.backgroundColor = "#03A9F4";
					event.target.innerHTML = "BLOCK";
				}
				localStore[url] = content.outerHTML;
				port.postMessage(localStore);
			};
		}
	}
});

function extractDomain(url) {
	return url.replace(/.+\/\/|www.|\/.+/g, '');
}

// function deleteCookie() {

// }

function cookieinfo(url) {
	// var domain = extractDomain(url);
	// console.log('a.' + domain);
	chrome.cookies.getAll({"domain": 'google.com'}, function (cookie) {
		
		console.log(cookie.length);
		var content = document.getElementById("mainContent");
		content.style.fontFamily = "Arial, Helvetica, sans-serif";
		content.innerHTML = "";
		
		for(i=0;i<cookie.length;i++) {
			var tile = document.createElement('div');
			tile.id = 'tile';
			tile.className = 'tile';


			var textStuff = document.createElement('div');
			textStuff.style.float = "left";

			var name = document.createElement('div');
			name.id = 'name';
			name.innerHTML = 'Name: ' + cookie[i].name;
			name.style.fontSize = "4.15vw";
			textStuff.appendChild(name);
			
			var domain = document.createElement('div');
			domain.id = 'domain';
			domain.innerHTML = 'Domain: ' + cookie[i].domain;
			domain.style.fontSize = "3.75vw";
			textStuff.appendChild(domain);
			tile.appendChild(textStuff);
			
			
			var blockBtn = document.createElement('button');
			blockBtn.className = 'blockBtn';
			blockBtn.value = "0";
			blockBtn.innerHTML = "BLOCK";
			blockBtn.style.float = "right";
			blockBtn.onclick = function(event) {
				//console.log(getComputedStyle(event.target).backgroundColor);
				if(event.target.value === "0") {
					event.target.value = "1";
					event.target.style.backgroundColor = "red";
					event.target.innerHTML = "BLOCKED";
				} else {
					event.target.value = "0";
					event.target.style.backgroundColor = "#03A9F4";
					event.target.innerHTML = "BLOCK";
				}
				localStore[url] = content.outerHTML;
				port.postMessage(localStore);
			};
			tile.appendChild(blockBtn);

			content.append(tile);
			console.log(cookie[i]);
		}
		localStore[url] = content.outerHTML;
		port.postMessage(localStore);
	});

}

chrome.tabs.query({"status": "complete", "windowId": chrome.windows.WINDOW_ID_CURRENT, "active": true}, function(tab) {
	port.postMessage({url : tab[0].url});
});