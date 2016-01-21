/**
* @function jquery.menu.js
* @version 0.0.1
* @author Ian McBurnie <imcburnie@ebay.com>
* @requires jquery-button-flyout
* @requires jquery-common-keys
* @requires jquery-roving-tabindex
*/
(function ( $ ) {

    var keycodes = {"65":"A","66":"B","68":"D","76":"L","77":"M","78":"N","80":"P"}

    $.fn.menu = function menu() {

        return this.each(function onEach() {
            var $this = $(this),
                $button = $this.find('button'),
                $rootMenu = $this.find('> [role=menu], > *:last-child > [role=menu]').first(),
                $groups = $rootMenu.find('> div[role=presentation]'),
                $allmenuitems = $rootMenu.find('> [role^=menuitem], > div > [role^=menuitem], > a'),
                $links = $rootMenu.find('a'),
                $buttons = $rootMenu.find('[role=menuitem]'),
                $checkboxes = $rootMenu.find('[role=menuitemcheckbox]'),
                $radios = $rootMenu.find('[role=menuitemradio]'),
                $firstMenuItem = $allmenuitems.first(),
                $subMenus = $rootMenu.find('[role=menuitem][aria-haspopup=true]'),
                shortcutKeyMap = {};

            $allmenuitems.each(function(idx) {
                // store the starting letter of each menu item
                shortcutKeyMap[$(this).text()[0]] = idx;
            });

            // assign id to widget
            $this.nextId('popupmenu');

            $this.buttonFlyout({focusManagement:true});

            // listen for specific key presses on all menu items
            $allmenuitems.commonKeyDown();

            // listen for roving tabindex update on all menu items
            $allmenuitems.rovingTabindex($this.prop('id'), {axis: 'y'});

            // assign id to menu
            $rootMenu.prop('id', $this.prop('id') + '-menu');

            $button
                .attr('aria-haspopup', 'true')
                .prop('id', $this.prop('id') + '-button');

            $groups
                .attr('role', 'presentation');

            // all submenus start in collapsed state
            $subMenus.attr('aria-expanded', 'false');

            $allmenuitems.on('rovingTabindexChange', function onRovingTabindex(event, item) {
                $(item).focus();
            });

            $allmenuitems.not('a').on('click' , function(e) {
                $this.trigger('activate', e.target);
            });

            $allmenuitems.not('a').on('spaceKeyDown enterKeyDown', function(e) {
                $this.trigger('activate', e.target);
            });

            $checkboxes.on('spaceKeyDown enterKeyDown', function(e) {
                $(this).attr('aria-checked', $(this).attr('aria-checked') == 'true' ? 'false' : 'true');
            });

            $checkboxes.on('click', function(e) {
                $(this).attr('aria-checked', $(this).attr('aria-checked') == 'true' ? 'false' : 'true');
            });

            $radios.on('spaceKeyDown enterKeyDown', function(e) {
                $radios.attr('aria-checked', 'false')
                $(this).attr('aria-checked', 'true');
            });

            $radios.on('click', function(e) {
                $radios.attr('aria-checked', 'false')
                $(this).attr('aria-checked', 'true');
            });

            $this.on('buttonFlyoutOpen buttonFlyoutClose', function onShowOrHide() {
                $allmenuitems.attr('tabindex', '-1');
            });

            $allmenuitems.on('keydown', function(e){
                var keyPressed = keycodes[e.keyCode];

                // if a menu item begin with this letter, set focus on it
                if (keyPressed) {
                    $allmenuitems.get(shortcutKeyMap[keyPressed]).focus();
                }
            })

            $this.on('activate', function onActivate(e, item) {
                alert(item.getAttribute('role') + ': ' + item.innerHTML);
                $this.trigger('dismiss');
                setTimeout(function(){
                    $button.focus();
                }, 50)
            });

            // call plugin to prevent page scroll
            $('[role^=menuitem]').preventDocumentScrollKeys();

            // mark widget as js initialised
            $this.addClass('menu-js');
        });
    };
}( jQuery ));
