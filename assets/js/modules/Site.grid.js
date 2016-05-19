// Site.grid.js

// Check if base namespace is defined so it isn't overwritten
var Site = Site || {};

// Create child namespace
Site.grid = (function ($) {
  "use strict";

  ///////////////
  // Variables //
  ///////////////

  var defaults = {},
      // Selectors for Show-Hide Grid
      shGridSel = "[data-shgrid=plugin]",
      shGridCellSel = "[data-shgrid=cell]",
      shGridHeadlineSel = "[data-shgrid=plugin] [data-shgrid=cell] [data-shgrid=headline]",
      shGridContentSel = '[data-shgrid=content]',
      shGridDetailsWindowTemplate = '<div class="cp_StoryContent" data-shgrid="window"><div class="in"></div></div>',
      shGridCloseButtonTemplate = '<a class="close" data-shgrid="close"></a>',
      shGridDetailsWindowSel = '[data-shgrid=window]',
      shGridDetailsCloseSel = "[data-shgrid=window] [data-shgrid=close]",
      transitionTime = 200,

      // Selectors for grid layout
      gdFlexCellSel = '.gdFlexCell .in',
      gdSingleCellRatio = 375/640,
      gdDoubleCellRatio = 750/640,


  //////////////////
  // Constructors //
  //////////////////

      /**
       * Creates a ShowHideGrid object to manage a show/hide grid widget
       * @constructor
       */
      ShowHideGrid = function (elem) {

        var $thisGrid = $(elem),
            $gridCells = $thisGrid.find(shGridCellSel),
            $currentCell,

            /**
             * Calculate the number of grid cells in a row
             * @function
             * @param {object} cell
             * @returns {number} cellWidth
             */
            calculateCellsPerRow = function (cell) {
              var containerWidthPix = $thisGrid.width(),
                  cellWidthPix = $(cell).width(),
                  cellWidth = Math.round(containerWidthPix / cellWidthPix);
                  return cellWidth;
            },

            /**
             * Get position to insert Details component based on current staff member's position and the page layout
             * @function
             * @param {object} cell
             * @returns {number} indexOfCellToInsertAfter
             */
            getInsertPosition = function (cell) {
              var thisCell = cell,
                  cellPosition = parseInt($gridCells.index(thisCell) + 1),
                  cellsPerRow = calculateCellsPerRow(thisCell),
                  cellToInsertAfter = (Math.ceil(cellPosition / cellsPerRow)) * cellsPerRow,
                  indexOfCellToInsertAfter = cellToInsertAfter - 1;

                if(indexOfCellToInsertAfter >= $gridCells.length) {
                  indexOfCellToInsertAfter = $gridCells.length - 1;
                }
                return indexOfCellToInsertAfter;
            },

            /**
             * Takes URL with Anchor and returns anchor
             * @function
             * @param {string} anchorUrl
             * @returns {string} anchor
             */
            getAnchorFromAnchorUrl = function (anchorUrl) {
              var thisUrl = anchorUrl,
                  index = thisUrl.indexOf('#'),
                  hash, anchor;

              if (index > 0) {
                hash = thisUrl.substring(index + 1);
                anchor = hash;
              } else {
                anchor = "";
              }
              return anchor;
            },

            /**
             * If details pane is being displayed, reposition it in the correct
             * position for the current grid layout
             * @function
             */
            updateLayout = function () {
              var $currentWindow = $thisGrid.find(shGridDetailsWindowSel);

              if($currentWindow.length > 0) {

                // Place info window in correct position based on current cell
                $currentWindow.insertAfter($gridCells.eq(getInsertPosition($currentCell)));

              } else {
                //Site.utils.cl('no current window so no need to do anything');
              }
            },

            /**
             * Use an animated scroll to position at the top of the cell passed in
             * @function
             */
            repositionView = function (cell) {
              var cellTopPos = cell.offset().top,
                  scrollTop = $(window).scrollTop();

              if (cellTopPos < scrollTop || Site.layout.getResponsiveSize() === 'small') {
                $('html, body').animate({
                  scrollTop: cellTopPos
                }, transitionTime);
              }
            },

            /**
             * Get the scroll position to the top of the cell passed in - no animation
             * @function
             */
            setView = function (cell) {
              var cellTopPos = cell.offset().top,
                  scrollTop = $(window).scrollTop();

                $('html, body').scrollTop(cellTopPos);
            },


            /**
             * Toggle the visibility of a cell in the grid
             * @function
             */
            toggleItem = function (cellToToggle) {
              var $thisCell = cellToToggle,
                  $currentWindow = $thisGrid.find(shGridDetailsWindowSel),
                  newContent = $thisCell.find(shGridContentSel).clone(),
                  $newWindow = $(shGridDetailsWindowTemplate),
                  cellsPerRow = calculateCellsPerRow($thisCell);

              if($thisCell.hasClass('isCurrent')){

                $thisCell.removeClass('isCurrent');
                $thisGrid.removeClass('isActive');

                if(cellsPerRow > 1){
                  $currentWindow.slideUp(function() {
                    $(this).remove();
                  });
                } else {
                  $currentWindow.remove();
                }

                $currentCell = false;

              } else {
                $gridCells.filter('.isCurrent').removeClass('isCurrent');
                $thisCell.addClass('isCurrent');
                $thisGrid.addClass('isActive');

                $currentCell = $thisCell;

                // Check if there is already an info window on the page
                if($currentWindow.length > 0) {
                  var $cellBefore = $currentWindow.prev();

                  // If it is in the same position as the new one, leave it there
                  if($gridCells.index($cellBefore) === getInsertPosition($thisCell)){
                    // replace content with that of current cell
                    $currentWindow.find('.in').empty().append(newContent).append($(shGridCloseButtonTemplate));
                    repositionView($thisCell);
                  // Otherwise remove the old one and add the new one
                  } else {
                    if(cellsPerRow > 1){
                      $currentWindow.slideUp(transitionTime, function() {
                        $(this).remove();
                      });
                    } else {
                      $currentWindow.remove();
                    }

                    $newWindow.insertAfter($gridCells.eq(getInsertPosition($thisCell)));

                    $newWindow.find('.in').append(newContent).append($(shGridCloseButtonTemplate));

                    if(cellsPerRow > 1){
                      $newWindow.slideDown(transitionTime, function () {
                        repositionView($thisCell);
                      });
                    } else {
                      $newWindow.show();
                      repositionView($thisCell);
                    }

                  }
                } else {
                  $newWindow.insertAfter($gridCells.eq(getInsertPosition($thisCell)));
                  $newWindow.find('.in').append(newContent).append($(shGridCloseButtonTemplate));

                  if(cellsPerRow > 1){
                    $newWindow.slideDown(transitionTime, function () {
                      repositionView($thisCell);
                    });
                  } else {
                    $newWindow.show();
                    repositionView($thisCell);
                  }
                }


                // Custom page event to track opening of cell details
                var storyTitle = $thisCell.find('.story__details .heading--lando').text();
                Site.analytics.trackPageEvent('Stories Component','Show story',storyTitle);
              }
            },

            // If the URL has a query string, set the initial state of the grid based on it
            setInitialStateOfGrid = function () {
              var queryString  = Site.utils.getURLQueryString(),
                  personSelector;

              if (queryString.person) {
                personSelector = '#' + queryString.person;
                $(personSelector).trigger('toggle');

                var currUri = window.location.toString();

                if (currUri.indexOf("?") > 0) {
                  var cleanUri = currUri.substring(0, currUri.indexOf("?"));
                  if(window.history.replaceState){
                    window.history.replaceState({}, document.title, cleanUri);
                  }
                }
              }
            },

            // Get the initial position of the grid to the currently open cell
            setInitialPosition = function () {
              var $currentCell = $thisGrid.find('.isCurrent');

              if($currentCell.length === 1) {
                setView($currentCell);
              }
            },

            /**
             * Hide the extra content if it is currently visible
             * @function
             */
            closeShowHideGrid = function () {
              toggleItem($gridCells.filter('.isCurrent').eq(0));
            },

            // Bind custom events for this class
            bindCustomMessageEvents = function () {
              $thisGrid.on('toggle', function (e) {
                e.preventDefault();
                var $targetItem = $(e.target).closest(shGridCellSel);
                toggleItem($targetItem);
              });

              $thisGrid.on('updatelayout', function (e) {
                e.preventDefault();
                updateLayout();
              });

              $thisGrid.on('setposition', function (e) {
                e.preventDefault();
                setInitialPosition();
              });

              $thisGrid.on('close', function (e) {
                e.preventDefault();
                closeShowHideGrid();
              });

            },

            // Subscribe object to Global Messages
            subscribeToEvents = function () {
              $.subscribe('page/resize', function () {$(this).trigger('updatelayout');},$thisGrid);
              $.subscribe('page/loaded', function () {$(this).trigger('setposition');},$thisGrid);
            };

        this.init = function () {
          bindCustomMessageEvents();
          subscribeToEvents();
          setInitialStateOfGrid();
        };
      },


      /**
       * Creates a GridFlexCell object to manage a flexible grid cell
       * @constructor
       */
      GridFlexCell = function (elem) {
        var $thisCell = $(elem),
            cellWidth = $thisCell.width(),
            cellMinHeight,

            updateMinHeight = function () {
              cellWidth = $thisCell.outerWidth();
              cellMinHeight = cellWidth * gdSingleCellRatio;
              $thisCell.css('min-height',cellMinHeight);
            },

            // Bind custom events for this class
            bindCustomMessageEvents = function () {
              $thisCell.on('updatelayout', function (e) {
                e.preventDefault();
                updateMinHeight();
              });
            },

            // Subscribe object to Global Messages
            subscribeToEvents = function () {
              $.subscribe('debouncedresize', function () {$(this).trigger('updatelayout');},$thisCell);
            };

        this.init = function () {
          updateMinHeight();
          bindCustomMessageEvents();
          subscribeToEvents();
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
        Site.events.delegate('click', shGridHeadlineSel, 'toggle');
        Site.events.delegate('click', shGridDetailsCloseSel, 'close');
      },

      /**
       * Returns grid ratio for use by other modules
       */
      getSingleCellRatio = function () {
        return gdSingleCellRatio;
      },

      /**
       * Initialise this module
       * @function
       */
      init = function () {
        Site.utils.cl("Site.grid initialised");

        // Initialise Staff Rosters as instances of gridShowHide class
        $(shGridSel).each(function () {
          var thisShowHideGrid = new ShowHideGrid(this);
          thisShowHideGrid.init();
        });

        $(gdFlexCellSel).each(function() {
          var thisFlexCell = new GridFlexCell(this);
          thisFlexCell.init();
        });

        // Add delegate event listeners for this module
        delegateEvents();
      };

  ///////////////////////
  // Return Public API //
  ///////////////////////

  return {
    init: init,
    getSingleCellRatio: getSingleCellRatio
  };

}(jQuery));