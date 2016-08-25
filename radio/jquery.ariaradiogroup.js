/**
* @function jquery.ariaradiogroup.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @desc Sample implementation for a pure aria radio group with no form fallbacks.
* @requires jquery-next-id
* @requires jquery-common-keys
* @requires jquery-roving-tabindex
* @requires jquery-prevent-scroll-keys
*/
(function ( $ ) {
    $.fn.ariaRadioGroup = function ariaRadioGroup() {
        return this.each(function onEachAriaRadioGroup() {
            var $widget = $(this),
                $form = $widget.closest('form'),
                $fieldset = $widget.find('.aria-radio-group__fieldset'),
                $labels = $fieldset.find('.aria-radio__label'),
                hasCheckedRadio = $fieldset.find('[aria-checked=true]').length > 0,
                checkedRadioIndex = hasCheckedRadio ? $widget.find('[aria-checked=true]').parent().index() : 0;

            // all common key events on radio buttons are delegated to widget
            $widget.commonKeyDown('[role=radio]');

            // spacebar triggers 'check' event
            $widget.on('spaceKeyDown', function onSpaceKeyDown(e) {
                $widget.trigger('check', e.originalEvent.target);
            });

            // enter key triggers 'ariaRadioGroupSelect' event with checked radio index and label text
            $widget.on('enterKeyDown', function onEnterKeyDown(e) {
                console.log($form);
                //var $checkedRadio = $fieldset.find('[aria-checked=true]');
                //$widget.trigger('ariaRadioGroupSelect', { index: $checkedRadio.parent().index(), label: $checkedRadio.next().text() });
                $form.submit();
            });

            // clicking a label checks the associated checkbox
            $labels.on('click', function(e) {
                $widget.trigger('check', $(e.target).prev());
            });

            // create a roving tab index on custom radios
            $widget.rovingTabindex('[role=radio]', {activeIndex: checkedRadioIndex});

            // update radiogroup state on check event or rovingTabindex change
            $widget.on('check rovingTabindexChange', function onCheckAndRove(e, radioButton) {
                var $radioButton = $(radioButton),
                    $checkedRadio = $fieldset.find('[aria-checked=true]');

                if ($radioButton[0] !== $checkedRadio[0]) {
                    // uncheck currently checked radio
                    $checkedRadio.attr('aria-checked', 'false');
                    // uncheck the real under the hood radio if it exists
                    $checkedRadio.prev().prop('checked', false);
                    // check the radio
                    $radioButton.attr('aria-checked', 'true');
                    // check the real under the hood radio if it exists
                    $radioButton.prev().prop('checked', true);
                }
            });

            // call plugin to prevent page scroll
            $widget.preventScrollKeys('[role=radio]');

            // mark our widget as intialised
            $widget.addClass('aria-radio-group--js');
        });
    };
}( jQuery ));
