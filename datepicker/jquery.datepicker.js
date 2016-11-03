/**
* @function jquery.datepicker.js
* @author Ian McBurnie <imcburnie@ebay.com>
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @requires jquery-next-id
* @requires jquery-common-keydown
* @requires jquery-active-descendants
* @requires jquery-focus-flyout
*/
(function($) {
    $.fn.datePicker = function datePicker(options) {
        options = $.extend({
            activeIndex: 0
        }, options);

        return this.each(function onEachDatePicker() {
            var $widget = $(this);
            var $input = $widget.find('.flyout__trigger').first();
            var $overlay = $widget.find('.flyout__overlay').first();
            var $description = $('<div>Use arrow keys to navigate grid.</div>');
            var $grids = $widget.find('table');
            var $caption = $grids.find('caption');
            var $cells = $grids.find('td');
            var month = 1;
            var year = 2016;

            $widget.nextId('datepicker');

            $widget.attr('role', 'application');

            if ($caption.prop('id') === '') {
                $caption.prop('id', $widget.prop('id') + '-caption');
            }

            $description
                .prop('id', $widget.prop('id') + '-description')
                .addClass('clipped');

            // add description to input
            $input.attr('aria-describedby', $description.prop('id'));

            // workaround for issue where voiceover does not announce first arrow key into grid
            $caption.attr('role', 'presentation');

            // voiceover must have a valid active-descendant container role on input
            $input.attr('role', 'group');

            // use caption (month & year) as description for cell
            $cells.each(function(cellIndex, cell) {
                $(cell).attr('aria-describedby', $caption.prop('id'));
            });

            // use plugin that creates focus flyout behaviour on input
            $widget.focusFlyout();

            // use plugin that creates active descendant behaviour on input
            $widget.activeDescendant('.flyout__trigger', 'table, [role=grid]', 'td, [role=gridcell]', {
                isGrid: true,
                autoReset: false,
                activeIndex: options.activeIndex
            });

            // autofill input when active descendant changes
            $widget.on('activeDescendantChange', 'td', function(e, data) {
                $input.val('0' + month + '/' + $(this).text() + '/' + year);
            });

            // add the description element to the DOM
            $overlay.append($description);
        });
    };
}(jQuery));
