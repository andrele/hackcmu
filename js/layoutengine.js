//Function to import external javascript files
function require(jsFilePath) {
    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = jsFilePath;
    document.body.appendChild(js);
}

function headTracker()
{
	currentState = 0;
	previousValue = 0;
	seedValue = 75;
	initialSeed = false;

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
	document.addEventListener("headtrackrStatus", function(event)
	{
		if (event.status in supportMessages)
	 		console.log(supportMessages[event.status]);
	 	else if ((event.status === "redetecting") || (event.status === "lost") && currentState != 1)
	 	{
	 		onFullMode();
	 	}
	 	else if (event.status === "detecting")
	 	{
			onBrowseMode();
		}

	}, true);

	$("body").keypress( function(e) {
		if (e.keyCode == 32){
			facetracker.stop();
			facetracker.start();
			console.log("restarting facetracker");
		}	
	});
			
	//Listen for headtracker position change events		
	document.addEventListener("headtrackingEvent", function(event)
	{
		var deadZone = 10;

		if (!initialSeed)
		{
			seedValue = event.z;
			initialSeed = true;
		}

		if (event.z < 0)
		{
			facetracker.stop();
			facetracker.start();
		}
		if (event.z < seedValue - deadZone && currentState != 3)
		{
			onDetailMode();
			//console.log("Near Reading"); // (" + event.z + "cm)";
		}	 
		else if (event.z >= seedValue + deadZone && event.z <= seedValue + 50 - deadZone && currentState != 2)
		{
			userLocation = "Medium";
				onBrowseMode();
			//console.log("Medium Reading"); // (" + event.z + "cm)";
		} else if (event.z > seedValue + 50 + deadZone  && currentState != 1)
		{
			onFullMode();
			//console.log("Far Reading"); // (" + event.z + "cm)";
		}	

		console.log("Current position: " + event.z);
		previousValue = event.z;	
	});
	
	
}
			
function onFullMode(){
	document.getElementById('body').className = "full";
	$(".heading").removeClass("col-md-4");
	$(".video").removeClass("col-md-8");
	currentState = 1;
	window.scrollTo(0, 0);
	document.getElementById('video1').play();

}

function onBrowseMode(){
	document.getElementById('body').className = "browse";
	$(".heading").addClass("col-md-4 clearLeftCol");
	$(".video").addClass("col-md-8 clearRightCol");
	currentState = 2;
	window.scrollTo(0, 0);
	document.getElementById('video1').play();

}

function onDetailMode(){
	document.getElementById('body').className = "detail";
	$(".heading").addClass("col-md-4");
	currentState = 3;
	window.scrollTo(0, 0);
	document.getElementById('video1').pause();
}

function nextArticle(){
	document.querySelector('.activeArticle').removeClass("activeArticle")
}

//Load headtracker code on startup
window.onload = headTracker;
