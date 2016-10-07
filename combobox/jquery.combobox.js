/**
* @function jquery.combobox.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie <imcburnie@ebay.com>
* @requires @ebay/jquery-next-id
* @requires @ebay/jquery-common-keydown
* @requires @ebay/jquery-active-descendant
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

            $widget.attr('role', 'application');

            $listbox
                .prop('id', $widget.prop('id') + '-listbox')
                .css('width', $input.css('width'))
                .attr('role','listbox');

            data.forEach(function(item, idx) {
                $listbox.append('<li role="option">'+item+'</li>');
            });

            $instructionsEl
                .prop('id', $widget.prop('id') + '-instructions')
                .text('Combobox list has 6 options. Use down key to navigate.');

            $input
                .attr('role', 'combobox')
                .attr('aria-expanded', 'false')
                .attr('autocomplete','off') // Disable HTML5 autocomplete
                .attr('aria-owns', $listbox.prop('id'))
                .attr('aria-describedby', $instructionsEl.prop('id'));

            $button
                .attr('type', 'button')
                .attr('tabindex', '-1')
                .attr('aria-label', 'Expand suggestions');

            $widget.append($button);
            $widget.append($instructionsEl);
            $widget.append($listbox);

            // plugins
            $widget.commonKeyDown();
            $widget.activeDescendant($input, '[role=option]', {axis: 'y'});

            $widget.on('downArrowKeyDown', function(e) {
                $widget.trigger('comboboxExpand');
            });

            $widget.on('upArrowKeyDown', function(e) {
                // prevent caret from moving to start
                e.preventDefault();
                $widget.trigger('comboboxExpand');
            });

            // ENTER key with active descendant should make selection & dismiss
            // listbox. It should not submit form.
            $widget.on('enterKeyDown', function (e) {
                $input.val($listbox.find('[aria-selected=true]').text());
                // check for an active descendant and ENTER key
                if ($input.attr('aria-expanded') == 'true') {
                    e.preventDefault();
                    $widget.trigger('comboboxCollapse');
                }
            });

            $input.on('focus', function(e) {
                if (options.showOnFocus === true && $input.attr('aria-expanded') == 'false') {
                    $widget.trigger('comboboxExpand');
                }
            });

            $input.on('blur', function onInputBlur(e) {
                blurTimer = setTimeout(function(e) {
                    $widget.trigger('comboboxCollapse');
                }, 100);
            });

            $button.on('click', function(e) {
                $widget.trigger($input.attr('aria-expanded') == 'true' ? 'comboboxCollapse' : 'comboboxExpand');
            });

            $listbox.on('click', function(e) {
                $input.val($(e.target).text());
                $widget.trigger($input.attr('aria-expanded') == 'true' ? 'comboboxCollapse' : 'comboboxExpand');
            });

            $widget.on('activeDescendantChange', '[role=option]', function(e, data) {
                console.log(this, data);
            });

            $widget.on('escapeKeyDown', function (e) {
                if($input.attr('aria-expanded') == 'true') {
                    $widget.trigger('comboboxCollapse');
                }
                else {
                    $input.val('');
                }
            });

            $widget.on('comboboxCollapse', function onCollapse(e) {
                $input.attr('aria-expanded', 'false');
            });

            $widget.on('comboboxExpand', function onExpand(e) {
                clearTimeout(blurTimer);
                $input.attr('aria-expanded', 'true');
            });
        });
    };
}( jQuery ));
