
$('document').ready(function(){
	//alert("hello");
  $('video').get(0).play();
 // $('video').bind('ended', function(){
 //   $(this).next('video');
 // });
      $('video').bind('ended', function(){
      $(this).get(0).src="content/video/googleglass.mp4";
    });

  
});
