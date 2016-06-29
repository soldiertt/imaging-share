/**********************************************************
 ****************** AJAX **********************************
 **********************************************************/
Imaging.ajax = {
    get: function(url) {
    	var data,
    		callbackFn;
    	
    	if (arguments.length === 2) {
    		// url, callbackFn
			callbackFn = arguments[1];
        	$.get(url, function(response) {
				if(typeof callbackFn === 'function'){
					callbackFn.call(this, response);
				}
			}).fail(function(xhr, ajaxOptions, thrownError) {
				Imaging.utils.throwError(url, xhr, thrownError);
    	    });
    	} else if (arguments.length === 3) {
    		// url, data, callbackFn
			data = arguments[1];
			callbackFn = arguments[2];
			$.get(url, data, function(response) {
				if(typeof callbackFn === 'function'){
					callbackFn.call(this, response);
				}
			}).fail(function(xhr, ajaxOptions, thrownError) {
				Imaging.utils.throwError(url, xhr, thrownError);
    	    });
    	}
    },
    getJson: function(url, data, callbackFn) {
		$.getJSON(url, data, function(response) {
			if(typeof callbackFn === 'function'){
				callbackFn.call(this, response);
			}
		}).fail(function(xhr, ajaxOptions, thrownError) {
			Imaging.utils.throwError(url, xhr, thrownError);
	    });
    },
    getJsonWait: function(url, data, callbackFn) {
    	$("body").addClass("wait");
		$.getJSON(url, data, function(response) {
			$("body").removeClass("wait");
			if (typeof callbackFn === 'function'){
				callbackFn.call(this, response);
			}
		}).fail(function(xhr, ajaxOptions, thrownError) {
			$("body").removeClass("wait");
			Imaging.utils.throwError(url, xhr, thrownError);
	    });
    },
    getJsonDisable: function(url, data, callbackFn) {
    	$("body").addClass("wait");
    	Imaging.utils.disablePage();
		$.getJSON(url, data, function(response) {
			$("body").removeClass("wait");
			Imaging.utils.enablePage();
			if (typeof callbackFn === 'function'){
				callbackFn.call(this, response);
			}
		}).fail(function(xhr, ajaxOptions, thrownError) {
			$("body").removeClass("wait");
			Imaging.utils.enablePage();
			Imaging.utils.throwError(url, xhr, thrownError);
	    });
    },
    postJson: function(url, data, callbackFn) {
    	$.ajax({
			type: "POST",
			url: url,
			data: $.toJSON(data),
			contentType : 'application/json'
		}).done(function(response) {
			if(typeof callbackFn === 'function'){
				callbackFn.call(this, response);
			}
		}).fail(function(xhr, ajaxOptions, thrownError) {
			Imaging.utils.throwError(url, xhr, thrownError);
		});
    },
    postJsonDisable: function(url, data, callbackFn) {
    	$("body").addClass("wait");
    	Imaging.utils.disablePage();
    	$.ajax({
			type: "POST",
			url: url,
			data: $.toJSON(data),
			contentType : 'application/json'
		}).done(function(response) {
			$("body").removeClass("wait");
			Imaging.utils.enablePage();
			if(typeof callbackFn === 'function'){
				callbackFn.call(this, response);
			}
		}).fail(function(xhr, ajaxOptions, thrownError) {
			$("body").removeClass("wait");
			Imaging.utils.enablePage();
			Imaging.utils.throwError(url, xhr, thrownError);
		});
    },
    putJson: function(url, data, callbackFn) {
    	$.ajax({
			type: "PUT",
			url: url,
			data: $.toJSON(data),
			contentType : 'application/json'
		}).done(function(response) {
			if(typeof callbackFn === 'function'){
				callbackFn.call(this, response);
			}
		}).fail(function(xhr, ajaxOptions, thrownError) {
			Imaging.utils.throwError(url, xhr, thrownError);
		});
    },
    ajaxDelete: function(url, callbackFn) {
    	$.ajax({
			type: "DELETE",
			url: url
		}).done(function(response) {
			if(typeof callbackFn === 'function'){
				callbackFn.call(this, response);
			}
		}).fail(function(xhr, ajaxOptions, thrownError) {
			Imaging.utils.throwError(url, xhr, thrownError);
		});
    }
 };