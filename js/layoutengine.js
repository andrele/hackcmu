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

	// System status information
	var statusMessages = 
	{
		"whitebalance" : "Checking for stability of camera whitebalance...",
		"detecting" : "Detecting face...",
		"hints" : "Hmm. Detecting the face is taking a long time...",
		"redetecting" : "Still there? Redetecting...",
		"lost" : "Are you still there? [F10] to redetect...",
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
	var toast = '';
	document.addEventListener("headtrackrStatus", function(event)
	{
		if (event.status in supportMessages)
			toast = new Android_Toast({content: supportMessages[event.status]});
	 	else if ((event.status === "redetecting") || (event.status === "lost"))
	 	{
	 		onFullMode();
	 		toast = new Android_Toast({content: statusMessages[event.status]});
	 	}
	 	else if (event.status === "detecting")
	 	{
	 		onBrowseMode();
	 		toast = new Android_Toast({content: statusMessages[event.status]});
	 	}
	}, true);
			
	//Listen for headtracker position change events		
	document.addEventListener("headtrackingEvent", function(event)
	{
		if (event.z < 60)
		{
			onDetailMode();
			//console.log("Near Reading"); // (" + event.z + "cm)";
		}	
		else if (event.z > 100)
		{
			onFullMode();
			//console.log("Far Reading"); // (" + event.z + "cm)";
		}	
		else
		{
			onBrowseMode();
			//console.log("Medium Reading"); // (" + event.z + "cm)";
		}
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
