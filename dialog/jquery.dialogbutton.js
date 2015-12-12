/**
* @function jquery.dialogbutton.js
* @version 0.0.1
* @author Ian McBurnie <imcburnie@ebay.com>
* @requires jquery.dialog.js
*/
(function ( $ ) {

    $.fn.dialogButton = function dialogButton(options) {

        return this.each(function onEach() {

            var $dialogButton = $(this),
                dialogId = $dialogButton.attr('aria-controls'),
                dialogOptions = options || $dialogButton.data('dialog'),
                $dialog = $('#'+dialogId);

            $dialog.dialog(dialogOptions);

            $dialog.on('close.dialog', function(e) {
                $dialogButton.focus();
            });

            $dialogButton.on('click', function(e) {
                $dialog.trigger('open.dialog');
            })

        });
    };
}( jQuery ));
