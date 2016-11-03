/**
* @function jquery.datepickerbutton.js
* @author Ian McBurnie <imcburnie@ebay.com>
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @requires jquery-next-id
* @requires jquery-common-keydown
* @requires jquery-active-descendant
* @requires jquery-click-flyout
*/
(function($) {
    $.fn.datePickerButton = function datePickerButton(options) {
        options = $.extend({
            activeIndex: 0
        }, options);

        return this.each(function onEachDatePickerButton() {
            var $widget = $(this);
            var $input = $widget.find('input').first();
            var $button = $widget.find('.flyout__trigger').first();
            var $overlay = $widget.find('.flyout__overlay').first();
            var $description = $('<div>Use arrow keys to navigate grid.</div>');
            var $carousel = $widget.find('.carousel').first();
            var $carouselList = $widget.find('.carousel__list').first();
            var $carouselItems = $carouselList.find('> li');
            var $grids = $widget.find('.datepicker__grid, table');
            var $captions = $grids.find('.datepicker__caption, caption');
            var $cells = $grids.find('td');
            var month = 1;
            var year = 2016; // hardcoded for purpose of demo
            var $carouselNext;
            var $carouselPrevious;
            var activeTableId;

            var collapseOverlay = function() {
                $button.attr('aria-expanded', 'false');
                $button.focus();
            };

            var getCurrentSlide = function() {
                return $carouselList.find('li:not([aria-hidden=true])');
            };

            var getCurrentCaption = function() {
                return getCurrentSlide().find('caption').text();
            };

            var getMonth = function() {
                var currentCaption = getCurrentCaption();
                var currentMonthTitle = currentCaption.split(' ')[0].toLowerCase();

                return currentMonth = (currentMonthTitle === 'january') ? '01' : '02';
            };

            var onCarouselSlideChange = function(e) {
                var $activeTable = $widget.find('#' + activeTableId);
                var $currentSlide = getCurrentSlide();

                $activeTable.prop('id', '');
                $currentSlide.find('table').prop('id', activeTableId);
            };

            $widget.nextId('datepicker');

            activeTableId = $widget.prop('id') + '__active-month';

            if ($captions.prop('id') === '') {
                $captions.prop('id', $widget.prop('id') + '-caption');
            }

            $description
                .prop('id', $widget.prop('id') + '-description')
                .addClass('clipped');

            $cells.attr('aria-describedby', $captions.prop('id'));

            $grids
                .attr('role', 'grid')
                .attr('aria-describedby', $description.prop('id'))
                .attr('tabindex', '0');

            $grids.first().prop('id', activeTableId);

            $carouselItems.activeDescendant('table', 'table', 'td', {isGrid: true, activeIndex: options.activeIndex, autoInit: true, autoReset: false});

            // use helper plugin to create expand/collapse overlay behaviour on click
            $widget.clickFlyout({
                autoCollapse: true,
                focusManagement: $widget.prop('id') + '__active-month'
            });

            // helper plugin for common key events on widget
            $widget.commonKeyDown();

            // autofill the input and collapse overlay when a date is selected
            $carouselItems.on('click enterKeyDown spaceKeyDown', 'table', function(e) {
                var $currentSlide = getCurrentSlide();
                var $activeDescendant = $currentSlide.find('#' + $currentSlide.find('table').attr('aria-activedescendant'));

                if (e.type === 'enterKeyDown') {
                    e.preventDefault();
                }

                if ($activeDescendant.attr('aria-disabled') !== 'true') {
                    $input.val(getMonth() + '/' + $activeDescendant.text() + '/' + year);
                    collapseOverlay();
                }
            });

            // collapse the overlay when ESC key is pressed
            $widget.on('escapeKeyDown', 'table, .carousel__previous, .carousel__next', collapseOverlay);

            // call carousel plugin
            $carousel.carousel();

            $carouselPrevious = $carousel.find('.carousel__previous');
            $carouselNext = $carousel.find('.carousel__next');

            $overlay.append($description);

            $widget.addClass('datepicker--js');

            $carousel.on('carouselSlideChange', onCarouselSlideChange);
        });
    };
}(jQuery));
