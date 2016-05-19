// Site.backgroundvideo.js

// Check if base namespace is defined so it isn't overwritten
var Site = Site || {};

// Create child namespace
Site.backgroundvideo = (function ($) { 
	"use strict";
	
  ///////////////
  // Variables //
  ///////////////
  
	var backgroundvideoSel = '[data-plugin="backgroundvideo"]',	
		bgvWrap = '[data-plugin="backgroundvideo"] #big-video-wrap',
		nextElement = '.st_Panel--process',
		
  //////////////////
  // Constructors //
  //////////////////
  
   		BgVideo = function(elem) {
		   	var $thisBgVideo = $(elem),	  
		    BV = new $.BigVideo({useFlashForFirefox:false, container: $(elem), doLoop: true}),
			activateVideo = function () {
	   		var webmUrl = $(backgroundvideoSel).data('webm-url');
	   		var mp4Url = $(backgroundvideoSel).data('mp4-url');
	   		
			BV.init();
		    BV.show([
		        { type: "video/mp4",  src: mp4Url },
		        { type: "video/webm", src: webmUrl }
		    ]);
		    BV.getPlayer().on('durationchange',function(){
			    $(bgvWrap).addClass('active');
			});
	   },
	   
	   pauseVideo = function () {
	   		BV.getPlayer().pause();
	   		$(bgvWrap).removeClass('active');
	   },
	   
	   playVideo = function () {
	   		BV.getPlayer().play();
	   		$(bgvWrap).addClass('active');
	   },
	   
	    checkStatus = function () {
	    	if($(nextElement).length > 0) {
				if($(window).scrollTop() > $(window).height() - 100) {
					$.publish('backgroundvideo/pause');
				} else {
					$.publish('backgroundvideo/play');
				}
			}
	   },

      
      subscribeToEvents = function () {
		 $.subscribe('backgroundvideo/pause', function () { pauseVideo(); });
		 $.subscribe('backgroundvideo/play', function () { playVideo(); });
		 $.subscribe('page/scroll', function () { checkStatus(); });

      };
      
      /**
       * Initialise this object
       * @function
       */
      this.init = function () {
      	activateVideo();
      	subscribeToEvents();
      };
	  
	  
  },
	    
  ///////////////
  // Functions //
  ///////////////
    

    init = function () {
      Site.utils.cl("Site.backgroundvideo initialised");

      $(backgroundvideoSel).each(function() {
        var thisBgVideo= new BgVideo(this);
        thisBgVideo.init();
      });
    };

	///////////////////////
  // Return Public API //
  ///////////////////////
  
 return {
		init: init
	};

}(jQuery));
