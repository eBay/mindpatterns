/**
* @function jquery.accordion.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @requires jquery-next-id
* @requires jquery-roving-tabindex
*/
(function ( $ ) {

    $.fn.accordion = function accordion(options) {

        var options = options || {};

        return this.each(function onEach() {

            var $accordionWidget = $(this),
                $items = $accordionWidget.find('> div'),
                $tabs = $items.find('> h4'),
                $panels = $items.find('> div');

            // set a unique widget id
            $accordionWidget.nextId('accordion');

            // option: make screenreader announce expanded tab content (default: true)
            $accordionWidget.attr('aria-live', options.live === false ? 'off' : 'polite');

            // add required ARIA roles, states and properties
            $accordionWidget.attr('role', 'tablist');

            $tabs
                .attr('role', 'tab')
                .attr('aria-selected', 'false')

            $panels
                .attr('role', 'tabpanel')
                .attr('aria-hidden', 'true');

            // all panels are labelled and controlled by their respective tab
            $tabs.each(function(idx, tabEl) {
                var tabId = $accordionWidget.attr('id') + '-tab-' + idx,
                    panelId = $accordionWidget.attr('id') + '-panel-' + idx;

                $(tabEl).attr('id', tabId).attr('aria-controls', panelId);
                $panels.eq(idx).attr('id', panelId).attr('aria-labelledby', tabId);
            });

            $accordionWidget.commonKeyDown($tabs);

            // Create a roving tab index on headings
            // roving tab index also calls keyhandlers plugin
            $accordionWidget.rovingTabindex('[role=tab]');

            $accordionWidget.on('click spaceKeyDown enterKeyDown', function(e) {
                $accordionWidget.trigger('select', e.originalEvent.target);
            });

            $accordionWidget.on('select', function(e, selectedTab) {
                var $selectedTab = $(selectedTab),
                    isSelected = $selectedTab.attr('aria-selected') == 'true';

                $selectedTab.attr('aria-selected', !isSelected);
                $selectedTab.attr('aria-expanded', !isSelected);
                $selectedTab.next().attr('aria-hidden', isSelected);
            });

            // call plugin to prevent page scroll
            $accordionWidget.preventScrollKeys($tabs);

            // mark widget as initialised
            $accordionWidget.addClass('accordion-js');
        });
    };
}( jQuery ));
