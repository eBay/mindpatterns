/**
* @file jquery.skipto.js
* @desc Please DO NOT copy this code to production! This is 'quick & ugly, just make it work!' code.
* @author Ian McBurnie <ianmcburnie@hotmail.com>
*/
(function ( $ ) {

    // if the user has pressed the back button, set focus back on the link
    /*
    var hasHistoryAPI = !!(window.history && history.pushState);

    $(window).on("popstate", function onPopState(e) {
        if(window.location.hash === '' && history.state && history.state.skipto) {
            $('#'+history.state.skipto).focus();
        }
    });
    */

    $.fn.skipto = function() {

        return this.each(function onEach() {

            var $this = $(this),
                $link = $this.find('a'),
                targetId = $link.attr('href'),
                $target = $(targetId);

            // set a unique widget id
            $this.nextId('skipto');

            $target.addClass('skiptotarget');

            // make target programmatically focussable
            $target.attr('tabindex', '-1');

            $link.on('click', function onClick(e) {

                // add class to allow kb focus outline
                $target.addClass('skiptotarget--active');

                // set programmatic focus on target
                // firefox needs a short delay
                window.setTimeout(function(e) {
                    $target.focus();
                }, 5);

                // on kb blur, remove class that allows outline
                $target.one('blur', function(e) {
                    $target.removeClass('skiptotarget--active');
                });

                // store link id in history state
                /*
                if (hasHistoryAPI === true && window.location.hash === '') {
                    history.pushState({"skipto":$this.prop('id')}, null, window.location.href);
                }
                */
            });
        });
    };
}( jQuery ));
