/**
* Copyright 2015 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

/**
* @file jquery.elementnotice.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie <ianmcburnie@hotmail.com>
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
