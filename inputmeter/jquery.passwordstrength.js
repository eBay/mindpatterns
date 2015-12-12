/**
* jquery.passwordstrength.js
* @author Ian McBurnie (imcburnie@ebay.com)
*/
(function ( $ ) {

    var MAX_STRENGTH = 5;

    // decimal value between 0 and 1 is returned because that will work best for
    // an HTML5 meter element (although we don't recommend this new element yet)
    var calculatePasswordStrength = function(password) {
        return ((Math.floor(Math.random() * MAX_STRENGTH) + 1) / 10) * 2;
    };

    var getLabel = function(level) {
            var label;

            switch (level) {
                case 0:
                    label = "empty";
                    break;
                case 0.2:
                    label = "too short";
                    break;
                case 0.4:
                    label = "invalid";
                    break;
                case 0.6:
                    label = "weak";
                    break;
                case 0.8:
                    label = "medium";
                    break;
                case 1:
                    label = "strong";
                    break;
                default:
                    label = "error";
            }

            return label;
    };

    $.fn.passwordstrength = function() {

        return this.each(function() {

            var $this = $(this),
                $password = $this.find('input'),
                $meter = $('<span class="passwordstrength-meter"><span></span></span>'),
                $label = $('<span class="passwordstrength-label">Strength&nbsp;</span>'),
                $value = $('<span class="passwordstrength-value" /></span>'),
                currentClass = "passwordstrength-empty";

            $this.attr('aria-live', 'polite');

            $this.addClass(currentClass);
            $label.append($value);
            $this.append($label);
            $this.append($meter);

            $password.on('keypress', function(e) {
                var newValue = calculatePasswordStrength(this.value);

                $this.removeClass(currentClass);
                currentClass = 'passwordstrength-{0}'.replace('{0}', getLabel(newValue).replace(/\s+/g, ''));
                $this.addClass(currentClass);
                $meter.attr('value', newValue);
                $value.text(getLabel(newValue));
            });

            $this.addClass('passwordstrength-js');

        });
    };
}( jQuery ));
