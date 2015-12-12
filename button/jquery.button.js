/**
* @function jquery.button.js
* @author Ian McBurnie <imcburnie@ebay.com>
* @desc An example of what is required to make any element equivalent to a
* button element. In practice this should only ever be used on hyperlinks that
* require progressively enchancing to buttons (hijaxing).
*/
(function ( $ ) {

    $.fn.button = function button() {

        return this.each(function onEachButton() {

            var $this = $(this),
                isKeydown = false;

            $this.commonKeys();

            $this
                .attr('role', 'button')
                .attr('tabindex', '0');

            $this.on('space.commonKeyDown enter.commonKeyDown', function(e) {
                e.preventDefault();
                isKeydown = true;
                $this.trigger('_click');
            });

            $this.on('click', function(e) {
                e.preventDefault();
                // enter key on links will fire a click event too. so we must be
                // careful to only fire once (via the enterkeydown handler).
                if(isKeydown === false) {
                    $this.trigger('_click');
                }
            });

            $this.on('_click', function(e) {
                $this.trigger('clicked');
            });

            $this.on('spacekeyup enterkeyup', function(e) {
                isKeydown = false;
            });

            // mark our widget as intialised
            $this.addClass('button-js');
        });
    };
}( jQuery ));
