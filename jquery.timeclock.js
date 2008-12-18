/**
 * jQuery Timeclock
 *
 * Copyright (c) 2008 Mikkel Hoegh <mikkel@hoegh.org>:
 *   http://mikkel.hoegh.org/
 *
 * Structure and concept from Countdown for jQuery
 *   by Keith Wood <kbwood@virginbroadband.com.au>
 *   http://keith-wood.name/countdown.html
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function($){

 /* TimeClock contstructor */
function TimeClock() {
    this._defaults = {
		// H: hours, M: minutes, S: seconds.
		format: 'HM',
		// Interval in miniseconds between updating this timeclock.
		tick: 480,
	}
	// Hmm, what does this do?
	$.extend(this._defaults);
}

var PROP_NAME = 'timeclock';

$.extend(TimeClock.prototype, {
	// Class name added to indicate that an element is already
    // configured with timeclock.
    markerClassName: "hasTimeClock",

    /**
     * Attach a TimeClock to an element
     *
     * @param target element - the containing div-tag
     * @param options object - initial settings for the countdown
     */
	_attachTimeClock: function(target, options) {
		target = $(target);
        if (target.hasClass(this.markerClassName)) {
            return;
        }
        target.addClass(this.markerClassName);
        if (!target[0].id) {
            target[0].id = 'ticl' + new Date().getTime();
        }
        var inst = {};
        inst.options = $.extend({}, options);
        this._adjustSettings(inst);
        $.data(target[0], PROP_NAME, inst);
        this._updateTimeClock(target, inst);
	},

    /**
     * Update the timeclock's display.
     * @param id    element or string - the containing div-tag or its ID
     * @param inst  object - the current settings for this instance.
     */
    _updateTimeClock: function(id, inst) {
        var target = $(id);
        inst = inst || $.data(target[0], PROP_NAME);
        if (!inst) {
            return;
        }
        target.html(this._generateHTML(inst));
        target.toggleClass("tock");
        var format = this._get(inst, 'format');
        inst._timer = setTimeout('$.timeclock._updateTimeClock("#' + target[0].id + '")', this._get(inst, 'tick'));
        $.data(target[0], PROP_NAME, inst);
    },

    /**
     * Get a setting value, defaulting if necessary.
	 * @param  inst  object - the current settings for this instance
	 * @param  name  string - the name of the required setting
	 * @return any - the setting's value or a default if not overridden
     */
    _get: function(inst, name) {
        if (inst.options[name] != null) {
            return inst.options[name];
        }
        else {
            return $.timeclock._defaults[name];
        }
    },

    /**
     * Calculate configuration settings for an instance.
     * @param inst object - the current settings for this instance
     */
    _adjustSettings: function(inst) {
        var now = new Date();
        inst._since = now;
    },

    /**
     * Generate the HTML to display the timeclock widget.
     * @param inst object - the current settings for this instance
     * @return string - the new HTML for the timeclock display
     */
    _generateHTML: function(inst) {
        var time = inst._currentTime = this._calculateTime(inst);
        var twoDigits = function(value) {
			return (value < 10 ? '0' : '') + value;
		};
        var container = $("<div/>").addClass("timeclock");
        $(container).append('<span class="hours">' + time.hours +'</span>');
        $(container).append('<span class="sep-hours">:</span>');
        $(container).append('<span class="minutes">' + twoDigits(time.minutes) +'</span>');
        return container;
    },

    /**
     * Calculate the passed that has passed.
     * @param inst object - the current settings for this instance.
     * $return object - the amount of time, split into hours, minutes, seconds and useconds.
     */
    _calculateTime: function(inst) {
        var now = new Date();
        var msecs = now - inst._since;
        var time = {
            hours: 0,
            minutes: 0,
            seconds: 0,
            mseconds: 0
        }
        var reduceTime = function(name, nummSecs) {
            time[name] = Math.floor(msecs / nummSecs);
            msecs -= time[name] * nummSecs;
        };
        reduceTime('hours', 3600000);
        reduceTime('minutes', 60000);
        reduceTime('seconds', 1000);
        reduceTime('mseconds', 1);
        return time;
    }

});

/**
 * Attach a countdown to a jQuery selection
 * @param command string - the command to run (optional, default 'attach')
 * @param options object - the new settings to use for these countdown instances
 * @return jQuery object - for chaining further calls.
 */
$.fn.timeclock = function(options) {
	var otherArgs = Array.prototype.slice.call(arguments, 1);

	return this.each(function() {
		if (typeof options == 'string') {
			// Hmm.
			$.timeclock['_' + options + 'TimeClock'].apply($.timeclock, [this].concat(otherArgs));
		}
		else {
			$.timeclock._attachTimeClock(this, options);
		}
	});
};

// Initialise the timeclock
$.timeclock = new TimeClock();

})(jQuery);
// vim: set noet ts=4 sts=4 sw=4

