/**
* @file jQuery plugin that creates the basic interactivity for an input flyout
* @version 0.0.1
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @requires jquery-next-id
* @requires jquery-focus-exit
*/
(function($, window, document, undefined) {
    /**
    * jQuery plugin that creates the basic interactivity for an input flyout
    *
    * @method "jQuery.fn.inputFlyout"
    * @fires {object} flyoutExpand - the flyout has closed
    * @fires {object} flyoutCollapse - the flyout has opened
    * @return {jQuery} chainable jQuery class
    */
    $.fn.inputFlyout = function inputFlyout(options) {
        options = $.extend({
            debug: false,
            inputSelector: '.flyout__input',
            overlaySelector: '.flyout__overlay'
        }, options);

        return this.each(function onEach() {
            var $widget = $(this);
            var $input = $widget.find(options.inputSelector);
            var $overlay = $widget.find(options.overlaySelector);

            var expandFlyout = function(e) {
                if ($input.attr('aria-expanded') === 'false') {
                    $input.attr('aria-expanded', 'true');
                    $overlay.attr('aria-hidden', 'false');
                    $widget.trigger('flyoutExpand');
                }
            };

            var collapseFlyout = function(e) {
                if ($input.attr('aria-expanded') === 'true') {
                    $input.attr('aria-expanded', 'false');
                    $overlay.attr('aria-hidden', 'true');
                    $widget.trigger('flyoutCollapse');
                }
            };

            var onInputFocus = function(e) {
                expandFlyout();
            };

            var onWidgetFocusExit = function(e) {
                collapseFlyout();
            };

            // assign next id in sequence if one doesn't already exist
            $widget.nextId('input-flyout');

            // plugin for detecting focus exit
            $widget.focusExit();

            // listen for focus exiting widget
            $widget.on('focusExit', onWidgetFocusExit);

            // assign id to overlay and hide element
            $overlay
                .prop('id', $widget.prop('id') + '-overlay')
                .attr('aria-hidden', 'true');

            // the input controls the overlay's expanded state
            $input
                .attr('aria-controls', $overlay.prop('id'))
                .attr('aria-expanded', 'false');

            // focus on input shows overlay
            $input.on('focus', onInputFocus);
        });
    };
}(jQuery, window, document));

/**
* The jQuery plugin namespace.
* @external "jQuery.fn"
* @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
*/

/**
* flyoutOpen event
*
* @event flyoutExpand
* @type {object}
* @property {object} event - event object
*/

/**
* flyoutClose event
*
* @event flyoutCollapse
* @type {object}
* @property {object} event - event object
*/
