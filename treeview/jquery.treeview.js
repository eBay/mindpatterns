/**
* @function jquery.treeview.js
* @author Ian McBurnie <imcburnie@ebay.com>
* @requires jquery-next-id
* @requires jquery-common-keys
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

            $treeItems.activedescendant($treeItems);

            $treeItems.on('change.activeDescendant', function(e, id) {
                console.log(id);
            });

            // call plugin to prevent page scroll
            $('[role=tree]').preventDocumentScrollKeys();
        });
    };
}( jQuery ));
