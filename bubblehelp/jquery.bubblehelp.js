/**
* @file jQuery plugin that creates the basic interactivity for a bubble help flyout
* @version 0.0.1
* @author Ian McBurnie <ianmcburnie@hotmail.com>
*/
(function($, window, document, undefined) {
    $.fn.bubbleHelp = function() {
        return this.each(function onEach() {
            var $bubblehelpWidget = $(this);
            var $button = $bubblehelpWidget.find('> button');
            var $link = $bubblehelpWidget.find('> a');

            // if anchor tag, grab referenced content and transform link to button
            if ($link.length === 1) {
                var href = $link.attr('href');
                var contentId = href.substring(href.indexOf('#') + 1);
                var $content = $('#' + contentId);

                $link.attr('aria-label', 'Help');
                $link.attr('role', 'button');
                $link.attr('href', ''); // weird bug in chromevox without this
                $link.text(''); // weird keyboard bug in jaws + ie without this

                $link.after($content);
            }

            // call button flyout plugin which does most of the work
            $bubblehelpWidget.buttonFlyout({isLiveRegion: true});

            // button is ready to use
            $button.prop('disabled', false);

            // mark the widget as done
            $bubblehelpWidget.addClass('bubblehelp--js');
        });
    };
}(jQuery, window, document));
