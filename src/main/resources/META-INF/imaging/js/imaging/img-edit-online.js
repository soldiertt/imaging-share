Imaging.editOnline = {
	
	onlineEditMimetypes:  {
	     "application/msword": "Word.Document",
	     "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word.Document",
	     "application/vnd.ms-word.document.macroenabled.12": "Word.Document",
	     "application/vnd.openxmlformats-officedocument.wordprocessingml.template": "Word.Document",
	     "application/vnd.ms-word.template.macroenabled.12": "Word.Document",
	
	     "application/vnd.ms-powerpoint": "PowerPoint.Slide",
	     "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PowerPoint.Slide",
	     "application/vnd.ms-powerpoint.presentation.macroenabled.12": "PowerPoint.Slide",
	     "application/vnd.openxmlformats-officedocument.presentationml.slideshow": "PowerPoint.Slide",
	     "application/vnd.ms-powerpoint.slideshow.macroenabled.12": "PowerPoint.Slide",
	     "application/vnd.openxmlformats-officedocument.presentationml.template": "PowerPoint.Slide",
	     "application/vnd.ms-powerpoint.template.macroenabled.12": "PowerPoint.Slide",
	     "application/vnd.ms-powerpoint.addin.macroenabled.12": "PowerPoint.Slide",
	     "application/vnd.openxmlformats-officedocument.presentationml.slide": "PowerPoint.Slide",
	     "application/vnd.ms-powerpoint.slide.macroEnabled.12": "PowerPoint.Slide",
	
	     "application/vnd.ms-excel": "Excel.Sheet",
	     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel.Sheet",
	     "application/vnd.openxmlformats-officedocument.spreadsheetml.template": "Excel.Sheet",
	     "application/vnd.ms-excel.sheet.macroenabled.12": "Excel.Sheet",
	     "application/vnd.ms-excel.template.macroenabled.12": "Excel.Sheet",
	     "application/vnd.ms-excel.addin.macroenabled.12": "Excel.Sheet",
	     "application/vnd.ms-excel.sheet.binary.macroenabled.12": "Excel.Sheet",
	     "application/vnd.visio": "Visio.Drawing"
	},
	onActionEditOnline: function ($link) {
		var mimetype = $link.attr("data-mimetype"),
			docname = $link.attr("data-docname"),
			docpath = $link.attr("data-docpath"),
			fileExt = Imaging.utils.getFileExtension(docname);
		var onlineEditUrl = "http://" + imagingProps.vtihost + ":" + imagingProps.vtiport + "/alfresco" + docpath.substr(docpath.indexOf("/imaging/")) + "/" + docname;
        Imaging.editOnline.actionEditOnlineInternal(onlineEditUrl, mimetype, fileExt);
    },

    actionEditOnlineInternal: function (onlineEditUrl, mimetype, fileExt) {
       if (Imaging.editOnline._launchOnlineEditor(onlineEditUrl, mimetype, fileExt)) {
          //OK
       } else {
          //NOT OK
       }
    },

    _launchOnlineEditor: function (onlineEditUrl, mimetype, fileExt)
    {
       var controlProgID = "SharePoint.OpenDocuments",
          appProgID = null,
          activeXControl = null,
          extensionMap =
          {
             doc: "application/msword",
             docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
             docm: "application/vnd.ms-word.document.macroenabled.12",
             dotx: "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
             dotm: "application/vnd.ms-word.template.macroenabled.12",

             ppt: "application/vnd.ms-powerpoint",
             pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
             pptm: "application/vnd.ms-powerpoint.presentation.macroenabled.12",
             ppsx: "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
             ppsm: "application/vnd.ms-powerpoint.slideshow.macroenabled.12",
             potx: "application/vnd.openxmlformats-officedocument.presentationml.template",
             potm: "application/vnd.ms-powerpoint.template.macroenabled.12",
             ppam: "application/vnd.ms-powerpoint.addin.macroenabled.12",
             sldx: "application/vnd.openxmlformats-officedocument.presentationml.slide",
             sldm: "application/vnd.ms-powerpoint.slide.macroEnabled.12",

             xls: "application/vnd.ms-excel",
             xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
             xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
             xlsm: "application/vnd.ms-excel.sheet.macroenabled.12",
             xltm: "application/vnd.ms-excel.template.macroenabled.12",
             xlam: "application/vnd.ms-excel.addin.macroenabled.12",
             xlsb: "application/vnd.ms-excel.sheet.binary.macroenabled.12"
          };

       // Try to resolve the record to an application ProgID; by mimetype first, then file extension.
       if (Imaging.editOnline.onlineEditMimetypes.hasOwnProperty(mimetype)) {
          appProgID = this.onlineEditMimetypes[mimetype];
       } else {
          if (fileExt !== null) {
        	  fileExt = fileExt.toLowerCase();
             if (extensionMap.hasOwnProperty(fileExt)) {
                mimetype = extensionMap[fileExt];
                if (Imaging.editOnline.onlineEditMimetypes.hasOwnProperty(mimetype)) {
                   appProgID = Imaging.editOnline.onlineEditMimetypes[mimetype];
                }
             }
          }
       }

       if (appProgID !== null) {

          if (Imaging.utils.isBrowserIE()) {
             return Imaging.editOnline._launchOnlineEditorIE(controlProgID, appProgID, onlineEditUrl);
          }

          if (Imaging.utils.isBrowserChrome()) {
             if (null !== fileExt) {
                var protocolHandler = Imaging.editOnline.getProtocolForFileExtension(fileExt.toLowerCase());
                return Imaging.editOnline._launchOnlineEditorChrome(protocolHandler, onlineEditUrl);
             }
          }

          return false;
       }
    },

    _launchOnlineEditorChrome: function(protocolHandler, url)
    {
        var protocolUrl = protocolHandler + ':ofe%7Cu%7C' + url;
        var protocolHandlerPresent = false;

        var input = document.createElement('input');
        var inputTop = document.body.scrollTop + 10;
        input.setAttribute('style', 'z-index: 1000; background-color: rgba(0, 0, 0, 0); border: none; outline: none; position: absolute; left: 10px; top: '+inputTop+'px;');
        document.getElementsByTagName("body")[0].appendChild(input);
        input.focus();
        input.onblur = function() {
            protocolHandlerPresent = true;
        };
        location.href = protocolUrl;
        setTimeout(function()
        {
            input.onblur = null;
            input.remove();
            if(!protocolHandlerPresent)
            {
                //Manage error
            }
        }, 500);
    },

    getProtocolForFileExtension: function(fileExtension) {
       var msProtocolNames =  {
          'doc'  : 'ms-word',
          'docx' : 'ms-word',
          'docm' : 'ms-word',
          'dot'  : 'ms-word',
          'dotx' : 'ms-word',
          'dotm' : 'ms-word',
          'xls'  : 'ms-excel',
          'xlsx' : 'ms-excel',
          'xlsb' : 'ms-excel',
          'xlsm' : 'ms-excel',
          'xlt'  : 'ms-excel',
          'xltx' : 'ms-excel',
          'xltm' : 'ms-excel',
          'xlsm' : 'ms-excel',
          'ppt'  : 'ms-powerpoint',
          'pptx' : 'ms-powerpoint',
          'pot'  : 'ms-powerpoint',
          'potx' : 'ms-powerpoint',
          'potm' : 'ms-powerpoint',
          'pptm' : 'ms-powerpoint',
          'potm' : 'ms-powerpoint',
          'pps'  : 'ms-powerpoint',
          'ppsx' : 'ms-powerpoint',
          'ppam' : 'ms-powerpoint',
          'ppsm' : 'ms-powerpoint',
          'sldx' : 'ms-powerpoint',
          'sldm' : 'ms-powerpoint',
       };
       return msProtocolNames[fileExtension];
    },

    _launchOnlineEditorIE: function (controlProgID, appProgID, onlineEditUrl) {
       // Try each version of the SharePoint control in turn, newest first
       try  {
          if (appProgID === "Visio.Drawing")
             throw ("Visio should be invoked using activeXControl.EditDocument2.");
          activeXControl = new ActiveXObject(controlProgID + ".3");
          return activeXControl.EditDocument3(window, onlineEditUrl, true, appProgID);
       } catch(e) {
          try {
             activeXControl = new ActiveXObject(controlProgID + ".2");
             return activeXControl.EditDocument2(window, onlineEditUrl, appProgID);
          } catch(e1) {
             try {
                activeXControl = new ActiveXObject(controlProgID + ".1");
                return activeXControl.EditDocument(onlineEditUrl, appProgID);
             } catch(e2) {
                // Do nothing
             }
          }
       }
       return false;
    }
}