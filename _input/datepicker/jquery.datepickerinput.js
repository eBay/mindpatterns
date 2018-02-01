/**
* Copyright 2015 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

/**
* @function jquery.datepickerinput.js
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @requires jquery-next-id
* @requires jquery-common-keydown
* @requires jquery-active-descendant
* @requires jquery-focus-flyout
*/
(function($) {
    $.fn.datePickerInput = function datePickerInput(options) {
        options = $.extend({
            activeIndex: 0
        }, options);

        return this.each(function onEachDatePickerInput() {
            var $widget = $(this);
            var $input = $widget.find('.flyout__trigger').first();
            var $overlay = $widget.find('.flyout__overlay').first();
            var $description = $('<div>Use arrow keys to navigate calendar grid.</div>');
            var $carousel = $widget.find('.carousel').first();
            var $carouselList = $widget.find('.carousel__list').first();
            var $carouselItems = $carouselList.find('> li');
            var $grids = $widget.find('.datepicker__grid, table');
            var $captions = $grids.find('.datepicker__caption, caption');
            var year = 2016; // hardcoded for purpose of demo
            var $carouselButtons;
            var $buttonSlideNext;
            var $buttonSlidePrevious;
            var activeTableId;
            var previousMonthIndex; // track which cell we came from, so we can go back there

            var getCurrentSlide = function getCurrentSlide() {
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

            var onGridNavigationBoundary = function onGridNavigationBoundary(e, data) {
                if (data.boundary === 'bottom') {
                    $buttonSlideNext.click();
                } else if (data.boundary === 'top') {
                    $buttonSlidePrevious.click();
                }
            };

            var onCarouselSlideChange = function onCarouselSlideChange(e, data) {
                var $activeTable = $widget.find('#' + activeTableId);
                var $currentSlide = getCurrentSlide();
                var $newActiveTable = $currentSlide.find('table');

                //$activeTable.trigger('visibilityChange', {type:'hide'});

                // switch the id, which is used in descendantItemsSelector
                $activeTable.prop('id', '');
                $newActiveTable.prop('id', activeTableId);

                $newActiveTable.trigger('domChange');
            };

            var onActiveDescendantChange = function onActiveDescendantChange(e, data) {
                $input.val(getMonth() + '/' + $(this).text() + '/' + year);
            };

            var onCarouselButtonClick = function onCarouselButtonClick(e) {
                $input.focus();
            };

            // ensure widget has an id
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
            $grids.each(function onEachGrid(gridIndex, gridEl) {
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

            // add description to input
            $input.attr('aria-describedby', $description.prop('id'));

            // role application prevents nvda and jaws intercepting arrow keys
            $widget.attr('role', 'application');

            // workaround for issue where voiceover does not announce first arrow key into grid
            $captions.attr('role', 'presentation');

            // voiceover must have a valid active-descendant container role on input
            $input.attr('role', 'group');

            // use plugin that creates focus flyout behaviour on input
            $widget.focusFlyout();

            // use plugin that creates active descendant behaviour on input
            $widget.activeDescendant('.flyout__trigger', '#' + activeTableId, '#' + activeTableId +' td', {
                isGrid: true,
                autoInitOnDomChange: true,
                autoReset: true,
                activeIndex: options.activeIndex
            });

            // autofill input when active descendant changes
            $widget.on('activeDescendantChange', 'td', onActiveDescendantChange);

            $widget.on('gridNavigationBoundary', onGridNavigationBoundary);

            // add the description element to the DOM
            $overlay.append($description);

            // call carousel plugin
            $carousel.carousel();

            $carouselButtons = $carousel.find('.carousel__previous, .carousel__next');

            $buttonSlideNext = $carousel.find('.carousel__next');
            $buttonSlidePrevious = $carousel.find('.carousel__previous');

            $carouselButtons
                .attr('tabindex', '-1')
                .attr('aria-hidden', 'true');

            $carouselButtons.on('click', onCarouselButtonClick);

            $carousel.on('carouselSlideChange', onCarouselSlideChange);

            $grids.preventScrollKeys();

            $widget.addClass('datepicker--js');
        });
    };
}(jQuery));
