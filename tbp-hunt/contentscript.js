if(window == top) {
	var action;
	var health = parseInt(document.getElementById("health").innerHTML);
	var min_health = parseInt(document.getElementById("maxhealth").innerHTML) / 5;
	var el = document.createElement("div");
	el.id = "tbpHunt";
	el.style.position = 'absolute';
	el.style.bottom = '50px';
	el.style.right = '50px';
	el.style.padding = '5px';
	el.style.background = '#ccc';
	el.style.border = 'solid 1px';
	el.addEventListener("click", __tbpHuntToggle, false);

	if (document.forms.length > 0) {
		action = 'click';
	} else {
		action = 'fight';
	}
	document.body.appendChild(el);

	function __tbpHuntToggle() {
		chrome.extension.sendRequest({
				action : 'toggle'});
	}

	function showState(running, state) {
		document.getElementById("tbpHunt").innerHTML = "" + running + "<br />" + state;
	}

	function goHeal() {
		if (health_value < min_health) {
			location.href = "michelle.php?action=bullpen&req=nap";
		}
	}
	chrome.extension.sendRequest({
			state : action,
			health : health,
			min_health : min_health});
}
