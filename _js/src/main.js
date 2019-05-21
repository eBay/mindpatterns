/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

const Expander = require('makeup-expander');

const pageWidgets = [];

document.addEventListener("DOMContentLoaded", function(e) {
    const Util = require('./util.js');
    const Accordion = require('./accordion.js');
    const AccordionLegacy = require('./accordion-legacy.js');
    const Combobox = require('./combobox.js');
    const Expando = require('./expando.js');
    const Tabs = require('./tabs.js');
    const Tooltip = require('./tooltip.js');
    const Dialog = require('./dialog.js');
    const DialogButton = require('./dialog-button.js');
    const ListboxButton = require('./listbox-button.js');
    const Listbox = require('./listbox.js');
    const MenuButton = require('./menu-button.js');
    const Menu = require('./menu.js');
    const AriaButton = require('./aria-button.js');
    const HijaxButton = require('./hijax-button.js');
    const StarRating = require('./star-rating.js');

    document.querySelectorAll('.accordion').forEach(function(widgetEl) {
        pageWidgets.push(new Accordion(widgetEl, {
            autoCollapse: widgetEl.hasAttribute('data-makeup-accordion-auto-collapse')
        }));
    });

    document.querySelectorAll('.accordion-legacy').forEach(function(widgetEl) {
        pageWidgets.push(new AccordionLegacy(widgetEl));
    });

    document.querySelectorAll('.native-button, .stealth-button').forEach(function(widgetEl) {
        pageWidgets.push(widgetEl);
        widgetEl.addEventListener('click', function() {
            console.log(this);
        });
    });

    document.querySelectorAll('.aria-button').forEach(function(widgetEl) {
        pageWidgets.push(new AriaButton(widgetEl));

        widgetEl.addEventListener('aria-button-click', function(e) {
            console.log(this);
        });
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

    document.querySelectorAll('.tabs').forEach(function(widgetEl) {
        widgetEl.addEventListener('tabs-change', Util.logEvent);

        pageWidgets.push(new Tabs(widgetEl));
    });

    document.querySelectorAll('.dialog').forEach(function(widgetEl) {
        pageWidgets.push(new Dialog(widgetEl));
    });

    document.querySelectorAll('.dialog-button').forEach(function(widgetEl) {
        const dialogWidgetIndex = pageWidgets.findIndex(function(widget) {
            return widget._el.id === widgetEl.dataset.makeupDialog;
        });
        pageWidgets.push(new DialogButton(widgetEl, pageWidgets[dialogWidgetIndex]));
    });

    document.querySelectorAll('.listbox-button').forEach(function(widgetEl) {
        pageWidgets.push(new ListboxButton(widgetEl, { autoSelect: (widgetEl.dataset.autoSelect === 'true') ? true : false }));
        widgetEl.addEventListener('listbox-change', function(e) {
            console.log(e.type, e.detail);
        });
    });

    document.querySelectorAll('.combobox').forEach(function(widgetEl) {
        pageWidgets.push(new Combobox(widgetEl, {
            autoSelect: (widgetEl.dataset.autoSelect === 'true') ? true : false
        }));

        widgetEl.addEventListener('combobox-change', function(e) {
            console.log(e.type, e.detail);
        });
    });

    document.querySelectorAll('.listbox').forEach(function(widgetEl) {
        pageWidgets.push(new Listbox(widgetEl, { autoSelect: (widgetEl.dataset.autoSelect === 'true') ? true : false }));
        widgetEl.addEventListener('listbox-change', function(e) {
            console.log(e.type, e.detail);
        });
    });

    document.querySelectorAll('.menu-button').forEach(function(widgetEl) {
        pageWidgets.push(new MenuButton(widgetEl));

        widgetEl.addEventListener('menuitem-select', function(e) {
            console.log(e.type, detail.el.innerText);
        });
    });

    document.querySelectorAll('.menu').forEach(function(widgetEl) {
        pageWidgets.push(new Menu(widgetEl));

        widgetEl.addEventListener('menu-select', (e) => console.log(e.type, e.detail));
        widgetEl.addEventListener('menu-change', (e) => console.log(e.type, e.detail));
        widgetEl.addEventListener('menu-toggle', (e) => console.log(e.type, e.detail));
    });

    document.querySelectorAll('.expando').forEach(function(widgetEl) {
        widgetEl.addEventListener('expando-toggle', Util.logEvent);

        pageWidgets.push(new Expando(widgetEl));
    });

    document.querySelectorAll('.page-notice--attention').forEach(function(widgetEl) {
        widgetEl.setAttribute('tabindex', '-1');

        setTimeout(function onTimeout() {
            widgetEl.focus();
        }, 250);
    });

    document.querySelectorAll('.star-rating').forEach(function(widgetEl) {
        pageWidgets.push(new StarRating(widgetEl));
    });

    document.querySelectorAll('.tooltip').forEach(function(widgetEl) {
        pageWidgets.push(new Tooltip(widgetEl));
    });

    document.querySelectorAll('.infotip').forEach(function(widgetEl) {
        pageWidgets.push(new Expander(widgetEl, {
            contentSelector: '.infotip__content',
            expandOnClick: true,
            collapseOnClick: true,
            hostSelector: '.infotip__host'
        }));
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
});
