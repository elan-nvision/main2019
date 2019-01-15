/**
 * Naive swipe helper
 *
 * @constructor
 */
(function () {
    "use strict";

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function('return this')();

    function Swipe() {
        this.index = 0;
        this.handlers = {};
    }

    // add listeners to start dispatching events
    // 4 events are supported: swipeleft, swiperight, swipeup, swipedown
    Swipe.prototype.on = function (container, customOptions) {

        container = container || document.body;

        this.options = {
            threshold: 150, //required min distance traveled to be considered swipe
            restraint: 200, // maximum distance allowed at the same time in perpendicular direction
            allowedTime: 300, // maximum time allowed to travel that distance
            preventMove: true // prevent moving while swiping
        };

        if ('object' == typeof customOptions) {
            for (var attrname in customOptions) {
                if (this.options.hasOwnProperty(attrname)) {
                    this.options[attrname] = customOptions[attrname];
                }
            }
        }

        var touchstartX = 0;
        var touchstartY = 0;
        var touchendX = 0;
        var touchendY = 0;
        var distX = 0; // get horizontal dist traveled by finger while in contact with surface
        var distY = 0; // get vertical dist traveled by finger while in contact with surface
        var startTime = null; // record time when finger first makes contact with surface
        var elapsedTime = 0; // get time elapsed

        var swipe = container.getAttribute('data-swipe');
        if (null === swipe) {
            swipe = this.index ++;
            container.setAttribute('data-swipe', swipe);
            this.handlers[swipe] = {};
        }

        this.handlers[swipe]['touchstart'] = function (event) {
            touchstartX = event.changedTouches[0].screenX;
            touchstartY = event.changedTouches[0].screenY;
            startTime = new Date().getTime();
        };

        this.handlers[swipe]['touchmove'] = function (event) {
            event.preventDefault(); // prevent scrolling when inside DIV
        };

        this.handlers[swipe]['touchend'] = function (event) {
            elapsedTime = new Date().getTime() - startTime;

            if (elapsedTime <= this.options.allowedTime) {
                touchendX = event.changedTouches[0].screenX;
                touchendY = event.changedTouches[0].screenY;
                distX = Math.abs(touchendX - touchstartX);
                distY = Math.abs(touchendY - touchstartY);

                var swipeEvent;
                if (distY <= this.options.restraint && distX > this.options.threshold) {
                    swipeEvent = document.createEvent('Event');

                    if (touchendX < touchstartX) {
                        swipeEvent.initEvent('swipeleft', true, true);
                        container.dispatchEvent(swipeEvent);
                    } else {
                        swipeEvent.initEvent('swiperight', true, true);
                        container.dispatchEvent(swipeEvent);
                    }
                }

                if (distX <= this.options.restraint && distY > this.options.threshold) {
                    swipeEvent = document.createEvent('Event');

                    if (touchendY < touchstartY) {
                        swipeEvent.initEvent('swipedown', true, true);
                        container.dispatchEvent(swipeEvent);
                    } else {
                        swipeEvent.initEvent('swipeup', true, true);
                        container.dispatchEvent(swipeEvent);
                    }
                }
            }

            if (touchendY == touchstartY) {
                swipeEvent = document.createEvent('Event');
                swipeEvent.initEvent('tap', true, true);
                container.dispatchEvent(swipeEvent);
            }
        }.bind(this);

        addEventListener(container, 'touchstart', this.handlers[swipe]['touchstart'], false);

        if (this.options.preventMove) {
            addEventListener(container, 'touchmove', this.handlers[swipe]['touchmove'], false);
        }

        addEventListener(container, 'touchend', this.handlers[swipe]['touchend'], false);
    };

    // remove all listeners
    Swipe.prototype.off = function (container) {
        var swipe = container.getAttribute('data-swipe');

        if (null !== swipe && this.handlers.hasOwnProperty(swipe)) {
            removeEventListener(container, 'touchstart', this.handlers[swipe]['touchstart'], false);

            if (this.options.preventMove) {
                removeEventListener(container, 'touchmove', this.handlers[swipe]['touchmove'], false);
            }

            removeEventListener(container, 'touchend', this.handlers[swipe]['touchend'], false);
        }
    };

    // Helper functions
    var supportsPassiveOption = true;

    try {
        var opts = Object.defineProperty({}, 'passive', {
            get: function () {
                supportsPassiveOption = true;
            }.bind(this)
        });
        window.addEventListener('test', null, opts);
        window.removeEventListener('test', null, opts);
    } catch (e) {

    }

    function addEventListener(elem, event, fn, options, useCapture) {
        if (! supportsPassiveOption && 'object' == typeof options) {
            options = options.hasOwnProperty('capture') ? options.capture : false;
        }

        if ('undefined' === typeof options) {
            options = {};
        }

        var events = event.split(" ");
        if (elem.addEventListener) {
            for (var i = 0; i < events.length; i ++) {
                elem.addEventListener(events[i], fn, options, useCapture || false);
            }
        } else {
            for (var j = 0; j < events.length; j ++) {
                elem.attachEvent("on" + events[j], fn); // older versions of IE
            }
        }
    }

    function removeEventListener(elem, event, fn, options, useCapture) {
        if (! supportsPassiveOption && 'object' == typeof options) {
            options = options.hasOwnProperty('capture') ? options.capture : false;
        }

        if ('undefined' === typeof options) {
            options = false;
        }

        if (elem.removeEventListener) {
            (event.split(" ")).forEach(function (e) {
                elem.removeEventListener(e, fn, options, useCapture || false);
            });
        } else {
            (event.split(" ")).forEach(function (e) {
                elem.detachEvent("on" + e, fn);        // older versions of IE
            });
        }
    }

    root.nuSwipe = Swipe;
}());