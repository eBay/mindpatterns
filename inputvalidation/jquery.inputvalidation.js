/**
* @file jquery.inputvalidation.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie <ianmcburnie@hotmail.com>
*/
(function ( $ ) {

    // template for the error message that will be displayed
    var messageTemplate = '{0} entered is not a valid {1}!';

    // this simple plugin is hardcoded to validate numbers only
    var validateNumber = function(x) {
        return !isNaN(x);
    };

    $.fn.inputvalidation = function inputValidation() {

        return this.each(function() {

            var $this = $(this),
                labelText = $this.find('label').text(),
                $input = $this.find('input'),
                $status = $('<span aria-live="polite" />'),
                $statusMsg = $('<span />'),
                message,
                validationType;

            $this.nextId('inputvalidation');

            $status.append($statusMsg);

            // input is described by contents of status
            $status.prop('id', $this.prop('id') + '-status');
            $status.appendTo($this);
            $input.attr('aria-describedby', $status.prop('id'));

            // determine validation type (number, date, url, etc)
            if ($this.hasClass('inputvalidation__number')) {
                validationType = 'number';
            }
            // it's always number or string for this simple example
            else {
                validationType = 'string';
            }

            // compile the error message template
            message = messageTemplate.replace('{0}', labelText).replace('{1}', validationType);

            // validate on page load
            if ($this.hasClass('inputvalidation__onload')) {
                $this.trigger('validate');
            }

            // validate on input
            if ($this.hasClass('inputvalidation__oninput')) {
                $input.on('input', function(e) {
                    // if input is supported we don't need the keyup fallback
                    $input.off('keyup');
                    $this.trigger('validate');
                });
                // IE8 fallback using keyup event
                $input.on('keyup', function(e) {
                    $this.trigger('validate');
                });
            }

            // validate on blur
            if ($this.hasClass('inputvalidation__onblur')) {
                $input.on('blur', function(e) {
                    $this.trigger('validate');
                });
            }

            // validate event handler
            $this.on('validate', function(e) {
                var isValid = validateNumber($input.val());

                // update live-region contents and aria-invalid state
                $statusMsg.text(isValid === true ? '' : message);
                $input.attr('aria-invalid', isValid ? 'false' : 'true');
            });

        });
    };
}( jQuery ));
