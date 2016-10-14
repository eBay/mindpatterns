/**
* @file jQuery plugin that creates the basic interactivity for a bubble help flyout
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @requires jquery-click-flyout
* @requires jquery-hijax-button
* @version 0.0.1
* @author Ian McBurnie <ianmcburnie@hotmail.com>
*/
(function($, window, document, undefined) {
    $.fn.bubbleHelp = function() {
        return this.each(function onEach() {
            var $widget = $(this);
            var $button = $widget.find('.flyout__trigger');
            var $link = $widget.find('> a');

            // check for progressive enhancement of anchor tag
            if ($link.length === 1) {

                // hijax the link with button semantics and behaviour
                $link.hijaxButton();

                // move referenced content into adjacent overlay and transform link to button
                var href = $link.attr('href');
                var contentId = href.substring(href.indexOf('#') + 1);
                var $content = $('#' + contentId).html();

                var $newLiveRegion = $('<span class="flyout__live-region" aria-live="polite"></span>');
                var $newOverlay = $('<div class="flyout__overlay"></div>');

                $link.addClass('flyout__trigger');
                $link.attr('aria-label', 'Help');
                $link.attr('href', ''); // weird bug in chromevox without this
                $link.text(''); // weird keyboard bug in jaws + ie without this

                $newOverlay.append($content);
                $newLiveRegion.append($newOverlay);
                $link.after($newLiveRegion);
            }

            // call click flyout plugin which does most of the work
            $widget.clickFlyout({autoCollapse: false});

            // button is ready to use
            $button.prop('disabled', false);

            // mark the widget as done
            $widget.addClass('bubblehelp--js');
        });
    };
}(jQuery, window, document));
