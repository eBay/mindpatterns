/**
* @function jquery.listbox.js
* @author Ian McBurnie <imcburnie@ebay.com>
* @version 0.0.1
*/
(function ( $ ) {

    $.fn.listbox = function listbox() {

        return this.each(function onEach() {

            var $this = $(this),
                $form = $this.closest('form'),
                $label = $this.find('label'),
                $select = $this.find('select'),
                isListBoxMultiSelect = $select.attr('size')  || $select.prop('multiple'),
                $customListbox;

            $this.nextId('listbox');

            $label.prop('id', $this.prop('id') + '-label');

            if (isListBoxMultiSelect === false) {
                $this.listboxsingleselect();
            }
            else {
                $this.listboxmultiselect();
            }

            $customListbox = $(this).find('[role=listbox]');

            $customListbox.commonKeyDown();

            $customListbox.on('enterKeyDown', function onListboxEnterKey(e) {
                $form.submit();
            })

            $customListbox.attr('aria-labelledby', $label.prop('id'));

            // call plugin to prevent page scroll
            $('[role=listbox]').preventDocumentScrollKeys();

            $this.addClass('listbox--js');
        });
    };

    $.fn.listboxsingleselect = function listboxsingleselect() {
        var $this = $(this),
            $nativeListbox = $this.find('select'),
            $nativeOptions = $nativeListbox.find('option'),
            $button = $('<button aria-haspopup="true" />');

        $this.addClass('listbox--single-select');
        $button.text($nativeOptions.first().text());
        $this.append($button);
    };

    $.fn.listboxmultiselect = function listboxmultiselect() {
        return this.each(function onEach() {

            var $this = $(this),
                $nativeListbox = $this.find('select'),
                $label = $this.find('label'),
                $nativeOptions = $nativeListbox.find('option'),
                $customListbox = $('<ul role="listbox" />'),
                $customOptions,
                indexOfSelectedNativeOption,
                activeId = $this.prop('id') + '-active';

            $this.addClass('listbox--multi-select');

            // find the current selected index state of native select
            indexOfFirstSelectedNativeOption = $nativeListbox.find('[selected]').first().index() || -1;

            $nativeOptions.each(function(idx, item) {
                var $nativeOption = $(item),
                    $customOption = $('<li>');

                $customOption
                    .attr('role', 'option')
                    .text($nativeOption.text());

                console.log();

                if($($nativeOptions.get(idx)).prop('selected') === true) {
                    $customOption
                        .attr('aria-selected', 'true');
                }

                $customListbox.append($customOption);
            });

            $customOptions = $customListbox.find('[role=option]');

            $customOptions.commonKeyDown();

            // set aria-selected on the active descendant
            $customListbox.find('#'+activeId).attr('aria-selected', 'true');

            // init rovingTabindex plugin on custom listbox
            $customListbox.rovingTabindex($customOptions, {wrap:false});

            // listen for click events (triggered by mouse/pointer)
            $customOptions.on('click spaceKeyDown', function(e) {
                $customOptions.attr('tabindex', '-1');
                $(e.currentTarget).attr('tabindex', '0');
                $customListbox.find('#'+activeId).removeAttr('id');
                $(e.currentTarget).prop('id', activeId);
                $this.trigger('select', e.currentTarget);
            });

            $this.on('select', function(e, item) {
                var $item = $(item),
                    selectedIndex = $(item).index(),
                    $nativeItem = $($nativeOptions.get(selectedIndex));

                $item.attr('aria-selected', ($item.attr('aria-selected') == 'true') ? 'false' : 'true');
                $nativeItem.prop('selected', ($nativeItem.prop('selected') == true) ? false : true);

                $(item).focus();
            });

            // append the custom listbox to the widget
            $this.append($customListbox);
        });
    };

}( jQuery ));
