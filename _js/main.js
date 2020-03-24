/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

// requires NodeList.forEach polyfill for IE
// conditional check due to https://github.com/imagitama/nodelist-foreach-polyfill/issues/7
if (typeof window !== 'undefined') {
    require('nodelist-foreach-polyfill');
}

const pageWidgets = [];

const findIndex = require('core-js-pure/features/array/find-index');

document.addEventListener("DOMContentLoaded", function(e) {
    const Util = require('./util.js');
    const Accordion = require('./accordion.js');
    // const AccordionLegacy = require('./accordion-legacy.js');
    const AlertDialog = require('./alert-dialog.js');
    const AriaButton = require('./aria-button.js');
    const Carousel = require('./carousel.js');
    const CharacterMeter = require('./character-meter.js');
    const Combobox = require('./combobox.js');
    const ConfirmDialog = require('./confirm-dialog.js');
    const Dialog = require('./dialog.js');
    const DialogButton = require('./dialog-button.js');
    // const Expando = require('./expando.js');
    const Expander = require('makeup-expander');
    const HijaxButton = require('./hijax-button.js');
    const InputDialog = require('./input-dialog.js');
    const PasswordMeter = require('./password-meter.js');
    const Listbox = require('./listbox.js');
    const ListboxButton = require('./listbox-button.js');
    const Menu = require('./menu.js');
    const MenuButton = require('./menu-button.js');
    const Pagination = require('./pagination.js');
    const StarRating = require('./star-rating.js');
    const Switch = require('./switch.js');
    const Tabs = require('./tabs.js');
    const Tile = require('./tile.js');
    const Tooltip = require('./tooltip.js');

    document.querySelectorAll('.accordion').forEach(function(widgetEl) {
        pageWidgets.push(new Accordion(widgetEl, {
            autoCollapse: widgetEl.hasAttribute('data-makeup-accordion-auto-collapse')
        }));
    });

    /*
    document.querySelectorAll('.accordion-legacy').forEach(function(widgetEl) {
        pageWidgets.push(new AccordionLegacy(widgetEl));
    });
    */

    document.querySelectorAll('.alert-dialog').forEach(function(widgetEl) {
        pageWidgets.push(new AlertDialog(widgetEl));
    });

    document.querySelectorAll('.aria-button').forEach(function(widgetEl) {
        pageWidgets.push(new AriaButton(widgetEl));

        widgetEl.addEventListener('aria-button-click', function(e) {
            console.log(this);
        });
    });

    document.querySelectorAll('.carousel').forEach(function(widgetEl) {
        pageWidgets.push(new Carousel(widgetEl));

        widgetEl.addEventListener('carousel-pagination', function(e) {
            console.log(e);
        });
    });

    document.querySelectorAll('.character-meter').forEach(function(widgetEl) {
        pageWidgets.push(new CharacterMeter(widgetEl));
    });

    document.querySelectorAll('.combobox').forEach(function(widgetEl) {
        pageWidgets.push(new Combobox(widgetEl, {
            autoSelect: (widgetEl.dataset.autoSelect === 'true') ? true : false
        }));

        widgetEl.addEventListener('combobox-change', function(e) {
            console.log(e.type, e.detail);
        });
    });

    document.querySelectorAll('.confirm-dialog').forEach(function(widgetEl) {
        pageWidgets.push(new ConfirmDialog(widgetEl));
    });

    document.querySelectorAll('.dialog').forEach(function(widgetEl) {
        pageWidgets.push(new Dialog(widgetEl));
    });

    document.querySelectorAll('.flyout--click').forEach(function(widgetEl) {
        pageWidgets.push(new Expander(widgetEl, {
            contentSelector: '.flyout__content',
            expandOnClick: true,
            collapseOnClick: true,
            hostSelector: '.flyout__host'
        }));
    });

    document.querySelectorAll('.flyout--focus').forEach(function(widgetEl) {
        pageWidgets.push(new Expander(widgetEl, {
            contentSelector: '.flyout__content',
            expandOnFocus: true,
            autoCollapse: true,
            hostSelector: '.flyout__host'
        }));
    });

    document.querySelectorAll('.flyout--hover').forEach(function(widgetEl) {
        pageWidgets.push(new Expander(widgetEl, {
            contentSelector: '.flyout__content',
            expandOnFocus: true,
            expandOnHover: true,
            autoCollapse: true,
            hostSelector: '.flyout__host'
        }));
    });

    document.querySelectorAll('.fake-menu').forEach(function(widgetEl) {
        pageWidgets.push(new Expander(widgetEl, {
            expandOnClick: true,
            collapseOnFocusOut: true,
            collapseOnClickOut: true,
            contentSelector: '.fake-menu__content',
            focusManagement: 'focusable',
            hostSelector: '.fake-menu__host'
        }));
    });

    document.querySelectorAll('.hijax-button').forEach(function(widgetEl) {
        pageWidgets.push(new HijaxButton(widgetEl));

        widgetEl.addEventListener('hijax-button-click', function(e) {
            console.log(this);
        });
    });

    document.querySelectorAll('.infotip').forEach(function(widgetEl) {
        pageWidgets.push(new Expander(widgetEl, {
            contentSelector: '.infotip__content',
            expandOnClick: true,
            collapseOnClick: true,
            hostSelector: '.infotip__host'
        }));
    });

    document.querySelectorAll('.input-dialog').forEach(function(widgetEl) {
        pageWidgets.push(new InputDialog(widgetEl));
    });

    document.querySelectorAll('.password-meter').forEach(function(widgetEl) {
        pageWidgets.push(new PasswordMeter(widgetEl));
    });

    document.querySelectorAll('.listbox').forEach(function(widgetEl) {
        pageWidgets.push(new Listbox(widgetEl, {
            autoSelect: (widgetEl.dataset.autoSelect === 'true') ? true : false
        }));
        widgetEl.addEventListener('listbox-change', function(e) {
            console.log(e.type, e.detail);
        });
    });

    document.querySelectorAll('.listbox-button').forEach(function(widgetEl) {
        const widget = new ListboxButton(widgetEl, {
            autoSelect: (widgetEl.dataset.autoSelect === 'true') ? true : false
        });

        pageWidgets.push(widget);

        widgetEl.addEventListener('listbox-button-change', function(e) {
            console.log(e.type, e.detail);
        });
    });

    document.querySelectorAll('.menu-button').forEach(function(widgetEl) {
        const widget = new MenuButton(widgetEl);

        pageWidgets.push(widget);

        widget.menu.el.addEventListener('menu-select', function(e) {
            console.log(e.type, e.detail.el.innerText);
        });
    });

    document.querySelectorAll('.menu').forEach(function(widgetEl, i) {
        // check this isn't a buttonless menu
        if (widgetEl.querySelector('.expand-btn')) {
            var widget = new Expander(widgetEl, {
                autoCollapse: true,
                contentSelector: '[role=menu]',
                expandOnClick: true,
                focusManagement: 'focusable',
                hostSelector: '.expand-btn'
            });

            var contentEl = widgetEl.querySelector('[role=menu]');
            var rovingTabindexState = RovingTabindex.createLinear(contentEl, '.menu__item');

            querySelectorAllToArray('.menu__item', contentEl).forEach(function(el) {
                ScrollKeyPreventer.add(el);
            });
        }
    });

    document.querySelectorAll('.menu').forEach(function(widgetEl) {
        pageWidgets.push(new Menu(widgetEl));

        widgetEl.addEventListener('menu-select', (e) => console.log(e.type, e.detail));
        widgetEl.addEventListener('menu-change', (e) => console.log(e.type, e.detail));
        widgetEl.addEventListener('menu-toggle', (e) => console.log(e.type, e.detail));
    });

    document.querySelectorAll('.native-button, .stealth-button').forEach(function(widgetEl) {
        pageWidgets.push(widgetEl);
        widgetEl.addEventListener('click', function() {
            console.log(this);
        });
    });

    document.querySelectorAll('.pagination').forEach(function(widgetEl) {
        pageWidgets.push(new Pagination(widgetEl));
    });

    document.querySelectorAll('.star-rating').forEach(function(widgetEl) {
        pageWidgets.push(new StarRating(widgetEl));
    });

    document.querySelectorAll('.switch').forEach(function(widgetEl) {
        pageWidgets.push(new Switch(widgetEl));

        widgetEl.addEventListener('switch-toggle', function(e) {
            console.log(e.type, e.detail);
            if (e.detail.value === 'on') {
                document.body.classList.add('lights-on');
            } else {
                document.body.classList.remove('lights-on');
            }
        });
    });

    document.querySelectorAll('.tabs').forEach(function(widgetEl) {
        widgetEl.addEventListener('tabs-change', Util.logEvent);

        pageWidgets.push(new Tabs(widgetEl,  {
            autoSelect: (widgetEl.dataset.autoSelect === 'true') ? true : false
        }));
    });

    document.querySelectorAll('.tile').forEach(function(widgetEl) {
        pageWidgets.push(new Tile(widgetEl));
    });

    document.querySelectorAll('.tooltip').forEach(function(widgetEl) {
        pageWidgets.push(new Tooltip(widgetEl));
    });

    document.querySelectorAll('.dialog-button').forEach(function(widgetEl) {
        const dialogWidgetIndex = findIndex(pageWidgets, function(widget) {
            return widget._el.id === widgetEl.dataset.makeupDialog;
        });
        pageWidgets.push(new DialogButton(widgetEl, pageWidgets[dialogWidgetIndex]));
    });
});
