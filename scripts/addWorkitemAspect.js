//doc2 var doc = utils.getNodeFromString("workspace://SpacesStore/5e9d4c72-742f-477c-890d-bac08c5acf6e") ;
//doc3 var doc = utils.getNodeFromString("workspace://SpacesStore/eac4834a-5942-4626-a074-141cb4415896") ;
//doc3 WorkinCopy var doc = utils.getNodeFromString("workspace://SpacesStore/b807c7e3-a83e-4609-9757-ba2ba0342191") ;
//doc1 var doc = utils.getNodeFromString("workspace://SpacesStore/918d4fe3-285c-4436-a85e-0c7e9920f88a") ;
//doc4 var doc = utils.getNodeFromString("workspace://SpacesStore/4a490001-d992-4bf7-8645-3c8d165ef05d") ;
//doc5 var doc = utils.getNodeFromString("workspace://SpacesStore/c66c2ef1-9bcd-4305-8d53-fef4240bc897") ;
//doc6 var doc = utils.getNodeFromString("workspace://SpacesStore/976a0ba3-ee0b-4a95-a8f4-d583be7c78cf") ;

if(doc.hasAspect("fds:workitem") == false) {
	logger.log("Add Aspect fds:workitem");
	doc.addAspect("fds:workitem");
	doc.properties["fds:itemEntryTime"] = new Date();
	doc.save();
}