function onFullMode(){
	document.getElementById('body').className = "full";
	$(".heading").removeClass("col-md-4");
	$(".video").removeClass("col-md-8");
	$(".shortText").removeClass("col-md-12");
}

function onBrowseMode(){
	document.getElementById('body').className = "browse";
	$(".heading").addClass("col-md-4");
	$(".video").addClass("col-md-8");
	$(".shortText").addClass("col-md-4");
}

function onDetailMode(){
	document.getElementById('body').className = "detail";

}