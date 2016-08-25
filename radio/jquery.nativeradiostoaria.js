/**
* @function jquery.nativeradiostoaria.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @desc Converts native HTML radio group markup to ARIA radio group markup.
* Does not add any behaviour! Use jquery.ariaradiogroup.js for that.
* @requires jquery-next-id
*/
(function ( $ ) {
    $.fn.nativeRadiosToAria = function nativeRadiosToAria() {
        return this.each(function onEachItem() {
            var $widget = $(this),
                $fieldset = $widget.find('> fieldset'),
                $legend = $fieldset.find('> legend'),
                $items = $fieldset.find('> span, > div'),
                $labels = $fieldset.find('label');

            // set a unique widget id
            $widget.nextId('radiogroup');

            // set a unique legend id
            $legend.prop('id', $widget.prop('id') + '-legend');

            // add the new class in order to receive ARIA styles
            $widget.addClass('aria-radio-group');

            // various BEM element classes
            $legend.addClass('aria-radio-group__legend');
            $items.addClass('aria-radio__container');
            $labels.addClass('aria-radio__label');

            // custom radios must live inside a labelled radiogroup
            // note that using the existing fieldset tag causes an incorrect item count in voiceover
            $items.wrapAll('<div class="aria-radio-group__fieldset" role="radiogroup" aria-labelledby="'+$legend.prop('id')+'"></div>');

            // presentation role on containers fixes issue with wrong radio button count in voiceover
            $items.attr('role', 'presentation');

            // inject ARIA radios after each native radio
            $fieldset.find('input[type=radio]').each(function onEachNativeRadio(index, nativeRadio) {
                var $nativeRadio = $(nativeRadio),
                    $explicitLabel = $widget.find('[for=' + $nativeRadio.attr('id') + ']'),
                    $customRadio = $('<span>'),
                    labelId;

                $customRadio.attr('role', 'radio');

                // if native input has programmatic label we must transfer it to custom radio
                if ($explicitLabel.length === 1) {
                    labelId = $widget.attr('id') + '-label-' + index;
                    $explicitLabel.attr('id', labelId);
                    $customRadio.attr('aria-labelledby', labelId);

                    // prevent voiceover treating label as a radiogroup item
                    $explicitLabel.attr('aria-hidden', 'true');
                }

                // if native input has state, we must transfer it to custom radio
                if ($nativeRadio.prop('checked') === true) {
                    $customRadio.attr('aria-checked', 'true');
                }
                else {
                    $customRadio.attr('aria-checked', 'false');
                }

                // the native input element must be hidden
                $nativeRadio.attr('aria-hidden', 'true');

                // insert the custom radio after the native radio
                $(nativeRadio).after($customRadio);
            });
        });
    };
}( jQuery ));
