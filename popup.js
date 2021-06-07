function listCookies() {
	console.log("LIST Cookie");
    var theCookies = document.cookie.split(';');
    var aString = '';
    for (var i = 1 ; i <= theCookies.length; i++) {
        aString += i + ' ' + theCookies[i-1] + "\n";
    }
	console.log(theCookies);
    return aString;
}

function cookieinfo(){
	console.log("Cookie Info!!");
	chrome.tabs.query({"status": "complete", "windowId": chrome.windows.WINDOW_ID_CURRENT, "active": true}, function(tab) {
		tabdata = JSON.stringify(tab)
		console.log(tabdata, tab[0].url);
		chrome.cookies.getAll({"url": tab[0].url}, function (cookie) {
			
			console.log(cookie.length);
			allCookieInfo = "";
			for(i=0;i<cookie.length;i++) {
				console.log(JSON.stringify(cookie[i]));
				allCookieInfo = allCookieInfo + JSON.stringify(cookie[i]);
			}
			localStorage.currentCookieInfo = allCookieInfo;
			listCookies();
		});
	});

}

window.onload=cookieinfo;