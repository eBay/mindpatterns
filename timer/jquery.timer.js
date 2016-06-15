/**
* jquery.timer.js
* @author Ian McBurnie (imcburnie@ebay.com)
*/
(function ( $ ) {

    var alertIntervalMs = 15000,
        timerIntervalMs = 1000;

    $.fn.timer = function() {

        return this.each(function onEach() {
            var $this = $(this),
                $onscreenContainer = $this.find('> p'),
                $onscreenTime = $onscreenContainer.find('> span:last-child'),
                $offscreenContainer = $('<div />'),
                $offscreenTimer = $('<p />'),
                $min = $onscreenTime.find('> span:nth-child(1)'),
                $sec = $onscreenTime.find('> span:nth-child(2)'),
                minVal = $min.text(),
                secVal = $sec.text(),
                timerInterval,
                alertInterval;

            $offscreenTimer.hide();

            $offscreenContainer
                .attr('role', 'alert')
                .append($offscreenTimer)
                .appendTo('body');


            // update the onscreen clock every tick
            // remember that setInterval is not guaranteed to be acccurate
            // remember to sync with the server time (using AJAX for example)
            timerInterval = setInterval(function() {

                // if time has ended, refresh offscreen timer and clear intervals
                if (minVal == 0 && secVal == 0) {
                    $offscreenTimer.text('Time has ended!').show();
                    clearInterval(timerInterval);
                    clearInterval(alertInterval);
                }
                // else, if minute has ended reset seconds and decrement mins
                else if (secVal == 0) {
                    secVal = 59;
                    $min.text(--minVal);
                }
                // else, tick
                else {
                    secVal--;
                }

                $sec.text(secVal);

            }, timerIntervalMs);

            setTimeout(function() {
                alertInterval = setInterval(function() {
                    $offscreenTimer.text('Time left: ' + $onscreenTime.text()).show();

                    setTimeout(function() {
                        $offscreenTimer.hide();
                    }, 5000);

                }, alertIntervalMs);
            }, 1000);
        });
    };
}( jQuery ));
