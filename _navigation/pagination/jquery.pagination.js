/**
* @function jquery.pagination.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie <ianmcburnie@hotmail.com>
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
