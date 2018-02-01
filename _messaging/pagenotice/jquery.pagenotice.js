/**
* Copyright 2015 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

/**
* @file jquery.pagenotice.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie <ianmcburnie@hotmail.com>
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
