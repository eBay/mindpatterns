/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

import '@ebay/skin/utility';
import '@ebay/skin/alert-dialog';
import '@ebay/skin/breadcrumbs';
import '@ebay/skin/checkbox';
import '@ebay/skin/icon';
import '@ebay/skin/icon-button';
import '@ebay/skin/button';
import '@ebay/skin/combobox';
import '@ebay/skin/confirm-dialog';
import '@ebay/skin/lightbox-dialog';
import '@ebay/skin/listbox';
import '@ebay/skin/listbox-button';
import '@ebay/skin/menu';
import '@ebay/skin/menu-button';
import '@ebay/skin/radio';
import '@ebay/skin/switch';
import '@ebay/skin/toast-dialog';

const pageWidgets = [];

const logEvent = (e) => console.log(e); // eslint-disable-line no-console

document.addEventListener('DOMContentLoaded', function() {
    const Accordion = require('./accordion.js');
    const AriaButton = require('./aria-button.js');
    const Carousel = require('./carousel.js');
    const CharacterMeter = require('./character-meter.js');
    const Combobox = require('makeup-combobox');
    const DialogButton = require('makeup-dialog-button');
    const Expander = require('makeup-expander');
    const HijaxButton = require('./hijax-button.js');
    const PasswordMeter = require('./password-meter.js');
    const Listbox = require('makeup-listbox');
    const ListboxButton = require('makeup-listbox-button');
    const Menu = require('makeup-menu');
    const MenuButton = require('makeup-menu-button');
    const Pagination = require('./pagination.js');
    const Pulldown = require('./pulldown.js');
    const StarRating = require('./star-rating.js');
    const Switch = require('makeup-switch');
    const Tabs = require('./tabs.js');
    const Tile = require('./tile.js');
    const Tooltip = require('./tooltip.js');

    document.querySelectorAll('.accordion').forEach(function(widgetEl) {
        pageWidgets.push(new Accordion(widgetEl, {
            autoCollapse: widgetEl.hasAttribute('data-makeup-accordion-auto-collapse')
        }));
    });

    document.querySelectorAll('.aria-button').forEach(function(widgetEl) {
        pageWidgets.push(new AriaButton(widgetEl));

        widgetEl.addEventListener('aria-button-click', function() {
            console.log(this);
        });
    });

    document.querySelectorAll('.carousel').forEach(function(widgetEl) {
        pageWidgets.push(new Carousel(widgetEl));

        widgetEl.addEventListener('carousel-pagination', logEvent);
    });

    document.querySelectorAll('.character-meter').forEach(function(widgetEl) {
        pageWidgets.push(new CharacterMeter(widgetEl));
    });

    document.querySelectorAll('.combobox').forEach(function(widgetEl) {
        pageWidgets.push(new Combobox(widgetEl, {
            autoSelect: !(widgetEl.dataset.makeupAutoSelect === 'false')
        }));

        widgetEl.addEventListener('makeup-combobox-change', (e) => console.log(e.type, e.detail));
    });

    document.querySelectorAll('.dialog-button').forEach(function(widgetEl) {
        const widget = new DialogButton(widgetEl);

        pageWidgets.push(widget);

        widget.dialog._el.addEventListener('dialog-open', logEvent);
        widget.dialog._el.addEventListener('dialog-close', logEvent);
        widget.dialog._el.addEventListener('dialog-confirm', logEvent);
        widget.dialog._el.addEventListener('dialog-reject', logEvent);
        widget.dialog._el.addEventListener('dialog-reset', logEvent);
        widget.dialog._el.addEventListener('dialog-done', logEvent);
        widget.dialog._el.addEventListener('dialog-acknowledge', logEvent);
        widget.dialog._el.addEventListener('dialog-cta', logEvent);
        widget.dialog._el.addEventListener('dialog-submit', logEvent);
        widget.dialog._el.addEventListener('dialog-cancel', logEvent);
    });

    document.querySelectorAll('.flyout--click').forEach(function(widgetEl) {
        pageWidgets.push(new Expander(widgetEl, {
            contentSelector: '.flyout__content',
            expandOnClick: true,
            collapseOnClick: true,
            collapseOnClickOut: true,
            collapseOnFocusOut: true,
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

    document.querySelectorAll('.flyout--hover-only').forEach(function(widgetEl) {
        pageWidgets.push(new Expander(widgetEl, {
            contentSelector: '.flyout__content',
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

        widgetEl.addEventListener('hijax-button-click', function() {
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

    document.querySelectorAll('.password-meter').forEach(function(widgetEl) {
        pageWidgets.push(new PasswordMeter(widgetEl));
    });

    document.querySelectorAll('.listbox').forEach(function(widgetEl) {
        pageWidgets.push(new Listbox(widgetEl, {
            autoSelect: (widgetEl.dataset.makeupAutoSelect === 'true')
        }));
        widgetEl.addEventListener('makeup-listbox-change', (e) => console.log(e.type, e.detail));
    });

    document.querySelectorAll('.listbox-button').forEach(function(widgetEl) {
        pageWidgets.push(new ListboxButton(widgetEl, {
            autoSelect: (widgetEl.dataset.makeupAutoSelect === 'true')
        }));

        widgetEl.addEventListener('makeup-listbox-button-change', (e) => console.log(e.type, e.detail));
    });

    document.querySelectorAll('.menu-button').forEach(function(widgetEl) {
        const widget = new MenuButton(widgetEl);

        pageWidgets.push(widget);

        widget.menu.el.addEventListener('makeup-menu-select', (e) => console.log(e.type, e.detail));
        widget.menu.el.addEventListener('makeup-menu-change', (e) => console.log(e.type, e.detail));
    });

    document.querySelectorAll('.menu').forEach(function(widgetEl) {
        pageWidgets.push(new Menu(widgetEl));

        widgetEl.addEventListener('makeup-menu-select', (e) => console.log(e.type, e.detail));
        widgetEl.addEventListener('makeup-menu-change', (e) => console.log(e.type, e.detail));
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

    document.querySelectorAll('.pulldown').forEach(function(widgetEl) {
        pageWidgets.push(new Pulldown(widgetEl));

        widgetEl.addEventListener('makeup-pulldown-toggle', (e) => console.log(e.type, e.detail));
    });

    document.querySelectorAll('.star-rating').forEach(function(widgetEl) {
        pageWidgets.push(new StarRating(widgetEl));
    });

    document.querySelectorAll('.switch').forEach(function(widgetEl) {
        pageWidgets.push(new Switch(widgetEl, {
            bem: {
                control: 'switch__control'
            }
        }));

        widgetEl.addEventListener('makeup-switch-toggle', function(e) {
            console.log(e.type, e.detail);
            if (e.detail.on) {
                document.body.classList.add('lights-on');
            } else {
                document.body.classList.remove('lights-on');
            }
        });
    });

    document.querySelectorAll('.tabs').forEach(function(widgetEl) {
        widgetEl.addEventListener('tabs-change', logEvent);

        pageWidgets.push(new Tabs(widgetEl, {
            autoSelect: (widgetEl.dataset.autoSelect === 'true')
        }));
    });

    document.querySelectorAll('.tile').forEach(function(widgetEl) {
        pageWidgets.push(new Tile(widgetEl));
    });

    document.querySelectorAll('.tooltip').forEach(function(widgetEl) {
        pageWidgets.push(new Tooltip(widgetEl));
    });
});
