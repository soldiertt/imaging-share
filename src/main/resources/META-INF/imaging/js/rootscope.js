// Production steps of ECMA-262, Edition 5, 15.4.4.17
// Reference: http://es5.github.io/#x15.4.4.17
// ONLY FOR IE8
if (!Array.prototype.some) {
  Array.prototype.some = function(fun /*, thisArg*/) {
    'use strict';

    if (this == null) {
      throw new TypeError('Array.prototype.some called on null or undefined');
    }

    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t && fun.call(thisArg, t[i], i, t)) {
        return true;
      }
    }

    return false;
  };
}

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var winOpened = [];

var WS_URLS = {
	docDetails:			"../../../proxy/alfresco/imaging/document/docdetails",
	systemInit: 		"../../../proxy/alfresco/imaging/utils/system",
	userPref:			"../../../proxy/alfresco/imaging/user/userpref",
	isInMyWI:			"../../../proxy/alfresco/imaging/utils/isinmyworkitem",
	hasWfAspect:		"../../../proxy/alfresco/imaging/utils/hasworkflowaspect",
	hasMyPersonalAspect:"../../../proxy/alfresco/imaging/utils/hasmypersonalaspect",
	usersOfBox:			"../../../proxy/alfresco/imaging/user/boxusers",
	stampAuditEvent:	"../../../proxy/alfresco/imaging/user/stampauditevent",
	docSave:			"../../../proxy/alfresco/imaging/action/savedocument",
	pbReadContext:		"../../../proxy/alfresco/imaging/pb/readcontext",
	pbIsLinkable:		"../../../proxy/alfresco/imaging/pb/islinkable",
	pbLinkImage:		"../../../proxy/alfresco/imaging/pb/linkimage",
	docAddComment: 		"../../../proxy/alfresco/api/node/{nodeRef}/comments",
	docEditRemoveComment: 	"../../../proxy/alfresco/api/comment/node/{nodeRef}",
	docListComments: 	"../../imaging/components/document/comments/list",
	docListImports: 	"../../imaging/components/document/listsubdocs",
	docMainPDFRef: 		"../../imaging/utils/document/maindocref",
	renderActions:		"../../imaging/action/renderdocactions",
	listBoxContent:		"../../imaging/components/boxes/listboxcontent",
	multiAction:		"../../imaging/action/multiaction",
	simpleAction:		"../../imaging/action/simpleaction",
	indexForm:			"../../imaging/components/workflow/indexform",
	indexFormMulti:		"../../imaging/components/workflow/indexformmulti",
	sendForm:			"../../imaging/components/workflow/sendform",
	configDashletMyactivities : "../../imaging/dashlet/myactivities/config",
	dashletMyactivities: "../../imaging/dashlet/myactivities"
};
