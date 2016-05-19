// Site.namespace.js

// Check if base namespace is defined so it isn't overwritten
var Site = Site || {};

// Create child namespace
Site.forms = (function ($) {
    "use strict";


  ///////////////
  // Variables //
  ///////////////

    var selFileUploadField = "input[type=file]",

        selFormsToValidate = "form",

        selFormFieldWithPlaceholder = "input[placeholder], textarea[placeholder]",

  //////////////////
  // Constructors //
  //////////////////


        /**
         * Creates an FileUploadManager object to create a more customisable file upload form field
         * @constructor
         */
        FileUploadManager = function () {

          var overlayTemplate = '<span class="fileUpload">',

          /**
           * Add/Update File Upload Overlay container
           * @function
           */
          updateOverlay = function (data) {
            var $thisFileUploadInput = $(data.target),
                $fileOverlay = $thisFileUploadInput.prev(),
                fileName;

            Site.utils.cl($thisFileUploadInput);

            if ($fileOverlay.length > 0) {

            } else {
              $fileOverlay = $(overlayTemplate);
              $thisFileUploadInput.before($fileOverlay)
            }

            fileName = $thisFileUploadInput.val().split('\\').pop();

            $fileOverlay.text(fileName);

            setFormValidation();
          },

          /**
           * Bind custom message events for this object
           * @function
           */
          bindCustomMessageEvents = function () {
            /*
            $thisMainNav.on('', function (e) {
              e.preventDefault();
            });
            */
          },

          /**
           * Subscribe object to Global Messages
           * @function
           */
          subscribeToEvents = function () {
            $.subscribe('fileupload/change', function (topic,data) { updateOverlay(data); });
          };

          /**
           * Initialise this object
           * @function
           */
          this.init = function () {
            bindCustomMessageEvents();
            subscribeToEvents();
          };
        },

        /**
         * Creates an FormValidationManager object to manage validation of site forms
         * @constructor
         */
        FormValidationManager = function () {
          var

          /**
           * Add additional validation methods to the jQuery Validate object
           * @function
           */
          addValidationMethods = function () {

            // Add method to test for exact length of string input
            $.validator.addMethod("exactlength", function(value, element, param) {
             return this.optional(element) || value.length == param;
            });

            // Add method to validate for one complete field from a group of fields
            $.validator.addMethod("require_from_group", function(value, element, options) {
            	var validator = this,
            	    selector = options[1],
                  validOrNot = $(selector, element.form).filter(function() {
                    return validator.elementValue(this);
            	    }).length >= options[0];

            	if(!$(element).data('being_validated')) {
            		var fields = $(selector, element.form);
            		fields.data('being_validated', true);
            		fields.valid();
            		fields.data('being_validated', false);
            	}
            	return validOrNot;
            }, $.validator.format("Please choose at least one of these options"));

          },

          /**
           * Set default error messages for each supported language
           * @function
           */
          setDefaultErrorMessages = function () {

            $.extend($.validator.messages, {
              required: "Please complete this field. It is required.",
              remote: "Please fix this field.",
              email: "Please enter a valid email address.",
              url: "Please enter a valid URL.",
              date: "Please enter a valid date.",
              dateISO: "Please enter a valid date (ISO).",
              number: "Please enter a valid number.",
              digits: "Please enter only digits.",
              creditcard: "Please enter a valid credit card number.",
              equalTo: "Please enter the same value again.",
              accept: "Please enter a value with a valid extension.",
              maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
              minlength: jQuery.validator.format("Please enter at least {0} characters."),
              rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
              range: jQuery.validator.format("Please enter a value between {0} and {1}."),
              max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
              min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
            });

          },

          /**
           * Set up basic validation for all the forms on the page
           * @function
           */
          setBasicValidationOnPageForms = function () {

            if( $('form').length > 0 ){

              // General form validation
              $(selFormsToValidate).each(function () {
                $(this).validate({
//                   groups: {
//                     modelCheckboxes: "field_user_levels[gents] field_user_levels[long_hair] field_user_levels[cut] field_user_levels[colour]"
//                   },

                  rules: {
                    mail: {
                      required: true,
                      email: true
                    }
                  },

                  messages: {
                    mail:{
                      required: "Please enter your email so we can get in touch with you"
                    }
//                     ,
//                     "files[field_user_photograph]": {
//                       required: "We'd love to see what look you're currently rocking",
//                       accept: "Sorry, please pick an image"
//                     }
                  },

                  errorPlacement: function(error, element) {
                    if (element.is(':file')) {
                      error.appendTo( $(".form-type-managed-file") );
                    } else if (element.closest('.form-checkboxes').length > 0) {
                      error.appendTo( element.closest('.form-checkboxes'));
                    } else {
                      error.appendTo( element.parent());
                    }
                  }
                });
              });
            }
          },

          /**
           * Add basic validation to a new form
           * @function
           */
          addValidationToANewForm = function (formElement) {
            $(formElement).validate({});
          };

          /**
           * Bind custom message events for this object
           * @function
           */
//           bindCustomMessageEvents = function () {
//             /*
//             $thisMainNav.on('', function (e) {
//               e.preventDefault();
//             });
//             */
//           },
//
//           /**
//            * Subscribe object to Global Messages
//            * @function
//            */
//           subscribeToEvents = function () {
//
//           };

          /**
           * Initialise this object
           * @function
           */
          this.init = function () {
            //bindCustomMessageEvents();
            //subscribeToEvents();
            addValidationMethods();
            setDefaultErrorMessages();
            setBasicValidationOnPageForms();
          };
        },

        /**
         * Creates an PlaceholderFallback object to manage form field placeholder fallback functionality in legacy browsers
         * @constructor
         */
        PlaceholderFallback = function (elem) {

          var $thisFormField = $(elem),
              placeholderText = $thisFormField.attr('placeholder'),


          // Create default text for text field on page load
          createText = function () {
            if ($thisFormField.attr("value") === placeholderText || $thisFormField.attr("value").length === 0) {
              $thisFormField.attr("value", placeholderText);
              $thisFormField.addClass("empty");
            }
          },

          // Remove default text on focus. Ignore user-inserted text
          removeText = function () {
            var currentValue = $thisFormField.attr("value");
            if (currentValue === placeholderText) {
              $thisFormField.attr("value", "");
              $thisFormField.removeClass("empty");
            }
          },

          // Restore default text on focus. Ignore user-inserted text
          restoreText = function () {
            var currentValue = $thisFormField.attr("value");
            if (currentValue !== undefined && currentValue !== '') {
              $thisFormField.attr("value", currentValue);
            } else if (currentValue === undefined || currentValue === '') {
              $thisFormField.attr("value", placeholderText);
              $thisFormField.addClass("empty");
            }
          };

          /**
           * Bind custom message events for this object
           * @function
           */
//           bindCustomMessageEvents = function () {
//             /*
//             $thisMainNav.on('', function (e) {
//               e.preventDefault();
//             });
//             */
//           },
//
//           /**
//            * Subscribe object to Global Messages
//            * @function
//            */
//           subscribeToEvents = function () {
//
//           };

          /**
           * Initialise this object
           * @function
           */
          this.init = function () {
            //bindCustomMessageEvents();
            //subscribeToEvents();

            // Get inputs with a placeholder attribute set
            createText();

            // Removal of text on user-focus
            $thisFormField.on('focus', function() {
              removeText();
            });

            // Restoration of default text on input blur, if no user input.
            $thisFormField.on('blur', function() {
              restoreText();
            });
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
          Site.events.global('change',selFileUploadField,'fileupload/change', false);
          //Site.events.delegate('click',selBookingFormConfirm,'showform');
        },


        init = function () {
          Site.utils.cl("Site.forms initialised");
          delegateEvents();

          // Create a new FileUploadManager object
          var thisFileUploadManager = new FileUploadManager();
          thisFileUploadManager.init();

          // Create a new FormValidationManager object
          var thisFormValidationManager = new FormValidationManager();
          thisFormValidationManager.init();

          // If form field placeholders are not supported, create a PlaceholderFallback object
          // to manage the fallback for each field that requires one.
          if(!Modernizr.placeholder) {
            $(selFormFieldWithPlaceholder).each(function() {
              var thisPlaceholderFallback = new PlaceholderFallback();
              thisPlaceholderFallback.init();
            });
          } else {
            //Site.utils.cl('placeholders are supported. No fallback required');
          }
        };


  ///////////////////////
  // Return Public API //
  ///////////////////////

    return {
      init: init
    };

}(jQuery));