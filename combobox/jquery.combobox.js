/**
* @function jquery.combobox.js
* @author Ian McBurnie <imcburnie@ebay.com>
* @requires jquery-next-id
* @requires jquery-common-keys
* @requires jquery-active-descendant
* @requires jquery.splendid.textchange.js
*
*/
(function ( $ ) {

    var data = ['Aardvark', 'Bear', 'Camel', 'Deer', 'Eel', 'Fox'];

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

            // plugins
            $input.commonKeyDown();
            $input.activeDescendant($listbox.find('> li'));

            $input.on('downArrowKeyDown', function(e) {
                $this.trigger('show');
            });

            $input.on('upArrowKeyDown', function(e) {
                // prevent caret from moving to start
                e.preventDefault();
            });

            // ENTER key with active descendant should make selection & dismiss
            // listbox. It should not submit form.
            $input.on('enterKeyDown', function (e) {
                // check for an active descendant and ENTER key
                if ($input.attr('aria-expanded') == 'true') {
                    e.preventDefault();
                    $this.trigger('dismiss');
                }
            });

            $input.on('focus', function(e) {
                if (options.showOnFocus === true && $input.attr('aria-expanded') == 'false') {
                    $this.trigger('show');
                }
            });

            $button.on('click', function(e) {
                $input.focus();
                if (options.showOnFocus !== true) {
                    $this.trigger($input.attr('aria-expanded') == 'true' ? 'dismiss' : 'show');
                }
            });

            $listbox.on('click', function(e) {
                $input.val($(e.target).text());
                $input.focus();
            });

            $input.on('activeDescendantChange', function(e, item) {
                $input.val($(item).text());
            });

            $input.on('blur', function onInputBlur(e) {
                blurTimer = setTimeout(function(e) {
                    $this.trigger('dismiss');
                }, 100);
            });

            $input.on('escapeKeyDown', function (e) {
                if($input.attr('aria-expanded') == 'true') {
                    $this.trigger('dismiss');
                }
                else {
                    $input.val('');
                }
            });

            $this.on('dismiss', function onDismiss(e) {
                $input.attr('aria-expanded', 'false');
            });

            $this.on('show', function onShow(e) {
                clearTimeout(blurTimer);
                $input.attr('aria-expanded', 'true');
            });

            $this.append($button);
            $this.append($instructionsEl);
            $this.append($listbox);
        });
    };
}( jQuery ));
