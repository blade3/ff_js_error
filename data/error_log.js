(function () {
    "use strict";
    var error_count = 4;
	var ff_netlys_js_error = {};
    ff_netlys_js_error.get = {
        setup: function () {
console.log("setup");
			window.onerror = function (message,url,lineNo, column, errorObj){
   console.log("on_error");
					self.port.emit('setBadge', 1);
					self.port.emit('errorMsg', [url,lineNo,message + ' Column: ' + column + ' StackTrace: ' +  errorObj]);
					return true;
			}
            //window.addEventListener("error", function(e) {
            //    self.port.emit('setBadge', 1);
			//	self.port.emit('errorMsg', [e.filename,e.lineno,e.message]);
              //  console.log("_trackEvent JavaScript Error: " + e.message + "\n " + e.filename + ": " + e.lineno);
            //});
		},
	}
	ff_netlys_js_error.get.setup();
})();