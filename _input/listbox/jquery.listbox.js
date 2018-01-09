/**
* @function jquery.listbox.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @version 0.0.1
*/
(function ( $ ) {
    $.fn.listbox = function listbox() {
        return this.each(function onEach() {
            var $this = $(this),
                $form = $this.closest('form'),
                $select = $this.find('select'),
                $label = $('label[for="' + $select.prop('id') + '"]'),
                $options = $select.find('option'),
                $listbox = $('<ul role="listbox" />'),
                isMultiSelect = $select.attr('size')  || $select.prop('multiple');

            $this.nextId('listbox');

            $label.prop('id', $this.prop('id') + '-label');

            $options.each(function(idx, item) {
                var $nativeOption = $(item),
                    $ariaOption = $('<li>');

                $ariaOption
                    .attr('role', 'option')
                    .text($nativeOption.text());

                if($($options.get(idx)).prop('selected') === true) {
                    $ariaOption.attr('aria-selected', 'true');
                }

                $listbox.append($ariaOption);
            });

            if (isMultiSelect === false) {
                $this.listboxsingleselect($listbox, $label);
            }
            else {
                $this.listboxmultiselect($listbox);
            }

            $this.addClass('listbox--js');
        });
    };

    $.fn.listboxsingleselect = function listboxsingleselect($listbox, $label) {
        var $this = $(this),
            $nativeListbox = $this.find('select'),
            $nativeOptions = $nativeListbox.find('option'),
            $customOptions = $listbox.find('[role=option]'),
            $input = $('<input role="combobox" type="text" readonly />'),
            numOptions = $nativeOptions.length,
            $selected = $nativeListbox.find('[selected]'),
            selectedIndex = $selected.length > 0 ? $selected.first().index() : 0;

        $this.addClass('listbox--single');

        $input.attr('aria-labelledby', $label.prop('id'));

        $input.val($nativeOptions.eq(selectedIndex).text());

        $input.attr('aria-expanded', 'false');

        $this.append($input);
        $this.append($listbox);

        $this.preventScrollKeys('[role="combobox"]');

        $this.commonKeyDown('[role="combobox"]');

        // $this.activeDescendant($input, '[role=listbox]', '[role=option]', {axis: 'y', useAriaSelected: true});

        $this.on('spaceKeyDown', function(e) {
            //$input.attr('aria-expanded', $input.attr('aria-expanded') === 'true' ? 'false' : 'true');
            $input.trigger('click');
        });

        $this.clickFlyout({
            overlaySelector: '[role=listbox]',
            triggerSelector: '[role=combobox]'
        });

        $this.on('escapeKeyDown', function(e) {
            $input.attr('aria-expanded', 'false');
        });

        $this.on('upArrowKeyDown', function(e) {
            if (selectedIndex > 0) {
                $nativeOptions.eq(selectedIndex).prop('selected', false);
                $customOptions.eq(selectedIndex).attr('aria-selected', false);
                $input.val($nativeOptions.eq(--selectedIndex).text());
                $nativeOptions.eq(selectedIndex).prop('selected', true);
                $customOptions.eq(selectedIndex).attr('aria-selected', true);
            }
        });

        $this.on('downArrowKeyDown', function(e) {
            if (selectedIndex < numOptions - 1) {
                $nativeOptions.eq(selectedIndex).prop('selected', false);
                $customOptions.eq(selectedIndex).attr('aria-selected', false);
                $input.val($nativeOptions.eq(++selectedIndex).text());
                $nativeOptions.eq(selectedIndex).prop('selected', true);
                $customOptions.eq(selectedIndex).attr('aria-selected', true);
            }
        });

        $listbox.on('click', '[role=option]', function(e) {
            var $this = $(this);

            $input.val($this.text());

            $nativeOptions.eq(selectedIndex).prop('selected', false);
            $customOptions.eq(selectedIndex).attr('aria-selected', false);

            selectedIndex = $this.index();

            $nativeOptions.eq(selectedIndex).prop('selected', true);
            $customOptions.eq(selectedIndex).attr('aria-selected', true);

            $input.attr('aria-expanded', 'false');
        });
    };

    $.fn.listboxmultiselect = function listboxmultiselect($listbox) {
        return this.each(function onEach() {

            var $this = $(this),
                $form = $this.closest('form'),
                $nativeListbox = $this.find('select'),
                $label = $this.find('label'),
                $nativeOptions = $nativeListbox.find('option'),
                $customOptions = $listbox.find('[role=option]'),
                indexOfSelectedNativeOption,
                activeId = $this.prop('id') + '-active';

            $this.addClass('listbox--multiple');

            $listbox.commonKeyDown('[role=option]');

            // set aria-selected on the active descendant
            $listbox.find('#'+activeId).attr('aria-selected', 'true');

            // init rovingTabindex plugin on custom listbox
            $listbox.rovingTabindex('[role=option]', {axis: 'y', wrap:false});

            // listen for click events (triggered by mouse/pointer)
            $listbox.on('click spaceKeyDown', function(e) {
                console.log(e.originalEvent.target);
                $customOptions.attr('tabindex', '-1');
                $(e.originalEvent.target).attr('tabindex', '0');
                $listbox.find('#'+activeId).removeAttr('id');
                $(e.originalEvent.target).prop('id', activeId);
                $this.trigger('select', e.originalEvent.target);
            });

            $this.on('select', function(e, item) {
                var $item = $(item),
                    selectedIndex = $(item).index(),
                    $nativeItem = $($nativeOptions.get(selectedIndex));

                $item.attr('aria-selected', ($item.attr('aria-selected') == 'true') ? 'false' : 'true');
                $nativeItem.prop('selected', ($nativeItem.prop('selected') == true) ? false : true);

                $(item).focus();
            });

            $listbox.on('enterKeyDown', function onListboxEnterKey(e) {
                $form.submit();
            });

            $listbox.attr('aria-labelledby', $label.prop('id'));

            // call plugin to prevent page scroll
            $listbox.preventScrollKeys('[role=option]');

            // append the ARIA listbox to the widget
            $this.append($listbox);
        });
    };

}( jQuery ));
