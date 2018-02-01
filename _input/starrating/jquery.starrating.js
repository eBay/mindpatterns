/**
* Copyright 2015 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

(function ( $ ) {

    $.fn.starRating = function starRating() {

        return this.each(function onEach() {
            var $widget = $(this);
            var $stars = $widget.find('input');
            var isChecked = $widget.find('input:checked').length > 0;

            $widget.one('click', function() {
                $(this).removeClass('starrating--unselected');
            });

            if (isChecked === false) {
                $widget.addClass('starrating--unselected');
            }

            /*
            // the following code would be needed if labels and inputs are not all siblings in the DOM
            // in that case, CSS adjacent sibling selectors would not work
            // example of this to come

            var includedStars = function(index) {
                return index < $stars.index($widget.find('input:checked'));
            };

            var updateStars = function() {
                $stars.removeClass('included').filter(includedStars).addClass('included');
            };

            $widget.on('click', $stars, updateStars);

            update();
            */
        });
    };
}( jQuery ));
