/**
* @file jquery.fauxMenu.js
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
*/
(function ($) {
    $.fn.fauxMenu = function fauxMenu(options) {
        options = $.extend({
            type: 'click'
        }, options);
        return this.each(function onEachFauxMenu() {
            var $widget = $(this);
            var $overlay = $widget.find('.flyout__overlay');
            var $trigger = $widget.find('.flyout__trigger');

            var onOverlayKeydown = function(e) {
                if (e.keyCode === 27) {
                    $trigger.last().focus();
                    $trigger.last().attr('aria-expanded', 'false');
                }
            };

            if (options.type === 'click') {
                $widget.clickFlyout({focusManagement: 'first'});
            } else {
                $widget.hoverFlyout();
                $widget.clickFlyout({focusManagement: 'first', triggerSelector: 'button.flyout__trigger'});
            }

            $overlay.on('keydown', 'a, button', onOverlayKeydown);
        });
    };
}(jQuery));
