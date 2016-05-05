/*********************************************************
***************** UTILS *********************************
**********************************************************/
Imaging.utils = {
	getURLParameter: function (name) {
	    return decodeURI(
	        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
	    );
	},
	getFileExtension: function(filename) {
		return filename.split('.').pop();
	},
	isBrowserIE: function() {

	    var ua = window.navigator.userAgent;
	    var msie = ua.indexOf("MSIE ");

	    return (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./));
	},
	isBrowserChrome: function() {
		return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
	},
	throwError: function(url, xhr, thrownError) {
		if ($("#errorthrown").length == 0) {
    		var htmlCode = "<div id='errorthrown'><h1>An error occured, please try again or contact ICT Team if error persists !</h1>"
    			+ "<div id='errorclose'></div>"
    			+ "<p><span id='detailslink'>Click here to see error details</span></p>"
    			+ "<div id='errordetails' style='display:none'>" + "Error with request url : " + url + "<br/>" 
				+ xhr.status + "<br/>" + thrownError + "<br/>" + xhr.responseText + "</div>"
				+ "</div>"
    			$(htmlCode).appendTo("body");
    		$("#detailslink").click(function() {
    			$("#errordetails").toggle();
    		});
    		$("#errorclose").click(function() {
    			$("#errorthrown").remove();
    		});
		}
		if ($("#pageoverlay").length > 0) {
			$("#pageoverlay").remove();
		}
	},
	goTo: function (url) {
		window.location.href = url;
	},
	getURLPage: function () {
		var path = window.location.pathname,
			urlPage = path.substr(path.lastIndexOf('/') + 1);
	    return urlPage;
	},
	reloadWorkitemPage: function(nodeRef) {
		
		if (Imaging.utils.getURLPage() === "page-document") {
			var openerWindow = window.opener;
			if (typeof openerWindow !== "undefined" && openerWindow != null) {
				try {
					//IE throws unspecified error on next line where parent window was closed (pathname is Error)
					var openerPath = openerWindow.location.pathname,
    				openerUrlPage = openerPath.substr(openerPath.lastIndexOf('/') + 1);
    				if (openerUrlPage == "page-boxes") { //Only refresh workitem view if opener is indeed the workitem view (not the search)
    					openerWindow.$("#workitem").trigger("click");
    				}
				} catch(e){
					//just continue
				}
			}
			window.opener = top;
			window.close();
		} else if (Imaging.utils.getURLPage() === "dashboard") {
			if (nodeRef) {
				Imaging.utils.goTo("page-boxes?nodeRef=" + nodeRef);
			} else {
				Imaging.utils.goTo("page-boxes");
			}
		} else {
			if (nodeRef) {
				Imaging.onClickBoxes.specialBoxClick($("#workitem"), nodeRef);
    		} else {
    			Imaging.onClickBoxes.specialBoxClick($("#workitem"), null);
    		}
		}
	},
	reloadAdminPage: function() {
		Imaging.onClickBoxes.specialBoxClick($("#admin"), null);
	},
	openViewer: function(nodeRef) {
		
		var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
		var winRef;
		
		if (!isChrome) {
			var foundOpenedViewer = false;
			$.each(winOpened, function(index, elem) {
				if (elem.nodeRef === nodeRef) {
					foundOpenedViewer = true;
					elem.winRef.focus(); // DOES NOT WORK ON CHROME !
				}
			});
			
			if (!foundOpenedViewer) {
				
				winRef = Imaging.utils.newWindow("page-document?nodeRef=" + nodeRef);
				winOpened.push({"nodeRef":nodeRef, "winRef": winRef});
				winRef.attachEvent('onbeforeunload', function() {
					 var indexToRemove = -1;
					 $.each(winOpened, function(index, elem) {
						if (elem.nodeRef === nodeRef) {
							indexToRemove = index;
						} 
					 });
					 winOpened.splice(indexToRemove, 1);
				});
				
			}
		} else {
			
			Imaging.utils.newWindow("page-document?nodeRef=" + nodeRef);
		}
		
		
	},
	getUserPref: function(prefName, callbackFn) {
		var getData = {	prefName: prefName };
		Imaging.ajax.getJson(WS_URLS.userPref, getData, callbackFn);
	},
	runWithWorkitemPermission: function(nodeRef, callbackFn) {
		var getData = {	nodeRef: nodeRef },
			manageHasPermission = function(response) {
				if (response.isinmyworkitem === "yes") {
					if(typeof callbackFn === 'function'){
						callbackFn.call(this, response);
					}
				} else {
					Imaging.utils.errorBox("Action error", "The document is no more in your workitem !");
				}
			};
		Imaging.ajax.getJson(WS_URLS.isInMyWI, getData, manageHasPermission);
	},
	infoBox: function(title, message) {
		$(".web-preview").css("visibility","hidden");
		new Messi(message, {title: title, titleClass: "info", modal: true, buttons: [{id: 0, label: 'Close', val: 'X'}], callback: function() { $(".web-preview").css("visibility","visible"); } });
	},
	errorBox: function(title, message) {
		$(".web-preview").css("visibility","hidden");
		new Messi(message, {title: title, titleClass: "error", modal: true, buttons: [{id: 0, label: 'Close', val: 'X'}], callback: function() { $(".web-preview").css("visibility","visible"); } });
	},
	warningBox: function(title, message) {
		$(".web-preview").css("visibility","hidden");
		new Messi(message, {title: title, titleClass: "warning", modal: true, buttons: [{id: 0, label: 'Close', val: 'X'}], callback: function() { $(".web-preview").css("visibility","visible"); } });
	},
	yesnoBox: function(title, message, callbackFn) {
		$(".web-preview").css("visibility","hidden");
		new Messi(message, {title: title, titleClass: "info", modal: true, buttons: [{id: 0, label: 'Yes', val: 'Y'}, {id: 1, label: 'No', val: 'N'}], callback: callbackFn});
	},
	newWindow: function(url) {
		var viewerPos = $.jStorage.get("viewerPosition", {winW:1000, winH: 600, scX: 0, scY:0}),
			positionInfo = "width=" + viewerPos.winW + ",height=" + viewerPos.winH + ",top=" + viewerPos.scY + ",left=" + viewerPos.scX;
		return window.open(url, "_blank", positionInfo + ",menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=yes,status=no");
	},
	disablePage: function() {
		$(".web-preview").css("visibility","hidden");
		$("body").append("<div id=\"pageoverlay\"></div>");
	},
	enablePage: function() {
		$("#pageoverlay").remove();
		$(".web-preview").css("visibility","visible");
	},
	updatePersonsList: function(jsonResp) {
		var boxusers = jsonResp.allusers,
			$workAssignee = $("select[name='fds:workAssignee']"),
			attrSelected="",
			usersSortFn = function(a,b) {
				if (a.displayname < b.displayname) {
					return -1;
				}
				if (a.displayname > b.displayname) {
					return 1;
				}
				return 0;
			}

		boxusers.sort(usersSortFn);
		$workAssignee.html("<option value=''></option>");
		for (var i = 0; i < boxusers.length; i++) {
			if (boxusers[i].userid === $("input#workAssignee").val()) {
				attrSelected = "selected";
			} else {
				attrSelected="";
			}
			$workAssignee.append("<option value='" + boxusers[i].userid + "'" + attrSelected + ">" + boxusers[i].displayname + "</option>");
		}
		$workAssignee.trigger("change");
		$workAssignee.trigger("chosen:updated"); 
	},
	managePersonSelection: function() {
		var $workBox = $("select[name='fds:workBox']"),
			$workAssignee = $("select[name='fds:workAssignee']");
		
		if ($workBox.length > 0) { // Not there for repository documents
			if ($workBox.val() === "EXIT" || $workBox.val() === "NONE") {
				Imaging.utils.updatePersonsList({allusers:[{userid:$("input#workAssignee").val(), displayname:$("input#workAssignee").val()}]});
				$workAssignee.attr("disabled", true).trigger("chosen:updated");
				$("#indexFormMultiID input#submit").prop("disabled", true);
			} else if ($workBox.val() === "MY PERSONAL") {
				Imaging.ajax.getJson(WS_URLS.usersOfBox, { boxname: "BRIEF-LETTRE-CONTR"}, Imaging.utils.updatePersonsList);
				$workAssignee.attr("disabled", false).trigger("chosen:updated");
				$("#indexFormMultiID input#submit").prop("disabled", false);
				if ($workAssignee.val() === "") {
					$("#indexFormID input#submit").prop("disabled", true);
					$("#indexFormID input#savesend").prop("disabled", true);
				}
			} else {
				Imaging.ajax.getJson(WS_URLS.usersOfBox, { boxname: $workBox.find(":selected").text()}, Imaging.utils.updatePersonsList);
				$workAssignee.attr("disabled", false).trigger("chosen:updated");
				$("#indexFormMultiID input#submit").prop("disabled", false);
			}
		}
	},
	manageSendPersonSelection: function() {
		var $mypersAssignee = $("select#selectuser");
	
		if ($mypersAssignee.val() === "") {
			$("#sendform input#submit").prop("disabled", true);
		} else {
			$("#sendform input#submit").prop("disabled", false);
		}
	}
}