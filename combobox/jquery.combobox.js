/**
* @function jquery.combobox.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie <imcburnie@ebay.com>
* @requires @ebay/jquery-next-id
* @requires @ebay/jquery-common-keydown
* @requires @ebay/jquery-active-descendant
* @requires @ebay/jquery-click-flyout
*/
(function ( $ ) {
    var data = ['Playstation 3', 'Playstation 4', 'Xbox 360', 'Xbox One', 'Wii', 'Wii U'];

    $.fn.combobox = function combobox(options) {
        options = options || {};

        return this.each(function onEachCombobox() {
            var $widget = $(this),
                $input = $widget.find('> input'),
                $button = $('<button>'),
                $listbox = $('<ul>'),
                $instructionsEl = $('<span>'),
                blurTimer;

            $widget.nextId('combobox');

            $widget
                .attr('role', 'application')
                .addClass('flyout');

            $input
                .attr('role', 'combobox')
                .attr('autocomplete','off') // Disable HTML5 autocomplete
                .attr('aria-owns', $listbox.prop('id'))
                .attr('aria-describedby', $instructionsEl.prop('id'))
                .addClass('flyout__trigger');

            $button
                .attr('type', 'button')
                .attr('tabindex', '-1')
                .attr('aria-label', 'Expand suggestions');

            $listbox
                .prop('id', $widget.prop('id') + '-listbox')
                .css('width', $input.css('width'))
                .attr('role', 'listbox')
                .addClass('flyout__overlay')

            data.forEach(function(item, idx) {
                $listbox.append('<li role="option">'+item+'</li>');
            });

            $instructionsEl
                .addClass('combobox__description')
                .prop('id', $widget.prop('id') + '-instructions')
                .text('Combobox list has 6 options. Use down key to navigate.');

            // DOM manipulation
            $widget.append($button);
            $widget.append($instructionsEl);
            $widget.append($listbox);

            // plugins
            $widget.commonKeyDown();
            $widget.activeDescendant($input, '[role=option]', {axis: 'y'});
            $widget.focusFlyout({autoExpand: options.autoExpand});

            var isExpanded = function() {
                return $input.attr('aria-expanded') === 'true';
            };

            var expandCombobox = function() {
                clearTimeout(blurTimer);
                $input.attr('aria-expanded', 'true');
                $widget.trigger('comboboxExpand');
            };

            var collapseCombobox = function() {
                $input.attr('aria-expanded', 'false');
                $widget.trigger('comboboxCollapse');
            };

            var toggleCombobox = function() {
                var _void = isExpanded() ? collapseCombobox() : expandCombobox();
            };

            var onComboboxEscape = function(e) {
                var _void = isExpanded() ? collapseCombobox() : $input.val('');
            };

            var onActiveDescendantChange = function(e) {
                // console.log(e, this, data);
            };

            var onListboxClick = function(e) {
                $input.val($(this).text());
                var _void = toggleCombobox();
            };

            var onComboboxUpArrow = function(e) {
                // prevent caret from moving to start
                e.preventDefault();
                expandCombobox();
            };

            var onComboboxDownArrow = function(e) {
                expandCombobox();
            };

            var onComboboxEnterKey = function(e) {
                // if combobox is expanded
                if (isExpanded()) {
                    // update combobox value
                    $input.val($listbox.find('[aria-selected=true]').text());
                    // prevent form submission
                    e.preventDefault();
                    collapseCombobox();
                }
            };

            var onButtonClick = function(e) {
                toggleCombobox();
            };

            // listen for events
            $widget.on('downArrowKeyDown', '[role=combobox]', onComboboxDownArrow);
            $widget.on('upArrowKeyDown', '[role=combobox]', onComboboxUpArrow);
            $widget.on('enterKeyDown', '[role=combobox]', onComboboxEnterKey);
            $widget.on('activeDescendantChange', '[role=option]', onActiveDescendantChange);
            $widget.on('escapeKeyDown', '[role=combobox]', onComboboxEscape);
            $button.on('click', onButtonClick);
            $listbox.on('click', '[role=option]', onListboxClick);
        });
    };
}( jQuery ));
