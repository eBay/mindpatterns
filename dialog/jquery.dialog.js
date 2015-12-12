/**
* @function jquery.dialog.js
* @version 0.0.1
* @author Ian McBurnie <imcburnie@ebay.com>
* @requires jquery-next-id
* @requires jquery-focusable
* @requires jquery-keyboard-trap
* @requires jquery-screenreader-trap
*/
(function ( $ ) {

    $.fn.dialog = function dialog(options) {

        return this.each(function onEach() {

            var $dialog = $(this),
                opts = $.extend({}, $.fn.dialog.defaults, options),
                $body = $('body'),
                $header = $dialog.find('header'),
                $heading = $header.find('> h2'),
                $doc = $dialog.find('> [role=document]'), // role=document is for older NVDA
                $closeButton = $header.find('> button'),
                $focusable,
                openTimeout,
                closeTimeout;

            function onDocumentEscKey() {
                $dialog.trigger('close.dialog');
            }

            function onCloseButtonClick() {
                $dialog.trigger('close.dialog');
            }

            // assign a unique id to the dialog widget
            $dialog.nextId('dialog');

            // heading needs an id to create programmatic label for dialog
            $heading.nextId($dialog.prop('id') + '-title');

            // setup the programmatic label
            $dialog.attr('aria-labelledby', $heading.prop('id'));

            // ensure dialog has role dialog
            $dialog.attr('role', 'dialog');

            // ensure header has role banner
            $header.attr('role', 'banner');

            $dialog.on('open.dialog', function onDialogClose() {
                // clean up any untriggered closeTimeout
                window.clearTimeout(closeTimeout);

                // set display block so that CSS transitions will work
                $dialog.css('display', 'block');

                // wait a little time before triggering CSS transition
                openTimeout = setTimeout(function() {
                    $dialog.attr('aria-hidden', 'false');
                }, 10);

                // find all focusable elements inside dialog
                $focusable = $dialog.focusable();

                // dialog must always focus on an interactive element
                // if none found, set focus to doc
                if ($focusable.size() === 0) {
                    $doc.attr('tabindex', '-1').focus();
                }
                else {
                    $focusable.first().focus();
                }

                // prevent screen reader virtual cursor from leaving the dialog
                $.trapScreenreader($dialog);

                // prevent keyboard user from leaving the dialog
                $.trapKeyboard($dialog, {deactivateOnFocusExit:false});

                // add hook to body for CSS
                $body.addClass('has-dialog');

                // dialog must be closed on esc key
                $(document).commonKeys().on('escape.commonKeyDown', onDocumentEscKey);

                $closeButton.on('click', onCloseButtonClick);
            });

            // when the dialog is closed, we must undo everything we did on open
            $dialog.on('close.dialog', function onDialogClose() {
                window.clearTimeout(openTimeout);
                $closeButton.off('click', onCloseButtonClick);
                $(document).off('escape.commonKeyDown', onDocumentEscKey);
                $.untrapKeyboard();
                $.untrapScreenreader();
                $body.removeClass('has-dialog');
                $dialog.attr('aria-hidden', 'true');
                closeTimeout = setTimeout(function() {
                    $dialog.css('display', 'none');
                }, opts.transitionDurationMs);
            });
        });
    };
}( jQuery ));

$.fn.dialog.defaults = {
    transitionDurationMs : 175
};
