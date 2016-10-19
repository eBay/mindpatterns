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
            var $grid = $widget.find('.datepicker__grid');
            var month = 1;
            var year = 2016;

            $widget.focusFlyout();
            $widget.activeDescendant('.flyout__trigger', 'tbody, grid__body', 'td, [role=gridcell]', {isGrid: true});

            $widget.commonKeyDown().on('enterKeyDown', function(e) {
                //console.log(e);
            });

            $widget.on('activeDescendantChange', 'td', function(e, data) {
                $input.val('0' + month + '/' + $(this).text() + '/' + year);
            });
        });
    };
}(jQuery));
