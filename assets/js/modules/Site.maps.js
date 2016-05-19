// Site.map.js

// Check if base namespace is defined so it isn't overwritten
var Site = Site || {};

// Create child namespace
Site.maps = (function ($) {
    "use strict";

  ///////////////
  // Variables //
  ///////////////

    var

        // Marker Map Selectors
        selMarkerMap = "[data-marker-map=component]",
        selMap = "[data-map=image]",
        selMarker = "[data-map=marker]",


  //////////////////
  // Constructors //
  //////////////////



        /**
         * Creates an MarkerMap object
         * @constructor
         */
        MarkerMap = function (elem) {

          var $thisMarkerMap = $(elem),
              $mapContainer = $thisMarkerMap.find('.in').eq(0),
              $mapImage = $thisMarkerMap.find(selMap).eq(0),
              $mapMarker = $thisMarkerMap.find(selMarker).eq(0),
              origWidth = $mapImage.attr('width'),
              origHeight = $mapImage.attr('height'),
              origMarkerX = $mapMarker.data('coordx'),
              origMarkerY = $mapMarker.data('coordy'),

          /**
           * Position the map marker relative to the current size of the map
           * and then centre the marker if the map is in a scrollable container
           * @function
           */
          positionMarker = function () {
            var
                // We need to calculate an offset so the bottom center
                // of the marker sits over the coordinates
                markerOffsetX = $mapMarker.width() / 2,
                markerOffsetY = $mapMarker.height(),
                // Get current dimensions of the map image
                mapWidth = $mapImage.width(),
                mapHeight = $mapImage.height(),
                // Calculate the scale multiplier we'll use to calculate
                // the updated coordinates for the marker
                multiplier = mapWidth / origWidth,
                // Calculate the new marker coordinates
                calcX = (origMarkerX * multiplier) - markerOffsetX,
                calcY = (origMarkerY * multiplier) - markerOffsetY;

                // Add/Update 'top' and 'left' inline CSS to position the marker
                $mapMarker.css('top',calcY).css('left',calcX);

                // Centre Scrollable Map on Marker

                // If map container has a vertical scrollbar, centre the map vertically on the marker
                if ($mapContainer[0].scrollHeight > $mapContainer.height()) {
                  // Set the vertical scroll position:
                  // Scrolling to the position of the marker, minus half the height of the container
                  // centres the marker vertically
                  $mapContainer.scrollTop(( (origMarkerY * multiplier) - ($mapContainer.height() / 2) ));
                }
                // If map container has a horizontally scrollbar, centre the map horizontally on the marker
                if ($mapContainer[0].scrollWidth > $mapContainer.width()) {
                  // Set the horizontal scroll position:
                  // Scrolling to the position of the marker, minus half the width of the container
                  // centres the marker horizontally
                  $mapContainer.scrollLeft(( calcX - ($mapContainer.width() / 2) ));
                }
          },

          /**
           * Bind custom message events for this object
           * @function
           */
          bindCustomMessageEvents = function () {
            $thisMarkerMap.on('positionMarker', function (e) {
                e.preventDefault();

                positionMarker();
              });
          },

          /**
           * Subscribe object to Global Messages
           * @function
           */
          subscribeToEvents = function () {
            $.subscribe('page/resize', function () {$(this).trigger('positionMarker');},$thisMarkerMap);
          };

          /**
           * Initialise this object
           * @function
           */
          this.init = function () {
            bindCustomMessageEvents();
            subscribeToEvents();

            positionMarker();
            $thisMarkerMap.addClass('mapActive');
          };
        },

  ///////////////
  // Functions //
  ///////////////

        /**
         * Create delegate event listeners for this module
         * @function
         */
        delegateEvents = function () {
          //Site.events.delegate('click', sel, 'toggleMainNav');

        },

        /**
         * init function for this module
         * @function
         */
        init = function () {
          Site.utils.cl("Site.map initialised");

          // Initialise Objects objects based on DOM objects
          $(selMarkerMap).each(function () {
            var thisMarkerMap = new MarkerMap(this);
            thisMarkerMap.init();
          });

          // Add delegate event listeners for this module
          //delegateEvents();
        };

  ///////////////////////
  // Return Public API //
  ///////////////////////

    return {
      init: init
    };

}(jQuery));