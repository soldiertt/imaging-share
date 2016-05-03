<#escape x as jsonUtils.encodeJSONString(x)>
{
   "username": "${username!''}",
   "bylettertype": "${bylettertype!''}",
   "dateRangeStart": "${dateRangeStart!''}",
   "dateRangeEnd": "${dateRangeEnd!''}",
   "documents" : [
	<#list myactivities.documents as doc>
		{
			"doctype":"${doc.doctype}",
			<#if bylettertype == "true">
			"lettertype":"${doc.lettertype}",
			</#if>
			"count":"${doc.count}"
		}
		<#if doc_has_next> , </#if>
	</#list>
	]
}
</#escape>