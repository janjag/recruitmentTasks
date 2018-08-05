'use strict';

(function() {
    document.querySelector('.menu-toggle').addEventListener('click', toggleMenu, false);

    function toggleMenu() {
        event.target.classList.toggle('is-open');
    }

    window.addEventListener('scroll', scroller, false);
    window.addEventListener('touchmove', scroller, false);

    function clearAciveLink() {
        document.querySelectorAll('.nav-link').forEach(function(link) {
            link.classList.remove('active');
        });
    }

    function scroller () {
        var curent_pos = window.pageYOffset;
        var header_height = document.querySelector('.header').offsetHeight;
        var sections = document.querySelectorAll('.section');

        if (curent_pos >= header_height) {
            document.querySelector('.navbar').classList.add('fixed');
        } else {
            clearAciveLink();
            document.querySelector('.navbar').classList.remove('fixed');
        }

        sections.forEach(function(el) {
            var top = el.offsetTop - (.25 * window.innerHeight);
            var bottom = top + el.offsetHeight;
            var hash;
            
            if (curent_pos >= top && curent_pos <= bottom) {
                clearAciveLink();

                hash = '#' + el.getAttribute('id');
                if (window.location.hash !== hash) {
                    history.pushState(null, null, hash);
                }

                document.querySelector('a[href="#' + el.getAttribute('id') + '"]').classList.add('active');
            } 
        });
    }

     // Browser support:

    // Chrome >= 24
    // Firefox >= 23
    // IE >= 10
    // Opera >= 15
    // Safari >= 8 (on previous versions it breaks on 'now' in window.performance)
    // Android 4.4
    // Firefox >= 23
    // IE Mobile >= 10
    // Opera Mobile >= 15
    // Safari iOS >= 9
    // Chrome for Android >= 35

    /**
     *
     * @param {(number|HTMLElement)} destination - Destination to scroll to (DOM element or number)
     * @param {number} duration - Duration of scrolling animation
     * @param {string} easing - Timing function name (Allowed values: 'linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic', 'easeInQuart', 'easeOutQuart', 'easeInOutQuart', 'easeInQuint', 'easeOutQuint', 'easeInOutQuint')
     * @param {function} callback - Optional callback invoked after animation
     */
    function scrollIt(destination) {
        var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
        var easing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'linear';
        var callback = arguments[3];

    // Predefine list of available timing functions
    // If you need more, tween js is full of great examples
    // https://github.com/tweenjs/tween.js/blob/master/src/Tween.js#L421-L737
        var easings = {
        linear: function linear(t) {
            return t;
        },
        easeInQuad: function easeInQuad(t) {
            return t * t;
        },
        easeOutQuad: function easeOutQuad(t) {
            return t * (2 - t);
        },
        easeInOutQuad: function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        },
        easeInCubic: function easeInCubic(t) {
            return t * t * t;
        },
        easeOutCubic: function easeOutCubic(t) {
            return --t * t * t + 1;
        },
        easeInOutCubic: function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        },
        easeInQuart: function easeInQuart(t) {
            return t * t * t * t;
        },
        easeOutQuart: function easeOutQuart(t) {
            return 1 - --t * t * t * t;
        },
        easeInOutQuart: function easeInOutQuart(t) {
            return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
        },
        easeInQuint: function easeInQuint(t) {
            return t * t * t * t * t;
        },
        easeOutQuint: function easeOutQuint(t) {
            return 1 + --t * t * t * t * t;
        },
        easeInOutQuint: function easeInOutQuint(t) {
            return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
        } };



        // Store initial position of a window and time
        // If performance is not available in your browser
        // It will fallback to new Date().getTime() - thanks IE < 10
        var start = window.pageYOffset;
        var startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
        // const startTime = typeof(window.performance['now']) == 'function' ? performance.now() : new Date().getTime();


        // Take height of window and document to sesolve max scrollable value
        // Prevent requestAnimationFrame() from scrolling below maximum scollable value
        // Resolve destination type (node or number)
        var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
        var destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
        var destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);


        // If requestAnimationFrame is not supported
        // Move window to destination position and trigger callback function
        if ('requestAnimationFrame' in window === false) {
        window.scroll(0, destinationOffsetToScroll);
        if (callback) {
            callback();
        }
        return;
        }


        // function resolves position of a window and moves to exact amount of pixels
        // Resolved by calculating delta and timing function choosen by user
        function scroll() {
            var now = 'now' in window.performance ? performance.now() : new Date().getTime();
            var time = Math.min(1, (now - startTime) / duration);
            var timeFunction = easings[easing](time);
            window.scroll(0, Math.ceil(timeFunction * (destinationOffsetToScroll - start) + start));

            // Stop requesting animation when window reached its destination
            // And run a callback function
            if (window.pageYOffset === destinationOffsetToScroll) {
                if (callback) {
                callback();
                }
                return;
            }

            // If window still needs to scroll to reach destination
            // Request another scroll invokation
            requestAnimationFrame(scroll);
        }


        // Invoke scroll and sequential requestAnimationFrame
        scroll();
    }

    // Scroll to section
    document.querySelectorAll('.js-scroll').forEach(function(link) {
        link.addEventListener('click', function(event) {
            var href = event.target.getAttribute('href');
            scrollIt(document.querySelector(href), 300, 'easeOutQuad');
            document.querySelector('.menu-toggle').classList.remove('is-open');
        });
    });


    // simple form validation
    function checkValueLength(element) {
        console.log(element.value);
        element.classList.add('js-touched');
        if (element.value.length < 2) {
            element.classList.add('error');
        } else {
            element.classList.remove('error');
            element.classList.add('success');
        }
    }

    document.querySelectorAll('.input').forEach(function(input) {
        input.addEventListener('keyup', function(event) {
            checkValueLength(event.target);
        });
    });

    document.querySelector('.textarea').addEventListener('keyup', function(event) {
        checkValueLength(event.target);
    });

})();