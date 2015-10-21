//var buttons = require('sdk/ui/button/action');
var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");


var pageMod = require("sdk/page-mod");
var data = self.data;
tabs.on("ready", runScript);
var count_error = 0;
var error = [];

var button = ToggleButton({
  id: "ErrorJS_log",
  label: "Error JS Panel",
  icon: {
    "16": "./JS_ERROR_16.png",
    "32": "./JS_ERROR_32.png",
    "64": "./JS_ERROR_64.png"
  },
  badge: 0,
  badgeColor: "#00AAAA",
  onChange: handleChange
});


var panel = panels.Panel({
	contentURL: self.data.url("panel.html"),
	onHide: handleHide,
 });

function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button,
	  width: 400
    });
  }
}
function handleHide() {
  button.state('window', {checked: false});
}


panel.on("show", function() {
	var html = setupPanel();
	panel.port.emit("fillit", html);
});


function setupPanel(){
	var html = "";
	var tr1 = "<tr>",
		tr2 = "</tr>",
		td1 = "<td>",
		td2 = "</td>";
	
	for (var index = 0; index < error.length; ++index) {
		html += tr1 + td1 + error[index].script + td2 + td1 + error[index].line + td2 + td1 + error[index].msg + td2 + tr2;
	}
	//console.log(1 + " " + html);
	return html;
}



button.badge = "";

pageMod.PageMod({
  include: "*",
  contentScriptFile: "./error_log.js",
  contentScriptWhen: "start",
  onAttach: function (worker){
	worker.port.on('setBadge', function (html) {
		count_error += parseInt(html);
		button.badge = count_error;
	});
	worker.port.on('errorMsg', function (returnError){
		var er = {};
		er.script = returnError[0];
		er.line = returnError[1];
		er.msg = returnError[2];
		
		error.push(er);
	});
  }
});

function runScript(tab) {
	count_error = 0;
}
/*
// Track AJAX errors (jQuery API)
if (window.jQuery) {
	window.jQuery(document).ajaxError(function(e, request, settings) {
	console.log('_trackEvent Ajax error: ' + settings.url + " result: " +e.result);
	});
}
*/