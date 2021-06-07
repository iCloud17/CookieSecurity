var localStore = {};
const badCookies = ['nyt-us', 'nyt-geo'];
const worseCookies = ['nyt-m', 'nyt-jkidd'];
var currentCookieInfo = localStorage.getItem('currentCookieInfo');

var port = chrome.extension.connect({
	name: "currentCookieInfo"
});

function deleteCookie(url, name) {
	console.log('deleting cookie!', url, name);
	try {
		chrome.cookies.remove({
			url: url,
			name: name
		});	
	} catch (error) {
		console.log(error);
	}
}

function queryDB() {
	port.onMessage.addListener(function(msg) {
		if(msg.msg === undefined) {
			console.log(msg.url, 'not in db!');
			cookieinfo(msg.url);
		} else {
			var content = document.getElementById("mainContent");
			content.outerHTML = msg.msg;
			var btn = document.getElementsByClassName('blockBtn');
			var tiles = document.getElementsByClassName('tile');
			for(var i = 0; i < btn.length; i++) {
				var val = JSON.parse(btn[i].value);
				if(val.blocked === 1) {
					deleteCookie(msg.url, val.cookie.name);
				}
				if(badCookies.includes(val.cookie.name)) {
					tiles[i].style.backgroundColor = "#ffb856";
				} else if(worseCookies.includes(val.cookie.name)) {
					tiles[i].style.backgroundColor = "#f96800";
				}
				btn[i].onclick = function(event) {
					var value = JSON.parse(event.target.value);
					// console.log(value);
					if(value.blocked === 0) {
						value.blocked = 1;
						event.target.value = JSON.stringify(value);
						event.target.style.backgroundColor = "red";
						event.target.innerHTML = "BLOCKED";
						deleteCookie(msg.url, value.cookie.name);
					} else {
						value.blocked = 0;
						event.target.value = JSON.stringify(value);
						event.target.style.backgroundColor = "#03A9F4";
						event.target.innerHTML = "BLOCK";
					}
					localStore[msg.url] = content.outerHTML;
					port.postMessage(localStore);
				};
			}
		}
	});
}

queryDB();

function extractDomain(url) {
	return url.replace(/.+\/\/|www.|\/.+/g, '');
}

function cookieinfo(url) {
	// var domain = extractDomain(url);
	// console.log('a.' + domain);
	chrome.cookies.getAll({"url": url}, function (cookie) {
		
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
			var val = {};
			val['blocked'] = 0;
			val['cookie'] = cookie[i];
			blockBtn.value = JSON.stringify(val);
			blockBtn.innerHTML = "BLOCK";
			blockBtn.style.float = "right";
			blockBtn.onclick = function(event) {
				var value = JSON.parse(event.target.value);
				// console.log('in cookie info', value);
				if(value.blocked === 0) {
					value.blocked = 1;
					event.target.value = JSON.stringify(value);
					event.target.style.backgroundColor = "red";
					event.target.innerHTML = "BLOCKED";
					deleteCookie(url, value.cookie.name);
				} else {
					value.blocked = 0;
					event.target.value = JSON.stringify(value);
					event.target.style.backgroundColor = "#03A9F4";
					event.target.innerHTML = "BLOCK";
				}
				localStore[url] = content.outerHTML;
				port.postMessage(localStore);
			};

			if(badCookies.includes(cookie[i].name)) {
				tile.style.backgroundColor = "#ffb856";
			} else if(worseCookies.includes(cookie[i].name)) {
				tile.style.backgroundColor = "#f96800";
			}
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

window.onload = queryDB;