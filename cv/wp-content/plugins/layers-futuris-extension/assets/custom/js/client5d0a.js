(function ($) {
    'use strict';

    /** Document ready handler **/
    $(document).on('ready', function (e) {

        initProgressTracker();
        initBackToTop();

        scrollReveal($('[data-animation-origin]'));
        initProgress($('[data-progressbar]'));

        if (wp.customize) {
            wp.customize.selectiveRefresh.bind( 'widget-updated', function(data) {
                scrollReveal($('#'+data.widgetId).find('[data-animation-origin]'));
                initProgress($('#'+data.widgetId).find('[data-progressbar]'));
            } );
        }

        layers_apply_overlay_header_styles(e);

        playDefaultAnimation();

    });

    /** Window onload handler **/
    $(window).on('load', function (e) {
        /** Preloader **/
        $('#preloader').fadeOut(400, function () {
            $(this).remove();
        });

        initHeadroom();
        initCountUp();

        $(".lfe-sticky").stick_in_parent();
        $(".lfe-sticky-global").stick_in_parent({parent:'.wrapper-site'});
    });

    /** Script for Progress Bars **/
    function initProgress(items) {
        items.each(function(key, bar) {
            var data = progressbarConfig($(bar).data());
            switch (data.progressbar) {
                case 'line':
                    bar = new ProgressBar.Line(bar, data);
                    break;
                case 'circle':
                    bar = new ProgressBar.Circle(bar, data);
                    break;
                case 'semicircle':
                    bar = new ProgressBar.SemiCircle(bar, data);
                    break;
            }
            window.setTimeout(function() { bar.animate(data.value) }, $(bar).data('delay'));
        });
    }

    /** Back to top **/
    function initBackToTop() {
        var backTopVisible = false;
        var backTopEvent = false;
        var $backTop = $('#back-top');
        $backTop.on('click', function () {
            $backTop.velocity({ bottom: "-=20px", opacity: 0 }, { visibility: "hidden" });
            $("body").velocity("scroll", { duration: 1000,
                begin: function() { backTopEvent = true },
                complete: function() { backTopEvent = false; backTopVisible = false }
            });
            return false;
        });

        var scrollTrigger = 100, // px
            backToTop = function () {
                var scrollTop = window.pageYOffset;
                if (scrollTop > scrollTrigger && !backTopVisible) {
                    backTopVisible = true;
                    $backTop.velocity({ bottom: '+=20px', opacity: 1 }, { visibility: 'visible', duration: 600 });
                } else if (scrollTop <= scrollTrigger && backTopVisible && !backTopEvent) {
                    backTopVisible = false;
                    $backTop.velocity({ bottom: "-=20px", opacity: 0 }, { visibility: "hidden", duration: 600 });
                }
            };
        backToTop();
        $(window).on('scroll', backToTop);
    }

    /** Progress Tracker **/
    function initProgressTracker() {
        if ( typeof $.fn.progressTracker === 'undefined' ) return;

        var sections = [];
        $('nav.nav-horizontal li a').each(function(key, elem) {
            var href = $(elem).attr('href');
            var curHref = document.location.protocol +"//"+ document.location.hostname + document.location.pathname;
            if (href.indexOf("#") !== -1 && href.indexOf(curHref) !== -1) {
                var hash = href.substring(href.indexOf("#"));
                if ($(hash).length) {
                    sections.push( {
                        elem: $(hash),
                        name: $(elem).text()
                    });
                }
            }
        });

        $('body').progressTracker({
            sections: sections,
            linking: true,
            tooltip: "hover",
            positiveTolerance: 0,
            negativeTolerance: 60,
            displayWhenActive: false,
            disableBelow: 0,
            tracking: "viewport"
        });
    }

    /** Config for progress bar **/
    function progressbarConfig(data) {
        return {
            value: (typeof data.progressbarValue != "undefined") ? parseFloat(data.progressbarValue) : 1,
            progressbar: (typeof data.progressbar != "undefined") ? data.progressbar : 'circle',
            color: (typeof data.progressbarColor != "undefined") ? data.progressbarColor : '#fff',
            strokeWidth: (typeof data.progressbarStrokewidth != "undefined") ? parseInt(data.progressbarStrokewidth) : 4,
            trailWidth: (typeof data.progressbarTrailwidth != "undefined") ? parseFloat(data.progressbarTrailwidth) : 1,
            trailColor: (typeof data.progressbarTrailcolor != "undefined") ? data.progressbarTrailcolor : '#f4f4f4',
            fill: (typeof data.progressbarFill != "undefined") ? data.progressbarFill : 'rgba(0, 0, 0, 0.5)',
            easing: (typeof data.progressbarEasing != "undefined") ? data.progressbarEasing : 'easeInOut',
            duration: (typeof data.progressbarDuration != "undefined") ? parseInt(data.progressbarDuration) : 1400,
            from: (typeof data.progressbarFrom != "undefined") ? data.progressbarFrom : { color: '#aaa', width: 1 },
            to: (typeof data.progressbarTo != "undefined") ? data.progressbarTo : { color: '#333', width: 4 },
            // Set default step function for all animate calls
            step: function(state, circle) {
                circle.path.setAttribute('stroke', state.color);
                circle.path.setAttribute('stroke-width', state.width);

                var value = Math.round(circle.value() * 100);
                if (value === 0) {
                    circle.setText('');
                } else {
                    circle.setText(value + '%');
                }
            }
        };
    }

    /** Animation handler **/
    function scrollReveal(items) {

        window.sr = window.sr || ScrollReveal();

        items.each(function(index, elem) {
            var data = elem.dataset;

            var revealData = {
                duration: (typeof data.animationDuration != "undefined") ? parseInt(data.animationDuration) : 1000,
                origin: (typeof data.animationOrigin != "undefined") ? data.animationOrigin : 'bottom',
                distance: (typeof data.animationDistance != "undefined") ? data.animationDistance : '0px',
                delay: (typeof data.animationDelay != "undefined") ? parseInt(data.animationDelay) : 0,
                scale: (typeof data.animationScale != "undefined") ? parseFloat(data.animationScale) : 1,
                rotate: (typeof data.animationRotate != "undefined") ? JSON.parse(data.animationRotate) : { x: 0, y: 0, z: 0 },
                easing: (typeof data.animationEasing != "undefined") ? data.animationEasing : 'cubic-bezier(1.000, 1.000, 1.000, 1.000)',
                viewFactor: (typeof data.animationViewFactor != "undefined") ? parseFloat(data.animationViewFactor) : 0.2,
                mobile: false,
                afterReveal: function(elem) { $(elem).trigger('afterReveal') }
            };

            window.sr.reveal(elem, revealData);

            if (window.sr.tools.isMobile()) {
                $(elem).trigger('afterReveal');
            }
        });
    }

    /** Headroom **/
    function initHeadroom() {
        if (layers_script_settings && (typeof layers_script_settings.header_sticky_breakpoint != 'undefined')) {
            var headroom;
            if (headroom = document.querySelector(".header-site.header-sticky")) {
                new Headroom(headroom, {offset: layers_script_settings.header_sticky_breakpoint}).init();
            }
            if (headroom = document.querySelector(".headroom")) {
                $(headroom).each(function() {
                    var offset_top = $(this).outerHeight(true) + $(this).offset().top;
                    new Headroom(this, {offset: offset_top}).init();
                });
            }

            // Handle scroll ariving at page top.
            $("body").waypoint({
                offset 	: - layers_script_settings.header_sticky_breakpoint,
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
        }

    }

    function initCountUp() {
        var items = $('.countUp');

        if ( items.length ) {
            items.each(function(index, elem) {
                var numAnim = new CountUp(elem, elem.dataset.start, elem.dataset.end, elem.dataset.decimals, elem.dataset.duration);
                window.sr.reveal(elem, {beforeReveal: function() { numAnim.start(); }});
            });
        }
    }

    function playDefaultAnimation() {

        var items = $('.custom-nav .animated-menuitem');

        if ( items.length ) {
            var delay = 0;
            items.each(function(index, elem) {
                elem.dataset.animationDelay = delay;
                elem.dataset.animationRotate = '{ "x": 10, "y": 90, "z": 0 }';
                elem.dataset.animationEasing = 'cubic-bezier(0.800, 0.300, 0.300, 0.800)';
                delay += 100;
            });
            scrollReveal(items);
        }

        items = $('.animated-footer');

        if ( items.length ) {
            items.each(function(index, elem) {
                elem.dataset.animationEasing = 'cubic-bezier(0.800, 0.300, 0.300, 0.800)';
            });
            scrollReveal(items);
        }

    }

})(jQuery);