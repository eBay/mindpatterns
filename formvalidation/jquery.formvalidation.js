/**
* jquery.formvalidation.js
* @author Ian McBurnie (imcburnie@ebay.com)
*/
(function ( $ ) {

    $.fn.formvalidation = function formValidation() {

        // this plugin is intentionally not reusable!
        // the validation routine and error messages are hardcoded.

        var $form = $(this),
            $regionnotice = $('<div class="regionnotice" tabindex="-1">'),
            $errorHeading = $('<h3>Error! The form could not be submitted due to invalid entries.</h3><p>Please fix the following fields:</p>'),
            $listOfErrors = $('<ol>'),
            $elementnotice1 = $('<p class="elementnotice" id="age_error">Please enter a valid age (for example, 35)</p>'),
            $elementnotice2 = $('<p class="elementnotice" id="age_error">Please enter a valid shoe size (for example, 8.5)</p>'),
            $firstError = $('<li><a href="#age_container">Age</a> - please enter a valid age (for example, 35)</li>'),
            $secondError = $('<li><a href="#shoesize_container">Shoe-size</a> - please enter a valid shoe size (for example, 8.5)</li>');

        // prevent built-in validation (it conflicts with our custom validation)
        $form.attr('novalidate', 'novalidate');

        $regionnotice.append($errorHeading);
        $regionnotice.append($listOfErrors);

        $form.on('submit', function onSubmit(e) {
            e.preventDefault();

            // insert hardcoded errors
            $listOfErrors.append($firstError).append($secondError);
            $form.find('input[type=text]').attr('aria-invalid', 'true');
            $('#age_container').append($elementnotice1);
            $('#shoesize_container').append($elementnotice2);
            $form.prepend($regionnotice);

            $regionnotice.focus();
        });
    };
}( jQuery ));
