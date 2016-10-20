/**
* @function jquery.datepicker.js
* @author Ian McBurnie <imcburnie@ebay.com>
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @requires @ebay/jquery-next-id
* @requires @ebay/jquery-common-keydown
* @requires @ebay/jquery-active-descendants
* @requires @ebay/jquery-focus-flyout
*/
(function ($) {

    $.fn.datePicker = function datePicker(options) {

        options = $.extend({}, options);

        return this.each(function onEachDatePicker() {
            var $widget = $(this);
            var $input = $widget.find('.flyout__trigger');
            var $description = $widget.find('.datepicker__description');
            var $grid = $widget.find('.datepicker__grid');
            var $caption = $grid.find('caption, .grid__caption');
            var $cells = $grid.find('td');
            var month = 1;
            var year = 2016;

            $widget.nextId('datepicker');

            if ($caption.prop('id') === '') {
                $caption.prop('id', $widget.prop('id') + '-caption');
            }

            if ($description.prop('id') === '') {
                $description.prop('id', $widget.prop('id') + '-description');
            }

            // add description to input
            $input.attr('aria-describedby', $description.prop('id'));

            // workaround for issue where voiceover does not announce first arrow key into grid
            $caption.attr('role', 'presentation');

            // voiceover must have a valid active-descendant container role on input
            $input.attr('role', 'group');

            $cells.each(function(cellIndex, cell) {
                var $cell = $(cell);

                $cell
                    .attr('aria-label', $cell.text())
                    .attr('aria-describedby', $caption.prop('id'));
            });

            $widget.focusFlyout();
            $widget.activeDescendant('.flyout__trigger', 'table, [role=grid]', 'td, [role=gridcell]', {isGrid: true});

            $widget.commonKeyDown().on('enterKeyDown', function(e) {
                //console.log(e);
            });

            $widget.on('activeDescendantChange', 'td', function(e, data) {
                $input.val('0' + month + '/' + $(this).text() + '/' + year);
            });
        });
    };
}(jQuery));
