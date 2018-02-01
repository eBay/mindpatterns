/**
* Copyright 2015 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

/**
* @function jquery.pagination.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie <ianmcburnie@hotmail.com>
*/
(function ($) {
    $.fn.pagination = function pagination() {
        return this.each(function onEach() {
            var $paginationEl = $(this);
            var $paginationItems = $paginationEl.find('.pagination__item');
            var $prevEl = $paginationEl.find('.pagination__previous');
            var $nextEl = $paginationEl.find('.pagination__next');
            var $indexEl = $paginationEl.find('.pagination__index');
            var queryString = window.location.search;

            var updateModel = function(newIndex, doPushState) {
                if (newIndex >= 0 && newIndex < $paginationItems.length) {
                    var currentIndex = parseInt($indexEl.text(), 10) - 1;
                    var $currentItem = $($paginationItems[currentIndex]);
                    var $newItem = $($paginationItems[newIndex]);
                    var pageNum = newIndex + 1;
                    var pageName = (newIndex === 0) ? 'index' : pageNum;

                    $currentItem.removeAttr('aria-current');
                    $newItem.attr('aria-current', 'page');

                    $indexEl.text(newIndex + 1);
                    $paginationEl.trigger('paginationChange', $newItem.attr('href'));

                    if (newIndex === 0)  {
                        $prevEl.attr('aria-disabled', 'true');
                        $nextEl.attr('aria-disabled', 'false');
                    } else if (newIndex === $paginationItems.length - 1) {
                        $prevEl.attr('aria-disabled', 'false');
                        $nextEl.attr('aria-disabled', 'true');
                    } else {
                        $prevEl.attr('aria-disabled', 'false');
                        $nextEl.attr('aria-disabled', 'false');
                    }

                    if (doPushState !== false) {
                        history.pushState({index: newIndex}, '', "index.html?page="+pageNum);
                    }
                }
            };

            $prevEl.on('click', function(e) {
                e.preventDefault();
                var newIndex = parseInt($indexEl.text(), 10) - 2;
                updateModel(newIndex);
            });

            $nextEl.on('click', function(e) {
                e.preventDefault();
                var newIndex = parseInt($indexEl.text(), 10);
                updateModel(newIndex);
            });

            $paginationEl.on('click', '.pagination__item', function(e) {
                e.preventDefault();
                var newIndex = parseInt($(this).text(), 10) - 1;
                updateModel(newIndex);
            });

            $(window).on('popstate', function(e) {
                if (history.state) {
                    updateModel(history.state.index, false);
                } else {
                    updateModel(0, false);
                }
            });

            if (history.state) {
                updateModel(history.state.index, false);
            } else {
                updateModel(0, false);
            }

            if (queryString.indexOf('page=2') !== -1) {
                updateModel(1, false);
            } else if (queryString.indexOf('page=3') !== -1) {
                updateModel(2, false);
            } else {
                updateModel(0, false);
            }
        });
    };
}(jQuery));
