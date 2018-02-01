/**
* Copyright 2015 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

/**
* @function jquery.treeview.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @requires jquery-next-id
* @requires jquery-active-descendant
*/
(function ( $ ) {

    $.fn.treeview = function treeview() {

        return this.each(function onEachTreeview() {

            var $this = $(this),
                $tree = $this.find('> ol, > ul'),
                $treeItems = $tree.find('li'),
                $treeContainers = $tree.find('ul'),
                $rootNode = $treeItems.first();

            $this.nextId('treeview');

            $tree.attr('role', 'tree');

            $treeItems
                .attr('role', 'treeitem')
                .nextId($this.prop('id') + '-treeitem');

            $rootNode.attr('tabindex', '0');
            $treeContainers.attr('role', 'presentation');

            $treeItems.activeDescendant($treeItems);

            $treeItems.on('activeDescendantChange', function(e, newActiveDescendant) {
                console.log(newActiveDescendant);
            });

            // call plugin to prevent page scroll
            $('[role=tree]').preventScrollKeys('[role=treeitem]');
        });
    };
}( jQuery ));
