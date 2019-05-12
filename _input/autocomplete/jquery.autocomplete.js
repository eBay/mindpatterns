/**
* Copyright 2015 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

/**
* @function jquery.autocomplete.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie <imcburnie@ebay.com>
* @requires @ebay/jquery-next-id
* @requires @ebay/jquery-common-keydown
* @requires @ebay/jquery-active-descendant
* @requires Array.prototype.filter
* @todo this plugin should extend jquery.combobox.js
*/
(function ( $ ) {

    var data = ['Aardvark', 'Albatross', 'Aligator', 'Anteater', 'Baboon',
                'Bear', 'Camel', 'Crow', 'Deer', 'Dog', 'Eel', 'Elk', 'Foal',
                'Fox'];

    $.fn.autocomplete = function autocomplete() {

        return this.each(function onEachAutocomplete() {

            var $widget = $(this),
                $input = $widget.find('input'),
                $listbox = $('<ul>'),
                $statusEl = $('<span>'),
                activeDescendantId;

            $widget.nextId('autocomplete');

            $widget.attr('role', 'application');

            $listbox
                .prop('id', $widget.prop('id') + '-listbox')
                .attr('role','listbox');

            // use commonKeys plugin on input
            $widget.commonKeyDown($input);

            // use activedescendant plugin on input
            $widget.activeDescendant('input', '[role=listbox]', '[role=option]', {axis: 'y'});

            $input
                .attr('role', 'combobox')
                .attr('aria-expanded', 'false')
                .attr('aria-autocomplete', 'list')
                .attr('autocomplete','off') // Disable HTML5 autocomplete
                .attr('aria-owns', $listbox.prop('id'));

            $statusEl
                .addClass('clipped')
                .attr('role', 'status')
                .attr('aria-live', 'polite')
                .attr('aria-atomic', 'true');

            $widget.append($statusEl);
            $widget.append($listbox);

            $listbox.on('click', function(e) {
                $input.val($(this).text());
                $input.focus();
            });

            $widget.on('escapeKeyDown', function (e) {
                if ($('#'+$input.attr('aria-activedescendant')).length !== 0) {
                    $widget.trigger('comboboxCollapse');
                }
                else {
                    $input.val('');
                }
            });

            // ENTER key with active descendant should make selection & dismiss
            // listbox. It should not submit form.
            $widget.on('enterKeyDown', function(e) {
                if ($('#'+$input.attr('aria-activedescendant')).length !== 0) {
                    e.preventDefault();
                    $input.val($('#'+$input.attr('aria-activedescendant')).text());
                    $widget.trigger('comboboxCollapse');
                }
            });

            $widget.on('upArrowKeyDown', function(e) {
                // prevent caret from moving to start
                e.preventDefault();
            });

            // use 'textchange' shim if IE8/9 support is needed
            $input.on('input', function(e) {
                var keyCode = e.keyCode,
                    inputValue = this.value,
                    $active = $listbox.find('#'+$input.attr('aria-activedescendant')),
                    activeText = $active.text();

                $listbox.find('li').remove();

                if (inputValue === '') {
                    $widget.trigger('comboboxCollapse');
                }
                else {
                    // filter data based on the new input text
                    // Array.prototype.filter not supported in IE8
                    var results = data.filter(function (item) {
                        return item.toLowerCase().indexOf(inputValue.toLowerCase()) === 0;
                    });

                    results.forEach(function(item, idx) {
                        $listbox.append('<li role="option">'+item+'</li>');
                    });

                    setTimeout(function() {
                        $statusEl.text($listbox.find('li').length + (($listbox.find('li').length === 1) ? ' suggestion found' : ' suggestions found') + '. Use up and down arrow keys to navigate suggestions.');
                    }, 50);

                    $listbox.css('left', $input.offset().left).width($input.width()).show();
                    $input.attr('aria-expanded', 'true');

                    // notify observers that active descendant items have changed
                    $listbox.trigger('domChange');
                }
            });

            $widget.on('activeDescendantChange', '[role=option]', function(e, data) {
                // $input.val($(this).text());
            });

            $input.on('blur', function onInputBlur(e) {
                setTimeout(function(e) {
                    $widget.trigger('comboboxCollapse');
                }, 250);
            });

            $widget.on('comboboxCollapse', function onCollapse(e) {
                $listbox.hide().empty();
                $input.attr('aria-expanded', 'false');
                $statusEl.text('');
                $listbox.trigger('domChange');
            });
        });
    };
}( jQuery ));
