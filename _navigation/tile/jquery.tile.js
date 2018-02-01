/**
* Copyright 2015 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

/**
* @file jquery.tile.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie <ianmcburnie@hotmail.com>
*/
(function ( $ ) {
    $.fn.tile = function tile() {
        return this.each(function onEachTile() {

            var $this = $(this),
                $link = $this.find('a'),
                href = $link.attr('href');

            $this.on('click', function onTileClick(e) {
                window.location = href;
            });

            $this.on('focusin', function onTileFocusIn(e) {
                $this.addClass('tile--focusin');
                $this.one('focusout', function onTileFocusOut(e) {
                    $this.removeClass('tile--focusin');
                });
            });
        });
    };
}( jQuery ));
