/**
* Copyright 2015 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

/**
* @function jquery.datepickerbutton.js
* @author Ian McBurnie <ianmcburnie@hotmail.com>
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
            var $button = $widget.find('.flyout__trigger').first();
            var $overlay = $widget.find('.flyout__overlay').first();
            var $description = $('<div>Activate button, then use arrow keys to navigate calendar grid.</div>');
            var $carousel = $widget.find('.carousel').first();
            var $carouselList = $widget.find('.carousel__list').first();
            var $carouselItems = $carouselList.find('> li');
            var $grids = $widget.find('.datepicker__grid, table');
            var $captions = $grids.find('.datepicker__caption, caption');
            var $cells = $grids.find('td');
            var year = 2016; // hardcoded for purpose of demo
            var $carouselButtons;
            var $buttonSlideNext;
            var $buttonSlidePrevious;
            var activeTableId;

            var getCurrentSlide = function() {
                return $carouselList.find('li:not([aria-hidden=true])');
            };

            var onCarouselSlideChange = function(e) {
                var $activeTable = $widget.find('#' + activeTableId);
                var $currentSlide = getCurrentSlide();

                $activeTable.prop('id', '');
                $currentSlide.find('table').prop('id', activeTableId);
            };

            var onGridNavigationBoundary = function(e, data) {
                if (data.boundary === 'bottom') {
                    $buttonSlideNext.click();
                } else if (data.boundary === 'top') {
                    $buttonSlidePrevious.click();
                }
            };

            var getCurrentCaption = function() {
                return getCurrentSlide().find('caption').text();
            };

            var collapseOverlay = function() {
                $button.attr('aria-expanded', 'false');
                $button.focus();
            };

            var getMonth = function() {
                var currentCaption = getCurrentCaption();
                var currentMonthTitle = currentCaption.split(' ')[0].toLowerCase();

                return currentMonth = (currentMonthTitle === 'january') ? '01' : '02';
            };

            var onCarouselButtonClick = function(e) {
                $widget.find('#' + activeTableId).focus();
            };

            $widget.nextId('datepicker');

            // create a unique id for the active table
            activeTableId = $widget.prop('id') + '__active-month';

            // the active table is the one with active descendants
            $grids.first().prop('id', activeTableId);

            // ensure the table captions have an id
            if ($captions.prop('id') === '') {
                $captions.prop('id', $widget.prop('id') + '-caption');
            }

            // use caption (month & year) as description for every cell
            $grids.each(function(gridIndex, gridEl) {
                var captionEl = $(gridEl).find('caption');
                var captionId = captionEl.id;
                $(gridEl).find('td').each(function(cellIndex, cellEl) {
                    $(cellEl).attr('aria-describedby', captionId);
                });
            });

            // add id and clipped class to description el
            $description
                .prop('id', $widget.prop('id') + '-description')
                .addClass('clipped');

            $grids
                .attr('role', 'grid')
                .attr('aria-describedby', $description.prop('id'))
                .attr('tabindex', '0');

            $carouselItems.activeDescendant('table', 'table', 'td', {isGrid: true, activeIndex: options.activeIndex, autoInit: true, autoReset: false});

            $carouselItems.on('gridNavigationBoundary', onGridNavigationBoundary);

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
                    collapseOverlay();
                    $widget.trigger('datePickerSelect', getMonth() + '/' + $activeDescendant.text() + '/' + year);
                }
            });

            // collapse the overlay when ESC key is pressed
            $widget.on('escapeKeyDown', 'table, .carousel__previous, .carousel__next', collapseOverlay);

            // call carousel plugin
            $carousel.carousel();

            $carouselButtons = $carousel.find('.carousel__previous, .carousel__next');

            $buttonSlideNext = $carousel.find('.carousel__next');
            $buttonSlidePrevious = $carousel.find('.carousel__previous');

            $carouselButtons
                .attr('tabindex', '-1')
                .attr('aria-hidden', 'true');

            $carouselButtons.on('click', onCarouselButtonClick);

            $overlay.append($description);

            $carousel.on('carouselSlideChange', onCarouselSlideChange);

            $widget.addClass('datepicker--js');
        });
    };
}(jQuery));
