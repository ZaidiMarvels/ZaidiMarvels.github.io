// source --> https://neuethemes.net/preview/wp/gridus/mark/wp-content/plugins/layers-futuris-extension/assets/custom/js/layers.framework.js?ver=2.0.7 
/**
 * Layers JS file
 *
 * This file contains all theme JS functions, from height matching to button toggling
 *
 * @package Layers
 * @since Layers 1.0.0
 * Contents
 * 1 - Container padding on first widgets for header fixed
 * 2 - Offsite sidebar Toggles
 * 3 - Sticky Header
 * 4 - FitVids
 * 5 - Layers Custom Easing
 * 6 - Swiper Height Matching Functions
 * 7 - Container padding on first widgets for header fixed - helper function.
 *
 * Author: Obox Themes
 * Author URI: http://www.oboxthemes.com/
 * License: GNU General Public License v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

jQuery(function($) {

	/**
	* 1 - Container padding on first widgets for header fixed
	*/

	$(window).on('resize', function(e) {
		layers_apply_overlay_header_styles(e);
	});

	/**
	* 2 - Offsite sidebar Toggles
	*/

	$(document).on( 'click' , '[data-toggle^="#"]'  , function(e){

		e.preventDefault();

		// "Hi Mom"
		$that = $(this);

		// Setup target ID
		$target = $that.data( 'toggle' );

		// Toggle .open class
		$( $target ).toggleClass( $that.data( 'toggle-class' ) );

		return false;

	});
	/**
	* 3 - Sticky Header
	*/

	// Set site header element
	$header_sticky = $("section.header-sticky");

	// Handle scroll passsing the go-sticky position.
	$("body").waypoint({
		offset 	: - layers_script_settings.header_sticky_breakpoint,
		handler	: function(direction) {
			if ( 'down' == direction ) {

				// Sticky the header
				$header_sticky.stick_in_parent({
					parent: 'body'
				});

				// Clear previous timeout to avoid duplicates.
				clearTimeout( $header_sticky.data( 'timeout' ) );

				// Show header miliseconds later so we can css animate in.
				$header_sticky.data( 'timeout', setTimeout( function() {
					$header_sticky.addClass('is_stuck_show');
				}, '10' ) );
			}
		}
	});

	// Handle scroll ariving at page top.
	$("body").waypoint({
		offset 	: -1,
		handler	: function(direction) {
			if ( 'up' == direction ) {

				// Clear previous timeout to avoid late events.
				clearTimeout( $header_sticky.data( 'timeout' ) );

				// Detach the header
				$header_sticky.removeClass('is_stuck_show');
				$header_sticky.trigger("sticky_kit:detach");
			}
		}
	});

	/**
	* 4 - FitVids resposive video embeds.
	*
	* Target your .container, .wrapper, .post, etc.
	*/

	$(".media-image, .thumbnail-media, .widget.slide .image-container, .post .thumbnail").fitVids();

	/**
	* 5 - Layers Custom Easing
	*
	* Extend jQuery easing with custom Layers easing function for UI animations - eg slideUp, slideDown
	*/

	// easeInOutQuad
	jQuery.extend( jQuery.easing, { layersEaseInOut: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	}});

});

/**
* 6 - Swiper Height Matching Functions
*
*/

function layers_swiper_resize( s ){

	// Find the highest slide, and set the Swiper container to that height.
	var height = 0;
	s.slides.each(function( key, slide ){

		var slide_height = jQuery(slide).find( '.container' ).outerHeight();
		if ( jQuery(slide).find( '.content' ).outerHeight() ) slide_height += jQuery(slide).find( '.content' ).outerHeight();
		if ( jQuery(slide).find( '.content' ).height() ) slide_height -= jQuery(slide).find( '.content' ).height();

		if( height < slide_height ){
			height = slide_height;
		}
	});
	s.container.css({ height: height+'px' });
}

/**
 * 7 - Container padding on first widgets for header fixed - helper function.
 */

var $first_element;
function layers_apply_overlay_header_styles(e) {

	// Get header.
	$header = jQuery( '.header-site' );
	$header_height = $header.outerHeight();

	// Get content wrapper.
	$content_wrapper = jQuery( '#wrapper-content' );

	if( $header.hasClass( 'header-overlay' ) ) {

		// Get first element.
		if( ! $first_element ) $first_element = $content_wrapper.children().eq(0);

		if( 'A' == $first_element.prop("tagName") ) $first_element = $content_wrapper.children( '.widget' ).eq(0);

		if( $first_element.hasClass( 'slide' ) && !$first_element.hasClass( '.full-screen' ) ) {

			// Reset previous incase this is being re-aplied due to window resize.
			// $first_element.find('.swiper-slide > .content' ).css('padding-top', '' );

			// $first_element_height = $first_element.outerHeight();

			// var padding_top = $first_element.find('.swiper-slide > .content' ).eq(0).css('padding-top').replace('px', '');
			// padding_top = ( '' != padding_top ) ? parseInt( padding_top ) : 0 ;

			// First element is Slider Widget.
			// $first_element.css( 'height', ( $header_height + $first_element_height ) );
			// $first_element.find('.swiper-slide' ).css( 'height', ( $header_height + $first_element_height ) );
			// $first_element.css( 'height', ( $first_element_height - $header_height ) );


			jQuery('body').addClass( 'header-overlay-no-push' );
		}
		else if( $first_element.hasClass('title-container') ) {

			// Reset previous incase this is being re-aplied due to window resize.
			if (e.type == 'resize') {
				$first_element.css('padding-top', '' );
			}

			var padding_top = $first_element.css('padding-top').replace('px', '');
			padding_top = ( '' != padding_top ) ? parseInt( padding_top ) : 0 ;

			// First element is Title (eg WooCommerce).
			$first_element.css({ 'paddingTop': $header_height + padding_top });
			jQuery('body').addClass( 'header-overlay-no-push' );
		}
		else{

			// Reset previous incase this is being re-aplied due to window resize.
			if (e.type == 'resize') {
				$content_wrapper.css('padding-top', '' );
			}

			var padding_top = $content_wrapper.css('padding-top').replace('px', '');
			padding_top = ( '' != padding_top ) ? parseInt( padding_top ) : 0 ;

			// Pad the site to compensate for overlay header.
			$content_wrapper.css( 'paddingTop', $header_height + padding_top );
		}

	}
};
// source --> https://neuethemes.net/preview/wp/gridus/mark/wp-content/plugins/layers-pro-extension/assets/js/layers-pro.js?ver=2.0.1 
/**
 * Layers Pro JS
 *
 * This file contains all theme JS functions.
 */
jQuery(function($){

	if( !layersCheckMobile() ){
		$.stellar({
			horizontalScrolling: false,
			verticalOffset: 40
		});
	};


	jQuery(window).resize(function(){
		resizeVideos();
	});

	$(document).on('layers-slider-init', function(s){
		resizeVideos();
	});

	function resizeVideos(){
		$( '.swiper-container .layerspro-slider-video' ).each(function(){

			var $that = $(this);

			var $parent = $that.closest( '.layers-slider-widget' );

			$ratio = ( $parent.outerHeight()/$parent.outerWidth() ) * 100;

			$that.removeClass( 'layers-slider-video-ultra-wide layers-slider-video-super-wide layers-slider-video-wide layers-slider-video-square layers-slider-video-tall layers-slider-video-super-tall' );

			if( $ratio <= 20 ){
				var $video_css = 'layers-slider-video-ultra-wide';
			} else if( $ratio <= 32 ){
				var $video_css = 'layers-slider-video-super-wide';
			} else if( $ratio <= 56 ){
				var $video_css = 'layers-slider-video-wide';
			} else if( $ratio <= 75 ){
				var $video_css = 'layers-slider-video-square';
			} else if( $ratio <= 100 ){
				var $video_css = 'layers-slider-video-tall';
			} else {
				var $video_css = 'layers-slider-video-super-tall';
			}

			$that.addClass( $video_css );

		});

	}

	playActiveVideos();

	function playActiveVideos(){
		setTimeout( function(){
			var video = $( '.swiper-slide-active' ).find( 'video' );

			if( 'undefined' == typeof( video.attr( 'customizer' ) ) )
				$( '.swiper-slide-active' ).find( 'video' ).trigger( 'play' );

		}, 100 );
	}

	// Move videos in the customizer to their first frame
	$( '.swiper-container .layerspro-slider-video' ).each(function(){

		if( layersCheckMobile() ) $(this).remove();

	});

	$( '.swiper-container video' ).each(function(){

		if( layersCheckMobile() ) $(this).remove();

		// Get the video object
		video = $(this);

		// Generate a preview
		if( !video.prop( 'autoplay' ) && video.prop( 'customizer' ) ) {
			// Trigger play
			video.trigger( 'play' );

			// As soon as we play then trigger a stop
			video.on( 'play', function(){
				setTimeout( function(){
					// Trigger pause
					video.trigger( 'pause' );
				}, 100);
			});
		};

	});

	/**
	 * Tabs
	 */
	$('.layers-pro-tabs').each(function( index, element ){

		var $widget              = $( element );
		var $tab_buttons_holder  = $widget.find('.nav-tabs');
		var $tab_buttons         = $tab_buttons_holder.find('li');
		var $tab_contents_holder = $widget.find('.tab-content');
		var $tab_contents        = $tab_contents_holder.children();

		$tab_buttons.each(function( index, element ){

			$( element ).on( 'click', function() {

				var $related_tab_button = $(this);
				var $related_tab_content = $tab_contents.eq(index);

				$tab_buttons.not($related_tab_button).removeClass('active');
				$related_tab_button.addClass('active');

				$tab_contents.not($related_tab_content).hide();
				$related_tab_content.show();

				return false;
			});
		});
	});

	/**
	 * Accordion
	 */
	$('.layers-pro-accordion').each(function( index, element ){

		var $widget              = $( element );
		var $accordion_list      = $widget.find('.accordion-list');
		var $accordion_items     = $widget.find('.accordion-list li');

		$accordion_items.each(function( index, element ){

			$( element ).children('section').slideUp(0).css({ position: 'relative', visibility: 'visible' });

			$( element ).children('a').on( 'click', function() {

				var $related_accordion_title   = $(this);
				var $related_accordion_item    = $related_accordion_title.parent();
				var $related_accordion_content = $related_accordion_item.children('section');

				if ( $related_accordion_item.hasClass('active') ) {
					// Close
					$related_accordion_item.removeClass('active');
					$related_accordion_content.slideUp({ duration:200, easing: 'layersEaseInOut' });
				}
				else {
					// Open
					$related_accordion_item.addClass('active');
					$related_accordion_content.slideDown({ duration:200, easing: 'layersEaseInOut' });
				}

				return false;
			});
		});
	});

	/**
	 * Search
	 */
	$(document).on( 'click', '.search-close', function(){

		$('.search-interface-overlay')
			.removeClass('search-interface-play-in')
			.addClass('search-interface-play-out');

		return false;

	});
	$(document).on( 'click', '.header-search > a, .menui-item-layers-search > a', function(){

		var $search_field = $('#layers-modal-search-field');

		$('.search-interface-overlay')
			.removeClass('search-interface-play-out')
			.addClass('search-interface-play-in');

		setTimeout(function() {
			$search_field
				.focus()
				.layers_pro_set_cursor_postion( $search_field.val().length );
		}, 600 );

		return false;
	});

    /**
	 * Allow animation if x-animation is found
     */
    // For all the animations on page animate as soon as the
    // scrolling reaches 25% above the widget
    /**
     * X - Scroll Animations.
     */
    var bodyEl = $('body');
    var footerEl = $('#footer');

    if ( bodyEl.hasClass('layers-animate') ) {
        var sectionsToAnimate = [
            "#wrapper-content > .widget",
            ".title-container .title",
            "#post-list .post",
            ".sidebar",
            "#wrapper-content :not(\".swiper-container\") .grid > article:not('.layers-masonry-column')"
        ];

        // Special header animation

        // Header site to fade in with downward direction
        $(".header-site").addClass("do-animate delay-200 animated-1s layers-default-fade-in-down");

        // Header block container to fade in upward direction
        $(".header-block.container").addClass("do-animate delay-200 animated-1s layers-default-fade-in-up");

        $(sectionsToAnimate.join(",")).not(".do-animate").addClass("do-animate translucent animated-1s layers-default-fade-in-up");
        footerEl.addClass("animated-1s");

        $('.do-animate').waypoint({
            offset 	: '75%',
            handler	: layersAnimationHandler('layers-default', false)
        });
        footerEl.waypoint({
            offset 	: '90%',
            handler	: layersAnimationHandler('layers-default', false)
        });

        // As we are using delay-200 for header and footer lets remove
		// the class of opacity from body for more smooth animations
        setTimeout(function(){
            bodyEl.removeClass('opacity-0');
		}, 200);
	}

    // For all the animations on page animate as soon as the
    // scrolling reaches 25% above the widget
    $('.do-animate').waypoint({
        handler: layersAnimationHandler('x', false),
        offset: '75%'
    });

});

/**
 * Helper function that initialsizes our Carousel. It expects that there
 * is a row of our standard Layers post list HTML that it will convert
 *
 * @param  string widget_id         Widgets id selector eg #widget_66
 * @param  object settings     Settings object
 * @return Swiper                   Swiper object
 */
function layers_pro_init_post_carousel( widget_id, settings ) {

	// Debigging disable.
	// return;

	// Get the all important row that will will contain our carousel.
	var carousel_row = jQuery( widget_id ).find( '.post-carousel-row' );
	var carousel_row_grid = carousel_row.find('.grid');

	/**
	 * Prepare a cloned Mimic row that we will grab our sizing from - which allows for responsive resizing.
	 */

	// Create a holder to hold the cloned elements that we will subsequently mimic in our carousel.
	var mimic_row = jQuery( '<div class="layers-pro-post-carousel-mimic-row"><div class="grid">' );
	var mimic_row_grid = mimic_row.find( '.grid' );

	jQuery( widget_id ).prepend( mimic_row );

	// Hide this mimic row until it's needed - it will be shown, DOM measurments taken from it, then hidden again before it's rendered.
	// mimic_row.hide();

	// Copy the classes from the row so the CSS (especially responsive) make it behave in the same way.
	mimic_row.addClass( carousel_row.attr('class') );

	// Clone one of the article elements that we will mimic (clone many during debugging stage).
	mimic_row_grid.prepend( jQuery( widget_id ).find( '.grid' ).children(':lt(6)').clone() );

	// Empty the articles so they don't tax the browsers performance.
	mimic_row_grid.children().html('').prepend('<div style="background:black">&nbsp;</div>');

	/**
	 * Prepare the actual Carousel elemnts.
	 */

	// Wrap the elemnts in the necessary holders required for Swiper.
	carousel_row_grid.children().not('.swiper-pagination, .arrows').wrapAll('<div class="swiper-wrapper">');
	carousel_row_grid.children().wrapAll('<div class="swiper-container">');

	// Get the final element that will become our carousel.
	carousel_element = carousel_row_grid.find('.swiper-container');

	// Setup the slides/columns.
	carousel_element.find('.column, .column-flush')
		// Remove framewrok classes from the column that will disrupt the carousel display.
		.removeClass('column column-flush span-1 span-2 span-3 span-4 span-5 span-6 span-7 span-8 span-9 span-10 span-11 span-12')
		// Add the swiper-slide class that Swiper needs.
		.addClass('swiper-slide');


	/**
	 * Start getting and settings properties.
	 */

	// Use the mimic row to get measurements from from our CSS.
	var space_between = layers_pro_post_carousel_calculate_space_between( carousel_row, mimic_row );
	var per_row = layers_pro_post_carousel_calculate_per_row( carousel_row, mimic_row );

	// Set the padding of the wrapper to start.
	carousel_row.css( { 'padding-left' : layers_pro_post_carousel_calculate_holder_spacing( carousel_row, mimic_row ), 'padding-right' : layers_pro_post_carousel_calculate_holder_spacing( carousel_row, mimic_row ) } );

	// Merge defaults with the settings passed.
	settings = jQuery.extend( {
		mode                :'horizontal',
		calculateHeight     : true,
		wrapperClass        : 'swiper-wrapper',
		slideClass          : 'swiper-slide',
		spaceBetween        : space_between,
		slidesPerView       : per_row,
		loop                : true,
		paginationClickable : true,
	}, settings );

	carousel_row.addClass('post-carousel-row-swiper');

	// Init the Carousel.
	var post_swiper = carousel_element.swiper( settings );

	/*
	post_swiper.enableKeyboardControl();

	jQuery( widget_id ).find('.arrows a').on( 'click' , function(e){
		e.preventDefault();

		// "Hi Mom"
		$that = jQuery(this);

		if( $that.hasClass( 'swiper-pagination-switch' ) ){ // Anchors
			post_swiper.swipeTo( $that.index() );
		} else if( $that.hasClass( 'l-left-arrow' ) ){ // Previous
			post_swiper.swipePrev();
		} else if( $that.hasClass( 'l-right-arrow' ) ){ // Next
		// 	post_swiper.swipeNext();
		}

		return false;
	});
	*/

	// Setup resize event so the carousel is constantly mimicing our mimic row - and auto heighting it's columns.
	jQuery(window).resize(function(){
		layers_pro_post_carousel_resize( post_swiper, carousel_row, mimic_row );
	});
	layers_pro_post_carousel_resize( post_swiper, carousel_row, mimic_row );

	// Return the slider incase it is needed further.
	return post_swiper;
}

function layers_pro_post_carousel_resize( post_swiper, carousel_row, mimic_row ) {

	// Get.
	var space_between = layers_pro_post_carousel_calculate_space_between( carousel_row, mimic_row );
	var per_row = layers_pro_post_carousel_calculate_per_row( carousel_row, mimic_row );
	var holder_padding = layers_pro_post_carousel_calculate_holder_spacing( carousel_row, mimic_row );

	// Set.
	carousel_row.css( { 'padding-left' : holder_padding, 'padding-right' : holder_padding } );
	post_swiper.params.spaceBetween = space_between;
	post_swiper.params.slidesPerView = per_row;
	post_swiper.update();

	// Also auto height match the rows.
	layers_pro_post_carousel_match_heights( post_swiper );
}

/**
 * Helper function that looks at our mimic row and culculates
 * how many columns it is displaying per row - so the Carousel
 * can mimic our CSS frameworks column behaviour.
 */
function layers_pro_post_carousel_calculate_per_row( carousel_row, mimic_row ){

	// Cache elements.
	var column_element = mimic_row.find('.column, .column-flush').eq(0);

	// Flash show the element so it holds size in the DOM
	mimic_row.show();

	// Calculate columns per_row.
	var per_row = parseInt( Math.round( mimic_row.width() / column_element.width() ) );

	// Hide the element soon as the calculations are done.
	mimic_row.hide();

	return per_row;
}

/**
 * Helper function, similar to above, looks at our mimic
 * row and calculates the space-between at any given time.
 */
function layers_pro_post_carousel_calculate_space_between( carousel_row, mimic_row ){

	// Cache elements.
	var column_element = mimic_row.find('.column, .column-flush').eq(0);

	// Flash show the element so it holds size in the DOM
	mimic_row.show();

	// Calculate the margin-right.
	var space_between = parseInt( column_element.css('margin-left') ) + parseInt( column_element.css('margin-right') );

	// Hide the element soon as the calculations are done.
	mimic_row.hide();

	return space_between;
}

/**
 * Helper function, similar to above, looks at our mimic
 * row and calculates the holder-spacing at any given time.
 */
function layers_pro_post_carousel_calculate_holder_spacing( carousel_row, mimic_row ){

	// Cache elements.
	var column_element = mimic_row.find('.column, .column-flush').eq(0);

	// Flash show the element so it holds size in the DOM
	mimic_row.show();

	// Get Values.
	var holder_padding = 0;
	holder_padding += parseInt( column_element.css('margin-left') ); // Get columns left-margin.
	holder_padding += ( parseInt( mimic_row.css('padding-left') ) ) / 2; // Get holder padding.

	// Hide the element soon as the calculations are done.
	mimic_row.hide();

	return holder_padding;
}

/**
 * Helper function that calculates the highest column
 * and makes sure all other rows match it's height.
 */
function layers_pro_post_carousel_match_heights( post_swiper, match_height ){

	// Reset the container and thumbnail-body height, if it has been set on the previous resize iteration.
	// Transition must be set to 0s so the postions can be measured immediately and not after animations
    post_swiper.container.css({ height: '' });
    post_swiper.container.find('.thumbnail-body').css( 'height', '' );
    post_swiper.container.find('.thumbnail-body .button').css( { 'margin-top': '', transition: '0s,0s' } );

    // Don't do any height matching if there is only one slide showing - this happens on Mobile.
    if ( post_swiper.params.slidesPerView <= 1 ) return;

    // Find the highest slide, and set the Swiper container to that height.
    var height = 0;
	post_swiper.slides.each(function( key, slide ){
    	var slide_height = jQuery(slide).outerHeight();
        if( height < slide_height ) height = slide_height;
    });
    post_swiper.container.css({ height: height+'px' });

    // Then go through each slide and stretch the thumbnail-body to fill in the empty space.
    post_swiper.slides.each( function( key, slide ) {

		// Skip auto-heighting of 'Display: Overlay' blocks.
    	if ( jQuery(slide).hasClass('with-overlay') ) return true;

        var thumb_height = 0;
        var padding_top = 0;
        var padding_bottom = 0;
        var slide_height = jQuery(slide).height();

        if ( jQuery(slide).find( '.thumbnail-media' ).length ) {
        	thumb_height = jQuery(slide).find( '.thumbnail-media' ).outerHeight();
        }

        if ( jQuery(slide).find( '.thumbnail-body' ).length ) {
        	padding_top = jQuery(slide).find( '.thumbnail-body' ).css( 'padding-top' );
			padding_bottom = jQuery(slide).find( '.thumbnail-body' ).css( 'padding-top' );

			var $body_height = parseInt(slide_height) - parseInt(thumb_height) - parseInt(padding_top) - parseInt(padding_bottom)

			jQuery(slide).find( '.thumbnail-body' ).height( $body_height );

        }
    });

}

// Set cursor position
jQuery.fn.layers_pro_set_cursor_postion = function(pos) {
	this.each(function(index, elem) {
		if (elem.setSelectionRange) {
			elem.setSelectionRange(pos, pos);
		}
		else if (elem.createTextRange) {
			var range = elem.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	});
	return this;
};

function layersCheckMobile(){
	var isMobile = false; //initiate as false

	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
		isMobile = true;
	}

	return isMobile;
}

/**
 * Animation handler for most of the animation regarding
 * do-animate
 */
(function($ , $window) {
    $window.layersAnimationHandler = function (replacementClass, addDefaultAnimation) {
        // Using closure for more dynamic functions
        return function () {
            // Get the element
            var element = $(this.element);
            // Split all the class names as array
            var classList = element.attr("class").split(/\s+/);

            var hasAnimation = false;
            // The standard procedure is we x-ify the animation class name and remove the x
            // as soon as the offset limit is reached
            $.each(classList, function (i, cls) {
                if (cls.match("^" + replacementClass + "-")) {
                    element.removeClass(cls);
                    element.addClass(cls.replace(replacementClass + '-', ''));
                    hasAnimation = true;
                }
            });

            if (!hasAnimation && addDefaultAnimation) {
                element.addClass('fade-in-up');
            }
            // Animation only occurs once, so as soon as animation is
            // done remove the waypoint monitor and do-animate class
            // from element to prevent multiple event binding
            element.removeClass('do-animate');
            this.destroy();
        }
    };
})(jQuery, window);
// source --> https://neuethemes.net/preview/wp/gridus/mark/wp-content/plugins/layers-pro-extension/assets/js/jquery.plugins.min.js?ver=2.0.1 
(function($,window,document,undefined){var pluginName='stellar',defaults={scrollProperty:'scroll',positionProperty:'position',horizontalScrolling:!0,verticalScrolling:!0,horizontalOffset:0,verticalOffset:0,responsive:!1,parallaxBackgrounds:!0,parallaxElements:!0,hideDistantElements:!0,hideElement:function($elem){$elem.hide()},showElement:function($elem){$elem.show()}},scrollProperty={scroll:{getLeft:function($elem){return $elem.scrollLeft()},setLeft:function($elem,val){$elem.scrollLeft(val)},getTop:function($elem){return $elem.scrollTop()},setTop:function($elem,val){$elem.scrollTop(val)}},position:{getLeft:function($elem){return parseInt($elem.css('left'),10)*-1},getTop:function($elem){return parseInt($elem.css('top'),10)*-1}},margin:{getLeft:function($elem){return parseInt($elem.css('margin-left'),10)*-1},getTop:function($elem){return parseInt($elem.css('margin-top'),10)*-1}},transform:{getLeft:function($elem){var computedTransform=getComputedStyle($elem[0])[prefixedTransform];return(computedTransform!=='none'?parseInt(computedTransform.match(/(-?[0-9]+)/g)[4],10)*-1:0)},getTop:function($elem){var computedTransform=getComputedStyle($elem[0])[prefixedTransform];return(computedTransform!=='none'?parseInt(computedTransform.match(/(-?[0-9]+)/g)[5],10)*-1:0)}}},positionProperty={position:{setLeft:function($elem,left){$elem.css('left',left)},setTop:function($elem,top){$elem.css('top',top)}},transform:{setPosition:function($elem,left,startingLeft,top,startingTop){$elem[0].style[prefixedTransform]='translate3d('+(left-startingLeft)+'px, '+(top-startingTop)+'px, 0)'}}},vendorPrefix=(function(){var prefixes=/^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,style=$('script')[0].style,prefix='',prop;for(prop in style){if(prefixes.test(prop)){prefix=prop.match(prefixes)[0];break}}
if('WebkitOpacity' in style){prefix='Webkit'}
if('KhtmlOpacity' in style){prefix='Khtml'}
return function(property){return prefix+(prefix.length>0?property.charAt(0).toUpperCase()+property.slice(1):property)}}()),prefixedTransform=vendorPrefix('transform'),supportsBackgroundPositionXY=$('<div />',{style:'background:#fff'}).css('background-position-x')!==undefined,setBackgroundPosition=(supportsBackgroundPositionXY?function($elem,x,y){$elem.css({'background-position-x':x,'background-position-y':y})}:function($elem,x,y){$elem.css('background-position',x+' '+y)}),getBackgroundPosition=(supportsBackgroundPositionXY?function($elem){return[$elem.css('background-position-x'),$elem.css('background-position-y')]}:function($elem){return $elem.css('background-position').split(' ')}),requestAnimFrame=(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(callback){setTimeout(callback,1000/60)});function Plugin(element,options){this.element=element;this.options=$.extend({},defaults,options);this._defaults=defaults;this._name=pluginName;this.init()}
Plugin.prototype={init:function(){this.options.name=pluginName+'_'+Math.floor(Math.random()*1e9);this._defineElements();this._defineGetters();this._defineSetters();this._handleWindowLoadAndResize();this._detectViewport();this.refresh({firstLoad:!0});if(this.options.scrollProperty==='scroll'){this._handleScrollEvent()}else{this._startAnimationLoop()}},_defineElements:function(){if(this.element===document.body)this.element=window;this.$scrollElement=$(this.element);this.$element=(this.element===window?$('body'):this.$scrollElement);this.$viewportElement=(this.options.viewportElement!==undefined?$(this.options.viewportElement):(this.$scrollElement[0]===window||this.options.scrollProperty==='scroll'?this.$scrollElement:this.$scrollElement.parent()))},_defineGetters:function(){var self=this,scrollPropertyAdapter=scrollProperty[self.options.scrollProperty];this._getScrollLeft=function(){return scrollPropertyAdapter.getLeft(self.$scrollElement)};this._getScrollTop=function(){return scrollPropertyAdapter.getTop(self.$scrollElement)}},_defineSetters:function(){var self=this,scrollPropertyAdapter=scrollProperty[self.options.scrollProperty],positionPropertyAdapter=positionProperty[self.options.positionProperty],setScrollLeft=scrollPropertyAdapter.setLeft,setScrollTop=scrollPropertyAdapter.setTop;this._setScrollLeft=(typeof setScrollLeft==='function'?function(val){setScrollLeft(self.$scrollElement,val)}:$.noop);this._setScrollTop=(typeof setScrollTop==='function'?function(val){setScrollTop(self.$scrollElement,val)}:$.noop);this._setPosition=positionPropertyAdapter.setPosition||function($elem,left,startingLeft,top,startingTop){if(self.options.horizontalScrolling){positionPropertyAdapter.setLeft($elem,left,startingLeft)}
if(self.options.verticalScrolling){positionPropertyAdapter.setTop($elem,top,startingTop)}}},_handleWindowLoadAndResize:function(){var self=this,$window=$(window);if(self.options.responsive){$window.bind('load.'+this.name,function(){self.refresh()})}
$window.bind('resize.'+this.name,function(){self._detectViewport();if(self.options.responsive){self.refresh()}})},refresh:function(options){var self=this,oldLeft=self._getScrollLeft(),oldTop=self._getScrollTop();if(!options||!options.firstLoad){this._reset()}
this._setScrollLeft(0);this._setScrollTop(0);this._setOffsets();this._findParticles();this._findBackgrounds();if(options&&options.firstLoad&&/WebKit/.test(navigator.userAgent)){$(window).on('load',function(){var oldLeft=self._getScrollLeft(),oldTop=self._getScrollTop();self._setScrollLeft(oldLeft+1);self._setScrollTop(oldTop+1);self._setScrollLeft(oldLeft);self._setScrollTop(oldTop)})}
this._setScrollLeft(oldLeft);this._setScrollTop(oldTop)},_detectViewport:function(){var viewportOffsets=this.$viewportElement.offset(),hasOffsets=viewportOffsets!==null&&viewportOffsets!==undefined;this.viewportWidth=this.$viewportElement.width();this.viewportHeight=this.$viewportElement.height();this.viewportOffsetTop=(hasOffsets?viewportOffsets.top:0);this.viewportOffsetLeft=(hasOffsets?viewportOffsets.left:0)},_findParticles:function(){var self=this,scrollLeft=this._getScrollLeft(),scrollTop=this._getScrollTop();if(this.particles!==undefined){for(var i=this.particles.length-1;i>=0;i--){this.particles[i].$element.data('stellar-elementIsActive',undefined)}}
this.particles=[];if(!this.options.parallaxElements)return;this.$element.find('[data-stellar-ratio]').each(function(i){var $this=$(this),horizontalOffset,verticalOffset,positionLeft,positionTop,marginLeft,marginTop,$offsetParent,offsetLeft,offsetTop,parentOffsetLeft=0,parentOffsetTop=0,tempParentOffsetLeft=0,tempParentOffsetTop=0;if(!$this.data('stellar-elementIsActive')){$this.data('stellar-elementIsActive',this)}else if($this.data('stellar-elementIsActive')!==this){return}
self.options.showElement($this);if(!$this.data('stellar-startingLeft')){$this.data('stellar-startingLeft',$this.css('left'));$this.data('stellar-startingTop',$this.css('top'))}else{$this.css('left',$this.data('stellar-startingLeft'));$this.css('top',$this.data('stellar-startingTop'))}
positionLeft=$this.position().left;positionTop=$this.position().top;marginLeft=($this.css('margin-left')==='auto')?0:parseInt($this.css('margin-left'),10);marginTop=($this.css('margin-top')==='auto')?0:parseInt($this.css('margin-top'),10);offsetLeft=$this.offset().left-marginLeft;offsetTop=$this.offset().top-marginTop;$this.parents().each(function(){var $this=$(this);if($this.data('stellar-offset-parent')===!0){parentOffsetLeft=tempParentOffsetLeft;parentOffsetTop=tempParentOffsetTop;$offsetParent=$this;return!1}else{tempParentOffsetLeft+=$this.position().left;tempParentOffsetTop+=$this.position().top}});horizontalOffset=($this.data('stellar-horizontal-offset')!==undefined?$this.data('stellar-horizontal-offset'):($offsetParent!==undefined&&$offsetParent.data('stellar-horizontal-offset')!==undefined?$offsetParent.data('stellar-horizontal-offset'):self.horizontalOffset));verticalOffset=($this.data('stellar-vertical-offset')!==undefined?$this.data('stellar-vertical-offset'):($offsetParent!==undefined&&$offsetParent.data('stellar-vertical-offset')!==undefined?$offsetParent.data('stellar-vertical-offset'):self.verticalOffset));self.particles.push({$element:$this,$offsetParent:$offsetParent,isFixed:$this.css('position')==='fixed',horizontalOffset:horizontalOffset,verticalOffset:verticalOffset,startingPositionLeft:positionLeft,startingPositionTop:positionTop,startingOffsetLeft:offsetLeft,startingOffsetTop:offsetTop,parentOffsetLeft:parentOffsetLeft,parentOffsetTop:parentOffsetTop,stellarRatio:($this.data('stellar-ratio')!==undefined?$this.data('stellar-ratio'):0.75),width:$this.outerWidth(!0),height:$this.outerHeight(!0),isHidden:!1})})},_findBackgrounds:function(){var self=this,scrollLeft=this._getScrollLeft(),scrollTop=this._getScrollTop(),$backgroundElements;this.backgrounds=[];if(!this.options.parallaxBackgrounds)return;$backgroundElements=this.$element.find('.layers-parallax');$backgroundElements.each(function(){var $this=$(this),backgroundPosition=getBackgroundPosition($this),horizontalOffset,verticalOffset,positionLeft,positionTop,marginLeft,marginTop,offsetLeft,offsetTop,$offsetParent,parentOffsetLeft=0,parentOffsetTop=0,tempParentOffsetLeft=0,tempParentOffsetTop=0;if(!$this.data('stellar-backgroundIsActive')){$this.data('stellar-backgroundIsActive',this)}else if($this.data('stellar-backgroundIsActive')!==this){return}
if(!$this.data('stellar-backgroundStartingLeft')){$this.data('stellar-backgroundStartingLeft',backgroundPosition[0]);$this.data('stellar-backgroundStartingTop',backgroundPosition[1])}else{setBackgroundPosition($this,$this.data('stellar-backgroundStartingLeft'),$this.data('stellar-backgroundStartingTop'))}
marginLeft=($this.css('margin-left')==='auto')?0:parseInt($this.css('margin-left'),10);marginTop=($this.css('margin-top')==='auto')?0:parseInt($this.css('margin-top'),10);offsetLeft=$this.offset().left-marginLeft-scrollLeft;offsetTop=$this.offset().top-marginTop-scrollTop;$this.parents().each(function(){var $this=$(this);if($this.data('stellar-offset-parent')===!0){parentOffsetLeft=tempParentOffsetLeft;parentOffsetTop=tempParentOffsetTop;$offsetParent=$this;return!1}else{tempParentOffsetLeft+=$this.position().left;tempParentOffsetTop+=$this.position().top}});horizontalOffset=($this.data('stellar-horizontal-offset')!==undefined?$this.data('stellar-horizontal-offset'):($offsetParent!==undefined&&$offsetParent.data('stellar-horizontal-offset')!==undefined?$offsetParent.data('stellar-horizontal-offset'):self.horizontalOffset));verticalOffset=($this.data('stellar-vertical-offset')!==undefined?$this.data('stellar-vertical-offset'):($offsetParent!==undefined&&$offsetParent.data('stellar-vertical-offset')!==undefined?$offsetParent.data('stellar-vertical-offset'):self.verticalOffset));self.backgrounds.push({$element:$this,$offsetParent:$offsetParent,isFixed:$this.css('background-attachment')==='fixed',horizontalOffset:horizontalOffset,verticalOffset:verticalOffset,startingValueLeft:backgroundPosition[0],startingValueTop:backgroundPosition[1],startingBackgroundPositionLeft:(isNaN(parseInt(backgroundPosition[0],10))?0:parseInt(backgroundPosition[0],10)),startingBackgroundPositionTop:(isNaN(parseInt(backgroundPosition[1],10))?0:parseInt(backgroundPosition[1],10)),startingPositionLeft:$this.position().left,startingPositionTop:$this.position().top,startingOffsetLeft:offsetLeft,startingOffsetTop:offsetTop,parentOffsetLeft:parentOffsetLeft,parentOffsetTop:parentOffsetTop,stellarRatio:($this.data('stellar-background-ratio')===undefined?0.5:$this.data('stellar-background-ratio'))})})},_reset:function(){var particle,startingPositionLeft,startingPositionTop,background,i;for(i=this.particles.length-1;i>=0;i--){particle=this.particles[i];startingPositionLeft=particle.$element.data('stellar-startingLeft');startingPositionTop=particle.$element.data('stellar-startingTop');this._setPosition(particle.$element,startingPositionLeft,startingPositionLeft,startingPositionTop,startingPositionTop);this.options.showElement(particle.$element);particle.$element.data('stellar-startingLeft',null).data('stellar-elementIsActive',null).data('stellar-backgroundIsActive',null)}
for(i=this.backgrounds.length-1;i>=0;i--){background=this.backgrounds[i];background.$element.data('stellar-backgroundStartingLeft',null).data('stellar-backgroundStartingTop',null);setBackgroundPosition(background.$element,background.startingValueLeft,background.startingValueTop)}},destroy:function(){this._reset();this.$scrollElement.unbind('resize.'+this.name).unbind('scroll.'+this.name);this._animationLoop=$.noop;$(window).unbind('load.'+this.name).unbind('resize.'+this.name)},_setOffsets:function(){var self=this,$window=$(window);$window.unbind('resize.horizontal-'+this.name).unbind('resize.vertical-'+this.name);if(typeof this.options.horizontalOffset==='function'){this.horizontalOffset=this.options.horizontalOffset();$window.bind('resize.horizontal-'+this.name,function(){self.horizontalOffset=self.options.horizontalOffset()})}else{this.horizontalOffset=this.options.horizontalOffset}
if(typeof this.options.verticalOffset==='function'){this.verticalOffset=this.options.verticalOffset();$window.bind('resize.vertical-'+this.name,function(){self.verticalOffset=self.options.verticalOffset()})}else{this.verticalOffset=this.options.verticalOffset}},_repositionElements:function(){var scrollLeft=this._getScrollLeft(),scrollTop=this._getScrollTop(),horizontalOffset,verticalOffset,particle,fixedRatioOffset,background,bgLeft,bgTop,isVisibleVertical=!0,isVisibleHorizontal=!0,newPositionLeft,newPositionTop,newOffsetLeft,newOffsetTop,i;if(this.currentScrollLeft===scrollLeft&&this.currentScrollTop===scrollTop&&this.currentWidth===this.viewportWidth&&this.currentHeight===this.viewportHeight){return}else{this.currentScrollLeft=scrollLeft;this.currentScrollTop=scrollTop;this.currentWidth=this.viewportWidth;this.currentHeight=this.viewportHeight}
for(i=this.particles.length-1;i>=0;i--){particle=this.particles[i];fixedRatioOffset=(particle.isFixed?1:0);if(this.options.horizontalScrolling){newPositionLeft=(scrollLeft+particle.horizontalOffset+this.viewportOffsetLeft+particle.startingPositionLeft-particle.startingOffsetLeft+particle.parentOffsetLeft)*-(particle.stellarRatio+fixedRatioOffset-1)+particle.startingPositionLeft;newOffsetLeft=newPositionLeft-particle.startingPositionLeft+particle.startingOffsetLeft}else{newPositionLeft=particle.startingPositionLeft;newOffsetLeft=particle.startingOffsetLeft}
if(this.options.verticalScrolling){newPositionTop=(scrollTop+particle.verticalOffset+this.viewportOffsetTop+particle.startingPositionTop-particle.startingOffsetTop+particle.parentOffsetTop)*-(particle.stellarRatio+fixedRatioOffset-1)+particle.startingPositionTop;newOffsetTop=newPositionTop-particle.startingPositionTop+particle.startingOffsetTop}else{newPositionTop=particle.startingPositionTop;newOffsetTop=particle.startingOffsetTop}
if(this.options.hideDistantElements){isVisibleHorizontal=!this.options.horizontalScrolling||newOffsetLeft+particle.width>(particle.isFixed?0:scrollLeft)&&newOffsetLeft<(particle.isFixed?0:scrollLeft)+this.viewportWidth+this.viewportOffsetLeft;isVisibleVertical=!this.options.verticalScrolling||newOffsetTop+particle.height>(particle.isFixed?0:scrollTop)&&newOffsetTop<(particle.isFixed?0:scrollTop)+this.viewportHeight+this.viewportOffsetTop}
if(isVisibleHorizontal&&isVisibleVertical){if(particle.isHidden){this.options.showElement(particle.$element);particle.isHidden=!1}
this._setPosition(particle.$element,newPositionLeft,particle.startingPositionLeft,newPositionTop,particle.startingPositionTop)}else{if(!particle.isHidden){this.options.hideElement(particle.$element);particle.isHidden=!0}}}
for(i=this.backgrounds.length-1;i>=0;i--){background=this.backgrounds[i];fixedRatioOffset=(background.isFixed?0:1);bgLeft=(this.options.horizontalScrolling?(scrollLeft+background.horizontalOffset-this.viewportOffsetLeft-background.startingOffsetLeft+background.parentOffsetLeft-background.startingBackgroundPositionLeft)*(fixedRatioOffset-background.stellarRatio)+'px':background.startingValueLeft);bgTop=(this.options.verticalScrolling?(scrollTop+background.verticalOffset-this.viewportOffsetTop-background.startingOffsetTop+background.parentOffsetTop-background.startingBackgroundPositionTop)*(fixedRatioOffset-background.stellarRatio)+'px':background.startingValueTop);setBackgroundPosition(background.$element,bgLeft,bgTop)}},_handleScrollEvent:function(){var self=this,ticking=!1;var update=function(){self._repositionElements();ticking=!1};var requestTick=function(){if(!ticking){requestAnimFrame(update);ticking=!0}};this.$scrollElement.bind('scroll.'+this.name,requestTick);requestTick()},_startAnimationLoop:function(){var self=this;this._animationLoop=function(){requestAnimFrame(self._animationLoop);self._repositionElements()};this._animationLoop()}};$.fn[pluginName]=function(options){var args=arguments;if(options===undefined||typeof options==='object'){return this.each(function(){if(!$.data(this,'plugin_'+pluginName)){$.data(this,'plugin_'+pluginName,new Plugin(this,options))}})}else if(typeof options==='string'&&options[0]!=='_'&&options!=='init'){return this.each(function(){var instance=$.data(this,'plugin_'+pluginName);if(instance instanceof Plugin&&typeof instance[options]==='function'){instance[options].apply(instance,Array.prototype.slice.call(args,1))}
if(options==='destroy'){$.data(this,'plugin_'+pluginName,null)}})}};$[pluginName]=function(options){var $window=$(window);return $window.stellar.apply($window,Array.prototype.slice.call(arguments,0))};$[pluginName].scrollProperty=scrollProperty;$[pluginName].positionProperty=positionProperty;window.Stellar=Plugin}(jQuery,this,document));
// source --> https://neuethemes.net/preview/wp/gridus/mark/wp-content/plugins/layers-pro-extension/assets/js/jquery.smoothscroll.js?ver=2.0.1 
/**
 * Layers Pro Smooth Scrolling
 *
 * This file contains all functions relating to the smooth scroll feature
 */

jQuery(function($) {

	// When to show the scroll link
	// higher number = scroll link appears further down the page
	var upperLimit = 100;

	// Scroll Speed. Change the number to change the speed
	var scrollSpeed = 600;

	// Choose your easing effect http://jqueryui.com/resources/demos/effect/easing.html
	var scrollStyle = 'swing';

	$('a[href*="#"]:not([href="#"]):not([href^="#tab"]):not([href="#_"])').click(function() {

		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') || location.hostname == this.hostname) {

			var target = $(this.hash),
			scrollHeaderHeight = $(".header-wrapper").height(); // Get fixed header height

			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

			if (target.length) {
				$('html,body').animate({ scrollTop: target.offset().top - scrollHeaderHeight }, scrollSpeed, scrollStyle );
				return false;
			}
		}
	});

});