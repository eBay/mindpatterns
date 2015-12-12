/**
* @function jquery.tabs.js
* @version 0.0.1
* @author Ian McBurnie <imcburnie@ebay.com>
* @requires jquery-next-id
* @requires jquery-roving-tabindex
*/
(function ( $ ) {

    $.fn.tabs = function tabs (options) {

        var options = options || {};

        return this.each(function onEach() {

            var $tabsWidget = $(this),
                $tablist = $tabsWidget.find('> ul:first-child, > ol:first-child, > div:first-child'),
                $tabs = $tablist.find('> li, > div'),
                $links = $tablist.find('a'),
                $panelcontainer = $tabsWidget.find('> div:last-child'),
                $panels = $panelcontainer.find('> div'),
                $panelHeadings = $panels.find('> h2:first-child, > h3:first-child');

            // set a unique widget id
            $tabsWidget.nextId('tabs');

            // add required ARIA roles, states and properties
            // first tabpanel is selected by default
            $tablist
                .attr('role', 'tablist');

            $tabs
                .attr('role', 'tab')
                .attr('aria-selected', 'false')
                .first()
                    .attr('aria-selected', 'true');

            $panels
                .attr('role', 'tabpanel')
                .attr('aria-hidden', 'true')
                .first()
                    .attr('aria-hidden', 'false');

            $panelHeadings.attr('aria-hidden', 'true');

            // remove hyperlink behaviour from links
            $links
                .attr('role', 'presentation')
                .removeAttr('href');

            if (options.livePanels === true) {
                $panelcontainer.attr('aria-live', 'polite');
            }

            // all panels are labelled and controlled by their respective tab
            $tabs.each(function onEachTab(idx, el) {
                var $tab = $(el),
                    tabId = $tabsWidget.attr('id') + '-tab-' + idx,
                    panelId = $tabsWidget.attr('id') + '-panel-' + idx;

                $tab
                    .attr('id', tabId)
                    .attr('aria-controls', panelId);

                $panels.eq(idx)
                    .attr('id', panelId)
                    .attr('aria-labelledby', tabId);
            });

            $tabs.on('click', function(e) {
                $tabsWidget.trigger('select', $(this));
            });

            // Create a roving tab index on tabs
            $tabs.rovingTabindex($tabsWidget.prop('id'));

            $tabsWidget.on('select change.rovingTabindex', function(e, selectedTab) {
                var $selectedTab = $(selectedTab),
                    $activeTab = $tablist.find('[aria-selected=true]'),
                    $activePanel = $panelcontainer.find('[aria-labelledby={0}]'.replace('{0}', $activeTab.attr('id'))),
                    $selectedPanel = $panelcontainer.find('[aria-labelledby={0}]'.replace('{0}', $selectedTab.attr('id')));

                if ($selectedTab[0] !== $activeTab[0]) {
                    $activePanel.attr('aria-hidden', 'true');
                    $selectedPanel.attr('aria-hidden', 'false');

                    $selectedTab.attr('aria-selected', 'true');

                    // update keyboard focus on next tick
                    setTimeout(function onTimeout() {
                        $selectedTab.focus();
                        // deselect activeTab last to prevent focus issues
                        $activeTab.attr('aria-selected', 'false');
                    }, 0);
                }
            });

            // call plugin to prevent page scroll
            $('.tabs [role=tab]').preventDocumentScrollKeys();

            // mark widget as initialised
            $tabsWidget.addClass('tabs--js');
        });
    };
}( jQuery ));
