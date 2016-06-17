/**
* jquery.carousel.js
* @author Ian McBurnie (imcburnie@ebay.com)
*/
(function ( $ ) {

    $.fn.carousel = function carousel() {

        return this.each(function onEach() {

            var $this = $(this),
                $list = $this.find('> ul, > ol'),
                $paginateLeft = $('<button />'),
                $paginateRight = $('<button />'),
                $listItems = $list.find('> li'),
                viewportSize = $this.data('carousel'),
                numPages = Math.round($listItems.length / viewportSize),
                currentPageIdx = 1,
                indexesInViewport = [],
                $container;

            $list.wrap('<div />');

            $container = $this.find('> div');

            $container
                .prepend($paginateLeft)
                .append($paginateRight);

            $paginateLeft.attr('aria-label', 'Paginate left').attr('aria-disabled', 'true');
            $paginateRight.attr('aria-label', 'Paginate right');

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

                if (currentPageIdx < numPages) {

                    var newIndexesInViewport;

                    // increment page index
                    currentPageIdx++;

                    newIndexesInViewport = indexesInViewport.map(function(idx) {
                        return idx + viewportSize;
                    });

                    $this.trigger('paginate', [newIndexesInViewport]);
                }
            });

            $paginateLeft.on('click', function(e) {

                if (currentPageIdx > 1) {

                    var newIndexesInViewport;

                    // increment page index
                    currentPageIdx--;

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

                // fadeout all viewport items
                $.when($(viewportCollection).fadeOut()).then(function() {

                    // hide viewport items from screen reader
                    $(viewportCollection).attr('aria-hidden', 'true');

                    // unhide all items in viewport model
                    newIndexesInViewport.forEach(function(idx) {
                        $($listItems.get(idx))
                            .css('display', 'inline-block')
                            .attr('aria-hidden', 'false');
                    });
                })

                if (currentPageIdx === 1) {
                    $paginateLeft.attr('aria-disabled', 'true');
                    $paginateRight.attr('aria-disabled', 'false');
                }
                else if (currentPageIdx === numPages) {
                    $paginateLeft.attr('aria-disabled', 'false');
                    $paginateRight.attr('aria-disabled', 'true');
                }
                else {
                    $paginateLeft.attr('aria-disabled', 'false');
                    $paginateRight.attr('aria-disabled', 'false');
                }

                // IMPORTANT! update the model
                indexesInViewport = newIndexesInViewport;
            });



            $this.addClass('carousel--js');
        });
    };
}( jQuery ));
