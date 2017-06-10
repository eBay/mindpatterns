/**
* @function jquery.customcheckbox.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie (imcburnie@ebay.com)
*/
(function ( $ ) {

    $.fn.ariacheckbox = function() {

        return this.each(function onEach() {

            var $checkbox = $(this),
                $input = $checkbox.find('input[type=checkbox]'),
                $form = $checkbox.closest('form'),
                $customInput = $('<span role="checkbox" class="checkbox__icon" />'),
                $svg = $('<svg aria-hidden="true" focusable="false"><use xlink:href="../../svg/icons.svg#svg-icon-checkbox"></use></svg>'),
                $explicitLabel = $checkbox.find('[for=' + $input.attr('id') + ']'),
                labelId;

            // set unique widget id
            $checkbox.nextId('checkbox');

            labelId = $checkbox.attr('id') + '-label';

            // if real input has programmatic label, we must transfer it
            if ($explicitLabel.length === 1) {
                $explicitLabel.attr('id', labelId);
                $customInput.attr('aria-labelledby', labelId);
            }
            else {
                // voiceover has issue with implicit label, so make it explicit
                $customInput.attr('aria-labelledby', $checkbox.attr('id'));
            }

            // if real input element has state, we must copy it
            $customInput.attr('aria-checked', $input.prop('checked'));

            // hide real input element
            $input.prop('hidden', true);

            // add custom checkbox element to tabindex
            $customInput.attr('tabindex', '0');

            $customInput.append($svg);

            // insert custom checkbox element
            $input.after($customInput);

            // plugins
            $checkbox.commonKeyDown();

            // make sure ENTER key submits form
            $checkbox.on('enterKeyDown', function onEnterKey(e) {
                $form.submit();
            });

            // listener for custom radios with explicit label
            $checkbox.on('click', 'span[aria-labelledby]', function onClick(e) {
                $checkbox.trigger('check');
            });

            // for mouse users, clicking label will trigger change event
            $input.on('change', function onChange(e) {
                $customInput.attr('aria-checked', $input.prop('checked'));
            })

            // trigger custom check event on SPACEBAR
            $checkbox.on('spaceKeyDown', function onSpacebar(e) {
                $checkbox.trigger('check');
            });

            // custom check event toggles checked property and aria state
            $checkbox.on('check', function onCheck(e) {
                $input.prop('checked', !$input.prop('checked'));
                $customInput.attr('aria-checked', $input.prop('checked'));
            });

            $('.ariacheckbox').preventScrollKeys('[role=checkbox]');

            $checkbox.addClass('ariacheckbox--js');
        });
    };
}( jQuery ));
