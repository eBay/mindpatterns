/**
* @function jquery.customradiogroup.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @desc Sample implementation for a custom radio group.
* @requires jquery-next-id
* @requires jquery-common-keys
* @requires jquery-roving-tabindex
*/
(function ( $ ) {

    $.fn.customradiogroup = function customRadioGroup() {

        return this.each(function onEachCustomRadioGroup() {

            var $widget = $(this),
                $fieldset = $widget.find('> fieldset')
                $form = $widget.closest('form'),
                $legend = $fieldset.find('> legend'),
                $items = $fieldset.find('> span, > div'),
                activeRadioIdx = 0;

            // set a unique widget id
            $widget.nextId('radiogroup');

            // set a unique legend id
            $legend.prop('id', $widget.prop('id') + '-legend');

            // custom radios must live inside a labelled radiogroup role
            $fieldset
                .attr('role', 'radiogroup')
                .attr('aria-labelledby', $legend.prop('id'));

            // add a class to radio button containers for easier DOM traversal
            $items.addClass('customradiogroupitem');

            // inject custom radio elements after each input
            $widget.find('input[type=radio]').each(function onEachNativeRadio(index, nativeRadio) {
                var $nativeRadio = $(nativeRadio),
                    $explicitLabel = $widget.find('[for=' + $nativeRadio.attr('id') + ']'),
                    $customRadio = $('<span role="radio" />'),
                    labelId;

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
                    activeRadioIdx = index;
                }
                else {
                    $customRadio.attr('aria-checked', 'false');
                }

                // the native input element must be hidden
                $nativeRadio.attr('aria-hidden', 'true');

                // insert the custom radio after the native radio
                $(nativeRadio).after($customRadio);
            });

            // click handler triggers 'check' event
            $items.on('click', 'label, span', function onClick(e) {
                $widget.trigger('check', $(this).closest('.customradiogroupitem'));
            });

            // enter key submits form
            $widget.on('enterKeyDown', function onEnterKeyDown(e) {
                $form.submit();
            });

            // spacebar triggers 'check' event
            $widget.on('spaceKeyDown', function onSpaceKeyDown(e) {
                $widget.trigger('check', e.originalEvent.target);
            });

            // key events on radio buttons are delegated to widget
            $widget.commonKeyDown('[role=radio]');

            // create a roving tab index on custom radios
            $widget.rovingTabindex('[role=radio]', {activeIndex: activeRadioIdx});

            // update radiogroup state on check event or rovingTabindex change
            $widget.on('check rovingTabindexChange', function onCheckAndRove(e, radiogroupitem) {
                var $widgetitem = $(radiogroupitem).closest('.customradiogroupitem'),
                    $activeInput = $widget.find('input:checked'),
                    $activeItem = $activeInput.closest('.customradiogroupitem');

                if ($widgetitem.hasClass('customradiogroupitem') && ($widgetitem[0] !== $activeItem[0])) {
                    // uncheck currently active native & custom radios
                    $activeInput.next('[role=radio]').attr('aria-checked', 'false');
                    $activeInput.prop('checked', false);
                    // check the new native & custom radios and set focus
                    $widgetitem.find('input[type=radio]').prop('checked', true);
                    $widgetitem.find('[role=radio]').attr('aria-checked', 'true');
                }
            });

            // call plugin to prevent page scroll
            $widget.preventScrollKeys('[role=radio]');

            // mark our widget as intialised
            $widget.addClass('customradiogroup--js');
        });
    };
}( jQuery ));
