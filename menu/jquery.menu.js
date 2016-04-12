/**
* @function jquery.menu.js
* @version 0.0.1
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @requires jquery-button-flyout
* @requires jquery-common-keydown
* @requires jquery-roving-tabindex
* @requires jquery-prevent-document-scroll-keys
*/
(function ( $ ) {

    function createKeyCodeMap() {
        for (var map = {}, charCode = 65; charCode <= 90; charCode++) {
            map[charCode] = String.fromCharCode(charCode);
        }

        return map;
    }

    $.fn.menu = function menu() {

        return this.each(function onEach() {
            var $this = $(this);
            var $button = $this.find('button');
            var $rootMenu = $this.find('> [role=menu], > *:last-child > [role=menu]').first();
            var $groups = $rootMenu.find('> div[role=presentation]');
            var $allmenuitems = $rootMenu.find('> [role^=menuitem], > div > [role^=menuitem], > a');
            var $links = $rootMenu.find('a');
            var $buttons = $rootMenu.find('[role=menuitem]');
            var $checkboxes = $rootMenu.find('[role=menuitemcheckbox]');
            var $radios = $rootMenu.find('[role=menuitemradio]');
            var $firstMenuItem = $allmenuitems.first();
            var $subMenus = $rootMenu.find('[role=menuitem][aria-haspopup=true]');
            var keyCodeMap = createKeyCodeMap();
            var shortcutKeyMap = {};

            // store first char of all menu items
            $allmenuitems.each(function(idx) {
                shortcutKeyMap[$(this).text()[0]] = idx;
            });

            // assign id to widget
            $this.nextId('popupmenu');

            // menu is built on top of button-flyout plugin
            $this.buttonFlyout({focusManagement:true});

            // listen for specific key presses on all menu items
            $allmenuitems.commonKeyDown();

            // listen for roving tabindex update on all menu items
            $rootMenu.rovingTabindex($allmenuitems, {axis: 'y'});

            // assign id to menu
            $rootMenu.prop('id', $this.prop('id') + '-menu');

            // create popup menu semantics
            $button
                .attr('aria-haspopup', 'true')
                .prop('id', $this.prop('id') + '-button');

            // all submenus start in collapsed state
            $subMenus.attr('aria-expanded', 'false');

            $allmenuitems.not('a').on('click spaceKeyDown enterKeyDown', function(e) {
                console.log($(e.target).text());
                $this.trigger(jQuery.Event( 'menuSelect', {menuValue: 'foo'}));
            });

            // toggle checkbox state
            $checkboxes.on('click spaceKeyDown enterKeyDown', function(e) {
                $(this).attr('aria-checked', $(this).attr('aria-checked') == 'true' ? 'false' : 'true');
            });

            // toggle radios state
            $radios.on('click spaceKeyDown enterKeyDown', function(e) {
                $radios.attr('aria-checked', 'false');
                $(this).attr('aria-checked', 'true');
            });

            // reset all tabindexes when flyout opens and closes
            $this.on('buttonFlyoutOpen buttonFlyoutClose', function onShowOrHide() {
                $allmenuitems.attr('tabindex', '-1');
            });

            // if char key is pressed, set focus on 1st matching menu item
            $allmenuitems.on('keydown', function(e){
                var char = keyCodeMap[e.keyCode];
                var itemIndex = shortcutKeyMap[char];

                if (itemIndex) {
                    $allmenuitems.get(itemIndex).focus();
                }
            });

            // when a menu item selection has been made, set focus back to button
            $this.on('menuSelect', function onMenuSelect(e) {
                console.log(e);
                $button.focus();
            });

            // use a plugin to prevent page scroll when arrow keys are pressed
            $('[role^=menuitem]').preventDocumentScrollKeys();

            // mark widget as js initialised
            $this.addClass('menu--js');
        });
    };

}( jQuery ));
