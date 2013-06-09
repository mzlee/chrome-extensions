function hashCode(str) {
    var hash = 0, i, char;
    if (typeof str === "string") {
        if (str.length == 0) return hash;
        for (i = 0, l = str.length; i < l; i++) {
            char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }
    } else {
        hash = str | 0;
    }
    // console.log("Hashed " + str + " to " + hash);
    return hash;
}

function getLocalData(objName) {
    var hc = hashCode(objName);
    // console.log("Retrieving " + objName + " -> " + hc);
    if (localStorage[hc] != undefined) {
        return JSON.parse(localStorage[hc]);
    }
    return null;
}

function setLocalData(objName, data) {
    var hc = hashCode(objName);
    // console.log("Storing " + objName + " " + hc);
    localStorage[hc] = JSON.stringify(data);
}

function deleteLocalData(objName) {
    delete(localStorage[hashCode(objName)]);
}
