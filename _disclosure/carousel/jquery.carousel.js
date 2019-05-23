/**
* Copyright 2015 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

/**
* jquery.carousel.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie (imcburnie@ebay.com)
*/
(function($) {
    var widgetCount = 0;

    $.fn.carousel = function carousel() {
        return this.each(function onEach() {
            var $widget = $(this),
                $title = $widget.find('.carousel__title'),
                titleText = ($title.length > 0) ? $title.text() : '',
                $carouselMain = $widget.find('.carousel__main'),
                $carouselList = $widget.find('.carousel__list'),
                $carouselItems = $carouselList.find('> li'),
                $statusMessageContainer = $('<p>'),
                $statusMessageText = $('<span>'),
                $paginateLeft = $('<button>'),
                $paginateRight = $('<button>'),
                viewportSize = $widget.data('carousel-size') || 1,
                numSlides = Math.round($carouselItems.length / viewportSize),
                model = {
                    currentSlideIndex: 1, // 1 based index, rather than 0
                    indexesInViewport: []
                };

            var onPaginateNextClick = function(e) {
                if (model.currentSlideIndex < numSlides) {
                    gotoSlide(model.currentSlideIndex + 1);
                }
            };

            var onPaginatePreviousClick = function(e) {
                if (model.currentSlideIndex > 1) {
                    gotoSlide(model.currentSlideIndex - 1);
                }
            };

            var setStatusMessage = function(slideIndex, slideCount, title) {
                $statusMessageText
                    .text('Slide {currentSlide} of {numSlides} - {title}'
                        .replace('{currentSlide}', slideIndex)
                        .replace('{numSlides}', slideCount)
                        .replace('{title}', title)
                    );
            };

            var shiftViewportLeft = function(val) {
                return val - viewportSize;
            };

            var shiftViewportRight = function(val) {
                return val + viewportSize;
            };

            var gotoSlide = function(newSlideIndex) {
                var newIndexesInViewport;
                var mapFunction;

                if (newSlideIndex > model.currentSlideIndex) {
                    mapFunction = shiftViewportLeft;
                } else if (newSlideIndex < model.currentSlideIndex) {
                    mapFunction = shiftViewportRight;
                }

                newIndexesInViewport = model.indexesInViewport.map(mapFunction);

                // map current viewport indexes to collection
                var itemsInViewport = model.indexesInViewport.map(function(val) {
                    return $carouselItems.get(val);
                });

                // map new viewport indexes to collection
                var newItemsInViewport = newIndexesInViewport.map(function(val) {
                    return $carouselItems.get(val);
                });

                // unhide new slide items
                $(newItemsInViewport)
                    .removeAttr('aria-hidden')
                    .removeAttr('tabindex');

                // hide current slide items
                $(itemsInViewport)
                    .attr('aria-hidden', 'true')
                    .attr('tabindex', '-1');

                // update model
                model.indexesInViewport = newIndexesInViewport;
                model.currentSlideIndex = newSlideIndex;

                // update pagination button state
                if (model.currentSlideIndex === 1) {
                    $paginateLeft.attr('aria-disabled', 'true');
                    $paginateRight.attr('aria-disabled', 'false');
                } else if (model.currentSlideIndex === numSlides) {
                    $paginateLeft.attr('aria-disabled', 'false');
                    $paginateRight.attr('aria-disabled', 'true');
                } else {
                    $paginateLeft.attr('aria-disabled', 'false');
                    $paginateRight.attr('aria-disabled', 'false');
                }

                // update the status message with new model
                setStatusMessage(model.currentSlideIndex, numSlides, titleText);

                $widget.trigger('carouselSlideChange');
            };

            // ensure widget has a unique id
            $widget.attr('id', 'carousel-' + widgetCount++);

            // add status message container to DOM
            $widget
                .prepend($statusMessageContainer);

            // add pagination buttons to DOM
            $carouselMain
                .prepend($paginateLeft)
                .append($paginateRight);

            // set the initial status message text
            setStatusMessage(model.currentSlideIndex, numSlides, titleText);

            $statusMessageContainer
                .attr('role', 'status')
                .attr('aria-live', 'polite')
                .prop('id', $widget.prop('id') + '-status')
                .addClass('clipped');

            $statusMessageContainer
                .append($statusMessageText);

            $paginateLeft
                .attr('type', 'button')
                .attr('aria-label', 'Previous slide - {title}'.replace('{title}', titleText))
                .attr('aria-disabled', 'true')
                .attr('aria-describedby', $statusMessageContainer.prop('id'))
                .addClass('carousel__previous')
                .on('click', onPaginatePreviousClick);

            $paginateRight
                .attr('type', 'button')
                .attr('aria-label', 'Next slide - {title}'.replace('{title}', titleText))
                .attr('aria-describedby', $statusMessageContainer.prop('id'))
                .addClass('carousel__next')
                .on('click', onPaginateNextClick);

            // cache items in viewport & hide items not in viewport
            $carouselItems.each(function(index, item) {
                if (index < viewportSize) {
                    model.indexesInViewport.push(index);
                } else {
                    $(item)
                        .attr('aria-hidden', 'true')
                        .attr('tabindex', '-1');
                }
            });

            // mark widget as js ready
            $widget.addClass('carousel--js');
        });
    };
}(jQuery));
