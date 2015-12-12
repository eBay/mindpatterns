/**
* @function jquery.accordion.js
* @author Ian McBurnie <imcburnie@ebay.com>
* @requires jquery-next-id
* @requires jquery-roving-tabindex
*/
(function ( $ ) {

    $.fn.accordion = function accordion(options) {

        var options = options || {};

        return this.each(function onEach() {

            var $accordionWidget = $(this),
                $items = $accordionWidget.find('> div'),
                $headings = $items.find('> h3'),
                $panels = $items.find('> div');

            // set a unique widget id
            $accordionWidget.nextId('accordion');

            // option: make screenreader announce expanded tab content (default: true)
            $accordionWidget.attr('aria-live', options.live === false ? 'off' : 'polite');

            // add required ARIA roles, states and properties
            $accordionWidget.attr('role', 'tablist');

            $headings
                .attr('role', 'tab')
                .attr('aria-selected', 'false')

            $panels
                .attr('role', 'tabpanel')
                .attr('aria-hidden', 'true');

            // all panels are labelled and controlled by their respective tab
            $headings.each(function(idx, tabEl) {
                var tabId = $accordionWidget.attr('id') + '-tab-' + idx,
                    panelId = $accordionWidget.attr('id') + '-panel-' + idx;

                $(tabEl).attr('id', tabId).attr('aria-controls', panelId);
                $panels.eq(idx).attr('id', panelId).attr('aria-labelledby', tabId);
            });

            $headings.on('click', function(e) {
                $accordionWidget.trigger('select', $(this));
            });

            // Create a roving tab index on headings
            // roving tab index also calls keyhandlers plugin
            $headings.rovingTabindex($accordionWidget.prop('id'));

            $headings.on('space.commonKeyDown enter.commonKeyDown', function(e) {
                $accordionWidget.trigger('select', $(this));
            });

            $accordionWidget.on('setfocus change.rovingTabindex', function(e, focusTab) {
                window.setTimeout( function onTimeout(e){
                    $(focusTab).focus();
                }, 0);
            });

            $accordionWidget.on('select', function(e, selectedTab) {
                var $selectedTab = $(selectedTab),
                    isSelected = $selectedTab.attr('aria-selected') == 'true';

                $selectedTab.attr('aria-selected', !isSelected);
                $selectedTab.attr('aria-expanded', !isSelected);
                $selectedTab.next().attr('aria-hidden', isSelected);

                $accordionWidget.trigger('setfocus', $selectedTab);
            });

            // call plugin to prevent page scroll
            $('.accordion [role=tab]').preventDocumentScrollKeys();

            // mark widget as initialised
            $accordionWidget.addClass('accordion-js');
        });
    };
}( jQuery ));
