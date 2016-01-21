/**
* @function jquery.customradiogroup.js
* @author Ian McBurnie <imcburnie@ebay.com>
* @desc Sample implementation for a custom radio group.
* @requires jquery-next-id
* @requires jquery-common-keys
* @requires jquery-roving-tabindex
*/
(function ( $ ) {

    $.fn.customradiogroup = function customRadioGroup() {

        return this.each(function onEachCustomRadioGroup() {

            var $radiogroup = $(this),
                $fieldset = $radiogroup.find('> fieldset')
                $form = $radiogroup.closest('form'),
                $legend = $fieldset.find('> legend'),
                $radiogroupitems = $fieldset.find('> span, > div'),
                activeRadioIdx = 0;

            // set a unique widget id
            $radiogroup.nextId('radiogroup');

            // set a unique legend id
            $legend.prop('id', $radiogroup.prop('id') + '-legend');

            // custom radios must live inside a labelled radiogroup role
            $fieldset
                .attr('role', 'radiogroup')
                .attr('aria-labelledby', $legend.prop('id'));

            // add a class to radio button containers for easier DOM traversal
            $radiogroupitems.addClass('customradiogroupitem');

            // inject custom radio elements after each input
            $radiogroup.find('input[type=radio]').each(function onEachNativeRadio(index, nativeRadio) {
                var $nativeRadio = $(nativeRadio),
                    $explicitLabel = $radiogroup.find('[for=' + $nativeRadio.attr('id') + ']'),
                    $customRadio = $('<span role="radio" />'),
                    labelId;

                // if native input has programmatic label we must transfer it to custom radio
                if ($explicitLabel.size() === 1) {
                    labelId = $radiogroup.attr('id') + '-label-' + index;
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

                // the native input element must be hidden
                $nativeRadio.attr('aria-hidden', 'true');

                // insert the custom radio after the native radio
                $(nativeRadio).after($customRadio);
            });

            // click handler triggers 'check' event
            $radiogroupitems.on('click', 'label, span', function onClick(e) {
                $radiogroup.trigger('check', $(this).closest('.customradiogroupitem'));
            });

            // enter key submits form
            $radiogroupitems.on('enterKeyDown', function onEnterKeyDown(e) {
                $form.submit();
            });

            // spacebar triggers 'check' event
            $radiogroupitems.on('spaceKeyDown', function onSpaceKeyDown(e) {
                $radiogroup.trigger('check', this);
            });

            $radiogroup.find('[role=radio]').commonKeyDown();

            // create a roving tab index on custom radios
            $radiogroup.find('[role=radio]').rovingTabindex($radiogroup.prop('id'), {activeIndex: activeRadioIdx});

            // update radiogroup state on check event or rovingTabindex change
            $radiogroup.on('check rovingTabindexChange', function onCheckAndRove(e, radiogroupitem) {
                var $radiogroupitem = $(radiogroupitem).closest('.customradiogroupitem'),
                    $activeInput = $radiogroup.find('input:checked'),
                    $activeItem = $activeInput.closest('.customradiogroupitem');

                if ($radiogroupitem.hasClass('customradiogroupitem') && ($radiogroupitem[0] !== $activeItem[0])) {
                    // uncheck currently active native & custom radios
                    $activeInput.next('[role=radio]').attr('aria-checked', 'false');
                    $activeInput.prop('checked', false);
                    // check the new native & custom radios and set focus
                    $radiogroupitem.find('input[type=radio]').prop('checked', true);
                    $radiogroupitem.find('[role=radio]').attr('aria-checked', 'true').focus();
                }
            });

            // call plugin to prevent page scroll
            $('.customradiogroupitem').preventDocumentScrollKeys();

            // mark our widget as intialised
            $radiogroup.addClass('customradiogroup-js');
        });
    };
}( jQuery ));
