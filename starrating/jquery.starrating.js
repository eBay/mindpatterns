(function ( $ ) {

    $.fn.starRating = function starRating() {

        return this.each(function onEach() {
            var $widget = $(this);
            var $stars = $widget.find('input');
            var isChecked = $widget.find('input:checked').length > 0;

            /*
            var includedStars = function(index) {
                return index < $stars.index($widget.find('input:checked'));
            };

            var updateStars = function() {
                $stars.removeClass('included').filter(includedStars).addClass('included');
            };

            $widget.on('click', $stars, updateStars);

            update();
            */

            $widget.one('click', function() {
                $(this).removeClass('starrating--unselected');
            });

            if (isChecked === false) {
                $widget.addClass('starrating--unselected');
            }
        });
    };
}( jQuery ));
