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
            var $this = $(this),
                $input = $this.find('> input'),
                $button = $('<button>'),
                $listbox = $('<ul>'),
                $instructionsEl = $('<span>'),
                blurTimer;

            $this.nextId('combobox');

            $this.attr('role', 'application');

            $listbox
                .prop('id', $this.prop('id') + '-listbox')
                .css('width', $input.css('width'))
                .attr('role','listbox');

            data.forEach(function(item, idx) {
                $listbox.append('<li role="option">'+item+'</li>');
            });

            $instructionsEl
                .prop('id', $this.prop('id') + '-instructions')
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

            $this.append($button);
            $this.append($instructionsEl);
            $this.append($listbox);

            // plugins
            $this.commonKeyDown($input);
            $this.activeDescendant($input, '[role=option]');

            $this.on('downArrowKeyDown', function(e) {
                $this.trigger('comboboxExpand');
            });

            $this.on('upArrowKeyDown', function(e) {
                // prevent caret from moving to start
                e.preventDefault();
                $this.trigger('comboboxExpand');
            });

            // ENTER key with active descendant should make selection & dismiss
            // listbox. It should not submit form.
            $this.on('enterKeyDown', function (e) {
                $input.val($listbox.find('[aria-selected=true]').text());
                // check for an active descendant and ENTER key
                if ($input.attr('aria-expanded') == 'true') {
                    e.preventDefault();
                    $this.trigger('comboboxCollapse');
                }
            });

            $input.on('focus', function(e) {
                if (options.showOnFocus === true && $input.attr('aria-expanded') == 'false') {
                    $this.trigger('comboboxExpand');
                }
            });

            $input.on('blur', function onInputBlur(e) {
                blurTimer = setTimeout(function(e) {
                    $this.trigger('comboboxCollapse');
                }, 100);
            });

            $button.on('click', function(e) {
                $this.trigger($input.attr('aria-expanded') == 'true' ? 'comboboxCollapse' : 'comboboxExpand');
            });

            $listbox.on('click', function(e) {
                $input.val($(e.target).text());
                $this.trigger($input.attr('aria-expanded') == 'true' ? 'comboboxCollapse' : 'comboboxExpand');
            });

            $this.on('activeDescendantChange', function(e, newActiveDescendant) {
                // hack/workaround for Safari is an autocomplete type behaviour
                //$input.val($(newActiveDescendant).text());
                console.log(e);
            });

            $this.on('escapeKeyDown', function (e) {
                if($input.attr('aria-expanded') == 'true') {
                    $this.trigger('comboboxCollapse');
                }
                else {
                    $input.val('');
                }
            });

            $this.on('comboboxCollapse', function onCollapse(e) {
                $input.attr('aria-expanded', 'false');
            });

            $this.on('comboboxExpand', function onExpand(e) {
                clearTimeout(blurTimer);
                $input.attr('aria-expanded', 'true');
            });
        });
    };
}( jQuery ));
