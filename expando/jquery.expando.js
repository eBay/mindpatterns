/**
* jquery.expando.js
* @author Ian McBurnie (imcburnie@ebay.com)
*/
(function ( $ ) {

    $.fn.expando = function expando() {

        return this.each(function onEachExpando() {

            var $expandoWidget = $(this),
                $contents = $expandoWidget.find('> *'),
                $liveRegion = $('<div aria-live="polite" />'),
                $container = $('<div/>'),
                $button = $('<button type="button">Show Translation</button>');

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
                $(this).text($(this).text() === 'Show Translation' ? 'Hide Translation' : 'Show Translation');
            });

            // prepend our button
            $expandoWidget.prepend($button);

            // mark our widget as intialised
            $expandoWidget.addClass('expando-js');
        });
    };
}( jQuery ));
