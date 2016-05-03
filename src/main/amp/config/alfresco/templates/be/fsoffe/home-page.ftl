<html>
<head>
<script type="text/javascript" src="${page.url.context}/res/imaging/external/jquery/jquery.js"></script>
<script type="text/javascript" src="${page.url.context}/res/imaging/js/imaging/imaging-all-min.js"></script>
<script type="text/javascript">
$(document).ready(function() {
	var redirectUser = function(jsonResult) {
			if (jsonResult.prefValue === "dashboard") {
				window.location.href="${page.url.context}/page/site/imaging/page-dashboard";
			} else if (jsonResult.prefValue === "inbox") {
				window.location.href="${page.url.context}/page/site/imaging/page-boxes?box=inbox";
			} else {
				window.location.href="${page.url.context}/page/site/imaging/page-boxes";
			}
		},
		getData = { prefName: "landingpage" };
	
	Imaging.ajax.getJson("../proxy/alfresco/imaging/user/userpref", getData, redirectUser);
});
</script>
</head>
<body></body>
</html>