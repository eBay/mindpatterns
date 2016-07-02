/**
* jquery.carousel.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie (imcburnie@ebay.com)
*/
(function ( $ ) {

    $.fn.carousel = function carousel() {

        return this.each(function onEach() {

            var $this = $(this),
                $title = $this.find('.carousel__title'),
                $list = $this.find('> ul, > ol'),
                $statusMessageContainer = $('<p role="status" class="clipped">'),
                $statusMessageText = $('<span>'),
                $paginateLeft = $('<button />'),
                $paginateRight = $('<button />'),
                $listItems = $list.find('> li'),
                viewportSize = $this.data('carousel'),
                numSlides = Math.round($listItems.length / viewportSize),
                currentSlideIndex = 1,
                indexesInViewport = [],
                $container;

            $this.nextId('carousel');

            $list.wrap('<div />');

            $container = $this.find('> div');

            $container
                .prepend($paginateLeft)
                .append($paginateRight)
                .prepend($statusMessageContainer);

            $statusMessageText
                .text('Showing slide {currentSlide} of {numSlides} - {title}'
                    .replace('{currentSlide}', currentSlideIndex)
                    .replace('{numSlides}', numSlides)
                    .replace('{title}', $title.text())
                );
            $statusMessageContainer.prop('id', $this.prop('id') + '-status');
            $statusMessageContainer.append($statusMessageText);

            $paginateLeft
                .html('<span class="clipped">Go to previous slide - {title}</span>'.replace('{title}', $title.text()))
                .attr('aria-disabled', 'true')
                .attr('aria-describedby', $statusMessageContainer.prop('id'));

            $paginateRight
                .html('<span class="clipped">Go to next slide - {title}</span>'.replace('{title}', $title.text()))
                .attr('aria-describedby', $statusMessageContainer.prop('id'));

            $listItems.each(function(idx, itm) {
                var $itm = $(itm);

                // hide every list item not in viewport
                if(idx < viewportSize) {
                    $itm.attr('aria-hidden', 'false');
                    indexesInViewport.push(idx);
                }
                else {
                    $itm.attr('aria-hidden', 'true');
                }
            });

            $paginateRight.on('click', function(e) {

                if (currentSlideIndex < numSlides) {

                    var newIndexesInViewport;

                    // increment page index
                    currentSlideIndex++;

                    newIndexesInViewport = indexesInViewport.map(function(idx) {
                        return idx + viewportSize;
                    });

                    $this.trigger('paginate', [newIndexesInViewport]);
                }
            });

            $paginateLeft.on('click', function(e) {

                if (currentSlideIndex > 1) {

                    var newIndexesInViewport;

                    // increment page index
                    currentSlideIndex--;

                    newIndexesInViewport = indexesInViewport.map(function(idx) {
                        return idx - viewportSize;
                    });

                    $this.trigger('paginate', [newIndexesInViewport]);
                }
            });

            $this.on('paginate', function(e, newIndexesInViewport) {

                var viewportCollection = [];

                // convert viewport items to collection
                indexesInViewport.forEach(function(idx, itm) {
                    viewportCollection.push($listItems.get(idx));
                });

                // unhide new slide items
                newIndexesInViewport.forEach(function(idx) {
                    $($listItems.get(idx)).removeAttr('aria-hidden');
                });

                // hide current slide items
                $(viewportCollection).attr('aria-hidden', 'true');

                if (currentSlideIndex === 1) {
                    $paginateLeft.attr('aria-disabled', 'true');
                    $paginateRight.attr('aria-disabled', 'false');
                }
                else if (currentSlideIndex === numSlides) {
                    $paginateLeft.attr('aria-disabled', 'false');
                    $paginateRight.attr('aria-disabled', 'true');
                }
                else {
                    $paginateLeft.attr('aria-disabled', 'false');
                    $paginateRight.attr('aria-disabled', 'false');
                }

                // IMPORTANT! update the model
                indexesInViewport = newIndexesInViewport;

                $statusMessageText
                    .text('Showing slide {currentSlide} of {numSlides} - {title}'
                        .replace('{currentSlide}', currentSlideIndex)
                        .replace('{numSlides}', numSlides)
                        .replace('{title}', $title.text())
                    );
            });

            $this.addClass('carousel--js');
        });
    };
}( jQuery ));
