/**
* @function jquery.datepicker2.js
* @author Ian McBurnie <imcburnie@ebay.com>
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @requires @ebay/jquery-next-id
* @requires @ebay/jquery-common-keydown
* @requires @ebay/jquery-active-descendant
* @requires @ebay/jquery-click-flyout
*/
(function ($) {

    $.fn.datePicker2 = function datePicker2(options) {

        options = $.extend({
            activeIndex: 0
        }, options);

        return this.each(function onEachDatePicker2() {
            var $widget = $(this);
            var $input = $widget.find('input');
            var $button = $widget.find('.flyout__trigger');
            var $overlay = $widget.find('flyout__overlay');
            var $description = $widget.find('.datepicker__description');
            var $grid = $widget.find('.datepicker__grid');
            var $caption = $grid.find('caption, .datepicker__caption');
            var $cells = $grid.find('td');
            var month = 1;
            var year = 2016;

            $grid.attr('role', 'grid');

            $widget.nextId('datepicker');

            if ($caption.prop('id') === '') {
                $caption.prop('id', $widget.prop('id') + '-caption');
            }

            if ($description.prop('id') === '') {
                $description.prop('id', $widget.prop('id') + '-description');
            }

            $cells.attr('aria-describedby', $caption.prop('id'));

            $grid.attr('aria-describedby', $description.prop('id'));

            $grid.attr('tabindex', '0');
            $widget.activeDescendant('table', 'table', 'td', {isGrid: true, activeIndex: options.activeIndex, autoInit: true, autoReset: false});

            $widget.clickFlyout({focusManagement: 'first'});

            $widget.commonKeyDown().on('enterKeyDown spaceKeyDown', 'table', function(e) {
                var $activeDescendant = $grid.find('#' + $grid.attr('aria-activedescendant'));
                e.preventDefault();

                if ($activeDescendant.attr('aria-disabled') !== 'true') {
                    $input.val('0' + month + '/' + $activeDescendant.text() + '/' + year);
                    $button.attr('aria-expanded', 'false');
                    $button.focus();
                }
            });

            $widget.commonKeyDown().on('escapeKeyDown', 'table', function(e) {
                $button.attr('aria-expanded', 'false');
                $button.focus();
            });
        });
    };
}(jQuery));
