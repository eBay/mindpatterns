/**
* @function jquery.autocomplete.js
* @author Ian McBurnie <imcburnie@ebay.com>
* @requires @ebay/jquery-next-id
* @requires @ebay/jquery-common-keydown
* @requires @ebay/jquery-active-descendant
* @requires jquery.splendid.textchange.js
* @requires Array.prototype.filter
* @todo this plugin should extend jquery.combobox.js
*/
(function ( $ ) {

    var data = ['Aardvark', 'Albatross', 'Aligator', 'Anteater', 'Baboon',
                'Bear', 'Camel', 'Crow', 'Deer', 'Dog', 'Eel', 'Elk', 'Foal',
                'Fox'];

    $.fn.autocomplete = function autocomplete() {

        return this.each(function onEachAutocomplete() {

            var $this = $(this),
                $input = $this.find('input'),
                $listbox = $('<ul>'),
                $statusEl = $('<span>'),
                activeDescendantId;

            $this.nextId('autocomplete');

            $this.attr('role', 'application');

            $listbox
                .prop('id', $this.prop('id') + '-listbox')
                .attr('role','listbox');

            // use commonKeys plugin on input
            $input.commonKeyDown();

            // use activedescendant plugin on input
            $this.activeDescendant($input);

            $input
                .attr('role', 'combobox')
                .attr('aria-expanded', 'false')
                .attr('aria-autocomplete', 'list')
                .attr('autocomplete','off') // Disable HTML5 autocomplete
                .attr('aria-owns', $listbox.prop('id'));

            $statusEl
                .addClass('accessAid')
                .attr('role', 'status')
                .attr('aria-live', 'polite')
                .attr('aria-atomic', 'true');

            $this.append($statusEl);
            $this.append($listbox);

            $listbox.on('click', function(e) {
                $input.val($(e.target).text());
                $input.focus();
            });

            $input.on('escapeKeyDown', function (e) {
                if ($('#'+$input.attr('aria-activedescendant')).size() !== 0) {
                    $this.trigger('dismiss');
                }
                else {
                    $input.val('');
                }
            });

            // ENTER key with active descendant should make selection & dismiss
            // listbox. It should not submit form.
            $input.on('enterKeyDown', function(e) {
                if ($('#'+$input.attr('aria-activedescendant')).size() !== 0) {
                    e.preventDefault();
                    $this.trigger('dismiss');
                }
            });

            $input.on('upArrowKeyDown', function(e) {
                // prevent caret from moving to start
                e.preventDefault();
            });

            // just use 'input' event if IE8 support is not needed
            $input.on('textchange', function(e) {
                var keyCode = e.keyCode,
                    inputValue = this.value,
                    $active = $listbox.find('#'+$input.attr('aria-activedescendant')),
                    activeText = $active.text();

                $listbox.find('li').remove();

                if (inputValue === '') {
                    $this.trigger('dismiss');
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

                    // update activedescendant plugin with new data
                    $input.trigger('updateActiveDescendantCollection', [$listbox.find('li')]);

                    setTimeout(function() {
                        $statusEl.text($listbox.find('li').size() + (($listbox.find('li').size() === 1) ? ' suggestion found' : ' suggestions found') + '. Use up and down arrow keys to navigate suggestions.');
                    }, 50);

                    $listbox.css('left', $input.offset().left).width($input.width()).show();
                    $input.attr('aria-expanded', 'true');
                }
            });

            $this.on('activeDescendantChange', function(e, newActiveDescendant) {
                $input.val($(newActiveDescendant).text());
            });

            $input.on('blur', function onInputBlur(e) {
                setTimeout(function(e) {
                    $this.trigger('dismiss');
                }, 250);
            });

            $this.on('dismiss', function onAutocompleteDismiss(e) {
                $input.trigger('updateActiveDescendantCollection', []);
                $listbox.hide().empty();
                $input.attr('aria-expanded', 'false');
                $statusEl.text('');
            });
        });
    };
}( jQuery ));
