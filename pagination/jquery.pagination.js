/**
* @function jquery.pagination.js
* @author Ian McBurnie <imcburnie@ebay.com>
*/
(function ( $ ) {
    $.fn.pagination = function pagination() {
        return this.each(function onEach() {
            $(this).find('a[aria-disabled=true]').on('click', function(e) {
                return false;
            });
            $(this).find('a:not([aria-disabled=true])').on('click', function(e) {
                alert('Todo: update ajax pagination state');
                return false;
            });
        });
    };
}( jQuery ));
