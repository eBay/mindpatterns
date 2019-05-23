/**
* Copyright 2015 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

/**
* @file jquery.inputvalidation.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie <ianmcburnie@hotmail.com>
*/
(function ($) {

    var widgetCount = 0;

    // template for the error message that will be displayed
    var messageTemplate = '{0} entered is not a valid {1}!';

    // this simple plugin is hardcoded to validate numbers only
    var validateNumber = function(x) {
        return !isNaN(x);
    };

    $.fn.inputValidation = function inputValidation() {
        return this.each(function() {
            var $this = $(this),
                labelText = $this.find('label').text(),
                $input = $this.find('input'),
                $status = $this.find('.input-validation__status'),
                $description = $status.find('.input-validation__description'),
                message,
                validationType;

            $this.attr('id', 'input-validation' + widgetCount++);

            $status
                .attr('aria-live', 'polite')
                .attr('role', 'status');

            // description needs a unique id to be a target of aria-describedby
            $description.prop('id', $this.prop('id') + '-status');

            // give input a description
            $input.attr('aria-describedby', $description.prop('id'));

            // determine validation type (number, date, url, etc)
            if ($this.hasClass('input-validation--number')) {
                validationType = 'number';
            }
            // it's always number or string for this simple example
            else {
                validationType = 'string';
            }

            // compile the error message template
            message = messageTemplate.replace('{0}', labelText).replace('{1}', validationType);

            // validate on page load
            if ($this.hasClass('input-validation--onload')) {
                $this.trigger('validate');
            }

            // validate on input
            if ($this.hasClass('input-validation--oninput')) {
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
            if ($this.hasClass('input-validation--onblur')) {
                $input.on('blur', function(e) {
                    $this.trigger('validate');
                });
            }

            // validate event handler
            $this.on('validate', function(e) {
                var isValid = validateNumber($input.val());

                // update live-region contents and aria-invalid state
                $description.text(isValid === true ? '' : message);
                $input.attr('aria-invalid', isValid ? 'false' : 'true');
            });
        });
    };
}(jQuery));
