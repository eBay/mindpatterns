/**
* @function jquery.tooltip.js
* @author Ian McBurnie <imcburnie@ebay.com>
*/
(function ( $ ) {

    $.fn.tooltip = function() {

        return this.each(function onEach() {

            var $tooltipWidget = $(this),
                $tabindexElement = $tooltipWidget.children().first(),
                $overlay = $tooltipWidget.find('[role=tooltip]'),
                $window = $(window),
                tooltipWidgetOffset,
                tooltipWidgetHeight,
                overlayHeight;

            $overlay.nextId('tooltip');

            $tabindexElement.attr('aria-describedby', $overlay.prop('id'));

            // Make overlay stick to element top
            var sticky = function () {
                return $overlay.css('top', tooltipWidgetOffset.top - overlayOuterHeight - $window.scrollTop() + 'px');
            };

            $tooltipWidget.not('.tooltip-input').on('mouseenter', function onMouseEnter(e) {
                $tooltipWidget.trigger('open')
            });

            $tooltipWidget.not('.tooltip-input').on('mouseleave', function onMouseLeave(e) {
                $tooltipWidget.trigger('dismiss');
            });

            $tooltipWidget.on('focusin', function onFocusIn(e) {
                $tooltipWidget.trigger('open');
            });

            // Add focusexit plugin
            $tooltipWidget.focusExit();

            $tooltipWidget.on('focusexit', function onFocusExit(e, data) {
                $tooltipWidget.trigger('dismiss');
            });

            $tooltipWidget.on('open', function onShow() {
                sticky().delay(250).fadeIn(function onFadeIn() {
                    $window.on('scroll', sticky);
                });
            });

            $tooltipWidget.on('dismiss', function onShow() {
                $overlay.stop(true).fadeOut(function onFadeOut() {
                    $window.off('scroll');
                });
            });

            $tooltipWidget.addClass('tooltip-js');

            setTimeout(function onTimeout() {
                tooltipWidgetHeight = $tooltipWidget.height();
                tooltipWidgetOffset = $tooltipWidget.offset();
                overlayOuterHeight = $overlay.outerHeight();

                $overlay.css('left', tooltipWidgetOffset.left + 'px');
            }, 10);
        });
    };
}( jQuery ));
