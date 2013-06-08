chrome.browserAction.onClicked.addListener(function(tab) {
        console.log("Trying to save " + tab.url);
        var name = tab.title;
        var url  = tab.url;
        console.log("name : " + name);
        console.log("url : " + url);

        chrome.tabs.captureVisibleTab(null, {"format":"png"}, function (image) {
                console.log("name : " + name);
                console.log("Capture visible tab");
                setLocalData(""+url, image);
                console.log("Trying to get bookmark node");
                chrome.bookmarks.create({parentId: "3", title: name, url: url});
            });
});
