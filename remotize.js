/**
 * 
 * Getting tired of rewriting the same remote ajax operations.
 * 
 * $('unique-selector-to-my-form').remotize();
 * 
 */
(function( $ ){

     var methods = {
         init : function( options ) {
             var $this = options.target;
             $this.data('remotize', options);
             
             $this
                 .bind('ajax:beforeSend', methods.onBeforeSend )
	               .bind('ajax:error', methods.onError )
	               .bind('ajax:success', methods.onSuccess );
             
         },
         onBeforeSend: function(xhr, settings) {
             var data = $(this).data('remotize');
             $(this)
	               .find('.' + data.spinnerClass ).show().end()
	               .find(':input').disable().end();
             return true;
         },
         onError: function(event, xhr, statusText) {
             var data = $(this).data('remotize');
             var $this = $(this);

             $this
	               .find('.' + data.mainErrorContainerClass + ' ' + data.mainErrorContentClass).empty().end()
                 .find(':input').removeClass( data.fieldWithErrorsClass ).end();

             $this
                 .find( '.' + data.spinnerClass ).hide().end();

             if ( CrashHandler.xhrInternalServerError( xhr ) ) {
                 $this
                     .find('.' + data.mainErrorContainerClass + ' ' + data.mainErrorContentClass).text(CrashHandler.xhrErrorMessage());
             }
             else {
	               var response = jQuery.parseJSON( xhr.responseText );
	               $this
                     .find('.' + data.mainErrorContainerClass + ' ' + data.mainErrorContentClass).text((response.alert !== null) ? response.alert : '');
                 
	               if( response.full_messages !== undefined ) {
	                   $.each( response.full_messages, function(index, full_message) {
                                 $this
                                     .find('.' + data.mainErrorContainerClass + ' ul')
                                     .append('<li>' + full_message + '.</li>');
		                         });
	               }
	               if( response.invalid_fields !== undefined) {
	                   $.each( response.invalid_fields, function(index, field) {
                                 $this
                                     .find('#' + data.modelName + '_' + field).addClass( data.fieldWithErrorsClass );
		                         });
	               }

	               if( response.redirect_url !== undefined ) {
	                   URLRedirect.to(response.redirect_url);
	               }
             }

             $(this)
	               .find('.' + data.mainErrorContainerClass ).show().end()
	               .find(':input').enable().end()
	               .find('.' + data.spinnerClass).hide().end();
         },
         onSuccess: function(data, status, xhr) {
             var myData = $(this).data('remotize');
             $(this)
                 .find('.' + myData.spinnerClass).hide().end()
	               .find('.' + myData.mainErrorContainerClass).hide().end()
                 .find(':input').enable().end()
                 .find('.' + myData.successfulCreateUpdateClass ).text(status.notice).show().end();

             if( status.redirect_url ) {
                 URLRedirect.to(status.redirect_url);
             }
         }
     };

     $.fn.remotize = function( options ) {
         
         if ( typeof options === 'object' || ! options ) {
             return this.each( function() {
                                   var modelName = "";
                                   var prefix = $(this).attr('id').substring(0, "new_".length);
                                   if( prefix === "new_" ) {
                                       modelName = $(this).attr('id').substring("new_".length);
                                   }
                                   else {
                                       modelName = $(this).attr('id'); // lousy default...
                                   }

                                   var settings = {
                                       target: $(this),
                                       onSuccess: function() {},
                                       onError: function() {},
                                       onBeforeSend: function() {},
                                       mainErrorContainerClass: 'errorExplanation',
                                       mainErrorContentClass: 'h2',
                                       fieldWithErrorsClass: 'field_with_errors',
                                       spinnerClass: 'spinner',
                                       successfulCreateUpdateClass: 'successfulCreateUpdate',
                                       modelName: modelName
                                   };

                                   $.extend( settings, options );
                                   methods.init( settings );
                               });
         } else {
             $.error( 'Unexpected paramter  ' +  options + ' on jQuery.remotize' );
             return this;
         }
     };
     
 })( jQuery );
