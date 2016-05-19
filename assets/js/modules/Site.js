// Site namespace
//
// Base namespace for the Site framework
var Site = Site || {};

// Base init function that calls itself and then initialises the modules
Site.init = (function ($) {
    "use strict";

  ///////////////
  // Polyfills //
  ///////////////

  ////////////////////////
  // Initialise Modules //
  ////////////////////////

    // Modules object
    var Modules = {};

    /**
     * Initialise the modules used in this project
     * @function
     */
    Modules.init = function () {
      $(document).ready(function () {
        Site.utils.init();
        Site.events.init();
        Site.analytics.init();
        Site.layout.init();
        Site.navigation.init();
        Site.images.init();
        Site.loading.init();


        // ScrollMagic prototyping
        $(function () { // wait for document ready
      		// init
      		var controller = new ScrollMagic.Controller(),

      		// define movement of panels
      		wipeAnimation = new TimelineMax()
      			//.fromTo("#slide2", 0.5, {y: "100%", opacity:0}, {y: "0%",opacity:1, delay: 0.1, ease: Power1.easeOut})
            .fromTo("#slide2", 0.5, {y: "100%"}, {y: "0%",delay: 0.1, ease: Linear.easeNone})
      			.fromTo("#slide3", 0.5, {y: "100%"}, {y: "0%",delay: 0.4, ease: Linear.easeNone})
      			.fromTo("#slide4", 0.5, {y: "100%"}, {y: "0%",delay: 0.4, ease: Linear.easeNone});

      		// create scene for Homepage Sticky Scroller
          if($('#stickyCarousel').length > 0) {
        		var scrollerScene = new ScrollMagic.Scene({
        				triggerElement: "#stickyCarousel",
        				triggerHook: "onLeave",
        				duration: "400%"
        			})
        			.setPin("#stickyCarousel")
        			.setTween(wipeAnimation)
        			//.addIndicators() // add indicators (requires plugin)
        			.addTo(controller);
          }

          // create scene for About page animated panel
          if($('#protoAnimatedPanel').length > 0) {
            var panelScene = new ScrollMagic.Scene({
              triggerElement: "#protoAnimatedPanel",
              triggerHook: "onLeave",
              duration: "100%"
            })
            .setPin('#protoAnimatedPanel')
            //.addIndicators() // add indicators (requires plugin)
            .addTo(controller);
          }

      	});

      });
    };

    // Automatically call Modules.init function
    return Modules.init();

}(jQuery));
