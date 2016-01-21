/**
* @function jquery.bubblehelp.js
* @author Ian McBurnie (imcburnie@ebay.com)
*/
(function ( $ ) {

    $.fn.bubbleHelp = function () {

        return this.each(function () {

            var $bubblehelpWidget = $(this),
                $button = $bubblehelpWidget.find('> a'),
                href = $button.attr('href'),
                contentId = href.substring(href.indexOf('#') + 1),
                $content = $('#' + contentId),
                hasFocus = false,
                offset = $bubblehelpWidget.offset(),
                $liveRegion = $('<span aria-live="polite"/>');

            $button.attr('aria-label', 'Help');
            $button.attr('aria-controls', contentId);
            $button.attr('aria-expanded', 'false');
            $button.attr('role', 'button');

            // workarounds
            $button.attr('href', ''); // weird bug in chromevox without this
            $button.text(''); // weird keyboard bug in jaws + ie without this

            $content.addClass('bubblehelp-content');

            // plugins
            $bubblehelpWidget.commonKeyDown();
            $button.commonKeyDown();

            // place the content inline after the button
            // this creates a logical reading/tabindex order
            $liveRegion.append($content);
            $button.after($liveRegion);

            $content.css('left', offset.left + $button.outerWidth());

            $button.on('click', function (e) {
                e.preventDefault();
                $(this).focus();
                $bubblehelpWidget.trigger('toggle');
            });

            $button.on('spaceKeyDown', function (e) {
                e.preventDefault();
                $bubblehelpWidget.trigger('toggle');
            });

            $content.on('focusin', function (e) {
                hasFocus = true;
            });

            $content.on('focusout', function (e) {
                hasFocus = false;
            });

            $bubblehelpWidget.on('toggle', function (e) {
                var eventName = ($button.attr('aria-expanded') === 'false') ? 'show' : 'hide';

                $bubblehelpWidget.trigger(eventName);
            });

            $bubblehelpWidget.on('show', function (e) {
                $button.attr('aria-expanded', 'true');
                $content.fadeIn('fast');

                $bubblehelpWidget.trigger('sticky');

                $(window).on('scroll', function(e) {
                    $bubblehelpWidget.trigger('sticky');
                });
            });

            $bubblehelpWidget.on('hide', function (e) {
                $(window).off('scroll');

                $button.attr('aria-expanded', 'false');
                $content.fadeOut('fast');

                if (hasFocus === true) {
                    $button.focus();
                }
            });

            $bubblehelpWidget.on('escapeKeyDown', function (e) {
                $bubblehelpWidget.trigger('hide');
            });

            $bubblehelpWidget.on('sticky', function (e) {
                $content.css('top', offset.top - $(window).scrollTop() - Math.round($content.outerHeight() / 3) + 'px');
            });

            $bubblehelpWidget.addClass('bubblehelp-js');
        });
    };
}( jQuery ));
