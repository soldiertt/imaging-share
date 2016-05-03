/*********************************************************
***************** ACTION *********************************
**********************************************************/
Imaging.action = {
	insertActions: function (nodeRef, view, destination) {
		var displayActions = function(html) {
				destination.html(html);
			},
			getData = { nodeRef: nodeRef, view: view };
			
		Imaging.ajax.get(WS_URLS.renderActions, getData, displayActions);
	},
	manageActionsEvents : function (useMenu) {
		if (useMenu) {
			$("div.action-menu ul").each(function() {
				if ($(this).children().size() == 0) {
					$(this).parent().prev("img").hide();
				}
			});
			$(".actions img").click(function(e) {
				e.stopPropagation();
				$(this).next("div.action-menu").toggle();
			});
			$(".actions").parent().mouseleave(function(e) {
				$(this).find("div.action-menu").hide();
			});
			$("div.action-menu").mouseleave(function(e) {
				$(this).hide();
			});
			$("ul.actions-list").menu();
		}
		
		// Manage action click
		$(".actions-list a img").click(function(e) {
			$(this).parent().trigger("click");
		});
			
		$(".actions-list li").click(function(e) {
			e.stopPropagation();
			e.preventDefault();
			Imaging.onClickAction.menuActionClick($(this));
		});
	},
	runWebscriptAction: function(actionName, runWithPerms, nodeRef, callbackFn) {
		var	checkActionStatusFn = function(jsonResponse) { // Check action execution status and call callback if success
    			if (jsonResponse.hasOwnProperty("status")) { //Not managed error
    				Imaging.utils.errorBox("Action failed", jsonResponse.message);
    			} else if (jsonResponse.hasOwnProperty("actionstatus") && jsonResponse.actionstatus == "NOK") {
    				Imaging.utils.errorBox("Action failed", jsonResponse.errormessage);
    			} else {
    				callbackFn();
    			}
    		},
			runActionFn = function() { 
				var getData = { nodeRef: nodeRef, action: actionName, method: "POST" }; 
				Imaging.ajax.getJsonDisable(WS_URLS.simpleAction, getData, checkActionStatusFn);
			};
		
		if(runWithPerms) {
			Imaging.utils.runWithWorkitemPermission(nodeRef, runActionFn);
		} else {
			runActionFn();
		}
	}
};

/**********************************************************
***************** ONClick - Action ************************
**********************************************************/	
Imaging.onClickAction = {
	filterBoxContent: function($toggle, $btnAssignedToMe, $btnShowWorkitems, $selectedbox) {
		var assignedtomeValue = $btnAssignedToMe.data("assignedtome");
		var showworkitemsValue = $btnShowWorkitems.data("showworkitems");
		if ($toggle.attr("id") === $btnAssignedToMe.attr("id")) {
	        if (!assignedtomeValue || assignedtomeValue === "no") {
	        	assignedtomeValue = "yes";
	        } else {
	        	assignedtomeValue = "no";
	        }
		}
		if ($toggle.attr("id") == $btnShowWorkitems.attr("id")) {
	        if (!showworkitemsValue || showworkitemsValue === "no") {
	        	showworkitemsValue = "yes";
	        } else {
	        	showworkitemsValue = "no";
	        }
		}
        Imaging.boxes.listBoxContent($selectedbox.attr("id"), assignedtomeValue, showworkitemsValue);
	},
	multiAction: function($action) {
		var multiActionCallbackFn = function(remoteAction, firstNodeRef) { // Final callback when multi action was successfullly completed.
				Imaging.callbackMgr().executeCallback("multi_" + remoteAction, firstNodeRef);
    	    },
    	    checkActionResultFn = function(jsonResult, remoteAction, firstNodeRef) { // Check the multi action execution status
    	    	if (jsonResult.actionstatus === "OK") {
    	    		multiActionCallbackFn(remoteAction, firstNodeRef);
    	    	} else {
    	    		Imaging.utils.errorBox("Action failed", jsonResult.errormessage);
    	    	}
    	    },
    	    remoteAction = $action.attr("id").substring(4),
    		nodeRefs = [],
    		getData;
	
        $(":checkbox[name='rows']:checked").each(function() {
        	nodeRefs.push($(this).val());
        });
        
        if (nodeRefs.length === 0) {
        	Imaging.utils.warningBox("Selection error", "Please select at least one document !");
        } else {
        	if (remoteAction === "indexform") {
        		multiActionCallbackFn(remoteAction);
        	} else {
        		getData = { noderefs: nodeRefs, action: remoteAction, method: "POST" };
        		Imaging.ajax.getJsonDisable(WS_URLS.multiAction, getData, function(jsonResult) { checkActionResultFn(jsonResult, remoteAction, nodeRefs[0]); });
        	}
        }
	},
	openImport: function($link) {
		var inBrowserFormats = ["png","gif","jpg","jpeg","txt","htm","html","bmp","js"];
		var openedInBrowser = inBrowserFormats.some(function(entry) {
			return $link.attr("href").endsWith("." + entry);
		});
		if (openedInBrowser) {
			window.open($link.attr("href"),"_blank");
		} else {
    		if (Imaging.utils.getURLPage() === "page-document") {
				window.opener.location.href=$link.attr("href");
			} else {
				Imaging.utils.goTo($link.attr("href"));
			}
		}
	},
	editImport: function($link, nodeRef) {
		var editFunction = function() {
			Imaging.editOnline.onActionEditOnline($link);
		};
		Imaging.utils.runWithWorkitemPermission(nodeRef, editFunction)
	},
	viewerForImport: function($link) {
		Imaging.utils.newWindow("page-viewer?nodeRef=" + $link.attr("data-noderef"));
	},
	deleteImport: function($link, nodeRef) {
		var	importname = $link.nextAll("div.importname").eq(0).text(),
    		refreshRow = function() {
				Imaging.boxes.refreshImportsAndNotes(nodeRef);
    		},
			deleteImport = function() {
				Imaging.ajax.ajaxDelete("../../../proxy/alfresco/api/node/workspace/SpacesStore/" + $link.attr("id").substring(4), refreshRow);
			},
			checkYesNoDeleteImport = function(value) {
				if (value === "Y") {
					$link.unbind("click"); //Avoid the user click multiple times on the delete button.
					Imaging.utils.runWithWorkitemPermission(nodeRef, deleteImport);
				}
				$(".web-preview").css("visibility","visible");
			};
	
		Imaging.utils.yesnoBox("Delete import", "Are you sure to delete '" + importname + "' import file ?", checkYesNoDeleteImport);
	},
	menuActionClick: function($link) {
		
		var $linkElem = $link.find("a"),
			actionName = $linkElem.attr("href").substring(1),
			nodeRef,
			acturl,
			acturltarget;
			
		$link.closest(".action-menu").hide();
		
		if ($link.closest("tr").length > 0) {
			nodeRef = $link.closest("tr").attr("id");
		} else {
			nodeRef = Imaging.utils.getURLParameter("nodeRef");
		}
		if ($linkElem.attr("data-act-type") === "url") {
			// ACTION OF TYPE "URL" : just redirect
			acturl = $linkElem.attr("data-act-url").replace("{nodeRef}", nodeRef);
			acturltarget = $linkElem.attr("data-act-url-target");
			if (acturltarget === "_blank") {
				
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
						
						winRef = Imaging.utils.newWindow(acturl);
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
					
					Imaging.utils.newWindow(acturl);
				}
				
			} else {
				Imaging.utils.goTo(acturl);
			}
		} else if ($linkElem.attr("data-act-type") === "javascript") {
			// ACTION OF TYPE "JAVASCRIPT" : call the callback function
			Imaging.callbackMgr().executeCallback(actionName, nodeRef);
		}
	}
};