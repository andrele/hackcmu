//Function to import external javascript files
function require(jsFilePath) {
    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = jsFilePath;
    document.body.appendChild(js);
}

function headTracker()
{
	//require("js/headtrackr.js");
	var videoInput = document.getElementById('inputVideo');
	var canvasInput = document.getElementById('inputCanvas');
	var userLocation = "Medium";

	// System status information
	var statusMessages = 
	{
		"whitebalance" : "Checking for stability of camera whitebalance...",
		"detecting" : "Detecting face...",
		"hints" : "Hmm. Detecting the face is taking a long time...",
		"redetecting" : "Lost track of face. Redetecting...",
		"lost" : "Lost track of face",
		"found" : "Tracking face..."
	};
			
	//System error information
	var supportMessages =
	{
		"no getUserMedia" : "Unfortunately, <a href='http://dev.w3.org/2011/webrtc/editor/getusermedia.html'>getUserMedia</a> is not supported in your browser. Try <a href='http://www.opera.com/browser/'>downloading Opera 12</a> or <a href='http://caniuse.com/stream'>another browser that supports getUserMedia</a>. Now using fallback video for facedetection.",
		"no camera" : "No camera found. Reverting to fallback video..."
	};
			
	//Setup and initialize face tracking
	var facetracker = new headtrackr.Tracker({altVideo : {ogv : "./video/sampleogg.ogv", mp4 : "./video/samplemp4.mp4"}, ui: false});
	facetracker.init(videoInput, canvasInput);
	facetracker.start();
			
	//Listen for headtracker status events
	document.addEventListener("headtrackrStatus", function(event)
	{
		if (event.status in supportMessages)
	 		console.log(supportMessages[event.status]);
	 	else if (event.status === "redetecting")
	 	{
	 		userLocation = "Far";
	 		onFullMode();
	 		console.log(statusMessages[event.status]);
	 	}
	 	else if (event.status in statusMessages)
			console.log(statusMessages[event.status]);
	}, true);
			
	//Listen for headtracker position change events		
	document.addEventListener("headtrackingEvent", function(event)
	{
		if (event.z < 75)
		{
			userLocation = "Near";
			onDetailMode();
			//console.log("Near Reading"); // (" + event.z + "cm)";
		}	
		else if (event.z > 140)
		{
			userLocation = "Far";
			onFullMode();
			//console.log("Far Reading"); // (" + event.z + "cm)";
		}	
		else
		{
			userLocation = "Medium";
			onBrowseMode();
			//console.log("Medium Reading"); // (" + event.z + "cm)";
		}

		console.log("Current position: " + event.z);	
	
	});
	
	
}		
			
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
	$(".heading").removeClass("col-md-4 clearLeftCol");
	$(".heading").addClass("col-md-8 clearLeftCol");



}

//Load headtracker code on startup
window.onload = headTracker;
