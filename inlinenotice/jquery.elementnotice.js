/**
* jquery.elementnotice.js
* @author Ian McBurnie (imcburnie@ebay.com)
*/
(function ( $ ) {

    $.fn.elementnotice = function elementNotice() {

        return this.each(function onEach() {

            var $this = $(this),
                $interactiveElement = $this.children().first(),
                $liveRegion = $('<span aria-live="polite" />');

            $liveRegion.nextId('elementnotice');
            $interactiveElement.attr('aria-describedby', $liveRegion.attr('id'));
            $this.append($liveRegion);
        });
    };
}( jQuery ));
