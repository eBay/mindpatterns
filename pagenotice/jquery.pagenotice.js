/**
* jquery.pagenotice.js
* @author Ian McBurnie (imcburnie@ebay.com)
*/
(function ( $ ) {
    $.fn.pagenotice = function pageNotice() {
        var $this = $(this);

        if ($this.hasClass('page-notice--error')) {
            $this.attr('tabindex', '-1');

            setTimeout(function onTimeout() {
                $this.focus();
            }, 250);
        }
    };
}( jQuery ));
