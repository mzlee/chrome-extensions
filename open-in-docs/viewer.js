function Viewer(url) {
	this.link = "http://docs.google.com/viewer";
	this.url = url;
	this.toString = function () {
		link = this.link + "?";
		link += "url=" + encodeURIComponent(this.url);
		return link;
	}
}
function viewInDocs(data, tab) {
	var viewerLink = new Viewer(data.linkUrl);
	chrome.tabs.create({
		url : viewerLink.toString()
	});
}
var menuId = chrome.contextMenus.create({
	"title" : "View in Docs",
	"contexts" : ["link"],
	"onclick" : viewInDocs
});
