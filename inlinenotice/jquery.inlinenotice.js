/**
* jquery.elementnotice.js
* @author Ian McBurnie (imcburnie@ebay.com)
*/
(function ( $ ) {

    $.fn.inlinenotice = function inlinenotice() {

        return this.each(function onEach() {

            var $this = $(this),
                $interactiveElement = $this.children().first(),
                $liveRegion = $('<span aria-live="polite" />');

            $liveRegion.nextId('inline-notice');
            $interactiveElement.attr('aria-describedby', $liveRegion.attr('id'));
            $this.append($liveRegion);
        });
    };
}( jQuery ));
