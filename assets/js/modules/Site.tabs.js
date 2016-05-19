// Site.tabs.js

// Check if base namespace is defined so it isn't overwritten
var Site = Site || {};

// Create child namespace
Site.tabs = (function ($) {
    "use strict";

  ///////////////
  // Variables //
  ///////////////

    var tabContainerSel = '[data-tabs=plugin]',
        tabPanelSel = '[data-tabs=panel]',
        tabControlSel = '[data-tabs=control]',
        tabControlCurrentSel = '.current[data-tabs=control]',

        tabGlobalControlSel = '[data-tabs=plugin] [data-tabs=control]',
        tabGlobalControlInnerSel = '[data-tabs=plugin] [data-tabs=control]',

        // Template contains show/hide data attributes
        tabControlsContainerTemplate = '<div class="cp_TabControls" data-tabs="controls"><a class="tabAdvance--prev tabAdvance" href="#" data-tab-advance="p">Prev</a><a class="tabAdvance--next tabAdvance" href="#" data-tab-advance="n">Next</a><div class="tabs"></div></div>',
        tabControlTemplate = '<a href="#" class="tabLink" data-tabs="control"></a>',

        tabAdvanceSel = "[data-tab-advance]",


  //////////////////
  // Constructors //
  //////////////////


        TabbedContent = function (elem) {
          var $thisTabbedContent = $(elem),
              $tabPanels = $thisTabbedContent.find(tabPanelSel),
              $tabControls = $(tabControlsContainerTemplate),

          /**
           * Setup tabbed content and controls
           * @function
           */
          setupTabs = function () {

            $tabPanels.each(function () {
              var thisTitle = $(this).data('title'),
                  $tabControl = $(tabControlTemplate);

              $tabControl.text(thisTitle);
              $('.tabs',$tabControls).append($tabControl);
            });

            $($thisTabbedContent).prepend($tabControls);

            $thisTabbedContent.addClass('tabbed');
            $tabPanels.eq(0).addClass('current');
            $('.tabLink:first-child', $tabControls).addClass('current');

          },


          /**
           * Change active tab and panel of content
           * @function
           * @parameter tab - object
           */
          updateCurrentTab = function (tab) {
            var $tabTarget = $(tab),
                $actualTab, indexOfClickedTab;

            if($(tab).hasClass('inner')){
              $actualTab = $tabTarget.parent();
            } else {
              $actualTab = $tabTarget
            }

            indexOfClickedTab = $actualTab.index();

            $('.current', $tabControls).removeClass('current');
            $tabPanels.removeClass('current');

            $actualTab.addClass('current');
            $tabPanels.eq(indexOfClickedTab).addClass('current');
          },


          /**
           * Advance to the next/previous tab
           * @function
           * @parameter direction - string
           */
          advanceTabs = function (direction) {
            var thisDirection = direction,
                numOfTabs = $thisTabbedContent.find('.tabLink').length,
                currentPos = $thisTabbedContent.find('.tabLink.current').eq(0).index();

              // Set next slide based on direction
              if (direction === 'n'){

                if((currentPos+1) < numOfTabs){
                  $thisTabbedContent.find('.tabLink.current').eq(0).next().click();
                } else {
                  $thisTabbedContent.find('.tabLink:first-child').click();
                }

              } else if (direction === 'p') {

                if(currentPos > 0){
                  $thisTabbedContent.find('.tabLink.current').eq(0).prev().click();
                } else {
                  $thisTabbedContent.find('.tabLink:last-child').eq(0).click();
                }
              }
          },

          /**
           * Bind custom message events for this object
           * @function
           */
          bindCustomMessageEvents = function () {
            $thisTabbedContent.on('updatestate', function (e) {
               e.preventDefault();
               updateCurrentTab(e.target);
            });


            $thisTabbedContent.on('advanceTabs', function (e) {
              e.preventDefault();

              if($(e.target).attr('data-tab-advance') !== undefined) {
                advanceTabs($(e.target).attr('data-tab-advance'));
              }
            });
          },

          /**
           * Subscribe object to Global Messages
           * @function
           */
          subscribeToEvents = function () {

          };

          /**
           * Initialise this object
           * @function
           */
          this.init = function () {
            bindCustomMessageEvents();
            subscribeToEvents();
            setupTabs();
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
          Site.events.delegate('click', tabGlobalControlSel, 'updatestate');
          Site.events.delegate('click', tabAdvanceSel, 'advanceTabs');;
        },

        init = function () {
          Site.utils.cl("Site.tabs initialised");
          //initialiseTabbedPanels();
          delegateEvents();

          $(tabContainerSel).each(function() {
            var thisTabbedContent= new TabbedContent(this);
            thisTabbedContent.init();
          })
        };

  ///////////////////////
  // Return Public API //
  ///////////////////////

    return {
      init: init
    };

}(jQuery));
