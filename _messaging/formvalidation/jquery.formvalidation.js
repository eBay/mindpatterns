/**
* Copyright 2015 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

/**
* @file jquery.formvalidation.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie <ianmcburnie@hotmail.com>
*/
(function ( $ ) {

    $.fn.formValidation = function formValidation() {

        // this plugin is intentionally not reusable for now!
        // the validation routine and error messages are hardcoded for demo purposes only!

        var $form = $(this),
            $regionnotice = $('<div class="regionnotice" tabindex="-1">'),
            $errorHeading = $('<h3>Error! The form could not be submitted due to invalid entries.</h3><p>Please fix the following fields:</p>'),
            $listOfErrors = $('<ol>'),
            $elementnotice1 = $('<p class="elementnotice" id="age_error">Please enter a valid age (for example, 35)</p>'),
            $elementnotice2 = $('<p class="elementnotice" id="shoesize_error">Please enter a valid shoe size (for example, 8.5)</p>');

        var errorLinks = [
            '<a href="#age">Age - please enter a valid age (for example, 35)</a>',
            '<a href="#shoesize">Shoe-size - please enter a valid shoe size (for example, 8.5)</a>'
        ];

        // prevent built-in validation (it conflicts with our custom validation)
        $form.attr('novalidate', 'novalidate');

        $regionnotice.append($errorHeading);
        $regionnotice.append($listOfErrors);

        // insert hardcoded errors
        errorLinks.forEach(function(el) {
            $listOfErrors.append('<li>' + el + '</li>');
        });

        $listOfErrors.on('click', 'a', function(e) {
            e.preventDefault();
            var href = this.href;
            var targetId = href.substring(href.indexOf('#'));
            $(targetId).focus();
        });

        $form.one('submit', function onSubmit(e) {
            // setup hardcoded input notices
            $form.find('input[type=text]').attr('aria-invalid', 'true');

            $('#age_field').append($elementnotice1);
            $('#shoesize_field').append($elementnotice2);

            $('#age').attr('aria-describedby', 'age_error');
            $('#shoesize').attr('aria-describedby', 'shoesize_error');

            $form.prepend($regionnotice);
        });

        $form.on('submit', function onSubmit(e) {
            e.preventDefault();
            $regionnotice.focus();
        });
    };
}(jQuery));
