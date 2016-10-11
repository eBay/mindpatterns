/**
* @file jQuery plugin that creates the basic interactivity for a bubble help flyout
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @version 0.0.1
* @author Ian McBurnie <ianmcburnie@hotmail.com>
*/
(function($, window, document, undefined) {
    $.fn.bubbleHelp = function() {
        return this.each(function onEach() {
            var $widget = $(this);
            var $button = $widget.find('.bubblehelp__button');
            var $link = $widget.find('> a');

            // check for progressive enhancement of anchor tag
            if ($link.length === 1) {
                // move referenced content into adjacent overlay and transform link to button
                var href = $link.attr('href');
                var contentId = href.substring(href.indexOf('#') + 1);
                var $content = $('#' + contentId).html();

                var $newLiveRegion = $('<span class="bubblehelp__live-region" aria-live="polite"></span>');
                var $newOverlay = $('<div class="bubblehelp__overlay"></div>');

                $link.addClass('bubblehelp__button');
                $link.attr('aria-label', 'Help');
                $link.attr('role', 'button');
                $link.attr('href', ''); // weird bug in chromevox without this
                $link.text(''); // weird keyboard bug in jaws + ie without this

                $newOverlay.append($content);
                $newLiveRegion.append($newOverlay);
                $link.after($newLiveRegion);
            }

            // call button flyout plugin which does most of the work
            $widget.buttonFlyout();

            // button is ready to use
            $button.prop('disabled', false);

            // mark the widget as done
            $widget.addClass('bubblehelp--js');
        });
    };
}(jQuery, window, document));
