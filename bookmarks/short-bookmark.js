chrome.browserAction.onClicked.addListener(function(tab) {
        var name = tab.title;
        var url  = tab.url;
        chrome.tabs.captureVisibleTab(null, {"format":"png"}, function (image) {
                setLocalData(""+url, image);
                chrome.bookmarks.create({parentId: "3", title: name, url: url});
        });
});
