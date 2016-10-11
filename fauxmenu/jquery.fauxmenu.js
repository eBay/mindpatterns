/**
* @file jquery.fauxMenu.js
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
*/
(function ( $ ) {

    $.fn.fauxMenu = function fauxMenu(options) {
        options = $.extend({
            isLink: false
        }, options);
        return this.each(function onEachFauxMenu() {
            var $widget = $(this);
            var $overlay = $widget.find('.flyout__overlay');
            var flyoutOptions = {
                focusManagement:'first'
            };
            var $button = $widget.find('.flyout__button');
            var $link = $widget.find('.flyout__link');

            var onOverlayKeydown = function(e) {
                if (e.keyCode === 27) {
                    $button.focus();
                    $button.attr('aria-expanded', 'false');
                }
            };

            if ($link.length > 0) {
                $widget.linkFlyout(flyoutOptions);
                $button = $widget.find('.flyout__button');
            } else {
                $widget.buttonFlyout(flyoutOptions);
            }

            $overlay.on('keydown', 'a, button', onOverlayKeydown);
        });
    };
}( jQuery ));
