/**
* Copyright 2015 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

/**
* @file jquery.expando.js
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
*/
(function ( $ ) {

    $.fn.expando = function expando() {

        return this.each(function onEachExpando() {

            var $expandoWidget = $(this),
                $contents = $expandoWidget.find('> *'),
                $liveRegion = $('<div aria-live="polite" />'),
                $container = $('<div/>'),
                $button = $('<button class="button" type="button">Translation</button>');

            // set unique ids
            $expandoWidget.nextId('expando');
            $container.prop('id', $expandoWidget.attr('id') + '-section');

            // wrap the expandable section in a live region
            $contents.wrapAll($liveRegion).wrapAll($container);

            // add ARIA properties & states
            $button
                .attr('aria-controls', $container.prop('id'))
                .attr('aria-expanded', 'false');

            // update state and button label on click
            $button.on('click', function(e) {
                $(this).attr('aria-expanded', $(this).attr('aria-expanded') === 'true' ? 'false' : 'true');
                //$(this).text($(this).text() === 'Show Translation' ? 'Hide Translation' : 'Show Translation');
            });

            // prepend our button
            $expandoWidget.prepend($button);

            // mark our widget as intialised
            $expandoWidget.addClass('expando-js');
        });
    };
}( jQuery ));
