chrome.browserAction.onClicked.addListener(function(tab) {
        var name = tab.title;
        var url  = tab.url;
        chrome.tabs.captureVisibleTab(null, {"format":"png"}, function (image) {
	        var canvas = document.getElementById('scratch_pad');
	        var context = canvas.getContext('2d');
	        var img = new Image;
	        img.onload = function () {
		    context.drawImage(img, 0, 0, img.width, img.height,
				      0, 0, 360, 200);
		    setLocalData(""+url, canvas.toDataURL());
                    chrome.bookmarks.create({parentId: "3", title: name, url: url});
		}
	        img.src = image;
        });
});
