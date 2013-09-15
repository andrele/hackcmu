function onFullMode(){
	document.getElementById('body').className = "full";
	$(".heading").removeClass("col-md-4");
	$(".video").removeClass("col-md-8");
}

function onBrowseMode(){
	document.getElementById('body').className = "browse";
	$(".heading").addClass("col-md-4 clearLeftCol");
	$(".video").addClass("col-md-8 clearRightCol");
}

function onDetailMode(){
	document.getElementById('body').className = "detail";

}