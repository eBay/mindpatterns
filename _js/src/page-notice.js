/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

function create(widgetEl) {
    if (widgetEl.classList.contains('page-notice--attention')) {
        widgetEl.setAttribute('tabindex', '-1');

        setTimeout(function onTimeout() {
            widgetEl.focus();
        }, 250);
    }

    widgetEl.classList.add('page-notice--js');
}

module.exports = {
    create: create
}
